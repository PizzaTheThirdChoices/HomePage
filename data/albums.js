// 制作順No.を参照。楽曲名は data/songs.js 側で一元管理。
// 配信先の正式URLが判明したら links に入力してください。
const albums = [
  {id:'love-at-first-sight',title:'Love at First Sight',color:'#E9B7B6',cover:'assets/albums/love-at-first-sight.png',trackNumbers:[1,2,3,5,24,21,9,8,6,11],links:{spotify:'',appleMusic:'',youtubeMusic:'',other:'https://big-up.style/FhlKcAGNXT'}},
  {id:'inevitable-death',title:'Inevitable Death',color:'#A5D7D2',cover:'assets/albums/inevitable-death.png',trackNumbers:[10,29,7,14,15,18,28,32,20,12],links:{spotify:'',appleMusic:'',youtubeMusic:'',other:'https://big-up.style/sQgQMpnX6s'}},
  {id:'pentagon-pizza-puzzle',title:'Pentagon Pizza Puzzle',color:'#B99B79',cover:'assets/albums/pentagon-pizza-puzzle.png',trackNumbers:[19,26,25,13,34,22,23,4,31,33],links:{spotify:'',appleMusic:'',youtubeMusic:'',other:'https://big-up.style/MnTAFGr5GU'}},
  {id:'tape-33',title:'33 (1st Tape)',type:'tape',color:'#777777',cover:'assets/albums/33-tape.png',sides:{
    A:[1,2,3,34,15,18,30,9,8,25,26,5,32,20,12,16,27,11],
    B:[10,29,7,14,13,4,28,24,21,22,23,6,19,31,33,{type:'live',label:'Live音源 (Bonus)',eventId:'20260829'}]
  },bonusNumbers:[30,16,27],links:{spotify:'',appleMusic:'',youtubeMusic:'',other:''}}
];
function albumByTitle(title){return albums.find(a=>a.title===title || (a.id==='love-at-first-sight'&&title==='Love at First Sight'))}
function safeExternalLink(url){try{const u=new URL(url);return u.protocol==='https:'?u.href:null}catch{return null}}
function streamingLinks(album){const el=document.createElement('div');el.className='streaming-links';if(!album)return el;
 const labels={spotify:'Spotify ↗',appleMusic:'Apple Music ↗',youtubeMusic:'YouTube Music ↗',other:'配信ページ ↗'};
 for(const [key,label] of Object.entries(labels)){const url=safeExternalLink(album.links?.[key]);if(!url)continue;const a=document.createElement('a');a.href=url;a.target='_blank';a.rel='noopener noreferrer';a.textContent=label;el.append(a)}return el;
}
