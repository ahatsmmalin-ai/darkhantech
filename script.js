(() => {
 const qs=(s)=>document.querySelector(s),qsa=(s)=>[...document.querySelectorAll(s)];
 const menuButton=qs('.menu-button'),nav=qs('.site-nav');
 const shutMenu=()=>{nav?.classList.remove('open');menuButton?.setAttribute('aria-expanded','false');document.body.classList.remove('menu-open')};
 menuButton?.addEventListener('click',()=>{const isOpen=nav.classList.toggle('open');menuButton.setAttribute('aria-expanded',isOpen?'true':'false');document.body.classList.toggle('menu-open',isOpen)});
 qsa('.site-nav a').forEach(a=>a.addEventListener('click',shutMenu));
 window.addEventListener('resize',()=>{if(innerWidth>850)shutMenu()});
 const modal=qs('#inquiry-modal'),close=qs('.modal-close'),form=qs('#demo-form'),direction=qs('#f-direction'),result=qs('#form-result');
 let focusBefore=null;
 const openModal=(topic)=>{if(!modal)return;focusBefore=document.activeElement;const allowed=['Industrial','Expeditions','Sourcing','Общий запрос'];direction.value=allowed.includes(topic)?topic:'Общий запрос';result.textContent='';modal.classList.add('open');document.body.style.overflow='hidden';qs('#f-name')?.focus()};
 const closeModal=()=>{modal?.classList.remove('open');document.body.style.overflow='';focusBefore?.focus?.()};
 qsa('[data-open-modal]').forEach(btn=>btn.addEventListener('click',()=>openModal(btn.dataset.topic||'Общий запрос')));
 close?.addEventListener('click',closeModal);
 modal?.addEventListener('click',(e)=>{if(e.target===modal)closeModal()});
 document.addEventListener('keydown',(e)=>{if(e.key==='Escape'&&modal?.classList.contains('open'))closeModal()});
 form?.addEventListener('submit',(e)=>{e.preventDefault();if(!form.reportValidity())return;result.textContent='Форма работает как прототип. Отправка данных отключена до подключения CRM и согласования обработки персональных данных.'});
 const chosen=qs('#chosen-category');qsa('[data-category]').forEach(btn=>btn.addEventListener('click',()=>{qsa('[data-category]').forEach(x=>{x.classList.remove('active');x.setAttribute('aria-pressed','false');});btn.classList.add('active');btn.setAttribute('aria-pressed','true');if(chosen)chosen.textContent=btn.dataset.category;const topicButton=qs('.cat-selection [data-open-modal]');if(topicButton)topicButton.dataset.topic='Industrial';}));
 const back=qs('.back-to-top');window.addEventListener('scroll',()=>back?.classList.toggle('shown',scrollY>560),{passive:true});back?.addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));
 if('IntersectionObserver' in window){const observer=new IntersectionObserver((entries)=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add('visible');observer.unobserve(entry.target)}})},{rootMargin:'0px 0px -45px 0px',threshold:.08});qsa('.reveal').forEach(el=>observer.observe(el))}else qsa('.reveal').forEach(el=>el.classList.add('visible'));
})();


/* LIVE ROI MODEL: input values are hypothetical, no network or personal data. */
(()=>{
 const ids=['calc-now','calc-after','calc-pay','calc-capex','calc-extra'];
 const fields=ids.map(id=>document.getElementById(id));
 if(fields.some(x=>!x))return;
 const fmt=(n)=>Math.round(n).toLocaleString('ru-RU')+' ₽';
 const put=(id,value)=>{const el=document.getElementById(id);if(el)el.textContent=value};
 const get=(i)=>{const v=Number(fields[i].value);return Number.isFinite(v)?Math.max(0,v):0};
 const calc=()=>{
  const n=Math.min(50,get(0)),a=Math.min(50,get(1)),salary=get(2),capex=get(3),extra=get(4);
  const before=n*salary,after=a*salary+extra,diff=before-after,year=diff*12;
  const scale=Math.max(before,after,1);
  put('calc-saving',fmt(diff));put('calc-year',fmt(year));put('calc-percent',before>0?((diff/before)*100).toFixed(0)+'%':'—');
  put('calc-before-label',fmt(before));put('calc-after-label',fmt(after));
  put('calc-payback',diff>0&&capex>0?(capex/diff).toLocaleString('ru-RU',{minimumFractionDigits:1,maximumFractionDigits:1}):'—');
  document.getElementById('calc-before-bar').style.width=Math.max(0,Math.min(100,before/scale*100))+'%';
  document.getElementById('calc-after-bar').style.width=Math.max(0,Math.min(100,after/scale*100))+'%';
 };
 fields.forEach(el=>el.addEventListener('input',calc));
 document.getElementById('calc-reset')?.addEventListener('click',()=>{[5,2,85000,2500000,15000].forEach((v,i)=>fields[i].value=v);calc()});
 calc();
})();
// Real photographs are externally hosted and may be blocked offline. The shipped local fallback keeps the prototype functional.
document.querySelectorAll('img[data-fallback]').forEach(img=>img.addEventListener('error',()=>{if(img.dataset.fallback && !img.dataset.usedFallback){img.dataset.usedFallback='true';img.src=img.dataset.fallback;}}));


/* DARKHANTECH premium scroll progress and glass-header state */
(()=>{let raf=0;const h=document.querySelector('.site-header');const update=()=>{const y=window.scrollY||0;h?.classList.toggle('is-scrolled',y>42);const d=document.documentElement;const max=Math.max(1,d.scrollHeight-window.innerHeight);d.style.setProperty('--scroll-progress',(100*y/max).toFixed(2)+'%');raf=0;};const run=()=>{if(!raf)raf=requestAnimationFrame(update)};window.addEventListener('scroll',run,{passive:true});window.addEventListener('resize',run);update();})();


/* Visual media. Images loaded from the Pexels image CDN under its website-use license.
   The original on-site visuals remain available if an external source cannot be reached. */
(function(){
  const images=[...document.querySelectorAll('img[data-real-src]')];
  if(!images.length) return;
  const loaded=new WeakSet();
  function upgrade(img){
    if(loaded.has(img))return;
    loaded.add(img);
    const remote=img.getAttribute('data-real-src');
    if(!remote)return;
    const candidate=new Image();
    candidate.decoding='async';
    candidate.onload=()=>{
      if(!img.isConnected)return;
      img.src=remote;
      img.classList.add('photo-from-library');
      img.onerror=()=>{img.onerror=null;img.src=img.dataset.localPhoto;};
    };
    candidate.onerror=()=>{};
    img.dataset.localPhoto=img.src;
    candidate.src=remote;
  }
  if('IntersectionObserver' in window){
    const obs=new IntersectionObserver((entries)=>{
      entries.forEach(e=>{if(e.isIntersecting){upgrade(e.target);obs.unobserve(e.target)}});
    },{rootMargin:'480px'});
    images.forEach(el=>obs.observe(el));
  }else images.forEach(upgrade);
})();
