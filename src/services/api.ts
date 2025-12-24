import type { Campaign, DisplayNeed } from "../types";

// Configuration de l'API
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

// Types pour les réponses backend (format français)
interface BackendBesoin {
  _id: string;
  nomAnnonceur: string;
  nomPrestataire: string;
  format: string;
  formatVisible?: string;
  nombreAffiches: number;
  adresseLivraison: string;
  commentaires?: string;
  context?: string;
  dateCreation: string;
}

interface BackendCampaign {
  _id: string;
  slug: string;
  displayName: string;
}

// Transformateurs Backend ↔ Frontend
const transformBesoinToFrontend = (besoin: BackendBesoin): DisplayNeed => ({
  id: besoin._id,
  createdAt: besoin.dateCreation,
  advertiser: besoin.nomAnnonceur,
  provider: besoin.nomPrestataire,
  format: besoin.format,
  visibleFormat: besoin.formatVisible || "",
  quantity: besoin.nombreAffiches,
  deliveryAddress: besoin.adresseLivraison,
  comments: besoin.commentaires || "",
  context: besoin.context,
});

const transformBesoinToBackend = (
  need: Omit<DisplayNeed, "id" | "createdAt">,
): Omit<BackendBesoin, "_id" | "dateCreation"> => ({
  nomAnnonceur: need.advertiser,
  nomPrestataire: need.provider,
  format: need.format,
  formatVisible: need.visibleFormat,
  nombreAffiches: need.quantity,
  adresseLivraison: need.deliveryAddress,
  commentaires: need.comments,
  context: need.context,
});

const transformCampaignToFrontend = (campaign: BackendCampaign): Campaign => ({
  slug: campaign.slug,
  displayName: campaign.displayName,
});

// Helper pour les requêtes fetch
const fetchApi = async <T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Ajouter le token si disponible
  const token = localStorage.getItem("admin_token");
  if (token) {
    defaultHeaders["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "Erreur réseau" }));
    throw new Error(error.message || `Erreur ${response.status}`);
  }

  // Pour les DELETE qui peuvent ne rien retourner
  const text = await response.text();
  return text ? JSON.parse(text) : ({} as T);
};

class ApiService {
  // --- Public API (Formulaire) ---

  async submitNeed(
    need: Omit<DisplayNeed, "id" | "createdAt">,
  ): Promise<DisplayNeed> {
    const backendData = transformBesoinToBackend(need);
    const result = await fetchApi<BackendBesoin>("/besoins", {
      method: "POST",
      body: JSON.stringify(backendData),
    });

    const transformed = transformBesoinToFrontend(result);

    // Sauvegarder dans l'historique local
    this.addToLocalHistory(transformed);

    return transformed;
  }

  // --- Admin API ---

  // Authentication is now handled server-side via Server Actions and Middleware.
  // See src/app/actions/auth.ts and src/middleware.ts

  async getAllNeeds(context?: string): Promise<DisplayNeed[]> {
    const query = context ? `?context=${encodeURIComponent(context)}` : "";
    const results = await fetchApi<BackendBesoin[]>(`/besoins${query}`);
    return results.map(transformBesoinToFrontend);
  }

  async deleteNeed(id: string): Promise<void> {
    await fetchApi(`/besoins/${id}`, {
      method: "DELETE",
    });
  }

  async clearAllNeeds(context?: string): Promise<void> {
    const query = context ? `?context=${encodeURIComponent(context)}` : "";
    await fetchApi(`/besoins${query}`, {
      method: "DELETE",
    });
  }

  // --- Campaign Management ---

  async getCampaigns(): Promise<Campaign[]> {
    const results = await fetchApi<BackendCampaign[]>("/campagnes");
    return results.map(transformCampaignToFrontend);
  }

  async addCampaign(campaign: Campaign): Promise<Campaign> {
    const result = await fetchApi<BackendCampaign>("/campagnes", {
      method: "POST",
      body: JSON.stringify(campaign),
    });
    return transformCampaignToFrontend(result);
  }

  async deleteCampaign(slug: string): Promise<void> {
    await fetchApi(`/campagnes/${encodeURIComponent(slug)}`, {
      method: "DELETE",
    });
  }

  // --- Local Storage History (24h retention) ---

  private addToLocalHistory(need: DisplayNeed): void {
    const HISTORY_KEY = "user_history_v1";
    const existingRaw = localStorage.getItem(HISTORY_KEY);
    let history: { item: DisplayNeed; expires: number }[] = existingRaw
      ? JSON.parse(existingRaw)
      : [];

    // Clean expired
    const now = Date.now();
    history = history.filter((h) => h.expires > now);

    // Add new
    history.unshift({
      item: need,
      expires: now + 24 * 60 * 60 * 1000, // 24h
    });

    // Limit to last 5
    if (history.length > 5) history = history.slice(0, 5);

    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  }

  getLocalHistory(): DisplayNeed[] {
    const HISTORY_KEY = "user_history_v1";
    const existingRaw = localStorage.getItem(HISTORY_KEY);
    if (!existingRaw) return [];

    const now = Date.now();
    const history: { item: DisplayNeed; expires: number }[] =
      JSON.parse(existingRaw);

    // Return only valid ones
    return history.filter((h) => h.expires > now).map((h) => h.item);
  }
}

export const api = new ApiService();
