Deno.serve(async (req) => {
 const cors = {'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'authorization, x-client-info, apikey, content-type','Access-Control-Allow-Methods':'POST, OPTIONS'};
 const response = (body, status=200) => new Response(JSON.stringify(body), {status,headers:{...cors,'Content-Type':'application/json'}});
 if(req.method==='OPTIONS') return new Response('ok',{headers:cors});
 if(req.method!=='POST') return response({error:'Method not allowed'},405);
 const catalog = {
 'barrier-balancing-moisturizer':['Barrier Balancing Moisturizer',{'1.8 oz':3600}],
 'blemish-spot-treatment':['Blemish Spot Treatment',{'Regular':2800}],
 'charcoal-clay-cleanser':['Charcoal Clay Cleanser',{'2 oz':1400,'6.4 oz':3600}],
 'clarifying-toner-pads':['Clarifying Toner Pads',{'2 oz':2800}],
 'cucumber-hydrating-toner':['Cucumber Hydrating Toner',{'2 oz':1800,'3.3 oz':2800}],
 'glycolic-and-retinol-pads':['Glycolic and Retinol Pads',{'2 oz':3600}],
 'green-tea-citrus-cleanser':['Green Tea Citrus Cleanser',{'2 oz':1400,'6.4 oz':3600}],
 'honey-brightening-cleanser':['Honey Brightening Cleanser',{'2 oz':1600,'6.4 oz':4200}],
 'hydrating-moisturizer':['Hydrating Moisturizer',{'1.7 oz':3600}],
 'mandelic-brightening-serum':['Mandelic Brightening Serum',{'1 oz':4800}],
 'mint-refining-toner':['Mint Refining Toner',{'2 oz':1800,'6.4 oz':2800}],
 'pomegranate-antioxidant-cleanser':['Pomegranate Antioxidant Cleanser',{'2 oz':1400,'6.4 oz':3600}],
 'retinol-2-scrub':['Retinol 2% Scrub',{'2 oz':4900}],
 'revitalizing-cucumber-treatment':['Revitalizing Cucumber Treatment',{'2 oz':5200}],
 'vita-c-green-tea-serum':['Vita C Green Tea Serum',{'1 oz':3999}]
 };
 try {
  const body=await req.json(); const cart=body.cart;
  if(!Array.isArray(cart)||!cart.length||cart.length>50) return response({error:'Invalid cart.'},400);
  const lineItems=[]; let subtotal=0;
  for(const item of cart){
   const product=Object.hasOwn(catalog,item?.id)?catalog[item.id]:null;
   const amount=product && Object.hasOwn(product[1],item.variant)?product[1][item.variant]:null;
   const quantity=Number(item?.quantity);
   if(!product || !Number.isInteger(amount) || !Number.isSafeInteger(quantity) || quantity<1 || quantity>50) return response({error:'Invalid product, variant, or quantity. Please refresh your cart.'},400);
   subtotal+=amount*quantity;
   lineItems.push({name:product[0]+' - '+item.variant,quantity:String(quantity),base_price_money:{amount,currency:'USD'}});
  }
  if(subtotal<4900) lineItems.push({name:'Shipping',quantity:'1',base_price_money:{amount:1200,currency:'USD'}});
  const token=Deno.env.get('SQUARE_ACCESS_TOKEN'), location=Deno.env.get('SQUARE_LOCATION_ID');
  if(!token||!location) return response({error:'Checkout is not configured.'},500);
  const base=Deno.env.get('SQUARE_ENVIRONMENT')==='sandbox'?'https://connect.squareupsandbox.com':'https://connect.squareup.com';
  const site=Deno.env.get('SITE_URL')||'https://techniqskinandbeauty.com';
  const result=await fetch(base+'/v2/online-checkout/payment-links',{method:'POST',headers:{Authorization:'Bearer '+token,'Content-Type':'application/json','Square-Version':'2025-08-20'},body:JSON.stringify({idempotency_key:crypto.randomUUID(),order:{location_id:location,line_items:lineItems,taxes:[{name:'CT Sales Tax',percentage:'6.35',scope:'ORDER'}]},checkout_options:{redirect_url:site+'/products.html?checkout=success',ask_for_shipping_address:true}})});
  const data=await result.json();
  if(!result.ok) {console.error('Square checkout failed',result.status);return response({error:'Unable to start checkout.'},502)}
  if(!data.payment_link?.url) return response({error:'Unable to start checkout.'},502);
  return response({checkoutUrl:data.payment_link.url});
 } catch(error) {console.error('Checkout error',error);return response({error:'Unable to start checkout.'},400)}
});