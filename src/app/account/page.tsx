import type { Metadata } from 'next'
import { getSession } from '@/lib/session'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import AccountClient from './AccountClient'
import EmailLookup from './EmailLookup'

export const metadata: Metadata = {
  title: 'アカウント管理',
  robots: { index: false, follow: false },
}

export default async function AccountPage() {
  const session = await getSession()

  return (
    <>
      <Header />
      <main className="min-h-screen pt-32 pb-16 px-4">
        <div className="max-w-lg mx-auto">
          <h1 className="font-serif text-2xl font-bold text-epoch-text mb-2">
            アカウント管理
          </h1>
          <p className="text-epoch-dim text-sm mb-10">
            サブスクリプションの確認・解約はこちらから。
          </p>

          {session?.email ? (
            <AccountClient email={session.email} />
          ) : (
            <EmailLookup />
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
