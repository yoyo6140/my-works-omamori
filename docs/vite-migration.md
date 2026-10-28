# Vue CLI → Vite 遷移紀錄

此文件記錄 `my-omamori` 從 Vue CLI（webpack）遷移到 Vite 的完整改動，方便日後回溯或在其他專案重現同樣的流程。

分支：`refactor/webpack-change-vite`

## 1. 套件異動

安裝：
```bash
npm install -D vite @vitejs/plugin-vue
```

移除（webpack / babel 專用，Vite 用 esbuild 轉譯不需要）：
```bash
npm uninstall @vue/cli-plugin-babel @vue/cli-plugin-eslint @vue/cli-service @babel/core @babel/eslint-parser core-js
```

## 2. 設定檔

- 刪除 `vue.config.js`、`babel.config.js`
- 新增 `vite.config.js`，把原本 `publicPath`（依 `NODE_ENV`/`VERCEL` 判斷 GitHub Pages 用 `/my-works-omamori/`、Vercel 用 `/`）改寫成 Vite 的 `base`；另外補上 `@` → `src` 路徑別名（webpack 原本內建，Vite 要自己設定 `resolve.alias`）：

```js
import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  base:
    process.env.NODE_ENV === 'production' && process.env.VERCEL !== '1'
      ? '/my-works-omamori/'
      : '/',
})
```

- `jsconfig.json`：`target` 從 `es5` 改 `esnext`（僅影響編輯器提示，不影響實際建置）

## 3. 入口 HTML

Vite 要求 `index.html` 放在專案根目錄，且不支援 `htmlWebpackPlugin` 模板語法。
把 `public/index.html` 搬到根目錄並改寫：

```html
<!DOCTYPE html>
<html lang="">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    <link rel="icon" href="/logo.png">
    <title>御守屋</title>
  </head>
  <body>
    <noscript>
      <strong>此網站需要啟用 JavaScript。</strong>
    </noscript>
    <div id="app"></div>
    <script type="module" src="/src/main.js"></script>
  </body>
</html>
```

## 4. 環境變數

Vite 只認 `VITE_` 開頭的變數，透過 `import.meta.env.xxx` 讀取（Vue CLI 是 `VUE_APP_` + `process.env.xxx`）。

- `.env`：`VUE_APP_API` → `VITE_API`、`VUE_APP_PATH` → `VITE_PATH`
- `src/constants/api.js`：`process.env.VUE_APP_API` → `import.meta.env.VITE_API`（`API_PATH` 同理）

## 5. 動態資源引用（主要地雷）

webpack 的 `require('@/assets/xxx.png')` 在 Vite（ESM、瀏覽器端沒有 `require`）完全不能用，`vite build` 會直接報 resolve 錯誤。

受影響的 8 處，分布於：
- `src/views/MyHome.vue`
- `src/views/UserGoods.vue`（3 處）
- `src/views/UserProduct.vue`
- `src/components/OmamoriIntro.vue`（3 處）

全部改成在 `<script>` 用 `import xxx from '@/assets/xxx.png'`，再把變數綁進 `data()`，template 改成 `:src="xxx"`。

另外 `src/components/MyNavbar.vue`、`src/components/DashNavbar.vue` 原本是 `<img src="logo.png">`（相對路徑交給 webpack 處理）。`logo.png` 實際放在 `public/`，Vite 建置時找不到會直接噴錯。改成動態組路徑，讓它在 GitHub Pages 子路徑（`base: '/my-works-omamori/'`）和 Vercel 根路徑（`base: '/'`）下都能正確指到檔案：

```js
data() {
  return {
    logoSrc: `${import.meta.env.BASE_URL}logo.png`,
  }
}
```
```html
<img :src="logoSrc" alt="Logo" ...>
```

> `public/` 目錄裡的檔案不會被 Vite 處理/打包，引用時必須用根絕對路徑，且不會自動套用 `base`，所以才需要手動拼 `import.meta.env.BASE_URL`。

## 6. package.json

- 加上 `"type": "module"`（因為 `vite.config.js` 用 ESM 語法，沒加這個 Vite 會印 CommonJS 相容性警告）
- scripts：
  ```json
  "dev": "vite",
  "serve": "vite",
  "build": "vite build",
  "preview": "vite preview",
  "lint": "eslint . --ext .js,.vue",
  "deploy": "gh-pages -d dist"
  ```
- `eslintConfig.parserOptions`：移除已刪除的 `@babel/eslint-parser`，改用內建 `ecmaVersion: 2022` / `sourceType: "module"`

## 7. 驗證

```bash
npm run build    # 確認 dist/ 正常產出，無 resolve 錯誤
npm run dev      # 確認本機開發伺服器正常回應
```

## 已知、未處理的既有問題（與本次遷移無關）

- `src/views/UserCheckout.vue` 的表格 `<thead>` 底下直接放 `<th>`，缺少 `<tr>` 包裹，瀏覽器/Vue 編譯器會警告 HTML 結構不合法（`<th> cannot be child of <thead>`）。這是遷移前就存在的標記問題，不影響 Vite 建置本身，建議另開一張任務修正。
- `src/components/HeroCarousel.vue` 的 `slides` 資料使用相對路徑字串（如 `./images/slide1.png`），是 JS 字串而非 template 靜態屬性，不會被 Vite/webpack 的資源管線轉換；在非根路徑的路由下可能解析錯誤，建議之後改成 `public/` 根絕對路徑或 `import`。
