type Db = (path:string,method?:string,body?:unknown)=>Promise<any>;
type Job = {id:string;version:number;attempts:number;starts_at:string;status:string;meeting_url:string|null;name:string|null;duration_minutes:number};
export async function syncGoogleCalendar(db:Db, config:{clientId:string;clientSecret:string;refreshToken:string;calendarId:string}, fetcher:typeof fetch=fetch) {
 const jobs:Job[]=await db('rpc/claim_calendar_jobs','POST',{});
 if(!jobs.length)return 0;
 let token='';
 try {
  const r=await fetcher('https://oauth2.googleapis.com/token',{method:'POST',body:new URLSearchParams({client_id:config.clientId,client_secret:config.clientSecret,refresh_token:config.refreshToken,grant_type:'refresh_token'}),signal:AbortSignal.timeout(15000)});
  const d=await r.json();if(!r.ok||!d.access_token)throw new Error('Reconnect Google Calendar in the business account.');token=d.access_token;
 } catch {
  for(const j of jobs)await db('rpc/finish_calendar_job','POST',{p_id:j.id,p_version:j.version,p_error:'Google Calendar authorization failed. Please reconnect the business account.'});
  return 0;
 }
 const base='https://www.googleapis.com/calendar/v3/calendars/'+encodeURIComponent(config.calendarId)+'/events';
 async function request(url:string,method='GET',body?:unknown){
  const r=await fetcher(url,{method,headers:{Authorization:'Bearer '+token,'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(15000)});
  if(r.status===404||r.status===410)return null;
  if(r.status===409)return {conflict:true};
  if(!r.ok)throw new Error('Google Calendar could not sync this appointment (HTTP '+r.status+'). It will retry automatically.');
  return r.status===204?{}:await r.json();
 }
 for(const j of jobs){
  try{
   // UUID hex produces a valid, deterministic Google event id, including on retries.
   const eventId='techniq'+j.id.replaceAll('-','');
   const url=base+'/'+eventId;let event=await request(url);
   if(j.status==='cancelled'){
    if(event&&event.status!=='cancelled')await request(url+'?sendUpdates=none','PATCH',{status:'cancelled'});
   } else if(j.status==='scheduled'){
    if(!event && !j.meeting_url && new Date(j.starts_at).getTime()>Date.now()){
     const body={id:eventId,summary:'Techniq consultation · '+(j.name||'Client'),description:'Consultation details are available in the Techniq admin portal. https://techniqskinandbeauty.com/portal/',start:{dateTime:j.starts_at},end:{dateTime:new Date(new Date(j.starts_at).getTime()+Number(j.duration_minutes)*60000).toISOString()},conferenceData:{createRequest:{requestId:eventId,conferenceSolutionKey:{type:'hangoutsMeet'}}}};
     event=await request(base+'?conferenceDataVersion=1&sendUpdates=none','POST',body);
     if(event?.conflict)event=await request(url);
    }else if(event){
     event=await request(url+'?conferenceDataVersion=1&sendUpdates=none','PATCH',{status:'confirmed',start:{dateTime:j.starts_at},end:{dateTime:new Date(new Date(j.starts_at).getTime()+Number(j.duration_minutes)*60000).toISOString()}});
    }
    if(event){
     const link=event.hangoutLink||event.conferenceData?.entryPoints?.find((p:{entryPointType:string})=>p.entryPointType==='video')?.uri;
     if(!link||!/^https:\/\/meet\.google\.com\/[a-zA-Z0-9-]+$/.test(link))throw new Error('Google is still preparing the Meet link. Retrying automatically.');
     await db('rpc/finish_calendar_job','POST',{p_id:j.id,p_version:j.version,p_url:link});continue;
    }
   }
   await db('rpc/finish_calendar_job','POST',{p_id:j.id,p_version:j.version});
  }catch(e){await db('rpc/finish_calendar_job','POST',{p_id:j.id,p_version:j.version,p_error:e instanceof Error?e.message:'Calendar sync failed. Retrying automatically.'})}
 }
 return jobs.length;
}
