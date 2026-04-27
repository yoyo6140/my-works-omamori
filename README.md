## 作品連結

- Demo：`https://yoyo6140.github.io/my-works-omamori/#/home`

## 專案簡介

以 **Vue 3** 製作的電商前台/後台練習專案，透過 **Vue Router** 串接各頁面，並將常用 UI（例如 navbar、footer、載入特效）抽成可重複使用的元件。

## 功能與頁面結構

### 管理者平台（後台）

- 登入
- 商品管理
- 訂單管理
- 優惠券管理

### 使用者平台（前台）

- 首頁
- 商品介紹
- 購物車
- 結帳確認

## 技術與套件

- **前端**：Vue 3、Vue Router
- **UI**：Bootstrap 5、HTML、CSS、JavaScript
- **表單驗證**：VeeValidate（含 i18n / rules）
- **其他**：Axios、mitt、js-cookie

## 資料夾結構

```text
my-omamori/
├─ public/
│  ├─ images/
│  └─ index.html
├─ src/
│  ├─ assets/
│  ├─ components/          # navbar / footer / loading / modal 等共用元件
│  ├─ methods/             # 共用方法（例如事件總線）
│  ├─ router/              # 路由設定
│  ├─ views/               # 頁面（前台/後台）
│  │  ├─ AdminCoupons.vue
│  │  ├─ AdminOrders.vue
│  │  ├─ AdminProducts.vue
│  │  ├─ DashBoard.vue
│  │  ├─ LoginForm.vue
│  │  ├─ MyHome.vue
│  │  ├─ UserCarts.vue
│  │  ├─ UserCheckout.vue
│  │  ├─ UserGoods.vue
│  │  └─ UserProduct.vue
│  ├─ App.vue
│  └─ main.js
├─ .env
├─ package.json
└─ vue.config.js
```

## 開發與部署

此專案使用 **Vue CLI**。

### 安裝

```bash
npm install
```

### 本機開發

```bash
npm run serve
```

### 建置

```bash
npm run build
```

### 部署（GitHub Pages）

```bash
npm run deploy
```




