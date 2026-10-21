# Ver.14：データと表示処理を分離

- `data/songs.js`：楽曲マスター。末尾に曲を追加すると制作番号が連番で付きます。既存曲の行順は変えないでください。
- `data/descriptions.js`：楽曲解説。`22: ` のように曲番号をキーとして追加します。
- `data/videos.js`：楽曲ごとのYouTube Shorts。
- `data/albums.js`：アルバム収録順・配信リンク・ジャケット。
- `data/events.js`：公演情報・フライヤー・セットリスト。
- `data/social.js`：SNS・アーティストリンク。
- `script.js`：表示・検索・周期表の動作。普段のデータ追加では編集不要。

## カセット限定3曲のジャケット

No.16 / 27 / 30 は周期表の背景と楽曲詳細のジャケットに `assets/albums/33-tape.png` を使用します。画像が未配置の場合は従来の背景色にフォールバックします。元の楽曲のアルバム登録情報は変更しません。

## 更新時の注意

Ver.13のルートにあった `albums.js`, `events.js`, `social.js` は `data/` に移動しました。GitHub更新時は旧ファイルを削除し、HTML・script.js・dataフォルダをセットで更新してください。既にアップロード済みの `assets/events/`, `assets/setlist/`, `assets/albums/`, `assets/logo/` は残してください。

## 100曲を超える場合

周期表の行は楽曲数に応じて自動的に増えます。最初の2曲は両端に配置し、以降は8列ごとに並びます。

---

# Pizza The Third Choices — Official Website v8

GitHub Pages対応の静的サイト。`index.html` がトップページです。

## 1. アルバム曲順・サブスク
`albums.js` の各アルバムの `trackNumbers` に **制作順のNo.を実際の収録順** で入力します。
例: `trackNumbers:[3,1,5]`。空配列なら暫定的に制作順で表示します。
`links` にSpotify / Apple Music / YouTube Musicの**実際のHTTPSアルバムURL**を入れます。空欄のサービスは表示しません。
収録曲の正式な順番はまだ提供されていないため未設定です。

## 2. ライブ情報
`events.js` の `liveEvents` 配列に1公演1オブジェクトで追加します。`id` は一意で変更しないこと。
`date` は `YYYY-MM-DD`。`ticketUrl` はGoogleフォームなどの実際のHTTPS URL。日付が今日以降なら予約ボタンを表示し、過去になれば自動でアーカイブへ移動します。
`event.html?id=<id>` がライブ詳細ページ。フライヤー、セットリスト、イベント情報を表示。
`setlistSongNumbers` に曲No.を演奏順に並べると楽曲詳細へのリンクも生成します。
**注意:** 日付だけで判定するため、開催日当日は終演後でも「開催予定」に分類されます。必要なら後で終了時刻判定を追加できます。

## 3. A4画像の軽量化
元画像を `assets-original/events/<id>/flyer.png` と `setlist.png` に置き、
`python -m pip install Pillow` → `python tools/optimize_images.py` を実行します。
出力先: `assets/events/<id>/flyer-thumb.webp`, `flyer-full.webp`, `setlist-thumb.webp`, `setlist-full.webp`。
幅400pxと1200px、縦横比維持。**原本フォルダはGitにアップロードしない**でください（.gitignore設定済み）。
画像は遅延読込。詳細画像は詳細ページのみ読込、一覧ではサムネイルを使用。
A4画像の文字が潰れる場合はfullの幅を1600px程度に増やすか画質を上げてください。

## 4. ファイル
- `index.html`: 玄関・次回ライブ
- `music.html`: 楽曲周期表・アルバム順
- `song.html`: 楽曲詳細
- `live.html`: 今後・過去のライブ一覧
- `event.html`: ライブ詳細、フライヤー、セットリスト
- `script.js`: 楽曲マスタ・YouTube Shorts
- `albums.js`: アルバム曲順・配信リンク
- `events.js`: 公演・予約・セットリスト
- `assets/logo/logo-white.png`: バンドロゴ
- `assets/albums/`: アルバムジャケット

未発表曲をGitHub Pagesで秘密にしたい場合、**公開するJSに曲名を含めないこと**。`???` で画面を隠してもJSの中身は公開されます。

## Ver.9 収録順確定データ
`albums.js` に1st/2nd/3rdアルバムと1st Tape「33」のA/B面を登録済み。テープのNo.30/16/27にはBONUS表示、B面末尾は番号のない「Live @ 20260829」として登録しています（通常の楽曲No.を新設しません）。
**表記確認:** 正式名称「Love at First Sight」を使用しています。従来の楽曲データとの紐づけは互換処理で維持しています。正式表記を確認してください。
**公演ID:** `YYYYMMDD`（例 `20260829`）を使用します。日付は従来どおり `YYYY-MM-DD`。画像のフォルダも `assets/events/20260829/`、原本は `assets-original/events/20260829/` に保存します。同日に複数公演がある場合は `20260829-2` など一意のIDにしてください。
**注意:** Live @ 20260829 はテープの収録トラック情報であり、ライブ公演の開催情報自体は未登録です。公演内容・フライヤー等を確認して `events.js` に追加してください。
**ジャケット:** テープ画像は `assets/albums/33-tape.png`。配信リンクは未入力です。


## Ver.10 更新内容

- 正式なアルバム名を **Love at First Sight** に統一。
- No.22 **The Reason** とNo.23 **Why?** を相互の対曲として設定。制作順表示では隣接するため、一体型の斜め分割セルになります。
- 全ページ共通の公式SNSセクションを追加。ホームページでは「FOLLOW US」として表示。

### SNSのURL登録
`social.js` の `socialLinks` に公式アカウントのURLを設定してください。例：

```js
const socialLinks = {
  youtube: 'https://www.youtube.com/@YOUR_CHANNEL',
  x: 'https://x.com/YOUR_ACCOUNT',
  instagram: 'https://www.instagram.com/YOUR_ACCOUNT/',
  tiktok: '',
  bandcamp: ''
};
```

上記は記入例です。**実際のアカウントURLに置き換えてください。** 空欄のサービスは表示されません。


## Ver.11: 公式SNS・配信リンク

- `social.js`: Instagram、X、YouTube、Spotify（アーティストページ）、Apple Music（アーティストページ）の公式URLを設定済み。
- `albums.js`: 3枚のアルバムにBIG UP!配信ページを設定済み。**提供順が1st→2nd→3rdに対応するものとして仮登録**しています。異なる場合は `links.other` のURLを入れ替えてください。
- `index.html`: LISTEN / RELEASES欄を追加。`releases.js` がアルバムへのリンクを描画します。
- `music.html`: アルバム別表示の各作品にも「配信ページ ↗」が表示されます。
- カセット `33` の配信先は未設定です。

## Ver.12: 対曲の長方形とセル間隔

制作順の周期表では、通常セルの一辺を `w`、セル同士の余白を `g` とすると、横並びの対曲の長方形は `幅=2w+g、高さ=w`、縦並びなら `幅=w、高さ=2w+g` です。これにより通常セルのグリッドの位置や余白と正確に揃います。CSS Grid の2トラック分の領域をそのまま利用し、従来の固定 `aspect-ratio: 2/1` / `1/2` を解除しました。スマホ表示も同じ計算です。

BIG UP! 配信ページは提供順に1st / 2nd / 3rdへ設定済みです。


## Ver.13: イベントの横スワイプギャラリー
- `events.js` の `media` 配列に `{type:'flyer',src:'assets/events/xxx.png'}` を必要な枚数だけ追加し、最後に `{type:'setlist',src:'assets/setlist/xxx.pdf'}` を追加します。表示上はセットリストが必ず最後になります。
- 画像はクリックで別タブに拡大、PDFは埋め込み表示と「PDFを開く」リンクを併設。スマートフォンは左右スワイプ、PCは矢印ボタンと横スクロールに対応。
- スクリーンショットに写っていたファイル名を参考に9公演を仮登録しています。**イベント名、日付、画像ファイル名・拡張子を実ファイルと照合してください。** このZIPにフライヤーやセットリストの実体は含まれていません。
- `assets/events/` にフライヤー画像、`assets/setlist/` にPDFを置いてください。画像の容量が大きい場合はWebPへの最適化を推奨します。


## Ver.15 の更新箇所
- `data/events.js`: 当日以降のライブは NEXT LIVE にフライヤーと予約ボタンを表示。既定の取り置きフォームは `DEFAULT_TICKET_URL`。公演ごとに `ticketUrl` を設定すれば優先。過去公演は ARCHIVE。日付はブラウザの現地日付。
- `data/social.js`: 公式SNSと配信サービスを共通ヘッダーのアイコンで表示。
- `data/merch.js`: グッズの名称、価格、写真の順番を管理。画像は `assets/merch/sticker-1.webp`, `tshirt-1.webp` ... `tshirt-4.webp` に配置。未配置ならプレースホルダー表示。
- `assets/photos/artist-wide.webp`: トップページの横長アー写。未配置の場合は写真セクション非表示。
- `assets/logo/logo-secondary.png`: 追加ロゴ。未配置の場合は非表示。
- `music.html`: 表示名称を楽曲表へ変更。未収録・対曲の表示調整。
- `assets/events/` と `assets/setlist/` に既存の実素材を残してください。ZIPには実素材を含みません。
- `merch.html`, `merch.js` と `data/merch.js` は新規追加です。GitHubのWeb編集ではHTML・JS・CSS・データをまとめて反映してください。
