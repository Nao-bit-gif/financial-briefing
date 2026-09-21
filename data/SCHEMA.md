# データ形式

`data/latest.json` がサイトに表示される最新レポート。`data/history/` に日付・回次ごとのスナップショットを保存し、`data/index.json` がその一覧を管理する。

## `data/latest.json`

```json
{
  "updated_at": "2026-09-21T08:50:00+09:00",
  "slot": "morning",
  "headline": "1〜2文の要約",
  "sections": [
    {
      "title": "セクション見出し",
      "body": "本文（改行はそのまま反映される）",
      "sources": [
        { "title": "出典タイトル", "url": "https://..." }
      ]
    }
  ],
  "insight": "運用者目線の所見"
}
```

- `slot` は `"morning"`（朝7時の回）または `"evening"`（夜21時の回）。
- `updated_at` はISO8601、JSTのオフセット付き（`+09:00`）。

## 更新手順（Routineが行う作業）

1. `data/latest.json` を最新の内容で上書きする。
2. 同じ内容を `data/history/YYYY-MM-DD-{morning|evening}.json` として保存する。
3. `data/index.json` の配列末尾に `{ "file": "...", "label": "YYYY-MM-DD 朝の回/夜の回", "updated_at": "..." }` を追記する。
4. 3ファイルをコミットし、`main` ブランチへpushする（GitHub Pagesが自動的に反映する）。

夜の回は、同日朝の回で既に報告した内容を繰り返さず、それ以降の新しい動きのみを記載する。
