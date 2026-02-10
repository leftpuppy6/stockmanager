import "@/styles/globals.css";

import { type Metadata, type Viewport } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "@/trpc/react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Create T3 App",
  appleWebApp: {
    capable: true,
    title: "Create T3 App",
    statusBarStyle: "black-translucent",
    // 起動画面の画像などを指定する場合はここに追加
  },
};

export const viewport: Viewport = {
  width: "device-width",
  // ズームを防ぐ
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body className="bg-gray-50 text-gray-900">
        <TRPCReactProvider>
          <div className="pb-24">{children}</div>

          {/* ボトムナビゲーション */}
          <nav className="fixed bottom-4 left-1/2 z-50 w-[95%] max-w-md -translate-x-1/2">
            <div className="flex items-center justify-around rounded-3xl border border-gray-200 bg-white/80 px-6 py-3 shadow-2xl backdrop-blur-md">
              <Link href="/" className="group flex flex-col items-center gap-1">
                <span className="text-2xl transition-transform group-active:scale-90">
                  📦
                </span>
                <span className="text-[10px] font-bold text-gray-500 group-hover:text-blue-600">
                  在庫一覧
                </span>
              </Link>

              <Link
                href="/shopping-list"
                className="group flex flex-col items-center gap-1"
              >
                <span className="text-2xl transition-transform group-active:scale-90">
                  🛒
                </span>
                <span className="text-[10px] font-bold text-gray-500 group-hover:text-red-600">
                  買い物
                </span>
              </Link>

              <Link
                href="/category-list"
                className="group flex flex-col items-center gap-1"
              >
                <span className="text-2xl transition-transform group-active:scale-90">
                  🏷️
                </span>
                <span className="text-[10px] font-bold text-gray-500 group-hover:text-green-600">
                  マスタ
                </span>
              </Link>
            </div>
          </nav>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
