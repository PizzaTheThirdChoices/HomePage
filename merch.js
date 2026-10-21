// ========================================
// MERCH / グッズ一覧・写真ギャラリー表示
// ========================================
//
// 商品データ：data/merch.js
// 表示先：merch.html の #merch-items
// デザイン：style.css
//
// 商品名・価格・説明・写真を変更する場合は
// このファイルではなく data/merch.js を編集する。
// ========================================


function renderMerch() {

  // ----------------------------------------
  // 1. グッズ一覧の表示先を取得
  // ----------------------------------------
  const root = document.getElementById('merch-items');

  // 表示先が存在しないページでは処理を行わない
  if (!root) return;


  // ----------------------------------------
  // 2. 登録されている商品を順番に表示
  // ----------------------------------------
  for (const item of merchItems) {

    // 商品全体を囲む要素
    const article = document.createElement('article');
    article.className = 'merch-card';


    // --------------------------------------
    // 3. 商品名・価格
    // --------------------------------------
    const heading = document.createElement('div');
    heading.className = 'merch-heading';

    // 商品名
    const title = document.createElement('h2');
    title.textContent = item.name;

    // 価格（例：¥3,000 / 枚）
    const price = document.createElement('strong');
    price.textContent =
      '¥' +
      item.price.toLocaleString('ja-JP') +
      ' / ' +
      item.unit;

    heading.append(title, price);
    article.append(heading);


    // --------------------------------------
    // 4. 商品写真ギャラリー
    // --------------------------------------
    const gallery = document.createElement('div');
    gallery.className = 'merch-gallery';

    gallery.setAttribute(
      'aria-label',
      item.name + ' 写真'
    );


    // --------------------------------------
    // 5. 商品写真を1枚ずつ生成
    // --------------------------------------
    for (const [i, src] of item.images.entries()) {

      // 写真とキャプションを囲む要素
      const figure = document.createElement('figure');

      // 写真をクリックすると元画像を別タブで開く
      const link = document.createElement('a');
      link.href = src;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';

      // 商品画像
      const img = document.createElement('img');
      img.src = src;
      img.alt = item.name + ' 写真 ' + (i + 1);
      img.loading = 'lazy';


      // ------------------------------------
      // 6. 画像が存在しない場合の処理
      // ------------------------------------
      img.onerror = () => {

        // 画像未登録用のデザインを適用
        link.classList.add('merch-missing');

        // 読み込めなかった画像を非表示
        img.hidden = true;

        // 代わりに「COMING SOON」を表示
        link.textContent =
          'PHOTO ' +
          String(i + 1).padStart(2, '0') +
          ' / COMING SOON';

      };

      link.append(img);


      // ------------------------------------
      // 7. 写真番号の表示
      // ------------------------------------
      // 例：01 / 04
      const caption = document.createElement('figcaption');

      caption.textContent =
        String(i + 1).padStart(2, '0') +
        ' / ' +
        String(item.images.length).padStart(2, '0');


      // 写真と番号をギャラリーに追加
      figure.append(link, caption);
      gallery.append(figure);

    }


    // ----------------------------------------
    // 8. ギャラリーを商品カードに追加
    // ----------------------------------------
    article.append(gallery);


    // ----------------------------------------
    // 9. 商品説明
    // ----------------------------------------
    const desc = document.createElement('p');
    desc.textContent = item.description;

    article.append(desc);


    // ----------------------------------------
    // 10. 完成した商品カードをページに追加
    // ----------------------------------------
    root.append(article);

  }

}


// ========================================
// INITIALIZE / ページ読み込み完了後に実行
// ========================================

// HTMLの読み込みが完了したら
// グッズ一覧を自動生成する。
document.addEventListener(
  'DOMContentLoaded',
  renderMerch
);
