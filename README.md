# financial-briefing

毎日 朝7時・夜21時（JST目安）に、Claudeが金融マーケットのトピックスを収集・分析して自動更新する静的ダッシュボード。

## 公開ページ

GitHub Pagesで公開: `https://nao-bit-gif.github.io/financial-briefing/`
（Settings → Pages → Source: Deploy from a branch → `main` / `(root)` を選択すると有効になります）

## 構成

- `index.html` / `assets/` — 表示用の静的サイト（ビルド不要、`data/latest.json` をfetchして描画）
- `data/latest.json` — 最新レポート
- `data/history/` — 過去レポートのスナップショット
- `data/index.json` — 過去レポートの一覧
- `data/SCHEMA.md` — データ形式と更新手順

## 更新の仕組み

Claude Codeの定期実行（Routine）が1日2回（朝7時・夜21時 JST目安）起動し、直近の金融ニュースを収集・分析したうえで `data/latest.json` と `data/history/` を更新し、`main` ブランチにpushする。GitHub Pagesは自動でその内容を反映する。
