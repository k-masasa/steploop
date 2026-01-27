import { auth } from "@/auth";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const { pathname } = req.nextUrl;

  // 認証不要のパス
  const publicPaths = ["/login", "/privacy", "/api/auth"];
  const isPublicPath = publicPaths.some((path) => pathname.startsWith(path));

  // 未ログインで認証が必要なパスにアクセスした場合
  if (!isLoggedIn && !isPublicPath) {
    return Response.redirect(new URL("/login", req.nextUrl.origin));
  }

  // ログイン済みでログインページにアクセスした場合
  if (isLoggedIn && pathname === "/login") {
    return Response.redirect(new URL("/dashboard", req.nextUrl.origin));
  }

  return;
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
