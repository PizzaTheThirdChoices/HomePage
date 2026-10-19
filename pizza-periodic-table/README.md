# Pizza The Third Choices — MUSIC PERIODIC TABLE V5

## 起動方法
`index.html` をブラウザで開きます。GitHub Pages への公開も可能です（サーバー処理不要）。

## 画像を入れる場所（ファイル名は正確に）
- `assets/logo/logo-white.png` — 透過背景の白ロゴ
- `assets/albums/love-at-first-sight.png` — Love at First Sight の正方形ジャケット
- `assets/albums/inevitable-death.png` — Inevitable Death の正方形ジャケット
- `assets/albums/pentagon-pizza-puzzle.png` — Pentagon Pizza Puzzle の正方形ジャケット

画像が未登録の場合は、各アルバムの指定色を背景に表示します。未設定の楽曲はグレーです。
ジャケットは CSS の `background-size: cover` でセルに自動フィットします。可能なら正方形1000×1000px程度のPNGを推奨します。

## YouTube Shorts
`script.js` の `songVideos` に No.3, No.15, No.33 を登録済みです。YouTube側で埋め込みが許可されている場合に再生できます。

## 楽曲の紹介文
`script.js` の `descriptions` に例として `3: '曲紹介文'` のように追記してください。現在は未登録です。

## 配列
`script.js` の `lengths=[2,8,8,8,8,8,8]` で行長を管理します。制作順の番号は固定です。

## 注意
このZIPにはアルバムジャケットや正式ロゴの画像は含まれていません。ユーザーが用意した画像を上記に配置してください。
`(Sick)` は元データ上コード未確定のため、一覧にはまだ登録していません（47曲）。


## Ver.6: 対曲の一体型セル
- CHURCH (12) / SATAN (20)：上下2枠を一体化した縦長長方形。
- That's Right (25) / That's Left (26)、Ghost Town (42) / New Town (43)：左右2枠を一体化した横長長方形。
- 1つの外枠の内部に斜めの仕切り線を設け、両側を個別にクリックできます。
- 通常曲、アルバムカラー、ジャケット画像、YouTube Shorts登録はVer.5から維持しています。
