import { consultationConfirmation, sendTransactionalEmail } from '../_shared/brevo.ts';
// Server-to-server worker. Called only by an authorized scheduler; never expose its key.
const env=(name:string)=>{const value=Deno.env.get(name);if(!value)throw new Error('Missing '+name);return value};
async function db(path:string, method='GET', body?:unknown){const key=env('SUPABASE_SERVICE_ROLE_KEY');const r=await fetch(env('SUPABASE_URL')+'/rest/v1/'+path,{method,headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json',Prefer:'return=representation'},body:body===undefined?undefined:JSON.stringify(body)});if(!r.ok)throw new Error('Database request failed');return await r.json()}
Deno.serve(async(req:Request)=>{
 if(req.method!=='POST')return new Response('Method not allowed',{status:405});
 const expected=Deno.env.get('NOTIFICATION_WORKER_SECRET');const given=req.headers.get('x-worker-secret');
 if(!expected||!given)return new Response('Unauthorized',{status:401});
 const encoder=new TextEncoder();const a=new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(expected))),b=new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(given)));let diff=0;for(let i=0;i<a.length;i++)diff|=a[i]^b[i];if(diff!==0)return new Response('Unauthorized',{status:401});
 try{
  await db('rpc/flag_stale_notification_jobs','POST',{});
  const jobs=await db('rpc/claim_notification_jobs','POST',{p_limit:10});
  for(const job of jobs){
   let state='failed', reason='Unsupported or unconfigured notification';
   try{
    if(job.kind==='consultation_email') {
     const rows=await db('consultation_orders?id=eq.'+encodeURIComponent(job.order_ref)+'&select=id,name,email,starts_at,status,portal_consultations(status,meeting_url)');
     const order=rows[0], appointment=order?.portal_consultations;
     if(!order || order.status!=='paid' || !appointment || appointment.status!=='scheduled') throw new Error('Paid scheduled consultation not available');
     const message=consultationConfirmation({name:order.name,email:order.email,startsAt:order.starts_at,meetingUrl:appointment.meeting_url,senderEmail:'no-reply@techniqskinandbeauty.com',replyTo:'techniqskinandbeautyllc@gmail.com'});
     message.headers={'IdempotencyKey':job.job_key};
     await sendTransactionalEmail(env('BREVO_API_KEY'),message);state='sent';reason='';
    } else {
    const messages:Record<string,{title:string,message:string}>={
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
