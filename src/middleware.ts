import { auth } from "@/auth";

/**
 * Middleware (ミドルウェア)
 *
 * Next.js の Middleware は、リクエストがページに到達する「前」に実行される。
 * 全てのリクエストに対して認証チェックを行い、
 * 未ログインユーザーを /login にリダイレクトする役割を持つ。
 *
 * 実行タイミング:
 * ユーザーがURLにアクセス → Middleware実行 → ページ表示
 *
 * auth() でラップすることで、req.auth にセッション情報が入る。
 */
export default auth((req) => {
  /**
   * req.auth の中身 (ログイン済みの場合):
   * {
   *   user: {
   *     id: "google-user-id",
   *     name: "山田太郎",
   *     email: "taro@gmail.com",
   *     image: "https://..."
   *   }
   * }
   *
   * 未ログインの場合は null または undefined
   */
  const isLoggedIn = !!req.auth; // req.auth があれば true、なければ false
  const { pathname } = req.nextUrl; // アクセスしようとしている URL パス

  /**
   * 認証不要のパス (publicPaths)
   *
   * これらのパスは未ログインでもアクセス可能:
   * - /login: ログインページ (ここにリダイレクトするのでアクセス可能にしないとループする)
   * - /privacy: プライバシーポリシー (誰でも見れるべき)
   * - /api/auth: NextAuth.js の API エンドポイント (認証処理自体に必要)
   */
  const publicPaths = ["/login", "/privacy", "/api/auth"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  /**
   * ケース1: 未ログイン + 認証が必要なパス
   *
   * 例: 未ログインで /dashboard にアクセス
   * → /login にリダイレクト
   */
  if (!isLoggedIn && !isPublicPath) {
    return Response.redirect(new URL("/login", req.nextUrl.origin));
  }

  /**
   * ケース2: ログイン済み + ログインページ
   *
   * 例: ログイン済みで /login にアクセス
   * → /dashboard にリダイレクト (もうログインしてるから)
   */
  if (isLoggedIn && pathname === "/login") {
    return Response.redirect(new URL("/dashboard", req.nextUrl.origin));
  }

  /**
   * ケース3: それ以外
   *
   * - ログイン済み + 認証が必要なパス → OK、そのまま通す
   * - 未ログイン + 認証不要のパス → OK、そのまま通す
   *
   * return; または return undefined; で「何もしない (そのまま通す)」という意味
   */
  return;
});

/**
 * config.matcher: Middleware を実行するパスのパターン
 *
 * この正規表現の意味:
 * - /((?!_next/static|_next/image|favicon.ico|.*\\..*).*)
 *
 * 除外されるパス (Middleware を実行しない):
 * - /_next/static/... : Next.js の静的ファイル (JS, CSS)
 * - /_next/image/... : Next.js の画像最適化
 * - /favicon.ico : ファビコン
 * - /xxx.png, /xxx.css など : 拡張子付きのファイル
 *
 * なぜ除外する？:
 * → 静的ファイルに対して毎回認証チェックするのは無駄だから
 */
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
