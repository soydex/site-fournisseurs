"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  CheckCircle2,
  ChevronRight,
  Clock,
  MapPin,
  Tag,
} from "lucide-react";
import type React from "react";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button, Input, Select, TextArea } from "@/components/ui/FormElements";
import { api } from "@/services/api";
import { type Campaign, type DisplayNeed, FORMAT_OPTIONS } from "@/types";
import { useNotification } from "@/context/NotificationContext";

function PublicFormContent() {
  const searchParams = useSearchParams();
  const campaignContext = searchParams.get("ctx");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [history, setHistory] = useState<DisplayNeed[]>([]);
  const [campaignInfo, setCampaignInfo] = useState<Campaign | null>(null);
  const { addNotification } = useNotification();

  // Form State
  const [formData, setFormData] = useState({
    advertiser: "",
    provider: "",
    format: "",
    visibleFormat: "",
    quantity: "",
    deliveryAddress: "",
    comments: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setHistory(api.getLocalHistory());

    // Load campaign info if context is present
    if (campaignContext) {
      api.getCampaigns().then((campaigns) => {
        const found = campaigns.find((c) => c.slug === campaignContext);
        if (found) setCampaignInfo(found);
      });
    }
  }, [campaignContext, success]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.advertiser) newErrors.advertiser = "Requis";
    if (!formData.provider) newErrors.provider = "Requis";
    if (!formData.format) newErrors.format = "Requis";
    if (!formData.quantity || parseInt(formData.quantity, 10) <= 0)
      newErrors.quantity = "Quantité invalide";
    if (!formData.deliveryAddress) newErrors.deliveryAddress = "Requis";
    return newErrors;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      addNotification(
        "warning",
        "Formulaire incomplet",
        "Veuillez corriger les erreurs avant d'envoyer.",
      );
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await api.submitNeed({
        ...formData,
        context: campaignContext || undefined,
        quantity: parseInt(formData.quantity, 10),
      });
      setSuccess(true);
      addNotification(
        "success",
        "Demande envoyée !",
        "Votre besoin d'affichage a été enregistré.",
      );
      setFormData({
        advertiser: "",
        provider: "",
        format: "",
        visibleFormat: "",
        quantity: "",
        deliveryAddress: "",
        comments: "",
      });

      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error(err);
      setErrors({ form: "Une erreur est survenue lors de l'envoi." });
      addNotification(
        "error",
        "Erreur serveur",
        "Impossible d'envoyer la demande. Réessayez plus tard.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full">
      {/* Hero Section Background */}
      <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-slate-100 to-transparent -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
        <div className="mb-12 text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">
              Nouvelle demande{" "}
              <span className="text-comy-red">d'affichage</span>
            </h1>
            <p className="text-lg text-slate-500 leading-relaxed 3xl:block hidden">
              Centralisez vos besoins, simplifiez la logistique. Remplissez le
              formulaire ci-dessous pour initier une nouvelle campagne.
            </p>
          </motion.div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 items-start">
          {/* Main Form Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="flex-grow w-full"
          >
            <div className="glass-panel rounded-3xl p-1 shadow-glass">
              {/* Campaign Banner */}
              {campaignInfo && (
                <div className="bg-gradient-to-r from-red-600 to-red-700 px-6 py-3 rounded-t-[20px] rounded-b-none mx-[-1px] mt-[-1px] flex items-center gap-3 mb-1">
                  <Tag className="text-white" size={20} />
                  <div>
                    <p className="text-red-100 text-xs uppercase tracking-wide">
                      Campagne Active
                    </p>
                    <p className="text-white font-bold">
                      {campaignInfo.displayName}
                    </p>
                  </div>
                </div>
              )}

              <div className="bg-white/40 rounded-[20px] p-6 md:p-10">
                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Section 1: Identité */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-red-100 text-comy-red flex items-center justify-center font-bold text-sm">
                        1
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">
                        Identification
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-0 md:pl-11">
                      <Input
                        label="Nom de l'annonceur"
                        placeholder="Ex: Coca Cola"
                        value={formData.advertiser}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            advertiser: e.target.value,
                          })
                        }
                        error={errors.advertiser}
                      />
                      <Input
                        label="Nom du prestataire (vous)"
                        placeholder="Votre Agence / Société"
                        value={formData.provider}
                        onChange={(e) =>
                          setFormData({ ...formData, provider: e.target.value })
                        }
                        error={errors.provider}
                      />
                    </div>
                  </div>

                  <div className="h-px bg-slate-200/60 w-full" />

                  {/* Section 2: Technique */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">
                        2
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">
                        Spécifications Techniques
                      </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-0 md:pl-11">
                      <Select
                        label="Format"
                        options={FORMAT_OPTIONS}
                        value={formData.format}
                        onChange={(e) =>
                          setFormData({ ...formData, format: e.target.value })
                        }
                        error={errors.format}
                      />
                      <Input
                        label="Format visible (Optionnel)"
                        placeholder="Pour la créa (ex: 110x170)"
                        value={formData.visibleFormat}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            visibleFormat: e.target.value,
                          })
                        }
                      />
                      <div className="md:col-span-2 md:w-1/2">
                        <Input
                          label="Nombre d'affiches"
                          type="number"
                          placeholder="Ex: 50"
                          value={formData.quantity}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              quantity: e.target.value,
                            })
                          }
                          error={errors.quantity}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-slate-200/60 w-full" />

                  {/* Section 3: Logistique */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-sm">
                        3
                      </div>
                      <h3 className="text-lg font-bold text-slate-800">
                        Logistique
                      </h3>
                    </div>
                    <div className="space-y-6 pl-0 md:pl-11">
                      <TextArea
                        label="Adresse de livraison"
                        placeholder="Rue, Code Postal, Ville, Pays..."
                        value={formData.deliveryAddress}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            deliveryAddress: e.target.value,
                          })
                        }
                        error={errors.deliveryAddress}
                      />

                      <TextArea
                        label="Commentaires (Optionnel)"
                        placeholder="Notes sur le conditionnement, zippage, horaires de livraison..."
                        value={formData.comments}
                        onChange={(e) =>
                          setFormData({ ...formData, comments: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="pt-6">
                    <AnimatePresence mode="wait">
                      {success ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="bg-green-50/50 backdrop-blur border border-green-200 text-green-800 p-6 rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-green-900/5"
                        >
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                            <CheckCircle2 size={24} />
                          </div>
                          <div>
                            <h4 className="font-bold">Demande envoyée !</h4>
                            <p className="text-sm opacity-80">
                              Les détails ont été transmis à l'administration.
                            </p>
                          </div>
                        </motion.div>
                      ) : (
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full md:w-auto md:min-w-[200px] h-14 text-base"
                        >
                          {loading ? (
                            <span className="flex items-center gap-2">
                              <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span>
                              Traitement...
                            </span>
                          ) : (
                            <>
                              Envoyer la demande <ChevronRight size={18} />
                            </>
                          )}
                        </Button>
                      )}
                    </AnimatePresence>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>

          {/* History Sidebar - Redesigned as a Timeline */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="w-full lg:w-96 flex-shrink-0"
          >
            <div className="sticky top-28">
              <div className="flex items-center justify-between mb-6 px-2">
                <h2 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                  <Activity className="text-comy-red" size={20} />
                  Activité Récente
                </h2>
                <span className="text-xs font-medium text-slate-400 bg-white px-2 py-1 rounded-full border border-slate-100">
                  24h
                </span>
              </div>

              {history.length === 0 ? (
                <div className="bg-white/60 backdrop-blur rounded-2xl p-8 border border-dashed border-slate-300 text-center">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-400">
                    <Clock size={20} />
                  </div>
                  <p className="text-slate-500 font-medium">Aucun historique</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Vos soumissions apparaîtront ici.
                  </p>
                </div>
              ) : (
                <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gradient-to-b before:from-comy-red/50 before:to-transparent">
                  {history.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative"
                    >
                      <div className="absolute -left-[24px] top-1 w-6 h-6 rounded-full bg-white border-2 border-comy-red shadow-lg shadow-red-500/20 z-10 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-comy-red" />
                      </div>

                      <div className="bg-white/80 backdrop-blur p-4 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow group">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-bold text-slate-800">
                            {item.advertiser}
                          </h4>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                            {new Date(item.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-2 font-medium">
                          {item.format}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-2">
                          <MapPin size={12} />
                          <span className="truncate max-w-[200px]">
                            {item.deliveryAddress}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Wrapper with Suspense for useSearchParams
export default function PublicFormPage() {
  return (
    <Suspense fallback={<div className="p-10 text-center">Chargement...</div>}>
      <PublicFormContent />
    </Suspense>
  );
}
