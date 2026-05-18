# ITパスポート試験対策 クイズアプリ React版

既存のHTML/CSS/JavaScript版を、Vite + React + Supabase構成に作り直したものです。

## 主な変更点

- `index.html` / `login.html` の直書きJavaScriptをReactコンポーネントへ移行
- `document.getElementById`、`innerHTML`、`window.xxx` を廃止
- `useState` / `useEffect` による状態管理へ変更
- React Routerでログイン画面とクイズ画面を切り替え
- Supabase接続情報を `.env` で管理
- 既存機能を維持
  - ログイン
  - 年度選択
  - 全問題 / ランダム10問 / 10問ごとの範囲選択
  - 回答ログ保存
  - メダル表示
  - テーマ切替
  - キーボード操作 1〜4 / Enter

## セットアップ

```bash
npm install
cp .env.example .env
npm run dev
```

`.env` の内容を必要に応じて変更してください。

```env
VITE_SUPABASE_URL=あなたのSupabase URL
VITE_SUPABASE_ANON_KEY=あなたのSupabase anon key
```

## ビルド

```bash
npm run build
```

## Vercelデプロイ

`vercel.json` を同梱しています。React Routerのリロード対策として、全ルートを `index.html` に戻す設定を入れています。

## 主なファイル構成

```txt
src/
  components/
    LineText.jsx
    Menu.jsx
    Quiz.jsx
    Result.jsx
    ThemeToggle.jsx
    YearSelect.jsx
  hooks/
    useTheme.js
  lib/
    quiz.js
    supabase.js
  pages/
    Home.jsx
    Login.jsx
  App.jsx
  main.jsx
  index.css
```
