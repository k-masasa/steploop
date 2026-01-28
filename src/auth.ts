import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

/**
 * NextAuth.js (Auth.js v5) の設定
 *
 * この関数が返すもの:
 * - handlers: API ルート用のハンドラ (GET, POST)
 * - signIn: ログイン処理を開始する関数
 * - signOut: ログアウト処理を行う関数
 * - auth: 現在のセッションを取得する関数 (Server Component や middleware で使用)
 */
export const { handlers, signIn, signOut, auth } = NextAuth({
  /**
   * providers: 認証プロバイダの設定
   *
   * ここで設定したプロバイダでログインできるようになる。
   * 今回は Google のみだが、GitHub, Twitter など複数追加可能。
   */
  providers: [
    Google({
      // Google Cloud Console で取得した認証情報。これがないと Google 側で誰からのリクエストか判定できないので認証不可。
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],

  /**
   * callbacks: 認証フローの各段階で実行される関数
   *
   * 主なコールバック:
   * - signIn: ログイン時に呼ばれる (ログイン可否を制御)
   * - jwt: JWT トークン作成/更新時に呼ばれる
   * - session: セッション取得時に呼ばれる (セッション内容をカスタマイズ)
   */
  callbacks: {
    /**
     * session コールバック
     *
     * セッション情報を取得するたびに呼ばれる。
     * ここでセッションオブジェクトの中身をカスタマイズできる。
     *
     * @param session - 現在のセッション情報 (user.name, user.email, user.image など)
     * @param token - JWT トークンの中身 (sub = Google のユーザー ID)
     * @returns カスタマイズしたセッション
     */
    session({ session, token }) {
      // token.sub には Google が発行したユーザー ID が入っている
      // これを session.user.id にセットすることで、
      // アプリ内で auth() を呼んだときに session.user.id でアクセスできる
      if (token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },

  /**
   * pages: 認証関連ページのカスタマイズ
   *
   * デフォルトでは NextAuth.js が用意した汎用ページが使われるが、
   * ここで指定すると自分で作ったページを使える。
   */
  pages: {
    // ログインページを /login に変更 (デフォルトは /api/auth/signin)
    signIn: "/login",
  },
});
