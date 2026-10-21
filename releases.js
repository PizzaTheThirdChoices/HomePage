// アルバムの配信リンクをトップページにも表示
(function(){
  const root=document.getElementById('home-releases');if(!root||typeof albums==='undefined')return;
  for(const album of albums){
    if(album.type==='tape')continue;
    const url=safeExternalLink(album.links?.other);if(!url)continue;
    const a=document.createElement('a');a.className='release-link';a.href=url;a.target='_blank';a.rel='noopener noreferrer';
    const art=document.createElement('img');art.src=album.cover;art.alt='';art.loading='lazy';art.onerror=()=>art.hidden=true;
    const label=document.createElement('span');label.textContent=album.title;
    const action=document.createElement('span');action.textContent='LISTEN ↗';
    a.append(art,label,action);root.append(a);
  }
})();
