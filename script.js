const albumTrackOrder = Object.fromEntries(albums.map(a=>[a.title,a.trackNumbers]));
const colors={...Object.fromEntries(albums.map(a=>[a.title,a.color])),'未収録':'#999999'};
const albumImages=Object.fromEntries(albums.map(a=>[a.title,a.cover]));
const cassetteOnlyNumbers = new Set([16,27,30]);
const tapeRelease = albums.find(a=>a.id==='tape-33');
function coverFor(song){return cassetteOnlyNumbers.has(song.number)?(tapeRelease?.cassette?.sideA||tapeRelease?.cover):albumImages[song.album]}
function youtubeId(value){
 if(!value)return null;
 try{const u=new URL(value);const host=u.hostname.toLowerCase();
  if(host==='youtu.be'||host==='www.youtu.be')return validVideoId(u.pathname.split('/')[1]);
  if(!['youtube.com','www.youtube.com','m.youtube.com','youtube-nocookie.com','www.youtube-nocookie.com'].includes(host))return null;
  if(u.pathname==='/watch')return validVideoId(u.searchParams.get('v'));
  const parts=u.pathname.split('/');if(['shorts','embed','live'].includes(parts[1]))return validVideoId(parts[2]);
 }catch(e){}return null;
}
function validVideoId(id){return /^[a-zA-Z0-9_-]{11}$/.test(id||'')?id:null}
function videoFor(song){const id=youtubeId(songVideos[song.number]);if(!id)return null;
 const section=document.createElement('section');section.className='video-section';
 const h=document.createElement('h3');h.textContent='曲解説 / YouTube Shorts';
 const frame=document.createElement('iframe');frame.className='shorts-player';frame.src='https://www.youtube-nocookie.com/embed/'+id;
 frame.title=song.title+' 曲解説動画';frame.loading='lazy';frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';frame.allowFullscreen=true;
 const link=document.createElement('a');link.href='https://www.youtube.com/shorts/'+id;link.target='_blank';link.rel='noopener noreferrer';link.textContent='YouTubeで見る ↗';
 section.append(h,frame,link);return section;
}

const lengths=[2,...Array(Math.max(12,Math.ceil((songs.length-2)/8))).fill(8)]; // first row: left and right; subsequent rows sequentially filled
let selected=3;
let displayMode='creation';
function isTeaser(s){return unreleasedNumbers.includes(s.number)}
function publicCode(s){return isTeaser(s)?'???':(s.code||'—')}
function publicTitle(s){return isTeaser(s)?'未発表楽曲':s.title}
// Normalize typography differences without treating user input as a regular expression.
// Apostrophes (straight/curly), whitespace and other punctuation are ignored.
function normalizeSearch(text){
 return String(text).normalize('NFKC').toLowerCase().replace(/[\p{P}\p{S}\s]+/gu,'');
}
function isMatch(s,q){
 if(q==='%')return !isTeaser(s)&&s.title.includes('%');
 return !q||normalizeSearch(`${s.number} ${isTeaser(s)?'':s.title} ${publicCode(s)}`).includes(q);
}
function orderedAlbumSongs(album){const a=songs.filter(s=>getAlbum(s)===album);const order=albumTrackOrder[album]||[];return a.sort((x,y)=>{const ix=order.indexOf(x.number),iy=order.indexOf(y.number);return (ix<0?1000+x.number:ix)-(iy<0?1000+y.number:iy)})}

const iconPaths={
 cassette:'<rect x="2.5" y="5" width="19" height="14" rx="2"/><rect x="5.5" y="8" width="13" height="5" rx="1"/><circle cx="9" cy="10.5" r="1.4"/><circle cx="15" cy="10.5" r="1.4"/><path d="M7 19l2-4h6l2 4"/>',
 traffic:'<rect x="7" y="2" width="10" height="20" rx="3"/><circle cx="12" cy="6.5" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="12" cy="17.5" r="1.5"/>',
 sleeping:'<path d="M3 15a8 8 0 0 0 12 6A8 8 0 0 1 10 4 8 8 0 0 0 3 15Z"/><path d="M16 4h5l-5 5h5"/>',
 galaxy:'<circle cx="12" cy="12" r="2"/><ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(-25 12 12)"/><path d="M19 3v4M17 5h4"/>'
};
function icon(kind){const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('fill','none');svg.setAttribute('stroke','currentColor');svg.setAttribute('stroke-width','1.8');svg.setAttribute('stroke-linecap','round');svg.setAttribute('stroke-linejoin','round');svg.setAttribute('aria-hidden','true');svg.innerHTML=iconPaths[kind];return svg}
function markKind(note){return note==='カセット限定'?'cassette':note==='Traffic'?'traffic':note==='Sleeping'?'sleeping':note==='Galaxy Colosseum'?'galaxy':null}
const position=new Map();let positionCursor=0;
lengths.forEach((len,row)=>{for(let i=0;i<len;i++){position.set(positionCursor+i+1,{row,col:len===2?(i===0?0:7):i})}positionCursor+=len});
function pairDirection(song){if(!song.pair)return null;const a=position.get(song.number),b=position.get(song.pair);if(!a||!b)return null;if(a.row===b.row&&b.col===a.col+1)return 'right';if(a.col===b.col&&b.row===a.row+1)return 'down';return null}
function connector(dir){const e=document.createElement('span');e.className='pair-connector '+dir;e.setAttribute('aria-hidden','true');e.innerHTML=dir==='right'?'<svg viewBox="0 0 24 70"><path d="M3 66 L21 4" stroke="#181818" stroke-width="5"/><path d="M3 66 L21 4" stroke="white" stroke-width="2.5"/></svg>':'<svg viewBox="0 0 70 24"><path d="M3 21 L67 3" stroke="#181818" stroke-width="5"/><path d="M3 21 L67 3" stroke="white" stroke-width="2.5"/></svg>';return e}
function imageFor(song,cls){const src=coverFor(song);if(!src)return null;const img=document.createElement('img');img.className=cls;img.src=src;img.alt=cls==='detail-art'?(cassetteOnlyNumbers.has(song.number)?'33 (1st Tape)':song.album)+' ジャケット':'';img.loading='lazy';img.onerror=()=>img.hidden=true;return img}
function songUrl(s){return 'song.html?id='+encodeURIComponent(s.number)}

const table=document.querySelector('#periodic'),detail=document.querySelector('#detail');
const availableCovers=new Set();
if(table){[...Object.values(albumImages),tapeRelease?.cassette?.sideA,tapeRelease?.cover].filter(Boolean).forEach(src=>{const im=new Image();im.onload=()=>{availableCovers.add(src);render()};im.src=src;});}
function getAlbum(s){return s.album||'未収録'}
function createCell(song,q){
 const el=document.createElement('button');el.type='button';el.className='element'+(selected===song.number?' selected':'')+(q&&!isMatch(song,q)?' dim':'');el.style.background=colors[getAlbum(song)];el.style.setProperty('--album-color',colors[getAlbum(song)]);
 if(availableCovers.has(coverFor(song))){el.classList.add('cover-cell');el.style.setProperty('--cover-url',`url("${coverFor(song)}")`)}
 el.setAttribute('aria-label',`No.${song.number} ${publicTitle(song)}`);
 const num=document.createElement('span');num.className='num';num.textContent=String(song.number).padStart(2,'0');
 const sym=document.createElement('span');sym.className='symbol';sym.textContent=publicCode(song);if(publicCode(song).length>3)sym.classList.add('long-code');
 const marks=document.createElement('span');marks.className='marks';const kind=markKind(song.note);
 if(kind){const mark=document.createElement('span');mark.className='mark-icon';mark.title=song.note;mark.setAttribute('aria-label',song.note);mark.append(icon(kind));marks.append(mark)}
 const tip=document.createElement('span');tip.className='tooltip';const tNum=document.createElement('small');tNum.textContent=`No.${song.number} / ${publicCode(song)}`;const tTitle=document.createElement('strong');tTitle.textContent=publicTitle(song);const tDesc=document.createElement('small');tDesc.textContent=isTeaser(song)?'情報公開をお待ちください。':(descriptions[song.number]||`収録：${getAlbum(song)}。曲紹介は準備中です。`);const tMore=document.createElement('small');tMore.className='more';tMore.textContent='クリックで詳細を表示 ↓';tip.append(tNum,tTitle,tDesc,tMore);
 el.append(num,sym,marks,tip);el.onclick=()=>{selected=song.number;render()};return el;
}
function render(){
 const input=document.querySelector('#search').value.trim();
 const q=input==='%'?'%':normalizeSearch(input);table.replaceChildren();
 table.classList.toggle('album-layout',displayMode==='album');
 if(displayMode==='album'){renderAlbumGrid(q)}else{renderCreationGrid(q)}
 renderDetail();
}
function renderCreationGrid(q){
 // Position each song explicitly, so merged pairs do not shift the remaining elements.
 const consumed=new Set();
 for(const song of songs){
  if(consumed.has(song.number))continue;
  const a=position.get(song.number);if(!a)continue;
  const dir=pairDirection(song);
  if(dir){
   const other=songs[song.pair-1];const group=document.createElement('div');group.className='pair-unit '+(dir==='right'?'pair-horizontal':'pair-vertical');
   group.style.gridColumn=`${a.col+1} / span ${dir==='right'?2:1}`;
   group.style.gridRow=`${a.row+1} / span ${dir==='down'?2:1}`;
   group.setAttribute('role','group');group.setAttribute('aria-label',`${publicTitle(song)} と ${publicTitle(other)} の対曲`);
   const first=createCell(song,q),second=createCell(other,q);first.classList.add('pair-first');second.classList.add('pair-second');
   // Keep pair tooltips outside the clipped buttons so they can extend beyond the frame.
   const firstTooltip=first.querySelector('.tooltip');
   const secondTooltip=second.querySelector('.tooltip');
   firstTooltip?.remove();
   secondTooltip?.remove();
   if(firstTooltip)firstTooltip.classList.add('pair-tooltip-first');
   if(secondTooltip)secondTooltip.classList.add('pair-tooltip-second');
   group.append(first,second);
   const line=document.createElement('span');line.className='pair-divider';line.setAttribute('aria-hidden','true');group.append(line);
   if(firstTooltip)group.append(firstTooltip);
   if(secondTooltip)group.append(secondTooltip);
   // Only the matched half receives search emphasis, never the entire pair border.
   group.classList.toggle('pair-searching',Boolean(q));
   table.append(group);consumed.add(other.number);
  }else{
   const cell=createCell(song,q);cell.style.gridColumn=String(a.col+1);cell.style.gridRow=String(a.row+1);
   if(song.pair&&!pairDirection(songs[Math.min(song.number,song.pair)-1])){const mark=document.createElement('span');mark.className='pair-inline';mark.textContent='';mark.title=`対曲 No.${song.pair}`;cell.querySelector('.marks').append(mark)}
   table.append(cell);
  }
 }
}
function renderAlbumGrid(q){
 const used=new Set();
 for(const release of albums){
   const section=document.createElement('section');
   section.className='album-group album-release';
   const heading=document.createElement('h2');
   heading.className='album-group-title';
   heading.textContent=release.title;
   section.append(heading);

   const layout=document.createElement('div');
   layout.className='album-release-layout';
   const artwork=document.createElement('div');
   artwork.className='album-release-artwork';
   if(release.cover){
     const img=document.createElement('img');
     img.src=release.cover;
     img.alt=release.title+' ジャケット';
     img.loading='lazy';
     img.onerror=()=>img.hidden=true;
     artwork.append(img);
   }
   artwork.append(streamingLinks(release));
   layout.append(artwork);
   if(release.type==='tape')layout.classList.add('tape-release-layout');

   const tracksArea=document.createElement('div');
   tracksArea.className='album-track-lists';
   const groups=release.sides?Object.entries(release.sides):[['',release.trackNumbers||[]]];
   for(const [side,tracks] of groups){
     const sideRow=side&&release.type==='tape'?document.createElement('div'):null;
     const sideTracks=sideRow?document.createElement('div'):tracksArea;
     if(sideRow){
       sideRow.className='tape-side-row';
       const sideImagePath=release.cassette?.['side'+side];
       if(sideImagePath){
         const sideImage=document.createElement('img');
         sideImage.className='tape-side-image';
         sideImage.src=sideImagePath;
         sideImage.alt=release.title+' SIDE '+side+' カセット本体';
         sideImage.loading='lazy';
         sideImage.onerror=()=>sideImage.hidden=true;
         sideRow.append(sideImage);
       }
       sideTracks.className='tape-side-tracks';
     }
     if(side){
       const sub=document.createElement('h3');
       sub.className='release-side';
       sub.textContent='SIDE '+side;
       sideTracks.append(sub);
     }
     const list=document.createElement('ol');
     list.className='album-track-list';
     tracks.forEach((entry,i)=>{
       const li=document.createElement('li');
       li.className='album-track-row';
       const order=document.createElement('span');
       order.className='album-track-index';
       order.textContent=String(i+1);
       li.append(order);
       if(typeof entry==='object'){
         const special=document.createElement('a');
         special.className='album-track-link';
         special.href='event.html?id='+encodeURIComponent(entry.eventId);
         special.textContent='Live音源';
         special.title=entry.label+' / ライブ記録へ';
         li.append(special);
         const bonus=document.createElement('span');
         bonus.className='album-track-bonus';
         bonus.textContent='Bonus';
         li.append(bonus);
       }else{
         const song=songs[entry-1];
         if(!song)return;
         used.add(entry);
         const link=document.createElement('button');
         link.type='button';
         link.className='album-track-link'+(selected===song.number?' is-selected':'')+(q&&!isMatch(song,q)?' dim':'');
         link.textContent=publicTitle(song);
         link.onclick=()=>{selected=song.number;render()};
         li.append(link);
         if(release.bonusNumbers?.includes(entry)){
           const bonus=document.createElement('span');
           bonus.className='album-track-bonus';
           bonus.textContent='Bonus';
           li.append(bonus);
         }
       }
       list.append(li);
     });
     sideTracks.append(list);
     if(sideRow){sideRow.append(sideTracks);tracksArea.append(sideRow)}
   }
   layout.append(tracksArea);
   section.append(layout);
   table.append(section);
 }
 const remaining=songs.filter(s=>!used.has(s.number));
 if(remaining.length){
   const section=document.createElement('section');
   section.className='album-group album-other';
   const heading=document.createElement('h2');
   heading.className='album-group-title';
   heading.textContent='OTHER / 未収録';
   const grid=document.createElement('div');
   grid.className='album-song-grid';
   remaining.forEach(song=>{
     const wrap=document.createElement('div');
     wrap.className='album-song-wrap';
     wrap.append(createCell(song,q));
     grid.append(wrap);
   });
   section.append(heading,grid);
   table.append(section);
 }
}

// Navigate by production number, independent of the table's current view or search.
function navigateDetail(step){
 const index=songs.findIndex(song=>song.number===selected);
 const next=songs[index+step];
 if(!next)return;
 selected=next.number;
 render();
 detail.scrollTop=0;
}
function detailNavigation(){
 const nav=document.createElement('nav');
 nav.className='detail-navigation';
 nav.setAttribute('aria-label','楽曲詳細の前後移動');
 const prev=document.createElement('button');
 prev.type='button';prev.className='detail-nav-button';
 prev.textContent='← PREV';prev.setAttribute('aria-label','前の楽曲');
 prev.disabled=selected===songs[0].number;
 prev.onclick=()=>navigateDetail(-1);
 const count=document.createElement('span');
 count.className='detail-nav-count';
 count.textContent=selected+' / '+songs.length;
 const next=document.createElement('button');
 next.type='button';next.className='detail-nav-button';
 next.textContent='NEXT →';next.setAttribute('aria-label','次の楽曲');
 next.disabled=selected===songs[songs.length-1].number;
 next.onclick=()=>navigateDetail(1);
 nav.append(prev,count,next);
 return nav;
}
function renderDetail(){
 const s=songs.find(s=>s.number===selected);if(!s)return;detail.replaceChildren();
 const top=document.createElement('div');top.className='detail-top';const eyebrow=document.createElement('span');eyebrow.className='eyebrow';eyebrow.textContent=`No. ${s.number} / ${publicCode(s)}`;const close=document.createElement('button');close.className='detail-reset';close.textContent='↗';close.title='楽曲詳細ページを開く';close.onclick=()=>location.href=songUrl(s);top.append(eyebrow,close);detail.append(top,detailNavigation());
 const heading=document.createElement('div');heading.className='detail-heading';const num=document.createElement('span');num.className='detail-number';num.textContent=s.number;const titleWrap=document.createElement('div');const h=document.createElement('h2');h.textContent=publicTitle(s);const code=document.createElement('p');code.className='detail-code';code.textContent=publicCode(s);titleWrap.append(h,code);heading.append(num,titleWrap);detail.append(heading);
 const art=imageFor(s,'detail-art');const albumBox=document.createElement('div');albumBox.className='detail-album';const cover=document.createElement('div');cover.className='detail-cover';cover.style.setProperty('--album-color',colors[getAlbum(s)]);if(art)cover.append(art);else cover.textContent='NO ARTWORK';const meta=document.createElement('div');meta.className='detail-album-meta';const cap=document.createElement('small');cap.textContent=cassetteOnlyNumbers.has(s.number)?'カセット限定収録':'収録アルバム';const album=document.createElement('strong');album.textContent=cassetteOnlyNumbers.has(s.number)?'33 (1st Tape)':getAlbum(s);meta.append(cap,album);if(s.note){const note=document.createElement('span');note.textContent=s.note;meta.append(note)}albumBox.append(cover,meta);detail.append(albumBox);const streams=streamingLinks(cassetteOnlyNumbers.has(s.number)?tapeRelease:albumByTitle(s.album));if(streams.childElementCount)detail.append(streams);
 const descSection=document.createElement('section');descSection.className='description-section';const descHeading=document.createElement('h3');descHeading.textContent='楽曲解説';const desc=document.createElement('p');desc.textContent=isTeaser(s)?'情報公開をお待ちください。':(descriptions[s.number]||'楽曲紹介文は準備中です。');descSection.append(descHeading,desc);detail.append(descSection);
 if(s.pair&&!isTeaser(s)){const p=document.createElement('button');p.className='pair-jump';p.textContent=`対曲 No.${s.pair} / ${publicTitle(songs[s.pair-1])}`;p.onclick=()=>{selected=s.pair;render()};detail.append(p)}
 const video=isTeaser(s)?null:videoFor(s);if(video)detail.append(video);
 const link=document.createElement('a');link.className='detail-page-link';link.href=songUrl(s);link.textContent='楽曲詳細ページへ ↗';detail.append(link);

}
if(table){
const legend=document.querySelector('#legend');const label=document.createElement('strong');label.className='legend-label';label.textContent='ALBUM';legend.append(label);Object.entries(colors).forEach(([name,color])=>{const span=document.createElement('span');const square=document.createElement('i');square.className='swatch';square.style.background=color;span.append(square,document.createTextNode(name));legend.append(span)});
const sep=document.createElement('i');sep.className='legend-divider';legend.append(sep);const seriesLabel=document.createElement('strong');seriesLabel.className='legend-label';seriesLabel.textContent='SERIES / MARK';legend.append(seriesLabel);
for(const [kind,label] of [['traffic','Traffic'],['sleeping','Sleeping'],['galaxy','Galaxy Colosseum'],['cassette','カセット限定']]){const item=document.createElement('span');item.append(icon(kind),document.createTextNode(label));legend.append(item)}
const pairItem=document.createElement('span');pairItem.className='pair-legend';pairItem.textContent='対曲';legend.append(pairItem);
// Swipe only on the detail panel; preserve vertical scrolling and embedded media.
let swipeStart=null;
detail.addEventListener('touchstart',event=>{
 if(event.touches.length!==1||event.target.closest('button,a,iframe,input,select,textarea')){swipeStart=null;return;}
 const touch=event.touches[0];
 swipeStart={x:touch.clientX,y:touch.clientY};
},{passive:true});
detail.addEventListener('touchend',event=>{
 if(!swipeStart||event.changedTouches.length!==1)return;
 const touch=event.changedTouches[0];
 const dx=touch.clientX-swipeStart.x,dy=touch.clientY-swipeStart.y;
 swipeStart=null;
 if(Math.abs(dx)<55||Math.abs(dx)<Math.abs(dy)*1.5)return;
 navigateDetail(dx<0?1:-1);
},{passive:true});
detail.addEventListener('touchcancel',()=>{swipeStart=null;},{passive:true});
document.querySelector('#search').addEventListener('input',render);document.querySelector('#view-mode').addEventListener('change',e=>{displayMode=e.target.value;render()});render();
}
