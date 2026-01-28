# 認証フロー (ログイン処理の流れ)

ログインボタン押下からダッシュボード表示までの処理の流れ。

---

## 全体像

```
[ブラウザ]                    [StepLoop]                     [Google]
    │                            │                              │
    │  1. ログインボタン押下      │                              │
    │  ─────────────────────────>│                              │
    │                            │                              │
    │  2. Google 認証画面へリダイレクト                          │
    │  <─────────────────────────│──────────────────────────────>│
    │                            │                              │
    │  3. アカウント選択・ログイン │                              │
    │  ─────────────────────────────────────────────────────────>│
    │                            │                              │
    │  4. 認証コード付きでコールバック                           │
    │  <─────────────────────────────────────────────────────────│
    │  ─────────────────────────>│                              │
    │                            │                              │
    │                            │  5. 認証コードでトークン取得   │
    │                            │  ────────────────────────────>│
    │                            │  <────────────────────────────│
    │                            │                              │
    │                            │  6. ユーザー情報取得          │
    │                            │  ────────────────────────────>│
    │                            │  <────────────────────────────│
    │                            │                              │
    │  7. JWT Cookie セット + /dashboard へリダイレクト          │
    │  <─────────────────────────│                              │
    │                            │                              │
    │  8. /dashboard へアクセス   │                              │
    │  ─────────────────────────>│                              │
    │                            │                              │
    │  9. middleware で認証チェック (Cookie の JWT 検証)         │
    │                            │                              │
    │  10. ダッシュボード表示     │                              │
    │  <─────────────────────────│                              │
```

---

## 詳細

### 1. ログインボタン押下

**ファイル**: `src/app/login/page.tsx`

```typescript
const handleGoogleLogin = () => {
  const options = { callbackUrl: "/dashboard" };
  void signIn("google", options);
};
```

- `signIn("google")` が呼ばれる
- 第 1 引数: プロバイダ ID ("google")
- 第 2 引数: オプション (ログイン成功後のリダイレクト先)

---

### 2. Google 認証画面へリダイレクト

**処理**: NextAuth.js 内部

NextAuth.js が認証 URL を組み立て、ブラウザをリダイレクトさせる。

```
https://accounts.google.com/o/oauth2/v2/auth
  ?client_id=GOOGLE_CLIENT_ID
  &redirect_uri=http://localhost:3000/api/auth/callback/google
  &scope=openid email profile
  &response_type=code
  &state=ランダムな文字列 (CSRF 対策)
```

| パラメータ    | 説明                                           |
| ------------- | ---------------------------------------------- |
| client_id     | Google Cloud Console で取得したクライアント ID |
| redirect_uri  | 認証後の戻り先 URL                             |
| scope         | 要求する権限 (メール、プロフィール情報)        |
| response_type | code = 認証コードを要求                        |
| state         | CSRF 対策用のランダム文字列                    |

---

### 3. アカウント選択・ログイン

**処理**: Google 側

- ユーザーが Google アカウントを選択
- ログイン済みなら選択のみ、未ログインならパスワード入力
- 初回の場合は「このアプリに情報を提供してよいか」の確認画面

---

### 4. 認証コード付きでコールバック

**処理**: Google → ブラウザ → StepLoop

Google が認証 OK と判断したら、ブラウザを以下の URL にリダイレクト:

```
http://localhost:3000/api/auth/callback/google
  ?code=認証コード
  &state=リクエスト時と同じ値
```

| パラメータ | 説明                                            |
| ---------- | ----------------------------------------------- |
| code       | 一時的な認証コード (アクセストークン取得に使う) |
| state      | CSRF 対策用 (リクエスト時の値と一致するか検証)  |

---

### 5. 認証コードでトークン取得

**ファイル**: `src/app/api/auth/[...nextauth]/route.ts` (handlers が処理)

**処理**: NextAuth.js 内部

```
StepLoop → Google Token API
POST https://oauth2.googleapis.com/token
  client_id=xxx
  client_secret=xxx
  code=認証コード
  grant_type=authorization_code
  redirect_uri=xxx
```

Google からのレスポンス:

```json
{
  "access_token": "アクセストークン",
  "id_token": "ID トークン (JWT)",
  "expires_in": 3600,
  "token_type": "Bearer"
}
```

---

### 6. ユーザー情報取得

**処理**: NextAuth.js 内部

アクセストークンを使って Google からユーザー情報を取得:

```
GET https://openidconnect.googleapis.com/v1/userinfo
Authorization: Bearer アクセストークン
```

レスポンス:

```json
{
  "sub": "Google ユーザー ID",
  "email": "user@gmail.com",
  "name": "山田太郎",
  "picture": "https://..."
}
```

---

### 7. JWT Cookie セット + リダイレクト

**ファイル**: `src/auth.ts` (callbacks.session)

**処理**: NextAuth.js 内部 + auth.ts のコールバック

1. 取得したユーザー情報から JWT (JSON Web Token) を生成
2. `AUTH_SECRET` で暗号化
3. ブラウザの Cookie にセット (`authjs.session-token`)
4. `callbackUrl` (/dashboard) にリダイレクト

```typescript
// auth.ts - セッションに user.id を追加
callbacks: {
  session({ session, token }) {
    if (token.sub) {
      session.user.id = token.sub;  // Google の user ID
    }
    return session;
  },
}
```

---

### 8. /dashboard へアクセス

**処理**: ブラウザ

Cookie に JWT がセットされた状態で `/dashboard` にアクセス。

---

### 9. middleware で認証チェック

**ファイル**: `src/middleware.ts`

全てのリクエストの前に middleware が実行される:

```typescript
export default auth((req) => {
  // req.auth に Cookie の JWT を復号化したセッション情報が入る
  const isLoggedIn = !!req.auth;

  // /dashboard は認証必要なパス
  // isLoggedIn = true なので、そのまま通過
});
```

---

### 10. ダッシュボード表示

**ファイル**: `src/app/dashboard/page.tsx`

```typescript
export default async function DashboardPage() {
  // サーバーサイドでセッション取得
  const session = await auth();

  // session.user.id を使って DB からデータ取得
  const goals = await getGoals();

  return <div>...</div>;
}
```

---

## Cookie に保存される JWT の中身 (復号後)

```json
{
  "sub": "Google ユーザー ID",
  "name": "山田太郎",
  "email": "user@gmail.com",
  "picture": "https://...",
  "iat": 1234567890,
  "exp": 1234567890
}
```

| フィールド | 説明                  |
| ---------- | --------------------- |
| sub        | ユーザー ID           |
| name       | 表示名                |
| email      | メールアドレス        |
| picture    | プロフィール画像 URL  |
| iat        | 発行日時 (issued at)  |
| exp        | 有効期限 (expiration) |

---

## 関連ファイル一覧

| ファイル                                  | 役割                         |
| ----------------------------------------- | ---------------------------- |
| `src/app/login/page.tsx`                  | ログインページ (signIn 呼出) |
| `src/auth.ts`                             | NextAuth.js 設定             |
| `src/app/api/auth/[...nextauth]/route.ts` | 認証 API エンドポイント      |
| `src/middleware.ts`                       | 認証チェック (リクエスト前)  |
| `src/app/dashboard/page.tsx`              | ダッシュボード               |
