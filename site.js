(()=>{
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.mobile-nav');
if(menu&&nav){menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню')});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}))}
const modal=document.getElementById('contact-modal'),openers=document.querySelectorAll('[data-modal]'),close=modal?.querySelector('.modal-close');let lastFocus=null;
function openModal(event){
  const trigger=event?.currentTarget;
  const model=String(trigger?.dataset?.product||'').trim();
  const requestedMessage=String(trigger?.dataset?.message||'').trim();
  const preferred=String(trigger?.dataset?.direction||'').trim();
  const product=String(trigger?.dataset?.formProduct||'').trim();
  const textarea=modal?.querySelector('textarea[name="message"]');
  const select=modal?.querySelector('select[name="direction"]');
  const productInput=modal?.querySelector('input[name="product"]');
  if(textarea){
    if(requestedMessage){textarea.value=requestedMessage;textarea.dataset.prefilled='1';}
    else if(model){textarea.value='Интересует модель: '+model+'\nПожалуйста, уточните цену, комплектацию и условия поставки.';textarea.dataset.prefilled='1';}
    else if(textarea.dataset.prefilled==='1'){textarea.value='';delete textarea.dataset.prefilled;}
  }
  if(select&&preferred&&[...select.options].some(option=>option.value===preferred)){select.value=preferred;select.dataset.prefilled='1';}
  else if(select?.dataset.prefilled==='1'){select.selectedIndex=0;delete select.dataset.prefilled;}
  if(productInput&&product)productInput.value=product;
  lastFocus=document.activeElement;
  modal?.classList.add('open');modal?.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';close?.focus();
}
function closeModal(){modal?.classList.remove('open');modal?.setAttribute('aria-hidden','true');document.body.style.overflow='';lastFocus?.focus?.()}
openers.forEach(b=>b.addEventListener('click',openModal));close?.addEventListener('click',closeModal);modal?.addEventListener('click',e=>{if(e.target===modal)closeModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal?.classList.contains('open'))closeModal()});
const form=document.getElementById('contact-form');
const formStatus=document.getElementById('contact-result');
const copyFallback=document.getElementById('dh-copy-fallback');
const leadEndpoint=String(window.DH_LEAD_ENDPOINT||'').trim();
const isLeadActive=/^https:\/\/[^\s]+$/i.test(leadEndpoint)||leadEndpoint==='/api/leads';
function setStatus(message,kind=''){
 if(!formStatus)return;
 formStatus.textContent=message;formStatus.classList.toggle('is-error',kind==='error');formStatus.classList.toggle('is-success',kind==='success');
}
const contactChannels=window.DH_CONTACTS||{};
function publicContacts(){
 const items=[];
 let phone=String(contactChannels.phone||'').trim();
 let tg=String(contactChannels.telegram||'').trim();
 let wa=String(contactChannels.whatsapp||'').trim();
 if(phone && /^[+\d()\-\s]{7,30}$/.test(phone)) items.push(['Позвонить','tel:'+phone.replace(/[\s()\-]/g,'')]);
 if(tg){if(/^@[A-Za-z0-9_]{5,32}$/.test(tg))tg='https://t.me/'+tg.slice(1);if(/^https:\/\/t\.me\/[A-Za-z0-9_+\-/]+$/.test(tg))items.push(['Telegram',tg]);}
 if(wa){if(/^\+?\d{10,15}$/.test(wa))wa='https://wa.me/'+wa.replace(/\D/g,'');if(/^https:\/\/wa\.me\/\d{10,15}$/.test(wa))items.push(['WhatsApp',wa]);}
 return items;
}
const availableContacts=publicContacts();
const quick=document.getElementById('dh-quick-contact');
const quickLinks=document.getElementById('dh-quick-contact-links');
if(quick&&quickLinks&&availableContacts.length){
 quick.hidden=false;
 availableContacts.forEach(([label,url])=>{
  const a=document.createElement('a');a.href=url;a.textContent=label+' ↗';
  if(url.startsWith('https://')){a.target='_blank';a.rel='noopener noreferrer';}
  quickLinks.append(a);
 });
}

const directBox=document.getElementById('dh-direct-contacts');
if(directBox&&availableContacts.length){
 directBox.hidden=false;
 availableContacts.forEach(([label,url])=>{
   const a=document.createElement('a');a.textContent=label+' ↗';a.href=url;
   if(url.startsWith('https://')){a.target='_blank';a.rel='noopener noreferrer';}
   directBox.append(a);
 });
}
// Optional public contact links in the footer: all 86 pages use the same config.
if(availableContacts.length){
 const foot=document.querySelector('.site-footer .footer-grid');
 if(foot){const col=document.createElement('div');col.className='dh-footer-contacts';
   const title=document.createElement('strong');title.textContent='Связаться';col.append(title);
   availableContacts.forEach(([label,url])=>{const a=document.createElement('a');a.href=url;a.textContent=label+' ↗';if(url.startsWith('https://')){a.target='_blank';a.rel='noopener noreferrer';}col.append(a)});
   foot.append(col);
 }
}
function serializeLead(data){
 const out={};
 for(const key of ['name','contact','direction','product','message'])out[key]=String(data.get(key)||'').trim();
 out.consent=data.get('consent')==='on';out.website=String(data.get('website')||'');
 const q=new URLSearchParams(location.search);
 out.utm={};for(const key of ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'])out.utm[key]=String(q.get(key)||'').slice(0,130);
 out.page=location.href.split('#')[0].slice(0,650);
 return out;
}
function readableLead(payload){return [
'DARKHANTECH / ПОДБОР ОБОРУДОВАНИЯ',
'Имя: '+payload.name,
'Контакт: '+payload.contact,
'Направление: '+payload.direction,
'Продукт: '+(payload.product||'не указано'),
'Задача: '+(payload.message||'не указано'),
'Страница: '+payload.page
].join('\n');}
function showCopy(text){
 if(!copyFallback)return;
 copyFallback.hidden=false;
 const textarea=copyFallback.querySelector('textarea');if(textarea)textarea.value=text;
}
if(form){
 const submit=form.querySelector('#dh-form-submit');const help=form.querySelector('#dh-form-help');
 if(isLeadActive){
    if(submit)submit.textContent='Отправить запрос ↗';
    if(help)help.textContent='После отправки мы получим ваше обращение в CRM. Контакты используем только для ответа на запрос.';
 }else{
    if(submit)submit.textContent='Скопировать обращение ↗';
    if(help)help.textContent='Сайт пока не подключён к приёму заявок. Текст можно скопировать и отправить менеджеру. Автоматическая отправка не производится.';
 }
 form.addEventListener('submit',async event=>{
  event.preventDefault();setStatus('');
  if(!form.reportValidity())return;
  const lead=serializeLead(new FormData(form));
  if(lead.name.length<2 || lead.contact.length<5){setStatus('Укажите имя и контакт, по которому можно с вами связаться.','error');return;}
  const text=readableLead(lead);
  if(!isLeadActive){
    showCopy(text);
    try{if(navigator.clipboard&&window.isSecureContext){await navigator.clipboard.writeText(text);setStatus('Текст обращения скопирован. Передайте его менеджеру через согласованный канал связи.','success');}
    else setStatus('Скопируйте текст из поля ниже. Заявка не отправлена на сайт.');}
    catch(e){setStatus('Скопируйте обращение вручную из поля ниже. Заявка не отправлена на сайт.');}
    return;
  }
  if(submit)submit.disabled=true;
  setStatus('Отправляем запрос…');
  try{
   const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),15000);
   let response;
   try{response=await fetch(leadEndpoint,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(lead),credentials:'omit',mode:'cors',signal:controller.signal});}
   finally{clearTimeout(timer)}
   if(!response.ok)throw Error('Lead API '+response.status);
   const result=await response.json();
   if(result?.success!==true)throw Error('Lead not confirmed');
   setStatus('Запрос отправлен! Спасибо, скоро свяжемся с вами.','success');
   form.reset();if(copyFallback)copyFallback.hidden=true;
   if(typeof window.ym==='function'&&Number(window.DH_METRIKA_ID)>0)window.ym(Number(window.DH_METRIKA_ID),'reachGoal','lead_sent');
  }catch(err){
   setStatus('Не получилось отправить запрос. Данные остались в форме — повторите попытку или воспользуйтесь прямой связью ниже.','error');
   showCopy(text);
  }finally{if(submit)submit.disabled=false}
 });
 copyFallback?.querySelector('.dh-copy-again')?.addEventListener('click',async()=>{
   const text=copyFallback.querySelector('textarea')?.value||'';
   try{await navigator.clipboard.writeText(text);setStatus('Текст скопирован.','success');}
   catch(e){copyFallback.querySelector('textarea')?.select();setStatus('Выделите и скопируйте текст вручную.');}
 });
}

const toTop=document.querySelector('.to-top');window.addEventListener('scroll',()=>toTop?.classList.toggle('visible',window.scrollY>500),{passive:true});toTop?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

// Always retain local site photos and source-labelled catalogue images.
// Remote stock images no longer replace the user's own factory materials.
const loadEditorialPhoto=img=>{
 const fallback=img.dataset.fallback;
 if(fallback&&!img.getAttribute('src')) img.src=fallback;
};

const techData={
 vegetables:{title:'Подготовка и мойка овощей',lead:'Уточним, что нужно мыть или нарезать, в каких объёмах, и подберём подходящую машину.',image:'',fallback:'visual-lines.webp',questions:['Тип сырья, его температура и загрязнение','Размер фракции и однородность нарезки','Требуемый объём и фактический выход годного продукта','Схема мойки, обезвоживания и санитарной обработки']},
 dumplings:{title:'Формование полуфабрикатов',lead:'Проверим, как машина работает с вашим тестом и начинкой, какой получается вес и форма изделий.',image:'',fallback:'supplier-photos/songsheng-gq-3-sj-fa.webp',questions:['Консистенция теста и температура начинки','Размер, масса и геометрия готового изделия','Производительность в штуках и кг за смену','Доступность переналадки и очистки формовочного узла']},
 packing:{title:'Фасовка и упаковка',lead:'Для выбора машины важно знать продукт, упаковку и сколько нужно фасовать за час.',image:'',fallback:'supplier-photos/kenhigh-jr-420.webp',questions:['Тип упаковки и размеры тары','Температура, текучесть и порционность продукта','Точность дозировки и требуемый темп','Мойка оборудования, маркировка и условия последующей логистики']}
};
for(const [key, val] of Object.entries(techData)){
 const img=document.getElementById('tech-photo');
 if(!img) break;
 const buttons=[...document.querySelectorAll('[data-tech]')];
 buttons.forEach(btn=>btn.addEventListener('click',()=>{
  const selected=techData[btn.dataset.tech];if(!selected)return;
  buttons.forEach(b=>{const active=b===btn;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))});
  document.getElementById('tech-title').textContent=selected.title;
  document.getElementById('tech-lead').textContent=selected.lead;
  document.getElementById('tech-questions').innerHTML=selected.questions.map(x=>'<li>'+x+'</li>').join('');
  img.dataset.fallback=selected.fallback;img.src=selected.fallback;img.dataset.remote=selected.image;img.alt='Оборудование: '+selected.title;loadEditorialPhoto(img);
 }));
 const defaultPacking=buttons.find(button=>button.dataset.tech==='packing');if(defaultPacking)defaultPacking.click();
 break;
}


// INDUSTRIAL: model scenarios. Never present these as client projects or manufacturer specifications.
const caseScenarios={
 dumplings:{
 kicker:'РАЗБОР 01 / ТОНКОЕ ТЕСТО · ПО МАТЕРИАЛАМ АУДИТА',title:'Как подобрать формование для лёгких пельменей',
 lead:'В маркетинговом аудите упоминается задача с пельменями 8–12 г, тонким тестом и структурной начинкой. Это черновой разбор параметров — без утверждения результата или статуса проекта.',
 problem:'Тонкое тесто, малый вес изделия и текстура начинки предъявляют разные требования к машине',
 target:'Определить критерии стабильной формы, веса и выпуска на согласованном сырье',
 bottleneck:'Пластичность теста, размер фракции фарша, точность дозы, качество шва',
 flow:['Образцы теста и начинки','Формование','Контроль веса','Испытание серии'],
 questions:['Как ведёт себя машина с тонким тестом на выбранной рецептуре?','Достигается ли масса 8–12 г при приемлемой стабильности изделия?','Что происходит с крупной фракцией начинки?','Какие формы, расходники и условия санитарной мойки необходимы?'],
 next:'Согласовать реальные образцы и требования к изделию, затем запросить видео работы, измерения серии и перечень ограничений. В аудите нет протокола испытаний или подтверждённого результата.'},
 vegetables:{
 kicker:'РАЗБОР 02 / РОСТ ВЫПУСКА · ПО МАТЕРИАЛАМ АУДИТА',title:'Как найти узкое место при масштабировании готовой еды',
 lead:'Аудит описывает посещение производства и обсуждение возможной автоматизации. На сайте показываем только метод проверки: исходные параметры выпуска, последовательность операций и требования к качеству ещё нужно подтвердить.',
 problem:'Ручные переходы между подготовкой сырья, приготовлением и упаковкой могут сдерживать темп',
 target:'Определить, на каком этапе увеличение мощности действительно даст прирост годного выпуска',
 bottleneck:'Несогласованность скоростей операций, партии сырья, температура продукта и логистика участка',
 flow:['Карта операций','Замер цикла','Сравнение этапов','Пилот на сырье'],
 questions:['Сколько годной продукции выходит за смену на каждом участке?','Где формируется очередь или простой при пиковом выпуске?','Как изменятся качество и санитарные процедуры при росте темпа?','Какой результат можно проверить на тестовой партии?'],
 next:'Уточнить, как устроено производство, где возникают задержки и что реально можно улучшить. Результаты нужно проверить на практике.'},
 packing:{
 kicker:'РАЗБОР 03 / ОБУЧАЮЩИЙ СЦЕНАРИЙ',title:'Как связать точность дозирования с темпом участка',
 lead:'Модельный пример: даже высокая паспортная скорость не помогает, если продукт плохо дозируется, упаковка негерметична или смена формата занимает много времени.',
 problem:'Отклонения по массе, остановки при смене тары, дефекты запайки',
 target:'Согласованная точность, герметичность и стабильный выпуск',
 bottleneck:'Температура и вязкость продукта, тара, материал плёнки',
 flow:['Подача продукта','Дозирование','Запайка','Контроль массы / шва'],
 questions:['Допуск по массе и повторяемость дозирования','Демонстрация герметичности на выбранной таре','Время смены формата и доступность расходников','Совместимость с маркировкой и логистикой'],
 next:'Уточнить упаковку, проверить образцы на машине и договориться о критериях испытаний. Это пример подбора, а не результат выполненного проекта.'}
};
const caseButtons=[...document.querySelectorAll('[data-case]')];
function selectCase(key){const s=caseScenarios[key];if(!s)return;
 for(const b of caseButtons){const active=b.dataset.case===key;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))}
 const fields={'lab-kicker':s.kicker,'lab-title':s.title,'lab-lead':s.lead,'lab-problem':s.problem,'lab-target':s.target,'lab-bottleneck':s.bottleneck,'lab-next':s.next};
 for(const [id,value] of Object.entries(fields)){const el=document.getElementById(id);if(el)el.textContent=value}
 const flow=document.getElementById('lab-flow');if(flow){flow.replaceChildren();s.flow.forEach((label,i)=>{if(i){const arrow=document.createElement('i');arrow.textContent='→';flow.append(arrow)}const node=document.createElement('span');node.textContent=label;flow.append(node)})}
 const qs=document.getElementById('lab-questions');if(qs){qs.replaceChildren();s.questions.forEach(q=>{const li=document.createElement('li');li.textContent=q;qs.append(li)})}
}
caseButtons.forEach(b=>b.addEventListener('click',()=>selectCase(b.dataset.case)));
if(caseButtons.length)selectCase('packing');

const compareScenarios={
 dumplings:{heading:'Отдельный формовщик или интегрированная линия?',intro:'Первый вариант проще встроить в небольшой цех; второй потенциально сокращает ручные переходы между операциями, но требует согласования всей цепочки.',a:'Отдельная машина',b:'Интегрированная линия',rows:[['Сценарий','Самостоятельное формование','Связанные подача и формование'],['Когда уместно','Несколько рецептур, ограниченная площадь','Повторяемый ассортимент, план роста выпуска'],['Сильная сторона','Гибкая переналадка и поэтапная интеграция','Меньше ручных переходов между операциями'],['Ограничение','Темп зависит от подготовки и подачи сырья','Нужны место, настройка и синхронизация узлов'],['Что тестировать','Геометрия, вес и прочность шва в серии','Непрерывность подачи и качество продукта в потоке']],question:'Какой годный выпуск получается на вашем тесте и начинке?',proof:'Видео испытания в серии, комплект форм, санитарная карта, доступность запасных частей.'},
 vegetables:{heading:'Отдельные операции или единая линия подготовки?',intro:'Отдельные машины проще заменять по одной; единая линия связывает мойку, очистку и нарезку. Выбор зависит от сырья и объёмов.',a:'Отдельные машины',b:'Интегрированная линия',rows:[['Сценарий','Мойка / очистка / нарезка на отдельных участках','Последовательная обработка в одном технологическом потоке'],['Когда уместно','Частая смена сырья и неодинаковые партии','Стабильный ассортимент и планируемая загрузка'],['Сильная сторона','Проще заменить отдельный этап','Меньше ручных перемещений продукта'],['Ограничение','Дополнительные перегрузки и персонал','Зависимость линии от узкого места'],['Что тестировать','Выход годного продукта после каждого узла','Суммарные потери, фракцию и санобработку']],question:'Какой выход годного продукта получается на выбранном сырье?',proof:'Протокол испытания на сопоставимых партиях, водопотребление, требования к очистке и обслуживанию.'},
 packing:{heading:'Полуавтоматическая фасовка или автоматическая линия?',intro:'Выбор зависит от характеристик продукта, объёма партии, точности порции и времени на смену упаковки.',a:'Полуавтоматический участок',b:'Автоматическая линия',rows:[['Сценарий','Оператор участвует в подаче и контроле','Связанные дозирование, запайка и выдача'],['Когда уместно','Небольшие серии, частые смены упаковки','Стабильные форматы и повторяемая загрузка'],['Сильная сторона','Гибкость переналадки','Меньше ручных переходов'],['Ограничение','Производительность зависит от оператора','Потребуется согласовать тару, продукт и расходники'],['Что тестировать','Массу дозы, герметичность, темп','Потери при смене формата и работу в непрерывном цикле']],question:'Какая точность дозирования и герметичность достигается на вашей таре?',proof:'Контрольные образцы, протокол отклонений массы, тест запайки, состав расходников и сервисных материалов.'}
};
const compareButtons=[...document.querySelectorAll('[data-compare]')];
function selectCompare(key){const s=compareScenarios[key];if(!s)return;
 compareButtons.forEach(b=>{const active=b.dataset.compare===key;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))});
 const fields={'compare-headline':s.heading,'compare-intro':s.intro,'compare-name-a':s.a,'compare-name-b':s.b,'compare-question':s.question,'compare-proof':s.proof};
 for(const [id,value] of Object.entries(fields)){const el=document.getElementById(id);if(el)el.textContent=value}
 const body=document.getElementById('compare-tbody');if(body){body.replaceChildren();s.rows.forEach(([name,a,b])=>{const tr=document.createElement('tr');const th=document.createElement('th');th.setAttribute('scope','row');th.textContent=name;const tdA=document.createElement('td');tdA.textContent=a;const tdB=document.createElement('td');tdB.textContent=b;tr.append(th,tdA,tdB);body.append(tr)})}
}
compareButtons.forEach(b=>b.addEventListener('click',()=>selectCompare(b.dataset.compare)));if(compareButtons.length)selectCompare('packing');

const calc=document.getElementById('efficiency-form');if(!calc)return;
const defaults={'out-before':1200,'out-after':2200,'scrap-before':5,'scrap-after':2,'shifts':22,'demand':45,'margin':18,'staff-before':5,'staff-after':3,'salary':85000,'service':30000,'operating':40000,'idle-before':0,'idle-after':0,'idle-hour-cost':0,'investment':5200000,'launch':350000};
const read=id=>{const el=document.getElementById(id);if(!el)return 0;const v=Number(el.value);return Number.isFinite(v)?Math.max(0,v):0};
const fmt=x=>Math.round(x).toLocaleString('ru-RU');
const rub=x=>`${x<0?'−':''}${fmt(Math.abs(x))} ₽`;
function update(){
 const before=read('out-before'),after=read('out-after'),bScrap=Math.min(99,read('scrap-before')),aScrap=Math.min(99,read('scrap-after')),
 shifts=Math.max(1,read('shifts')),demand=Math.min(100,read('demand'))/100,margin=read('margin'),staffEffect=(read('staff-before')-read('staff-after'))*read('salary'),
 service=read('service'),operating=read('operating'),downtimeEffect=(read('idle-before')-read('idle-after'))*read('idle-hour-cost'),investment=read('investment')+read('launch');
 const goodBefore=before*(1-bScrap/100),goodAfter=after*(1-aScrap/100),gain=(goodAfter-goodBefore)*shifts,
 income=Math.max(0,gain)*demand*margin,net=income+staffEffect+downtimeEffect-service-operating;
 const payback=net>0?(investment/net).toFixed(1).replace('.',',')+' мес.':'Нет окупаемости';
 const set=(id,val)=>{const el=document.getElementById(id);if(el)el.textContent=val};
 set('effect-month',rub(net));set('effect-caption',net>=0?'Оценка по введённым данным':'При этих условиях результат отрицательный');
 set('good-before',fmt(goodBefore));set('good-after',fmt(goodAfter));set('good-gain',(gain>=0?'+':'−')+fmt(Math.abs(gain)));set('sold-gain',fmt(Math.max(0,gain)*demand));set('payback',payback);
 set('income-line',rub(income));set('staff-line',rub(staffEffect));set('downtime-line',rub(downtimeEffect));set('service-line','−'+rub(service));set('operating-line','−'+rub(operating));set('investment-line',rub(investment));
}
const scenarios={
 balanced:defaults,
 quality:{...defaults,'out-before':1200,'out-after':1350,'scrap-before':9,'scrap-after':2,'demand':80,'staff-before':5,'staff-after':5,'service':16000,'operating':14000,'investment':2800000,'launch':200000},
 capacity:{...defaults,'out-before':1200,'out-after':3000,'scrap-before':5,'scrap-after':4,'demand':35,'staff-before':5,'staff-after':5,'service':45000,'operating':45000,'investment':6500000,'launch':450000}
};
const fill=values=>Object.entries(values).forEach(([id,v])=>{const el=document.getElementById(id);if(el)el.value=v});
document.querySelectorAll('[data-scenario]').forEach(btn=>btn.addEventListener('click',()=>{
 const values=scenarios[btn.dataset.scenario];if(!values)return;fill(values);
 document.querySelectorAll('[data-scenario]').forEach(b=>{const active=b===btn;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))});update();
}));
calc.addEventListener('input',update);
document.getElementById('reset-calc')?.addEventListener('click',()=>{
 fill(defaults);document.querySelectorAll('[data-scenario]').forEach(b=>{const active=b.dataset.scenario==='balanced';b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))});update();
});update();
})();