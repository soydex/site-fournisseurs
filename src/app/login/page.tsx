"use client";

import { motion } from "framer-motion";
import { AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";
import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui/FormElements";
import { loginAction } from "@/app/actions/auth";
import { useNotification } from "@/context/NotificationContext";

export default function LoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { addNotification } = useNotification();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData();
    formData.append("password", password);

    try {
      const result = await loginAction(null, formData);
      if (result?.success) {
        addNotification(
          "success",
          "Connexion réussie",
          "Bienvenue sur l'espace administration.",
        );
        router.push("/admin");
      } else {
        const msg = result?.message || "Erreur de connexion";
        setError(msg);
        addNotification("error", "Échec de connexion", msg);
      }
    } catch (e) {
      setError("Une erreur est survenue");
      addNotification("error", "Erreur", "Une erreur inattendue est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="glass-panel p-8 md:p-10 rounded-3xl shadow-2xl shadow-slate-900/5 text-center border-t border-white/60">
          <div className="w-20 h-20 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner transform rotate-3">
            <ShieldCheck size={40} className="text-comy-red drop-shadow-sm" />
          </div>

          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            Accès Sécurisé
          </h1>
          <p className="text-slate-500 text-sm mb-8 px-4">
            Portail d'administration pour la gestion des campagnes.
          </p>

          <form onSubmit={handleLogin} className="space-y-6 text-left">
            <Input
              label="Clé d'accès"
              type="password"
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={error}
              autoFocus
              className="text-center tracking-widest"
            />

            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="flex items-center justify-center gap-2 text-sm text-red-600 bg-red-50/80 backdrop-blur p-3 rounded-xl border border-red-100"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full justify-center h-12 text-base shadow-lg shadow-red-500/20"
              disabled={loading}
            >
              {loading ? (
                "Vérification..."
              ) : (
                <>
                  Entrer <ArrowRight size={18} />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-200/50">
            <p className="text-xs text-slate-400 font-medium">
              Accès restreint aux administrateurs.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
