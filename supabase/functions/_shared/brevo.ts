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
 return {sender:{name:'Techniq Skin & Beauty',email:input.senderEmail},to:[{email:input.email,name:input.name}],replyTo:{email:input.replyTo},subject:'Your Techniq consultation is confirmed',textContent:text,htmlContent:`<!doctype html><html><body style="font-family:Arial,sans-serif;color:#302c2a;line-height:1.6"><h1>Your consultation is confirmed</h1><p>Hi ${escapeHtml(input.name)},</p><p>We look forward to seeing you on <strong>${escapeHtml(time)}</strong>.</p><p><a href="${escapeHtml(meeting.href)}">Join your Google Meet consultation</a></p><p>If you have questions, reply to this email.</p><p>Techniq Skin &amp; Beauty</p></body></html>`};
}

export function newClientIntake(input:{name:string;email:string;senderEmail:string;replyTo:string}):TransactionalEmail {
 const link='https://techniqskinandbeauty.com/intake-consent.html';
 return {sender:{name:'Techniq Skin & Beauty',email:input.senderEmail},to:[{email:input.email,name:input.name}],replyTo:{email:input.replyTo},subject:'Your Techniq intake form',textContent:`Hi ${input.name},\n\nThank you for booking with Techniq Skin & Beauty. Please complete your new-client intake form before your consultation: ${link}\n\nIf you have questions, reply to this email.\n\nTechniq Skin & Beauty`,htmlContent:`<!doctype html><html><body style="font-family:Arial,sans-serif;color:#302c2a;line-height:1.6"><h1>Welcome to Techniq</h1><p>Hi ${escapeHtml(input.name)},</p><p>Thank you for booking. Please complete your new-client intake form before your consultation.</p><p><a href="${link}">Complete your intake form</a></p><p>If you have questions, reply to this email.</p><p>Techniq Skin &amp; Beauty</p></body></html>`};
}

export function consultationReceipt(input:{name:string;email:string;startsAt:string;senderEmail:string;replyTo:string}):TransactionalEmail {
 const date=new Date(input.startsAt);if(Number.isNaN(date.getTime()))throw new Error('Invalid appointment time');
 const time=new Intl.DateTimeFormat('en-US',{dateStyle:'full',timeStyle:'short',timeZone:'America/New_York'}).format(date)+' Eastern Time';
 return {sender:{name:'Techniq Skin & Beauty',email:input.senderEmail},to:[{email:input.email,name:input.name}],replyTo:{email:input.replyTo},subject:'Your Techniq consultation is booked',textContent:`Hi ${input.name},\n\nYour payment is confirmed and your consultation is booked for ${time}. We will send your meeting link before your appointment.\n\nTechniq Skin & Beauty`,htmlContent:`<!doctype html><html><body style="font-family:Arial,sans-serif;color:#302c2a;line-height:1.6"><h1>Your consultation is booked</h1><p>Hi ${escapeHtml(input.name)},</p><p>Your payment is confirmed and your consultation is booked for <strong>${escapeHtml(time)}</strong>.</p><p>We will send your meeting link before your appointment.</p><p>Techniq Skin &amp; Beauty</p></body></html>`};
}
