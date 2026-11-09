(()=>{
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.mobile-nav');
if(menu&&nav){menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Закрыть меню':'Открыть меню')});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}))}
const modal=document.getElementById('contact-modal'),openers=document.querySelectorAll('[data-modal]'),close=modal?.querySelector('.modal-close');let lastFocus=null;
function openModal(){lastFocus=document.activeElement;modal?.classList.add('open');modal?.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';close?.focus()}
function closeModal(){modal?.classList.remove('open');modal?.setAttribute('aria-hidden','true');document.body.style.overflow='';lastFocus?.focus?.()}
openers.forEach(b=>b.addEventListener('click',openModal));close?.addEventListener('click',closeModal);modal?.addEventListener('click',e=>{if(e.target===modal)closeModal()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&modal?.classList.contains('open'))closeModal()});
const form=document.getElementById('contact-form');
const selectedFiles=document.getElementById('request-files');
const fileSelection=document.getElementById('selected-files');
const formStatus=document.getElementById('contact-result');
const maxFileSize=20*1024*1024;
function validateAttachments(){
 const files=Array.from(selectedFiles?.files||[]);
 if(!fileSelection)return true;
 if(files.length>3){fileSelection.textContent='Можно выбрать не более трёх файлов.';return false}
 const tooLarge=files.filter(f=>f.size>maxFileSize);
 if(tooLarge.length){fileSelection.textContent='Максимум 20 МБ на файл. Уменьшите: '+tooLarge.map(f=>f.name).join(', ');return false}
 fileSelection.textContent=files.length?'Выбрано: '+files.map(f=>`${f.name} (${(f.size/1024/1024).toFixed(1)} МБ)`).join(' · '):'Файлы не выбраны';
 return true;
}
selectedFiles?.addEventListener('change',()=>{validateAttachments();if(formStatus)formStatus.textContent=''});
form?.addEventListener('submit',e=>{
 e.preventDefault();if(!validateAttachments()){if(formStatus)formStatus.textContent='Исправьте список вложений.';return}
 const data=new FormData(form),get=k=>String(data.get(k)||'').trim();
 const attachments=Array.from(selectedFiles?.files||[]).map(x=>x.name);
 const body=['DARKHANTECH / ЧЕРНОВИК ОБРАЩЕНИЯ','Дата: '+new Date().toLocaleString('ru-RU'),'Имя: '+get('name'),'Контакт: '+get('contact'),'Направление: '+get('direction'),'Продукт: '+get('product'),'Задача: '+get('message'),'Вложения (их нужно отправить отдельно): '+(attachments.join(', ')||'нет'),'','Этот файл создан локально в браузере. Данные и вложения не отправлены компании.'].join('\n');
 const blob=new Blob(['\uFEFF'+body],{type:'text/plain;charset=utf-8'});
 const url=URL.createObjectURL(blob),anchor=document.createElement('a');anchor.href=url;anchor.download='DARKHANTECH-запрос.txt';document.body.append(anchor);anchor.click();anchor.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);
 if(formStatus)formStatus.textContent='Текст заявки сохранён на устройстве. Файлы не отправлены и в текстовую заявку не включены. Для реальной отправки понадобится подключение почты или CRM.';
});
const toTop=document.querySelector('.to-top');window.addEventListener('scroll',()=>toTop?.classList.toggle('visible',window.scrollY>500),{passive:true});toTop?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));

// Show offline-safe local image instantly, then progressively load licensed stock photography.
const loadEditorialPhoto=img=>{
  const url=img.dataset.remote;
  if(!url)return;
  const remote=new Image();
  remote.decoding='async';
  remote.onload=()=>{img.src=url};
  remote.onerror=()=>{}; // keep the local fallback; no broken image state
  remote.src=url;
};
if('IntersectionObserver' in window){
 const photosObserver=new IntersectionObserver((items,observer)=>{
  items.forEach(entry=>{if(entry.isIntersecting){loadEditorialPhoto(entry.target);observer.unobserve(entry.target)}})
 },{rootMargin:'350px'});
 document.querySelectorAll('img[data-remote]').forEach(img=>photosObserver.observe(img));
}else document.querySelectorAll('img[data-remote]').forEach(loadEditorialPhoto);

const techData={
 vegetables:{title:'Подготовка и мойка овощей',lead:'От сырья и формы нарезки зависят потери, санитарный режим и производительность.',image:'https://images.pexels.com/photos/5953729/pexels-photo-5953729.jpeg?auto=compress&cs=tinysrgb&w=1280',fallback:'visual-lines.webp',questions:['Тип сырья, его температура и загрязнение','Размер фракции и однородность нарезки','Требуемый объём и фактический выход годного продукта','Схема мойки, обезвоживания и санитарной обработки']},
 dumplings:{title:'Формование полуфабрикатов',lead:'Для стабильной формы важны рецепт, температура фарша, свойства теста и режим подачи.',image:'https://images.pexels.com/photos/8093299/pexels-photo-8093299.jpeg?auto=compress&cs=tinysrgb&w=1280',fallback:'visual-dumplings.webp',questions:['Консистенция теста и температура начинки','Размер, масса и геометрия готового изделия','Производительность в штуках и кг за смену','Доступность переналадки и очистки формовочного узла']},
 packing:{title:'Фасовка и упаковка',lead:'Тара, температура продукта и способ дозирования влияют на выбор машины.',image:'https://images.pexels.com/photos/5532669/pexels-photo-5532669.jpeg?auto=compress&cs=tinysrgb&w=1280',fallback:'visual-packaging.webp',questions:['Тип упаковки и размеры тары','Температура, текучесть и порционность продукта','Точность дозировки и требуемый темп','Мойка оборудования, маркировка и условия последующей логистики']}
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
  img.dataset.fallback=selected.fallback;img.src=selected.fallback;img.dataset.remote=selected.image;loadEditorialPhoto(img);
 }));
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
 flow:['Карта операций','Замер цикла','Сопоставление узлов','Пилот на сырье'],
 questions:['Сколько годной продукции выходит за смену на каждом участке?','Где формируется очередь или простой при пиковом выпуске?','Как изменятся качество и санитарные процедуры при росте темпа?','Какой результат можно проверить на тестовой партии?'],
 next:'Согласовать производственную схему и протокол замеров. Не публиковать обещания увеличения выпуска или фактическую модернизацию без подтверждённых данных.'},
 packing:{
 kicker:'РАЗБОР 03 / ОБУЧАЮЩИЙ СЦЕНАРИЙ',title:'Как связать точность дозирования с темпом участка',
 lead:'Модельный пример: даже высокая паспортная скорость не помогает, если продукт плохо дозируется, упаковка негерметична или смена формата занимает много времени.',
 problem:'Отклонения по массе, остановки при смене тары, дефекты запайки',
 target:'Согласованная точность, герметичность и стабильный выпуск',
 bottleneck:'Температура и вязкость продукта, тара, материал плёнки',
 flow:['Подача продукта','Дозирование','Запайка','Контроль массы / шва'],
 questions:['Допуск по массе и повторяемость дозирования','Демонстрация герметичности на выбранной таре','Время смены формата и доступность расходников','Совместимость с маркировкой и логистикой'],
 next:'Запросить спецификацию материалов, тест по согласованной таре и условия приемочных испытаний. Это учебный сценарий, не клиентский кейс.'}
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
if(caseButtons.length)selectCase('dumplings');

const compareScenarios={
 dumplings:{heading:'Отдельный формовщик или интегрированная линия?',intro:'Первый вариант проще встроить в небольшой цех; второй потенциально сокращает ручные переходы между операциями, но требует согласования всей цепочки.',a:'Отдельная машина',b:'Интегрированная линия',rows:[['Сценарий','Самостоятельное формование','Связанные подача и формование'],['Когда уместно','Несколько рецептур, ограниченная площадь','Повторяемый ассортимент, план роста выпуска'],['Сильная сторона','Гибкая переналадка и поэтапная интеграция','Меньше ручных переходов между операциями'],['Ограничение','Темп зависит от подготовки и подачи сырья','Нужны место, настройка и синхронизация узлов'],['Что тестировать','Геометрия, вес и прочность шва в серии','Непрерывность подачи и качество продукта в потоке']],question:'Какой годный выпуск получается на вашем тесте и начинке?',proof:'Видео испытания в серии, комплект форм, санитарная карта, доступность запасных частей.'},
 vegetables:{heading:'Отдельные операции или единая линия подготовки?',intro:'Раздельная компоновка позволяет менять узлы поэтапно; интегрированная — связывает мойку, очистку и нарезку, но предъявляет требования к согласованности операций.',a:'Отдельные машины',b:'Интегрированная линия',rows:[['Сценарий','Мойка / очистка / нарезка на отдельных участках','Последовательная обработка в одном технологическом потоке'],['Когда уместно','Частая смена сырья и неодинаковые партии','Стабильный ассортимент и планируемая загрузка'],['Сильная сторона','Проще заменить отдельный этап','Меньше ручных перемещений продукта'],['Ограничение','Дополнительные перегрузки и персонал','Зависимость линии от узкого места'],['Что тестировать','Выход годного продукта после каждого узла','Суммарные потери, фракцию и санобработку']],question:'Какой выход годного продукта получается на выбранном сырье?',proof:'Протокол испытания на сопоставимых партиях, водопотребление, требования к очистке и обслуживанию.'},
 packing:{heading:'Полуавтоматическая фасовка или автоматическая линия?',intro:'Выбор зависит от характеристик продукта, объёма партии, точности порции и времени на смену упаковки.',a:'Полуавтоматический участок',b:'Автоматическая линия',rows:[['Сценарий','Оператор участвует в подаче и контроле','Связанные дозирование, запайка и выдача'],['Когда уместно','Небольшие серии, частые смены упаковки','Стабильные форматы и повторяемая загрузка'],['Сильная сторона','Гибкость переналадки','Меньше ручных переходов'],['Ограничение','Производительность зависит от оператора','Потребуется согласовать тару, продукт и расходники'],['Что тестировать','Массу дозы, герметичность, темп','Потери при смене формата и работу в непрерывном цикле']],question:'Какая точность дозирования и герметичность достигается на вашей таре?',proof:'Контрольные образцы, протокол отклонений массы, тест запайки, состав расходников и сервисных материалов.'}
};
const compareButtons=[...document.querySelectorAll('[data-compare]')];
function selectCompare(key){const s=compareScenarios[key];if(!s)return;
 compareButtons.forEach(b=>{const active=b.dataset.compare===key;b.classList.toggle('is-active',active);b.setAttribute('aria-pressed',String(active))});
 const fields={'compare-headline':s.heading,'compare-intro':s.intro,'compare-name-a':s.a,'compare-name-b':s.b,'compare-question':s.question,'compare-proof':s.proof};
 for(const [id,value] of Object.entries(fields)){const el=document.getElementById(id);if(el)el.textContent=value}
 const body=document.getElementById('compare-tbody');if(body){body.replaceChildren();s.rows.forEach(([name,a,b])=>{const tr=document.createElement('tr');const th=document.createElement('th');th.setAttribute('scope','row');th.textContent=name;const tdA=document.createElement('td');tdA.textContent=a;const tdB=document.createElement('td');tdB.textContent=b;tr.append(th,tdA,tdB);body.append(tr)})}
}
compareButtons.forEach(b=>b.addEventListener('click',()=>selectCompare(b.dataset.compare)));

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
 set('effect-month',rub(net));set('effect-caption',net>=0?'Расчётный эффект в месяц, не гарантия':'При этих условиях результат отрицательный');
 set('good-before',fmt(goodBefore));set('good-after',fmt(goodAfter));set('good-gain',(gain>=0?'+':'−')+fmt(Math.abs(gain)));set('payback',payback);
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