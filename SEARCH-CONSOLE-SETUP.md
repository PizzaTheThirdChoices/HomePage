# 検索登録・YouTube Shorts更新の運用

## Google Search Console（管理者が一度実施）

1. このPRを確認してmainへマージし、GitHub Pagesの公開を待つ。
2. https://pizzathethirdchoices.github.io/HomePage/sitemap.xml と robots.txt の公開を確認する。
3. https://search.google.com/search-console/ で「URLプレフィックス」を選び、https://pizzathethirdchoices.github.io/HomePage/ を登録する。
4. Googleが発行する所有権確認用HTMLファイルをリポジトリ直下に配置し、公開後に「確認」を押す。検証ファイルは未発行のため、このPRには含まない。
5. 「サイトマップ」から sitemap.xml を送信し、「URL検査」でトップページを確認。必要に応じて登録をリクエストする。
6. 登録・検索順位・反映までの時間はGoogleの判断であり保証されない。

静的サイトマップには主要な固定ページのみ掲載。song.html?id=... の各曲ページは別URL生成の検討が必要。

## Shorts半自動追加

YouTube公式チャンネルに投稿後、ChatGPTに「No.11 の関連Shortsを追加：URL」と送る。

- 楽曲解説は data/videos.js の songVideos、一般Shortsは relatedSongVideos に登録する。
- relatedSongVideos は**古い順に登録**し、新しいものを末尾に追加する。
- 同じ動画IDを重複登録しない。公式チャンネルの動画であることを確認する。
- ChatGPTが変更用Draft PRを作り、メンバーが確認・マージする。
- 表示側では新しい順に3件を初期表示し、4件目以降は「もっと見る」で展開できる。
- 定期実行やYouTube APIキーは不要。

## アイコン

favicon.svg は仮のピザ図案。公式ロゴ画像を受領したら差し替え、iPhone用の apple-touch-icon.png も追加する。
