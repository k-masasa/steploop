import { handlers } from "@/auth";

/**
 * NextAuth.js の API ルートハンドラ
 *
 * このファイルのパス: /api/auth/[...nextauth]/route.ts
 * [...nextauth] は「キャッチオール」ルートで、以下の全てを処理:
 *
 * - GET /api/auth/signin      → ログインページ (カスタムページを使うので実際は未使用)
 * - GET /api/auth/signout     → ログアウト確認ページ
 * - POST /api/auth/signin/:provider → プロバイダでのログイン開始
 * - GET /api/auth/callback/:provider → プロバイダからのコールバック受信
 * - GET /api/auth/session     → 現在のセッション情報を JSON で返す
 * - GET /api/auth/csrf        → CSRF トークンを取得
 * - GET /api/auth/providers   → 利用可能なプロバイダ一覧を JSON で返す
 *
 * handlers は auth.ts で設定した NextAuth() が生成した
 * { GET, POST } ハンドラをそのままエクスポートしている。
 */
export const { GET, POST } = handlers;
