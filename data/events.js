// ライブ情報。サンプルはコメントのみ。実際の公演情報とURLを登録してください。
const DEFAULT_TICKET_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScENBWWtNbC9MeIqkYOe47HLfAf9lmO9ihr488N10owD7viOw/viewform';
const liveEvents = [
  // 画像・PDFはユーザーがGitHubの assets/events と assets/setlist に配置したファイルを参照します。
  // 名前や拡張子が異なる場合は実ファイルに合わせて修正してください。
  {id:'20261108',date:'2026-11-08',title:'Perfect Pizza Party',venue:'',
   media:[
    {type:'flyer',src:'assets/events/261108-PerfectPizzaParty.webp'}]},
  {id:'20260829',date:'2026-08-29',title:'Komaba Independence Days',venue:'',
   media:[
    {type:'flyer',src:'assets/events/260829-KomabaIndependenceDays-1.JPG'},
    {type:'flyer',src:'assets/events/260829-KomabaIndependenceDays-2.JPG'},
    {type:'setlist',src:'assets/setlist/260829-KomabaIndependenceDays.pdf'}]},
  {id:'20260519',date:'2026-05-19',title:'across',venue:'',
   media:[{type:'flyer',src:'assets/events/260519-across.JPG'},
          {type:'setlist',src:'assets/setlist/260519-across.pdf'}]},
  {id:'20260329',date:'2026-03-29',title:'独立前夜',venue:'',
   media:[{type:'flyer',src:'assets/events/260329-独立前夜-1.JPG'},
          {type:'flyer',src:'assets/events/260329-独立前夜-2.JPG'},
          {type:'setlist',src:'assets/setlist/260329-独立前夜.pdf'}]},
  {id:'20250803',date:'2025-08-03',title:'uncanny valley',venue:'',
   media:[{type:'flyer',src:'assets/events/250803-uncanny_valley.png'},
          {type:'setlist',src:'assets/setlist/250803-uncanny_valley.pdf'}]},
  {id:'20250706',date:'2025-07-06',title:'YEAH3',venue:'',
   media:[{type:'flyer',src:'assets/events/250706-YEAH3.png'},
          {type:'setlist',src:'assets/setlist/250706-YEAH3.pdf'}]},
  {id:'20250627',date:'2025-06-27',title:'PIZZA OF 100% DEATH',venue:'',
   media:[{type:'flyer',src:'assets/events/250627-PIZZAOF100_DEATH-1.png'},
          {type:'flyer',src:'assets/events/250627-PIZZAOF100_DEATH-2.png'},
          {type:'flyer',src:'assets/events/250627-PIZZAOF100_DEATH-3.png'},
          {type:'setlist',src:'assets/setlist/250627-PIZZAOF100_DEATH.pdf'}]},
  {id:'20250406',date:'2025-04-06',title:'YEAH2',venue:'',
   media:[{type:'flyer',src:'assets/events/250406-YEAH2.png'},
          {type:'setlist',src:'assets/setlist/250406-YEAH2.pdf'}]},
  {id:'20250208',date:'2025-02-08',title:'Komaba Independence Days',venue:'',
   media:[{type:'flyer',src:'assets/events/250208-KomabaIndependenceDays.png'},
          {type:'setlist',src:'assets/setlist/250208-KomabaIndependenceDays.pdf'}]},
  {id:'20241227',date:'2024-12-27',title:'YEAH',venue:'',
   media:[{type:'flyer',src:'assets/events/241227-YEAH-1.png'},
          {type:'flyer',src:'assets/events/241227-YEAH-2.png'},
          {type:'flyer',src:'assets/events/241227-YEAH-3.png'},
          {type:'flyer',src:'assets/events/241227-YEAH-4.png'},
          {type:'setlist',src:'assets/setlist/241227-YEAH.pdf'}]}
];
// 公演IDは YYYYMMDD (例: 20260829)。同日複数公演なら末尾に -2 などを付けます。
function parseDay(date){return new Date(date+'T00:00:00')}
function isUpcoming(e){const today=new Date();today.setHours(0,0,0,0);return parseDay(e.date)>=today}
function safeEventLink(url){try{const u=new URL(url);return u.protocol==='https:'?u.href:null}catch{return null}}
function node(tag,cls,value){const el=document.createElement(tag);if(cls)el.className=cls;if(value!=null)el.textContent=value;return el}
function eventUrl(e){return 'event.html?id='+encodeURIComponent(e.id)}
function addImage(parent,src,alt,cls){if(!src)return;const img=node('img',cls);img.src=src;img.alt=alt;img.loading='lazy';img.decoding='async';img.onerror=()=>img.hidden=true;parent.append(img)}
function orderedMedia(e){const media=Array.isArray(e.media)?e.media.filter(m=>m&&m.src):[];return [...media.filter(m=>m.type!=='setlist'),...media.filter(m=>m.type==='setlist')]}
function firstFlyer(e){return orderedMedia(e).find(m=>m.type==='flyer')}
function eventCard(e,compact=false){const article=node('article','event-card');
 const link=node('a','event-cover-link');link.href=eventUrl(e);addImage(link,firstFlyer(e)?.src||e.flyerThumb||e.flyerFull,e.title+' フライヤー','event-thumb');if(!link.childElementCount)link.append(node('span','event-no-image','FLYER COMING SOON'));article.append(link);
 const info=node('div','event-info');info.append(node('p','event-date',e.date+(e.start?' / START '+e.start:'')),node('h3','event-title',e.title),node('p','event-venue',[e.venue,e.city].filter(Boolean).join(' / ')));
 if(!compact&&e.lineup)info.append(node('p','event-lineup',e.lineup));
 const actions=node('div','event-actions');const detail=node('a','',isUpcoming(e)?'ライブ詳細 ↗':'記録・セットリスト ↗');detail.href=eventUrl(e);actions.append(detail);
 const ticket=safeEventLink(e.ticketUrl || DEFAULT_TICKET_URL);if(isUpcoming(e)&&ticket){const a=node('a','ticket-cta','取り置き・予約 ↗');a.href=ticket;a.target='_blank';a.rel='noopener noreferrer';actions.append(a)}
 info.append(actions);article.append(info);return article}
function renderEvents(targetId,limit){const root=document.getElementById(targetId);if(!root)return;root.replaceChildren();const future=liveEvents.filter(isUpcoming).sort((a,b)=>a.date.localeCompare(b.date));const past=liveEvents.filter(e=>!isUpcoming(e)).sort((a,b)=>b.date.localeCompare(a.date));
 if(limit){if(!future.length){root.append(node('p','empty-state','次回ライブは現在準備中です。最新情報はこちらでお知らせします。'));return}const grid=node('div','event-grid');future.slice(0,limit).forEach(e=>grid.append(eventCard(e,true)));root.append(grid);return}
 if(!liveEvents.length){root.append(node('p','empty-state','ライブ情報は準備中です。イベント情報とフライヤーを登録するとここに表示されます。'));return}
 for(const [heading,items] of [['UPCOMING LIVE',future],['PAST LIVE / ARCHIVE',past]]){if(!items.length)continue;const section=node('section','event-section');section.append(node('h2','event-heading',heading));const grid=node('div','event-grid');items.forEach(e=>grid.append(eventCard(e)));section.append(grid);root.append(section)}
}
function renderEventDetail(){const root=document.getElementById('event-detail');if(!root)return;const id=new URLSearchParams(location.search).get('id');const e=liveEvents.find(e=>e.id===id);if(!e){root.append(node('p','empty-state','該当するライブがありません。'));return}
 document.title=e.title+' | Pizza The Third Choices';root.append(node('p','eyebrow','LIVE ARCHIVE / '+e.date),node('h1','event-detail-title',e.title));
 const meta=node('div','event-detail-meta');for(const [label,val] of [['DATE',e.date],['OPEN',e.doors],['START',e.start],['VENUE',e.venue],['CITY',e.city],['LINEUP',e.lineup]])if(val)meta.append(node('p','',label+' / '+val));root.append(meta);
 if(e.description)root.append(node('p','event-description',e.description));const ticket=safeEventLink(e.ticketUrl || DEFAULT_TICKET_URL);if(isUpcoming(e)&&ticket){const a=node('a','ticket-main','取り置きフォームを開く ↗');a.href=ticket;a.target='_blank';a.rel='noopener noreferrer';root.append(a)}
 const media=orderedMedia(e);
 if(!media.length){for(const [type,src] of [['flyer',e.flyerFull||e.flyerThumb],['setlist',e.setlistFull||e.setlistThumb]])if(src)media.push({type,src})}
 if(media.length){
  const gallery=node('section','event-carousel');gallery.setAttribute('aria-label','フライヤー・セットリスト');
  const heading=node('div','event-carousel-heading');heading.append(node('h2','','GALLERY'));
  const counter=node('span','event-carousel-counter');heading.append(counter);gallery.append(heading);
  const track=node('div','event-carousel-track');track.tabIndex=0;track.setAttribute('aria-label','左右にスクロールして画像を閲覧');
  media.forEach((m,i)=>{
   const slide=node('figure','event-carousel-slide');slide.id='slide-'+e.id+'-'+i;
   const label=m.type==='setlist'?'SETLIST':'FLYER '+String(media.slice(0,i+1).filter(x=>x.type!=='setlist').length).padStart(2,'0');
   slide.append(node('figcaption','',label));
   const ext=m.src.split('?')[0].toLowerCase();
   if(ext.endsWith('.pdf')){
    const wrap=node('div','event-pdf');const iframe=node('iframe');iframe.src=m.src+'#toolbar=0';iframe.title=label+' / '+e.title;iframe.loading='lazy';wrap.append(iframe);
    const open=node('a','event-pdf-open','PDFを開く ↗');open.href=m.src;open.target='_blank';open.rel='noopener noreferrer';wrap.append(open);slide.append(wrap);
   }else{
    const link=node('a','event-slide-image');link.href=m.src;link.target='_blank';link.rel='noopener noreferrer';link.title='画像を拡大表示';
    addImage(link,m.src,label+' / '+e.title,'event-carousel-image');slide.append(link)
   }
   track.append(slide)
  });gallery.append(track);
  const controls=node('div','event-carousel-controls');const prev=node('button','event-carousel-arrow','←');prev.type='button';prev.setAttribute('aria-label','前の画像');
  const next=node('button','event-carousel-arrow','→');next.type='button';next.setAttribute('aria-label','次の画像');
  controls.append(prev,node('span','event-carousel-hint','SWIPE / SCROLL'),next);gallery.append(controls);
  function activeIndex(){const slides=[...track.children];return slides.reduce((best,slide,i)=>Math.abs(slide.offsetLeft-track.scrollLeft)<Math.abs(slides[best].offsetLeft-track.scrollLeft)?i:best,0)}
  function update(){const i=activeIndex();counter.textContent=(i+1)+' / '+media.length;prev.disabled=i===0;next.disabled=i===media.length-1}
  function move(delta){const i=Math.max(0,Math.min(media.length-1,activeIndex()+delta));track.children[i].scrollIntoView({behavior:'smooth',block:'nearest',inline:'start'})}
  prev.addEventListener('click',()=>move(-1));next.addEventListener('click',()=>move(1));track.addEventListener('scroll',update,{passive:true});
  track.addEventListener('keydown',ev=>{if(ev.key==='ArrowRight'||ev.key==='ArrowLeft'){ev.preventDefault();move(ev.key==='ArrowRight'?1:-1)}});
  root.append(gallery);requestAnimationFrame(update)
 }
 if(e.setlistSongNumbers?.length){const sec=node('section','setlist-text');sec.append(node('h2','','SETLIST'));const ol=node('ol');for(const num of e.setlistSongNumbers){const li=node('li');const a=node('a','',`No.${num} / 楽曲詳細 ↗`);a.href='song.html?id='+encodeURIComponent(num);li.append(a);ol.append(li)}sec.append(ol);root.append(sec)}
 if(e.notes)root.append(node('p','event-description',e.notes));
}
