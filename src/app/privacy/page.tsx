import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <Link href="/" className="text-xl font-bold">
            StepLoop
          </Link>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="mb-8 text-2xl font-bold">プライバシーポリシー</h1>

        <div className="prose prose-gray max-w-none space-y-6">
          <section>
            <h2 className="text-xl font-semibold">1. はじめに</h2>
            <p className="mt-2 text-gray-700">
              StepLoop (以下「本サービス」) は、ユーザーのプライバシーを尊重し、
              個人情報の保護に努めます。本プライバシーポリシーでは、
              本サービスにおける個人情報の取り扱いについて説明します。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">2. 収集する情報</h2>
            <p className="mt-2 text-gray-700">本サービスでは、以下の情報を収集します:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-700">
              <li>Google アカウント情報 (メールアドレス、氏名、プロフィール画像)</li>
              <li>目標および振り返りの内容</li>
              <li>サービス利用に関するログ情報</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">3. 情報の利用目的</h2>
            <p className="mt-2 text-gray-700">収集した情報は、以下の目的で利用します:</p>
            <ul className="mt-2 list-disc space-y-1 pl-6 text-gray-700">
              <li>本サービスの提供・運営</li>
              <li>ユーザーサポート</li>
              <li>サービスの改善・新機能の開発</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold">4. 情報の管理</h2>
            <p className="mt-2 text-gray-700">
              本サービスの管理者は、サービスの運営・改善のため、
              ユーザーの情報にアクセスすることがあります。
              ただし、正当な理由なく第三者に情報を開示することはありません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">5. 第三者への提供</h2>
            <p className="mt-2 text-gray-700">
              本サービスは、法令に基づく場合を除き、
              ユーザーの同意なく個人情報を第三者に提供することはありません。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">6. Cookie の使用</h2>
            <p className="mt-2 text-gray-700">
              本サービスでは、認証状態の維持のために Cookie を使用します。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">7. お問い合わせ</h2>
            <p className="mt-2 text-gray-700">
              プライバシーポリシーに関するお問い合わせは、サービス内のお問い合わせ機能よりご連絡ください。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold">8. 改定</h2>
            <p className="mt-2 text-gray-700">
              本プライバシーポリシーは、必要に応じて改定することがあります。
              重要な変更がある場合は、サービス内でお知らせします。
            </p>
          </section>

          <p className="mt-8 text-sm text-gray-500">最終更新日: 2026 年 1 月 27 日</p>
        </div>
      </main>

      {/* フッター */}
      <footer className="border-t bg-white">
        <div className="mx-auto max-w-4xl px-4 py-4 text-center text-sm text-gray-500">
          <span>© 2026 StepLoop</span>
        </div>
      </footer>
    </div>
  );
}
