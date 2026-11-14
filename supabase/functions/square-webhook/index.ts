// Square webhook: do not deploy without the signature key and exact notification URL.
const encode = new TextEncoder();
function same(a:Uint8Array,b:Uint8Array){let diff=a.length^b.length; for(let i=0;i<Math.max(a.length,b.length);i++) diff|=(a[i]||0)^(b[i]||0);return diff===0}
Deno.serve(async(req:Request)=>{
 if(req.method!=='POST') return new Response('Method not allowed',{status:405});
 const secret=Deno.env.get('SQUARE_WEBHOOK_SIGNATURE_KEY'), url=Deno.env.get('SQUARE_WEBHOOK_URL');
 if(!secret||!url) return new Response('Webhook not configured',{status:503});
 const raw=await req.text(), header=req.headers.get('x-square-hmacsha256-signature')||'';
 let received:Uint8Array;try{received=Uint8Array.from(atob(header),c=>c.charCodeAt(0))}catch{return new Response('Invalid signature',{status:403})}
 const key=await crypto.subtle.importKey('raw',encode.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);
 const expected=new Uint8Array(await crypto.subtle.sign('HMAC',key,encode.encode(url+raw)));
 if(!same(received,expected)) return new Response('Invalid signature',{status:403});
 try{
  const event=JSON.parse(raw); if(!['payment.created','payment.updated'].includes(event.type)) return new Response('Ignored',{status:200});
  const p=event.data?.object?.payment;
  if(p?.status!=='COMPLETED') return new Response('Ignored',{status:200});
  if(!p.order_id||!p.id||!Number.isSafeInteger(p.amount_money?.amount)||!p.amount_money?.currency) return new Response('Invalid event',{status:400});
  const secretKey=Deno.env.get('SUPABASE_SERVICE_ROLE_KEY'), base=Deno.env.get('SUPABASE_URL');
  if(!secretKey||!base) return new Response('Not configured',{status:503});
  const result=await fetch(base+'/rest/v1/rpc/finalize_consultation_payment',{method:'POST',headers:{apikey:secretKey,Authorization:'Bearer '+secretKey,'Content-Type':'application/json'},body:JSON.stringify({p_order:p.order_id,p_payment:p.id,p_amount:p.amount_money.amount,p_currency:p.amount_money.currency})});
  if(!result.ok) return new Response('Retry',{status:503});
  const disposition=await result.json();
  if(disposition==='unknown_order') {
   const product=await fetch(base+'/rest/v1/rpc/record_storefront_payment',{method:'POST',headers:{apikey:secretKey,Authorization:'Bearer '+secretKey,'Content-Type':'application/json'},body:JSON.stringify({p_order:p.order_id,p_payment:p.id,p_amount:p.amount_money.amount,p_currency:p.amount_money.currency})});
   if(!product.ok) return new Response('Retry',{status:503});
   await product.json(); // Unknown orders belong to another Square flow; acknowledge them.
  }
  return new Response('OK',{status:200});
 }catch(e){console.error('Webhook error',String(e));return new Response('Retry',{status:503})}
});
