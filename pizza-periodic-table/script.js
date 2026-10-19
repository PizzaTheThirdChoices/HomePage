const raw = [
['Inside The Pillows','ITP','Love at First Sight','','Sleeping'],
['POOL','POL','Love at First Sight','',''],
['3','THR','Love at First Sight','',''],
['Priority','PRI','Pentagon Pizza Puzzle','',''],
['Joe','JOE','Love at First Sight','',''],
['Hierarchy','HRC','Love at First Sight','',''],
['Traffic Jam','TRJ','Inevitable Death','','Traffic'],
['First Impression','FIM','Love at First Sight','',''],
['MELON','MEL','Love at First Sight','',''],
['Exist','EXI','Inevitable Death','',''],
['Cinnamon Attack','CNA','Love at First Sight','',''],
['CHURCH','CHU','Inevitable Death',20,''],
['Persimmon Patent Permission','PPP','Pentagon Pizza Puzzle','',''],
['Quantum','QUA','Inevitable Death','',''],
['SugarCane','SUC','Inevitable Death','',''],
['Clap your hands as you want','CLP','Love at First Sight','','カセット限定'],
['108','IO8','','',''],
['White Snow','WSN','Inevitable Death','',''],
['Outside the bed','OTB','Pentagon Pizza Puzzle','','Sleeping'],
['SATAN','SAT','Inevitable Death',12,''],
['Stars','STR','Love at First Sight','',''],
['The Reason','TRS','Pentagon Pizza Puzzle','',''],
['Why?','WHY','Pentagon Pizza Puzzle','',''],
['April Truth','APT','Love at First Sight','',''],
["That's Right",'TSR','Pentagon Pizza Puzzle',26,''],
["That's Left",'TSL','Pentagon Pizza Puzzle',25,''],
['Venus De Milo','VDM','Pentagon Pizza Puzzle','','カセット限定'],
["Don't Know",'DOK','Inevitable Death','',''],
['Traffic Lights','TRL','Inevitable Death','','Traffic'],
['La','LA','Inevitable Death','','カセット限定'],
['Zoophobia','ZOO','Pentagon Pizza Puzzle','',''],
['Death','DET','Inevitable Death','',''],
['33','THT','Pentagon Pizza Puzzle','',''],
['100%','OH%','Pentagon Pizza Puzzle','',''],
['YEAH YEAH YEAH','YYY','','',''],
['Ohana','OHN','','',''],
['Bonus Time','BOT','','',''],
['I will tell you something interesting outside the Internet','WTI','','',''],
['Beyond the Canyon, Laketown','BCL','','',''],
['Hyper Inflation','HIF','','',''],
['Xenophobia vs me','XVM','','',''],
['Ghost Town','GTO','',43,''],
['New Town','NTO','',42,''],
['Galaxy Colosseum IV','GCIV','','','Galaxy Colosseum'],
['Rush Hour','RSH','','',''],
['Jump to Heaven','JTH','','',''],
['No Picnic','NPC','','','']
];
const songs=raw.map(([title,code,album,pair,note],i)=>({number:i+1,title,code,album,pair:pair||null,note}));
const colors={'Love at First Sight':'#E9B7B6','Inevitable Death':'#A5D7D2','Pentagon Pizza Puzzle':'#B99B79','未設定':'#999999'};
const albumImages={'Love at First Sight':'assets/albums/love-at-first-sight.png','Inevitable Death':'assets/albums/inevitable-death.png','Pentagon Pizza Puzzle':'assets/albums/pentagon-pizza-puzzle.png'};
// Optional descriptions: fill these in as the song introductions are written.
const descriptions={};
// YouTube Shorts: 曲番号と Shorts のURLを登録してください。例： 12: 'https://www.youtube.com/shorts/VIDEO_ID'
const songVideos = {
  3: 'https://youtube.com/shorts/3t-I2Ui1LBw',
  15: 'https://youtube.com/shorts/9ovwyFPYc70',
  33: 'https://youtube.com/shorts/8SBFdrLoBUA',
};
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

const lengths=[2,8,8,8,8,8,8]; // first row: left and right; subsequent rows sequentially filled
let selected=3;
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
function connector(dir){const e=document.createElement('span');e.className='pair-connector '+dir;e.setAttribute('aria-hidden','true');e.innerHTML=dir==='right'?'<svg viewBox="0 0 24 70"><path d="M3 66 L21 4" stroke="#181818" stroke-width="5"/><path d="M3 66 L21 4" stroke="white" stroke-width="2.5"/><text x="12" y="38" text-anchor="middle" font-size="15" font-weight="bold" fill="white" stroke="#181818" stroke-width="3" paint-order="stroke">↔</text></svg>':'<svg viewBox="0 0 70 24"><path d="M3 21 L67 3" stroke="#181818" stroke-width="5"/><path d="M3 21 L67 3" stroke="white" stroke-width="2.5"/><text x="35" y="17" text-anchor="middle" font-size="15" font-weight="bold" fill="white" stroke="#181818" stroke-width="3" paint-order="stroke">↔</text></svg>';return e}
function imageFor(song,cls){const src=albumImages[song.album];if(!src)return null;const img=document.createElement('img');img.className=cls;img.src=src;img.alt=cls==='detail-art'?song.album+' ジャケット':'';img.loading='lazy';img.onerror=()=>img.hidden=true;return img}
function songUrl(s){return 'song.html?id='+encodeURIComponent(s.number)}

const table=document.querySelector('#periodic'),detail=document.querySelector('#detail');
const availableCovers=new Set();
if(table){Object.values(albumImages).forEach(src=>{const im=new Image();im.onload=()=>{availableCovers.add(src);render()};im.src=src;});}
function getAlbum(s){return s.album||'未設定'}
function createCell(song,q){
 const el=document.createElement('button');el.type='button';el.className='element'+(selected===song.number?' selected':'')+(q&&!`${song.number} ${song.title} ${song.code}`.toLowerCase().includes(q)?' dim':'');el.style.background=colors[getAlbum(song)];el.style.setProperty('--album-color',colors[getAlbum(song)]);
 if(availableCovers.has(albumImages[song.album])){el.classList.add('cover-cell');el.style.setProperty('--cover-url',`url("${albumImages[song.album]}")`)}
 el.setAttribute('aria-label',`No.${song.number} ${song.title}`);
 const num=document.createElement('span');num.className='num';num.textContent=String(song.number).padStart(2,'0');
 const sym=document.createElement('span');sym.className='symbol';sym.textContent=song.code||'—';if(song.code.length>3)sym.classList.add('long-code');
 const marks=document.createElement('span');marks.className='marks';const kind=markKind(song.note);
 if(kind){const mark=document.createElement('span');mark.className='mark-icon';mark.title=song.note;mark.setAttribute('aria-label',song.note);mark.append(icon(kind));marks.append(mark)}
 const tip=document.createElement('span');tip.className='tooltip';const tNum=document.createElement('small');tNum.textContent=`No.${song.number} / ${song.code}`;const tTitle=document.createElement('strong');tTitle.textContent=song.title;const tDesc=document.createElement('small');tDesc.textContent=descriptions[song.number]||`収録：${getAlbum(song)}。曲紹介は準備中です。`;const tMore=document.createElement('small');tMore.className='more';tMore.textContent='クリックで詳細を表示 ↓';tip.append(tNum,tTitle,tDesc,tMore);
 el.append(num,sym,marks,tip);el.onclick=()=>{selected=song.number;render()};return el;
}
function render(){
 const q=document.querySelector('#search').value.trim().toLowerCase();table.replaceChildren();
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
   group.setAttribute('role','group');group.setAttribute('aria-label',`${song.title} と ${other.title} の対曲`);
   const first=createCell(song,q),second=createCell(other,q);first.classList.add('pair-first');second.classList.add('pair-second');
   group.append(first,second);
   const line=document.createElement('span');line.className='pair-divider';line.setAttribute('aria-hidden','true');group.append(line);
   table.append(group);consumed.add(other.number);
  }else{
   const cell=createCell(song,q);cell.style.gridColumn=String(a.col+1);cell.style.gridRow=String(a.row+1);
   if(song.pair&&!pairDirection(songs[Math.min(song.number,song.pair)-1])){const mark=document.createElement('span');mark.className='pair-inline';mark.textContent='↔';mark.title=`対曲 No.${song.pair}`;cell.querySelector('.marks').append(mark)}
   table.append(cell);
  }
 }
 const s=songs.find(s=>s.number===selected);detail.replaceChildren();
 const top=document.createElement('div');top.className='detail-top';const eyebrow=document.createElement('span');eyebrow.className='eyebrow';eyebrow.textContent=`No. ${s.number} / ${s.code}`;const close=document.createElement('button');close.className='detail-reset';close.textContent='↗';close.title='楽曲詳細ページを開く';close.onclick=()=>location.href=songUrl(s);top.append(eyebrow,close);detail.append(top);
 const heading=document.createElement('div');heading.className='detail-heading';const num=document.createElement('span');num.className='detail-number';num.textContent=s.number;const titleWrap=document.createElement('div');const h=document.createElement('h2');h.textContent=s.title;const code=document.createElement('p');code.className='detail-code';code.textContent=s.code;titleWrap.append(h,code);heading.append(num,titleWrap);detail.append(heading);
 const art=imageFor(s,'detail-art');const albumBox=document.createElement('div');albumBox.className='detail-album';const cover=document.createElement('div');cover.className='detail-cover';cover.style.setProperty('--album-color',colors[getAlbum(s)]);if(art)cover.append(art);else cover.textContent='NO ARTWORK';const meta=document.createElement('div');meta.className='detail-album-meta';const cap=document.createElement('small');cap.textContent='収録アルバム';const album=document.createElement('strong');album.textContent=getAlbum(s);meta.append(cap,album);if(s.note){const note=document.createElement('span');note.textContent=s.note;meta.append(note)}albumBox.append(cover,meta);detail.append(albumBox);
 const descSection=document.createElement('section');descSection.className='description-section';const descHeading=document.createElement('h3');descHeading.textContent='楽曲解説';const desc=document.createElement('p');desc.textContent=descriptions[s.number]||'楽曲紹介文は準備中です。';descSection.append(descHeading,desc);detail.append(descSection);
 if(s.pair){const p=document.createElement('button');p.className='pair-jump';p.textContent=`↔ 対曲 No.${s.pair} / ${songs[s.pair-1].title}`;p.onclick=()=>{selected=s.pair;render()};detail.append(p)}
 const video=videoFor(s);if(video)detail.append(video);
 const link=document.createElement('a');link.className='detail-page-link';link.href=songUrl(s);link.textContent='楽曲詳細ページへ ↗';detail.append(link);

}
if(table){
const legend=document.querySelector('#legend');const label=document.createElement('strong');label.className='legend-label';label.textContent='ALBUM';legend.append(label);Object.entries(colors).forEach(([name,color])=>{const span=document.createElement('span');const square=document.createElement('i');square.className='swatch';square.style.background=color;span.append(square,document.createTextNode(name));legend.append(span)});
const sep=document.createElement('i');sep.className='legend-divider';legend.append(sep);const seriesLabel=document.createElement('strong');seriesLabel.className='legend-label';seriesLabel.textContent='SERIES / MARK';legend.append(seriesLabel);
for(const [kind,label] of [['traffic','Traffic'],['sleeping','Sleeping'],['galaxy','Galaxy Colosseum'],['cassette','カセット限定']]){const item=document.createElement('span');item.append(icon(kind),document.createTextNode(label));legend.append(item)}
const pairItem=document.createElement('span');pairItem.className='pair-legend';pairItem.textContent='↔ 対曲';legend.append(pairItem);
document.querySelector('#search').addEventListener('input',render);render();
}
