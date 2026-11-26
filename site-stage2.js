/* DARKHANTECH | модуль второго этапа: контакты, навигация, интерфейс */
(()=>{'use strict';
const cfg=window.DH_CONTACTS||{};
const valid=(v)=>typeof v==='string'&&v.trim().length>0;
if(valid(cfg.phone)||valid(cfg.telegram)||valid(cfg.whatsapp)){
 const strip=document.createElement('div');strip.className='stage2-contact-strip';
 const head=document.createElement('strong');head.textContent='Связаться напрямую';strip.append(head);
 if(valid(cfg.phone)){const a=document.createElement('a');a.href='tel:'+cfg.phone.replace(/[^+0-9]/g,'');a.textContent='Позвонить';strip.append(a);}
 if(valid(cfg.telegram)){const a=document.createElement('a');a.href=cfg.telegram;a.rel='noopener noreferrer';a.target='_blank';a.textContent='Telegram';strip.append(a);}
 if(valid(cfg.whatsapp)){const a=document.createElement('a');a.href=cfg.whatsapp;a.rel='noopener noreferrer';a.target='_blank';a.textContent='WhatsApp';strip.append(a);}
 const header=document.querySelector('.header-tools'); if(header)header.prepend(strip);
}
// Page-specific form source: category/model, when a visitor opens a catalogue product.
document.addEventListener('click',e=>{
 const trigger=e.target.closest('[data-product]');if(!trigger)return;
 setTimeout(()=>{const textarea=document.querySelector('#contact-form textarea[name="message"]');if(textarea&&!textarea.value.includes(trigger.dataset.product))textarea.value='Интересует: '+trigger.dataset.product+'\nУточните цену, комплектацию, доставку и поддержку.';},0);
});
})();
