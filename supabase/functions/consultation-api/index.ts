// Public booking API. Database access uses the server-only service role.
const cors = {'Access-Control-Allow-Origin':'https://techniqskinandbeauty.com','Access-Control-Allow-Headers':'content-type, apikey, authorization, x-client-info','Access-Control-Allow-Methods':'GET, POST, OPTIONS'};
const json = (x: unknown,status=200) => new Response(JSON.stringify(x),{status,headers:{...cors,'Content-Type':'application/json','Cache-Control':'no-store'}});
const env = (key:string) => {const value=Deno.env.get(key); if(!value) throw new Error('Missing configuration: '+key); return value};
async function db(path:string,method='GET',body?:unknown) {
 const key=env('SUPABASE_SERVICE_ROLE_KEY'); const r=await fetch(env('SUPABASE_URL')+'/rest/v1/'+path,{method,headers:{apikey:key,Authorization:'Bearer '+key,'Content-Type':'application/json',Prefer:'return=representation'},body:body===undefined?undefined:JSON.stringify(body)});
 const data=await r.json(); if(!r.ok) throw new Error('Database request failed'); return data;
}
Deno.serve(async (req:Request)=>{
 if(req.method==='OPTIONS') return new Response('ok',{headers:cors});
 try {
  if(Deno.env.get('BOOKING_ENABLED')!=='true') return json({error:'Online booking is not yet available.'},503);
  if(req.method==='GET') return json({slots:await db('rpc/list_consultation_slots','POST',{})});
  if(req.method!=='POST') return json({error:'Method not allowed'},405);
  const input=await req.json();
  if(!['new','returning'].includes(input.client_type)||typeof input.slot_id!=='string'||!/^[0-9a-f-]{36}$/i.test(input.slot_id)||typeof input.name!=='string'||typeof input.email!=='string'||!/^\S+@\S+\.\S+$/.test(input.email)||typeof input.phone!=='string') return json({error:'Enter a valid name, email, phone and time.'},400);
  let order; try {const rows=await db('rpc/reserve_consultation_v2','POST',{p_slot:input.slot_id,p_name:input.name,p_email:input.email,p_phone:input.phone,p_client_type:input.client_type}); order=Array.isArray(rows)?rows[0]:rows;} catch {return json({error:'This time is no longer available or booking is not configured. Please refresh.'},409)}
  const base=env('SQUARE_ENVIRONMENT')==='sandbox'?'https://connect.squareupsandbox.com':'https://connect.squareup.com';
  try {
   const result=await fetch(base+'/v2/online-checkout/payment-links',{method:'POST',headers:{Authorization:'Bearer '+env('SQUARE_ACCESS_TOKEN'),'Content-Type':'application/json','Square-Version':'2025-08-20'},body:JSON.stringify({idempotency_key:order.id,order:{location_id:env('SQUARE_LOCATION_ID'),reference_id:order.id,line_items:[{name:'Online skin consultation',quantity:'1',base_price_money:{amount:order.amount_cents,currency:'USD'}}]},pre_populated_data:{buyer_email:order.email},checkout_options:{redirect_url:'https://techniqskinandbeauty.com/consultation.html?payment=returned'}})});
   const data=await result.json(); if(!result.ok||!data.payment_link?.url||!data.payment_link?.order_id) throw new Error('Square could not create checkout');
   await db('consultation_orders?id=eq.'+order.id,'PATCH',{status:'awaiting_payment',square_order_id:data.payment_link.order_id,checkout_url:data.payment_link.url});
   return json({checkout_url:data.payment_link.url});
  } catch(e){console.error('consultation checkout failed',String(e)); await db('consultation_orders?id=eq.'+order.id,'PATCH',{status:'needs_attention'}); return json({error:'Checkout could not be started. Please contact us before trying again.'},503)}
 } catch(e) {console.error('consultation error',String(e)); return json({error:'Booking is temporarily unavailable.'},503)}
});
