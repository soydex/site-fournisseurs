"use client";

import { LogIn } from "lucide-react";
import type React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "@/components/ui/Logo";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isAdmin = pathname?.startsWith("/admin");

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-slate-800">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            {/* Simulated Logo based on Description */}
            <div className="flex items-center gap-2">
              <Logo className="text-comy-red fill-comy-red h-32 w-32 hover:opacity-80 transition-opacity" />
              <span className="ml-2 text-[10px] uppercase tracking-widest text-slate-400 font-semibold border border-slate-200 px-1.5 py-0.5 rounded-md align-middle hover:bg-slate-100 transition-colors">
                Client
              </span>
            </div>
          </Link>

          {!isAdmin && (
            <button
              onClick={() => router.push("/login")}
              className="group flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100 hover:bg-red-600 hover:text-white transition-all duration-300 ease-out text-sm font-semibold text-slate-600"
            >
              <LogIn size={16} />
              <span className="hidden sm:inline">Espace Admin</span>
            </button>
          )}
        </div>
      </header>

      <main className="flex-grow flex flex-col relative z-0">{children}</main>

      <footer className="bg-white border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} Com Y Média. Tous droits réservés.</p>
          <p className="mt-1">
            Application de gestion des besoins d'affichage.
          </p>
        </div>
      </footer>
    </div>
  );
}
