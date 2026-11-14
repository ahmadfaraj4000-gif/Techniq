import { brandEmail } from './email-layout.ts';
// Server-only Brevo transport. Provider credentials must never reach a browser.
export type TransactionalEmail = {
 sender: {name:string; email:string};
 to: {name?:string; email:string}[];
 replyTo?: {name?:string; email:string};
 subject:string;
 htmlContent:string;
 textContent:string;
 headers?: Record<string,string>;
};
export async function sendTransactionalEmail(apiKey:string, message:TransactionalEmail, fetcher:typeof fetch=fetch) {
 if(!apiKey || !message.sender.email || !message.to.length || !message.subject) throw new Error('Email is not configured');
 const result=await fetcher('https://api.brevo.com/v3/smtp/email',{
  method:'POST',headers:{'api-key':apiKey,'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(message),
 });
 if(!result.ok) throw new Error('Brevo rejected email: '+result.status);
 const data=await result.json();
 if(typeof data.messageId!=='string'||!data.messageId) throw new Error('Brevo response did not include a message ID');
 return data.messageId as string;
}
export function escapeHtml(value:string) {return value.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]!))}
export function consultationConfirmation(input:{name:string;email:string;startsAt:string;meetingUrl:string;senderEmail:string;replyTo:string}):TransactionalEmail {
 const meeting=new URL(input.meetingUrl);
 if(meeting.protocol!=='https:'||meeting.hostname!=='meet.google.com')throw new Error('A valid Google Meet link is required');
 const date=new Date(input.startsAt);if(Number.isNaN(date.getTime()))throw new Error('A valid appointment time is required');
 const time=new Intl.DateTimeFormat('en-US',{dateStyle:'full',timeStyle:'short',timeZone:'America/New_York'}).format(date)+' Eastern Time';
 const text=`Hi ${input.name},\n\nYour consultation is confirmed for ${time}.\n\nJoin your consultation: ${meeting.href}\n\nIf you have questions, reply to this email.\n\nTechniq Skin & Beauty`;
 return {sender:{name:'Techniq Skin & Beauty',email:input.senderEmail},to:[{email:input.email,name:input.name}],replyTo:{email:input.replyTo},subject:'Your Techniq consultation is confirmed',textContent:text,htmlContent:brandEmail({eyebrow:'Your online consultation',title:'Your consultation is confirmed.',preheader:'Your consultation is confirmed. Your Google Meet link is inside.',body:`<p style="margin:0 0 16px">Hi ${escapeHtml(input.name)},</p><p style="margin:0">Your consultation is confirmed. We look forward to learning about your skin and creating a plan that feels right for you.</p>`,detail:{label:'Your appointment',value:time},button:{label:'Join your consultation',url:meeting.href}})};
}

export function newClientIntake(input:{name:string;email:string;senderEmail:string;replyTo:string;intakeToken?:string}):TransactionalEmail {
 const link='https://techniqskinandbeauty.com/intake-consent.html'+(input.intakeToken?'#intake_token='+encodeURIComponent(input.intakeToken):'');
 return {sender:{name:'Techniq Skin & Beauty',email:input.senderEmail},to:[{email:input.email,name:input.name}],replyTo:{email:input.replyTo},subject:'Your Techniq intake form',textContent:`Hi ${input.name},\n\nThank you for booking with Techniq Skin & Beauty. Please complete your new-client intake form before your consultation: ${link}\n\nIf you have questions, reply to this email.\n\nTechniq Skin & Beauty`,htmlContent:brandEmail({eyebrow:'Before we meet',title:'Your intake form is ready.',preheader:'Your intake form is ready, with your booking details already filled in.',body:`<p style="margin:0 0 16px">Hi ${escapeHtml(input.name)},</p><p style="margin:0 0 16px">Thank you for booking with Techniq. Please complete your new-client intake form before your consultation so we can personalize your care.</p><p style="margin:0">Your name, phone number, email, and birthday are already filled in. Review them, then complete the remaining questions.</p>`,button:{label:'Complete your intake form',url:link}})};
}

export function consultationReceipt(input:{name:string;email:string;startsAt:string;senderEmail:string;replyTo:string}):TransactionalEmail {
 const date=new Date(input.startsAt);if(Number.isNaN(date.getTime()))throw new Error('Invalid appointment time');
 const time=new Intl.DateTimeFormat('en-US',{dateStyle:'full',timeStyle:'short',timeZone:'America/New_York'}).format(date)+' Eastern Time';
 return {sender:{name:'Techniq Skin & Beauty',email:input.senderEmail},to:[{email:input.email,name:input.name}],replyTo:{email:input.replyTo},subject:'Your Techniq consultation is booked',textContent:`Hi ${input.name},\n\nYour payment is confirmed and your consultation is booked for ${time}. We will send your meeting link before your appointment.\n\nTechniq Skin & Beauty`,htmlContent:brandEmail({eyebrow:'Booking received',title:'Your consultation is booked.',preheader:'Your payment is confirmed and your Techniq consultation is booked.',body:`<p style="margin:0 0 16px">Hi ${escapeHtml(input.name)},</p><p style="margin:0 0 16px">Your payment is confirmed and your consultation is booked. We’re looking forward to caring for your skin.</p><p style="margin:0">Your Google Meet link will arrive in a separate confirmation email. If you’re a new client, we’ll also send your intake form.</p>`,detail:{label:'Your appointment',value:time},button:{label:'Explore Techniq',url:'https://techniqskinandbeauty.com/'}})};
}
