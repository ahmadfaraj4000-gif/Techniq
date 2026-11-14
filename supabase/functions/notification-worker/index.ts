import { syncGoogleCalendar } from '../_shared/google-calendar.ts';
import { consultationConfirmation, consultationReceipt, newClientIntake, sendTransactionalEmail } from '../_shared/brevo.ts';
// Server-to-server worker. Called only by an authorized scheduler; never expose its key.
const env=(name:string)=>{const value=Deno.env.get(name);if(!value)throw new Error('Missing '+name);return value};
async function db(path:string, method='GET', body?:unknown){const key=env('SUPABASE_SERVICE_ROLE_KEY');const r=await fetch(env('SUPABASE_URL')+'/rest/v1/'+path,{method,headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json',Prefer:'return=representation'},body:body===undefined?undefined:JSON.stringify(body)});if(!r.ok)throw new Error('Database request failed');return await r.json()}
Deno.serve(async(req:Request)=>{
 if(req.method!=='POST')return new Response('Method not allowed',{status:405});
 const expected=Deno.env.get('NOTIFICATION_WORKER_SECRET');const given=req.headers.get('x-worker-secret');
 if(!expected||!given)return new Response('Unauthorized',{status:401});
 const encoder=new TextEncoder();const a=new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(expected))),b=new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(given)));let diff=0;for(let i=0;i<a.length;i++)diff|=a[i]^b[i];if(diff!==0)return new Response('Unauthorized',{status:401});
 try{
  if(Deno.env.get('GOOGLE_REFRESH_TOKEN')){try{await syncGoogleCalendar(db,{clientId:env('GOOGLE_CLIENT_ID'),clientSecret:env('GOOGLE_CLIENT_SECRET'),refreshToken:env('GOOGLE_REFRESH_TOKEN'),calendarId:Deno.env.get('GOOGLE_CALENDAR_ID')||'primary'});}catch{console.error('Calendar sync unavailable; notifications will continue.')}}
  await db('rpc/flag_stale_notification_jobs','POST',{});
  await db('rpc/enqueue_consultation_reminders','POST',{});
  const jobs=await db('rpc/claim_notification_jobs','POST',{p_limit:10});
  for(const job of jobs){
   let state='failed', reason='Unsupported or unconfigured notification';
   try{
    if(job.kind==='consultation_receipt_email') {
     const rows=await db('consultation_orders?id=eq.'+encodeURIComponent(job.order_ref)+'&select=name,email,starts_at,status');
     const order=rows[0];if(!order||order.status!=='paid')throw new Error('Paid consultation not available');
     const message=consultationReceipt({name:order.name,email:order.email,startsAt:order.starts_at,senderEmail:'no-reply@techniqskinandbeauty.com',replyTo:'techniqskinandbeautyllc@gmail.com'});message.headers={'IdempotencyKey':job.job_key};
     await sendTransactionalEmail(env('BREVO_API_KEY'),message);state='sent';reason='';
    } else if(job.kind==='consultation_intake_email') {
     const rows=await db('consultation_orders?id=eq.'+encodeURIComponent(job.order_ref)+'&select=name,email,status,client_type,intake_token');
     const order=rows[0];if(!order||order.status!=='paid'||order.client_type!=='new')throw new Error('Paid new-client consultation not available');
     const message=newClientIntake({name:order.name,email:order.email,intakeToken:order.intake_token,senderEmail:'no-reply@techniqskinandbeauty.com',replyTo:'techniqskinandbeautyllc@gmail.com'});message.headers={'IdempotencyKey':job.job_key};
     await sendTransactionalEmail(env('BREVO_API_KEY'),message);state='sent';reason='';
    } else if(job.kind==='consultation_email') {
     const rows=await db('consultation_orders?id=eq.'+encodeURIComponent(job.order_ref)+'&select=id,name,email,starts_at,status,portal_consultations(status,meeting_url)');
     const order=rows[0], appointment=order?.portal_consultations;
     if(!order || order.status!=='paid' || !appointment || appointment.status!=='scheduled') throw new Error('Paid scheduled consultation not available');
     const message=consultationConfirmation({name:order.name,email:order.email,startsAt:order.starts_at,meetingUrl:appointment.meeting_url,senderEmail:'no-reply@techniqskinandbeauty.com',replyTo:'techniqskinandbeautyllc@gmail.com'});
     message.headers={'IdempotencyKey':job.job_key};
     await sendTransactionalEmail(env('BREVO_API_KEY'),message);state='sent';reason='';
    } else if(job.kind==='consultation_reminder_push'||job.kind==='consultation_daily_push') {
     const token=env('PUSHOVER_APP_TOKEN'),user=env('PUSHOVER_USER_KEY');
     const send=async(title:string,message:string)=>{const r=await fetch('https://api.pushover.net/1/messages.json',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({token,user,title,message,url:'https://techniqskinandbeauty.com/portal/',url_title:'Open admin portal'})});const d=await r.json();if(!r.ok||d.status!==1)throw new Error('Pushover rejected notification')};
     const time=(v:string)=>new Intl.DateTimeFormat('en-US',{hour:'numeric',minute:'2-digit',timeZone:'America/New_York'}).format(new Date(v));
     if(job.kind==='consultation_reminder_push') {
      const rows=await db('portal_consultations?id=eq.'+encodeURIComponent(job.order_ref)+'&select=id,starts_at,status,portal_customers(name)');const c=rows[0],expected=Number(job.job_key.split(':').at(-1)),start=c?new Date(c.starts_at).getTime():0;
      if(!c||c.status!=='scheduled'||Math.floor(start/1000)!==expected||start<=Date.now()||start>Date.now()+15*60*1000){state='sent';reason='Skipped: appointment changed or is no longer upcoming'}
      else {await send('Consultation in 15 minutes',`${time(c.starts_at)} · ${c.portal_customers?.name||'Client'} (Eastern time)`);state='sent';reason=''}
     } else {
      if(!/^\d{4}-\d{2}-\d{2}$/.test(job.order_ref))throw new Error('Invalid summary date');
      const rows=await db('rpc/list_daily_consultations','POST',{p_day:job.order_ref});const lines=rows.map((c:{starts_at:string,customer_name:string})=>`${time(c.starts_at)} · ${c.customer_name}`);
      if(!lines.length)await send('Today’s consultations','No consultations scheduled today.');
      else {let chunk='';for(const line of lines){const next=chunk?chunk+'\n'+line:line;if(next.length>900&&chunk){await send('Today’s consultations',chunk);chunk=line.slice(0,900)}else chunk=next}if(chunk)await send('Today’s consultations',chunk)}
      state='sent';reason='';
     }
    } else {
    const messages:Record<string,{title:string,message:string}>={
     intake_push:{title:'New intake form',message:'A client submitted an intake form. Open the admin portal to review it.'},
     consultation_push:{title:'New consultation payment',message:'A consultation payment was completed. Open the admin portal for details.'},
     product_push:{title:'New product order',message:'A product order was paid. Open the admin portal for details.'},
     product_push_delayed:{title:'Product order reminder',message:'A product order was paid three hours ago. Open the admin portal to follow up.'}
    };
    const content=messages[job.kind]; if(!content)throw new Error(reason);
    const token=env('PUSHOVER_APP_TOKEN'), user=env('PUSHOVER_USER_KEY');
    // Keep client names and intake information out of push notifications.
    const result=await fetch('https://api.pushover.net/1/messages.json',{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:new URLSearchParams({token,user,title:content.title,message:content.message,url:'https://techniqskinandbeauty.com/portal/',url_title:'Open admin portal'})});
    const response=await result.json(); if(!result.ok || response.status!==1){state='failed';reason='Pushover rejected the notification';} else {state='sent';reason='';}
    }
   }catch(e){state='unknown';reason='Delivery outcome unknown or provider not configured';console.error('Notification worker:',String(e))}
   await db('notification_jobs?id=eq.'+encodeURIComponent(job.id)+'&state=eq.processing','PATCH',{state,last_error:reason||null,sent_at:state==='sent'?new Date().toISOString():null});
  }
  return new Response(JSON.stringify({processed:jobs.length}),{headers:{'Content-Type':'application/json'}});
 }catch(e){console.error('Notification worker:',String(e));return new Response('Worker error',{status:503})}
});
