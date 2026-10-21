// 商品の表示情報は data/merch.js で編集します。
function renderMerch(){
 const root=document.getElementById('merch-items');if(!root)return;
 for(const item of merchItems){
  const article=document.createElement('article');article.className='merch-card';
  const heading=document.createElement('div');heading.className='merch-heading';
  const title=document.createElement('h2');title.textContent=item.name;
  const price=document.createElement('strong');price.textContent='¥'+item.price.toLocaleString('ja-JP')+' / '+item.unit;
  heading.append(title,price);article.append(heading);
  const gallery=document.createElement('div');gallery.className='merch-gallery';gallery.setAttribute('aria-label',item.name+' 写真');
  for(const [i,src] of item.images.entries()){
   const figure=document.createElement('figure');const link=document.createElement('a');link.href=src;link.target='_blank';link.rel='noopener noreferrer';
   const img=document.createElement('img');img.src=src;img.alt=item.name+' 写真 '+(i+1);img.loading='lazy';
   img.onerror=()=>{link.classList.add('merch-missing');img.hidden=true;link.textContent='PHOTO '+String(i+1).padStart(2,'0')+' / COMING SOON'};
   link.append(img);const caption=document.createElement('figcaption');caption.textContent=String(i+1).padStart(2,'0')+' / '+String(item.images.length).padStart(2,'0');figure.append(link,caption);gallery.append(figure);
  }
  article.append(gallery);const desc=document.createElement('p');desc.textContent=item.description;article.append(desc);root.append(article);
 }
}
document.addEventListener('DOMContentLoaded',renderMerch);
