// 公式アカウントのURLを入力してください。空欄のサービスはリンクを表示しません。
const socialLinks = {
  youtube: 'https://www.youtube.com/@PizzaTheThirdChoices',
  x: 'https://twitter.com/pizza3rdchoices',
  instagram: 'https://www.instagram.com/pizza3rdchoices',
  // 必要に応じて追加
  spotify: 'https://open.spotify.com/intl-ja/artist/4ENePIxjSEaftxvJ98ftlg?si=nZhVvjq3TXmFRSJupGeiig',
  appleMusic: 'https://music.apple.com/jp/artist/pizza-the-third-choices/1860142863',
  tiktok: '',
  bandcamp: ''
};
const socialNames = {youtube:'YouTube', x:'X / Twitter', instagram:'Instagram', spotify:'Spotify', appleMusic:'Apple Music', tiktok:'TikTok', bandcamp:'Bandcamp'};
const socialIconPaths = {
 youtube:'<rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3z"/>',
 x:'<path d="M4 3h4l12 18h-4zM20 3 4 21"/>',
 instagram:'<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1"/>',
 spotify:'<circle cx="12" cy="12" r="10"/><path d="M6 9c5-2 10-1 13 1M7 13c4-2 8-1 11 1M8 17c3-1 6-1 9 1"/>',
 appleMusic:'<path d="M9 18V5l11-2v12M9 8l11-2"/><ellipse cx="6" cy="18" rx="3" ry="2"/><ellipse cx="17" cy="15" rx="3" ry="2"/>',
 tiktok:'<path d="M14 3v12a5 5 0 1 1-5-5M14 3c1 4 3 6 7 6"/>',bandcamp:'<path d="M8 6h14l-6 12H2z"/>'
};
function renderSocialLinks(){
 document.querySelectorAll('[data-social-links]').forEach(container=>{
  container.replaceChildren();
  for(const [service,label] of Object.entries(socialNames)){
   const raw=socialLinks[service];if(!raw)continue;
   let url;try{url=new URL(raw);if(url.protocol!=='https:')continue}catch{continue}
   const a=document.createElement('a');a.href=url.href;a.target='_blank';a.rel='noopener noreferrer';a.className='social-link social-'+service;
   a.title=label;a.setAttribute('aria-label',label);
   const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');svg.innerHTML=socialIconPaths[service]||'';a.append(svg);
   if(!container.classList.contains('header-social')){const text=document.createElement('span');text.textContent=label;a.append(text)}
   container.append(a)
  }
 });
}
document.addEventListener('DOMContentLoaded',renderSocialLinks);
