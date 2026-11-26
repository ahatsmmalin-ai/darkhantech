(()=>{
'use strict';
const featured=["DT-042", "DT-043", "DT-044", "DT-045", "DT-046", "DT-047", "DT-048", "DT-049", "DT-050", "DS-011", "DS-018", "DS-019", "DS-020"];
const PRODUCTS=Array.isArray(window.DH_PRODUCTS)?[...window.DH_PRODUCTS].sort((a,b)=>{
 const score=p=>{
   const featuredIndex=featured.indexOf(p.sku);
   if(featuredIndex!==-1)return featuredIndex;
   const packaging=p.directions?.includes('Фасовка и упаковка') || /упаков|дозатор|фасов/i.test(p.type);
   const semi=p.directions?.includes('Полуфабрикаты') || /пельмен|формовоч/i.test(p.type);
   const meat=p.directions?.includes('Мясопереработка') || p.directions?.includes('Овощеподготовка');
   const direction=packaging?0:semi?1000:meat?2000:3000;
   if(p.imageStatus==='needs-source')return 30000+direction;
   if(p.imageStatus==='review')return 20000+direction;
   if(p.sku==='DS-001'||p.sku==='DS-002')return 16000+direction;
   return 100+direction;
 };
 return score(a)-score(b) || a.sku.localeCompare(b.sku,'en');
}):[];
const grid=document.getElementById('dcat-grid');
if(!grid)return;
const search=document.getElementById('dcat-search'),direction=document.getElementById('dcat-direction'),type=document.getElementById('dcat-type'),brand=document.getElementById('dcat-brand'),counter=document.getElementById('dcat-counter'),pages=document.getElementById('dcat-pages'),reset=document.getElementById('dcat-reset');
const modal=document.getElementById('dcat-quick'),panel=document.getElementById('dcat-quick-content');
const n=12;let page=1;let lastFocus=null;
const param=new URLSearchParams(location.search);
const norm=v=>String(v||'').trim().toLocaleLowerCase('ru-RU').replace(/ё/g,'е');
const filterOptions=(el,arr,allLabel)=>{el.replaceChildren();const all=new Option(allLabel,'');el.add(all);for(const val of arr)el.add(new Option(val,val));};
filterOptions(direction,['Фасовка и упаковка','Полуфабрикаты','Мясопереработка','Овощеподготовка','Пекарни и кондитерские','Готовая еда и фабрики-кухни'],'Все направления');
filterOptions(type,[...new Set(PRODUCTS.map(x=>x.type))],'Все типы');
filterOptions(brand,[...new Set(PRODUCTS.map(x=>x.brand))].sort((a,b)=>a.localeCompare(b,'ru')),'Все бренды');
for(const [el,key] of [[search,'q'],[direction,'direction'],[type,'type'],[brand,'brand']]){const val=param.get(key);if(val&&(!el.options||[...el.options].some(x=>x.value===val)))el.value=val;}
const el=(tag,cls,content)=>{const node=document.createElement(tag);if(cls)node.className=cls;if(content!=null)node.textContent=content;return node;};
const img=(src,alt,lazy=true)=>{const im=document.createElement('img');im.src=src;im.alt=alt;im.decoding='async';if(lazy)im.loading='lazy';return im;};
function specPoints(p,max=2){return String(p.spec||'').split(';').map(s=>s.trim().replace(/\.$/,'')).filter(Boolean).slice(0,max)}
function requestProduct(p){
  const trigger=document.querySelector('.site-header [data-modal]')||document.querySelector('button[data-modal]');
  if(!trigger)return;
  trigger.click();
  const t=document.querySelector('#contact-form textarea[name="message"]');
  if(t)t.value='Интересует модель: '+p.title+' ('+p.sku+')\nПрошу уточнить стоимость, комплектацию и условия поставки.';
  const select=document.querySelector('#contact-form select[name="direction"]');
  if(select&&Array.isArray(p.directions)&&p.directions.length){const d=p.directions[0];select.value=(d==='Мясопереработка'||d==='Овощеподготовка')?'Овощеподготовка и мясопереработка':(d==='Готовая еда и фабрики-кухни'?'Фасовка и упаковка':d);}
}
function makeCard(p){
 const c=el('article','dcat-product dpc-premium-card');
 const visual=el('div','dpc-card-visual');
 const media=el('a','dcat-product-media');media.href=p.href;media.setAttribute('aria-label','Открыть карточку модели '+p.model);
 media.append(img(p.photo,p.title+' — оборудование',false));
 media.append(el('span','dcat-product-sku',p.sku));visual.append(media);
 const quick=el('button','dpc-quick-trigger');quick.type='button';quick.dataset.quick=p.sku;quick.setAttribute('aria-label','Быстрый просмотр '+p.title);
 quick.innerHTML='<svg aria-hidden="true" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></svg><span>Быстрый просмотр</span>';
 visual.append(quick);c.append(visual);
 const copy=el('div','dcat-product-copy');
 const meta=el('div','dpc-card-meta');meta.append(el('span','dpc-card-brand',p.brand),el('span','dcat-product-type',p.type));copy.append(meta);
 const title=el('a','dcat-product-title',p.title);title.href=p.href;copy.append(title);
 const specs=el('div','dpc-card-specs');specPoints(p).forEach(x=>specs.append(el('span','dpc-card-spec',x)));copy.append(specs);
 const footer=el('div','dcat-product-footer');
 const price=el('div','dpc-card-price');price.append(el('small','','СТОИМОСТЬ'),el('strong','',p.price||'По запросу'));footer.append(price);
 const actions=el('div','dcat-product-actions');
 const more=el('a','dpc-more','Подробнее ↗');more.href=p.href;
 const req=el('button','dpc-request','Запросить цену');req.type='button';req.dataset.requestSku=p.sku;
 actions.append(more,req);footer.append(actions);copy.append(footer);c.append(copy);return c;
}
function syncUrl(){const q=new URLSearchParams();for(const [key,val] of [['q',search.value],['direction',direction.value],['type',type.value],['brand',brand.value]])if(val.trim())q.set(key,val.trim());const dest=location.pathname+(q.size?'?'+q:'')+location.hash;if(location.protocol==='https:'||location.protocol==='http:')history.replaceState(null,'',dest);}
function filtered(){const q=norm(search.value);const rows=PRODUCTS.filter(p=>(!q||norm([p.sku,p.title,p.type,p.brand,p.model,p.desc,p.spec].join(' ')).includes(q))&&(!direction.value||p.directions.includes(direction.value))&&(!type.value||p.type===type.value)&&(!brand.value||p.brand===brand.value));
 if(direction.value==='Полуфабрикаты'){
 const order=p=>/пельмен|формовоч|бууз|мант|котлет/i.test(p.title+' '+p.type)?0:/тестораскат/i.test(p.title+' '+p.type)?1:/фаршемес/i.test(p.title+' '+p.type)?2:/тестомес/i.test(p.title+' '+p.type)?4:3;
 rows.sort((a,b)=>order(a)-order(b)||a.sku.localeCompare(b.sku,'ru'));
 }
 return rows;}
function render(){syncUrl();const rows=filtered();const total=Math.max(1,Math.ceil(rows.length/n));page=Math.min(page,total);counter.textContent=`Найдено ${rows.length} из ${PRODUCTS.length} моделей`;grid.replaceChildren();
 if(!rows.length){const empty=el('div','dcat-empty');empty.append(el('strong','','Ничего не найдено'),el('p','','Попробуйте другой запрос или сбросьте фильтры.'));grid.append(empty)}
 else rows.slice((page-1)*n,page*n).forEach(p=>grid.append(makeCard(p)));
 pages.replaceChildren();if(total>1){const make=(label,p,disabled=false)=>{const b=el('button',p===page?'is-current':'',label);b.type='button';b.disabled=disabled;b.setAttribute('aria-label',`Страница ${p}`);if(p===page)b.setAttribute('aria-current','page');b.addEventListener('click',()=>{page=p;render();document.getElementById('models').scrollIntoView({behavior:'smooth',block:'start'})});pages.append(b)};make('‹',Math.max(1,page-1),page===1);for(let i=1;i<=total;i++)make(String(i),i);make('›',Math.min(total,page+1),page===total)}
}
for(const e of [search,direction,type,brand])e.addEventListener(e===search?'input':'change',()=>{page=1;render()});
reset.addEventListener('click',()=>{search.value='';direction.value='';type.value='';brand.value='';page=1;render();search.focus()});
function openQuick(p,origin){lastFocus=origin;const g=el('div','dcat-quick-grid');const photo=img(p.photo,p.title);photo.className='dcat-quick-img';g.append(photo);
 const side=el('div','dcat-quick-info');side.append(el('span','dcat-quick-kicker',p.brand+' / '+p.sku+' / '+p.type),el('h2','dcat-quick-title',p.title),el('p','dcat-quick-p',p.desc));
 const ul=el('ul');p.spec.split(';').map(v=>v.trim()).filter(Boolean).forEach(v=>ul.append(el('li','',v)));side.append(ul);
 side.append(el('h3','',p.price||'По запросу'));
 const acts=el('div','dcat-quick-actions');const a=el('a','btn btn-gold','Полная карточка ↗');a.href=p.href;const b=el('button','dcat-outline','Запросить стоимость ↗');b.type='button';b.addEventListener('click',()=>{closeQuick();requestProduct(p);});acts.append(a,b);side.append(acts,el('p','dcat-quick-note','Визуализация модели · параметры уточняются при подборе.'));
 g.append(side);panel.replaceChildren(g);const ttl=panel.querySelector('.dcat-quick-title');if(ttl)ttl.id='dcat-quick-title';modal.hidden=false;modal.setAttribute('aria-hidden','false');document.body.style.overflow='hidden';modal.querySelector('.dcat-close').focus();}
function closeQuick(){if(modal.hidden)return;modal.hidden=true;modal.setAttribute('aria-hidden','true');document.body.style.overflow='';lastFocus?.focus();}
grid.addEventListener('click',e=>{const req=e.target.closest('[data-request-sku]');if(req){const p=PRODUCTS.find(x=>x.sku===req.dataset.requestSku);if(p)requestProduct(p);return;}const btn=e.target.closest('[data-quick]');if(!btn)return;const p=PRODUCTS.find(x=>x.sku===btn.dataset.quick);if(p)openQuick(p,btn)});
modal.addEventListener('click',e=>{if(e.target.closest('[data-dcat-close]'))closeQuick()});document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closeQuick()});
render();
})();
