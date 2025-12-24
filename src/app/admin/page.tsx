"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Check,
  Copy,
  ExternalLink,
  FileSpreadsheet,
  Layers,
  Link as LinkIcon,
  LogOut,
  Plus,
  Search,
  Trash2,
  Users,
  X,
  Zap,
} from "lucide-react";
import type React from "react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button, Input } from "@/components/ui/FormElements";
import { api } from "@/services/api";
import type { Campaign, DisplayNeed } from "@/types";
import * as XLSX from "xlsx";
import { logoutAction } from "../actions/auth";
import { useNotification } from "@/context/NotificationContext";

export default function AdminDashboard() {
  const router = useRouter();
  const [needs, setNeeds] = useState<DisplayNeed[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const { addNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

  // New Campaign Modal State
  const [showNewCampaign, setShowNewCampaign] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState("");

  // Link Generator State
  const [generatedLink, setGeneratedLink] = useState("");
  const [copied, setCopied] = useState(false);

  const loadData = async (context?: string) => {
    const [needsData, campaignsData] = await Promise.all([
      api.getAllNeeds(context || undefined),
      api.getCampaigns(),
    ]);
    setNeeds(needsData);
    setCampaigns(campaignsData);
    setLoading(false);
  };

  // Auth check handled by middleware
  useEffect(() => {
    loadData(selectedCampaign || undefined);
  }, [router, selectedCampaign]);

  const handleLogout = async () => {
    await logoutAction();
  };

  const handleDelete = async (id: string) => {
    addNotification(
      "warning",
      "Confirmer la suppression ?",
      "Cette action est irréversible.",
      {
        label: "Supprimer définitivement",
        onClick: async () => {
          await api.deleteNeed(id);
          addNotification(
            "success",
            "Suppression réussie",
            "L'entrée a été supprimée.",
          );
          loadData(selectedCampaign || undefined);
        },
      },
    );
  };

  const handleClearAll = async () => {
    const message = selectedCampaign
      ? "Cela va supprimer toutes les entrées de cette campagne."
      : "Cela va supprimer TOUTES les entrées.";

    addNotification("critical", "Action Destructrice", message, {
      label: "Tout Supprimer",
      onClick: async () => {
        await api.clearAllNeeds(selectedCampaign || undefined);
        addNotification(
          "success",
          "Nettoyage terminé",
          "Toutes les entrées ont été supprimées.",
        );
        loadData(selectedCampaign || undefined);
      },
    });
  };

  const handleExport = () => {
    const dataToExport = filteredNeeds.map((need) => ({
      Date: new Date(need.createdAt).toLocaleDateString(),
      Heure: new Date(need.createdAt).toLocaleTimeString(),
      Annonceur: need.advertiser,
      Prestataire: need.provider,
      Format: need.format,
      Quantité: need.quantity,
      Adresse: need.deliveryAddress,
      Campagne: need.context || "Aucune",
      Commentaires: need.comments,
    }));

    const ws = XLSX.utils.json_to_sheet(dataToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Besoins");

    const fileName = `Export_Besoins_${new Date().toISOString().split("T")[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
  };

  const generateLink = (slug: string) => {
    const baseUrl = window.location.origin;
    const link = `${baseUrl}/?ctx=${slug}`;
    setGeneratedLink(link);
    navigator.clipboard.writeText(link);
    setCopied(true);
    addNotification(
      "info",
      "Lien copié",
      "Le lien a été copié dans le presse-papier.",
    );
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddCampaign = async () => {
    if (!newCampaignName.trim()) return;

    // Generate slug from name
    const slug = newCampaignName
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "")
      .trim();

    await api.addCampaign({
      slug,
      displayName: newCampaignName.trim(),
    });

    addNotification(
      "success",
      "Campagne créée",
      `La campagne "${newCampaignName}" a été ajoutée.`,
    );
    setNewCampaignName("");
    setShowNewCampaign(false);
    loadData(selectedCampaign || undefined);
  };

  const handleDeleteCampaign = async (slug: string) => {
    addNotification(
      "warning",
      "Supprimer la campagne ?",
      "Cette action supprimera la campagne mais les besoins associés resteront.",
      {
        label: "Supprimer la campagne",
        onClick: async () => {
          await api.deleteCampaign(slug);
          addNotification(
            "success",
            "Campagne supprimée",
            "La campagne a été retirée avec succès.",
          );
          if (selectedCampaign === slug) {
            setSelectedCampaign(null);
          }
          loadData(selectedCampaign || undefined);
        },
      },
    );
  };

  // Filter logic (search within already filtered results)
  const filteredNeeds = needs.filter(
    (need) =>
      need.advertiser.toLowerCase().includes(searchTerm.toLowerCase()) ||
      need.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
      need.id.includes(searchTerm),
  );

  // Computed Stats
  const totalQuantity = needs.reduce((acc, curr) => acc + curr.quantity, 0);
  const uniqueAdvertisers = new Set(needs.map((n) => n.advertiser)).size;
  const currentCampaignName = selectedCampaign
    ? campaigns.find((c) => c.slug === selectedCampaign)?.displayName
    : "Toutes les campagnes";

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin w-8 h-8 border-4 border-comy-red border-t-transparent rounded-full"></div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header & Stats */}
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Vue d'ensemble
            </h1>
            <p className="text-slate-500 font-medium">
              Monitoring des demandes en temps réel.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={handleLogout}
            className="text-xs px-4 py-2"
          >
            <LogOut size={14} /> Déconnexion
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard
            label="Demandes Totales"
            value={needs.length}
            icon={<Layers className="text-blue-500" />}
            bg="bg-blue-50"
          />
          <StatCard
            label="Volume d'Affiches"
            value={totalQuantity}
            icon={<BarChart3 className="text-purple-500" />}
            bg="bg-purple-50"
          />
          <StatCard
            label="Annonceurs Uniques"
            value={uniqueAdvertisers}
            icon={<Users className="text-emerald-500" />}
            bg="bg-emerald-50"
          />
          <StatCard
            label="Campagnes Actives"
            value={campaigns.length}
            icon={<Zap className="text-amber-500" />}
            bg="bg-amber-50"
          />
        </div>
      </div>

      {/* Campaign Tabs Navigation (Glassmorphism) */}
      <div className="glass-panel p-2 rounded-xl flex flex-wrap gap-2 items-center">
        <button
          type="button"
          onClick={() => setSelectedCampaign(null)}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
            selectedCampaign === null
              ? "bg-slate-900 text-white shadow-lg"
              : "text-slate-500 hover:bg-slate-100/50 hover:text-slate-700"
          }`}
        >
          Toutes
        </button>

        <div className="h-6 w-px bg-slate-200/50 mx-1" />

        {campaigns.map((campaign) => (
          <div key={campaign.slug} className="relative group">
            <button
              type="button"
              onClick={() => setSelectedCampaign(campaign.slug)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                selectedCampaign === campaign.slug
                  ? "bg-comy-red text-white shadow-lg shadow-red-500/20"
                  : "text-slate-500 hover:bg-red-50 hover:text-comy-red"
              }`}
            >
              {campaign.displayName}
            </button>

            {/* Quick Actions Hover */}
            <div className="absolute -top-3 right-4 hidden group-hover:flex gap-1 z-10">
              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(generatedLink)}
                className="p-1 bg-white rounded-full text-red-500 shadow-sm border border-red-100 hover:bg-red-50"
                title="Copier le slug"
              >
                <Copy size={10} />
              </button>
            </div>
            <div className="absolute -top-3 -right-2 hidden group-hover:flex gap-1 z-10">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteCampaign(campaign.slug);
                }}
                className="p-1 bg-white rounded-full text-red-500 shadow-sm border border-red-100 hover:bg-red-50"
                title="Supprimer"
              >
                <X size={10} />
              </button>
            </div>
          </div>
        ))}

        <button
          type="button"
          onClick={() => setShowNewCampaign(true)}
          className="ml-auto px-3 py-2 rounded-lg text-xs font-bold text-comy-red hover:bg-red-50 flex items-center gap-1 transition-colors border border-dashed border-red-200"
        >
          <Plus size={14} /> Nouvelle Campagne
        </button>
      </div>

      {/* New Campaign Modal / Input Area */}
      {showNewCampaign && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3"
        >
          <Input
            label="Nom de la campagne"
            placeholder="Ex: Salon de l'Habitat 2024"
            value={newCampaignName}
            onChange={(e) => setNewCampaignName(e.target.value)}
            className="mb-0"
            autoFocus
          />
          <div className="flex items-center gap-2 mt-6">
            <Button onClick={handleAddCampaign}>Confirmer</Button>
            <Button
              variant="secondary"
              onClick={() => setShowNewCampaign(false)}
            >
              Annuler
            </Button>
          </div>
        </motion.div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Table Column */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between gap-4 items-center">
            <div className="relative w-full sm:max-w-md group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-comy-red transition-colors"
                size={18}
              />
              <input
                type="text"
                placeholder="Filtrer (Nom, Format, Ville...)"
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-comy-red/20 focus:border-comy-red transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button
                onClick={handleExport}
                variant="secondary"
                className="flex-1 sm:flex-none"
              >
                <FileSpreadsheet size={18} className="text-green-600" />{" "}
                <span className="hidden sm:inline">Export</span>
              </Button>
              <Button
                onClick={handleClearAll}
                variant="danger"
                className="flex-1 sm:flex-none"
              >
                <Trash2 size={18} />
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-glass border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto min-h-[400px]">
              <table className="w-full text-sm text-left">
                <thead className="bg-slate-50/80 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 font-bold text-slate-700 uppercase text-xs tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 font-bold text-slate-700 uppercase text-xs tracking-wider">
                      Client
                    </th>
                    <th className="px-6 py-4 font-bold text-slate-700 uppercase text-xs tracking-wider">
                      Format
                    </th>
                    <th className="px-6 py-4 font-bold text-slate-700 uppercase text-xs tracking-wider">
                      Qté
                    </th>
                    <th className="px-6 py-4 font-bold text-slate-700 uppercase text-xs tracking-wider">
                      Livraison
                    </th>
                    <th className="px-6 py-4 text-right font-bold text-slate-700 uppercase text-xs tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredNeeds.length === 0 ? (
                    <tr>
                      <td
                        colSpan={5}
                        className="px-6 py-16 text-center text-slate-400"
                      >
                        <div className="flex flex-col items-center gap-2">
                          <Search size={32} className="text-slate-200" />
                          <p>Aucune donnée ne correspond à votre recherche.</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredNeeds.map((need) => (
                      <tr
                        key={need.id}
                        className="hover:bg-slate-50/80 transition-colors group"
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-slate-500 font-medium">
                          {new Date(need.createdAt).toLocaleDateString()}
                          <span className="block text-xs text-slate-400">
                            {new Date(need.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">
                            {need.advertiser}
                          </div>
                          <div className="text-xs text-slate-500 flex items-center gap-1">
                            via {need.provider}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200 mb-1">
                            {need.format}
                          </span>
                        </td>
                        <td className="px-6 py-4">{need.quantity}</td>
                        <td className="px-6 py-4 max-w-[200px]">
                          <div
                            className="truncate text-slate-600 text-xs"
                            title={need.deliveryAddress}
                          >
                            {need.deliveryAddress}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button
                            type="button"
                            onClick={() => handleDelete(need.id)}
                            className="text-slate-300 hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100"
                            title="Supprimer"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar Tools */}
        <div className="space-y-6">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel p-6 rounded-2xl border border-blue-100 shadow-lg shadow-blue-500/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <LinkIcon size={100} className="text-blue-500" />
            </div>
            <div className="relative z-10">
              <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-4">
                <div className="p-1.5 bg-blue-100 rounded text-blue-600">
                  <LinkIcon size={16} />
                </div>
                Lien de Campagne
              </h3>

              <div className="space-y-4">
                {selectedCampaign ? (
                  <>
                    <p className="text-sm text-slate-600">
                      Générez un lien public unique pour la campagne{" "}
                      <strong className="text-slate-900">
                        {currentCampaignName}
                      </strong>
                      .
                    </p>
                    <Button
                      onClick={() => generateLink(selectedCampaign)}
                      className="w-full bg-slate-900 text-white hover:bg-slate-800 shadow-none"
                    >
                      Générer l'URL
                    </Button>
                    <Button
                      onClick={(e) => {
                        navigator.clipboard.writeText(generatedLink);
                        e.currentTarget.textContent = "L'URL a été copiée !";
                      }}
                      className="w-full bg-red-600 text-white hover:bg-red-700 shadow-none"
                    >
                      Partager l'URL
                    </Button>
                  </>
                ) : (
                  <div className="text-sm text-slate-500 italic bg-slate-50 p-3 rounded-lg border border-slate-100">
                    Sélectionnez une campagne ci-dessus pour générer un lien
                    spécifique.
                  </div>
                )}

                {generatedLink && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="bg-blue-50 rounded-lg p-3 border border-blue-100 mt-2"
                  >
                    <div className="text-[10px] uppercase text-blue-400 font-bold mb-1">
                      Lien généré
                    </div>
                    <div className="flex gap-2 items-center">
                      <div className="flex-grow truncate text-xs font-mono text-blue-900 bg-white/50 p-1 rounded">
                        {generatedLink}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(generatedLink);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                        className="text-blue-600 hover:bg-blue-200 p-1.5 rounded transition-colors"
                      >
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                    <a
                      href={generatedLink}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-1 text-[10px] text-blue-500 mt-2 hover:underline"
                    >
                      Tester le lien <ExternalLink size={10} />
                    </a>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

const StatCard = ({
  label,
  value,
  icon,
  bg,
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  bg: string;
}) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm flex items-center justify-between relative overflow-hidden group"
  >
    <div className="relative z-10">
      <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
        {label}
      </p>
      <p className="text-2xl font-extrabold text-slate-900">{value}</p>
    </div>
    <div
      className={`w-12 h-12 rounded-xl flex items-center justify-center ${bg} group-hover:scale-110 transition-transform`}
    >
      {icon}
    </div>
  </motion.div>
);
