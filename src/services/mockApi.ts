import type { Campaign, DisplayNeed } from "../types";

// Simulate a database delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

class MockApiService {
  private needs: DisplayNeed[] = [
    {
      id: "1",
      createdAt: new Date(Date.now() - 10000000).toISOString(),
      advertiser: "Coca Cola",
      provider: "Agence Paris",
      format: "120x176 (Abribus)",
      visibleFormat: "110x170",
      quantity: 50,
      deliveryAddress: "123 Avenue des Champs, 75008 Paris",
      comments: "Livraison urgente avant vendredi.",
      context: "salonhabitat",
    },
    {
      id: "2",
      createdAt: new Date(Date.now() - 5000000).toISOString(),
      advertiser: "Nike",
      provider: "Print Services",
      format: "320x240 (4x3)",
      visibleFormat: "320x240",
      quantity: 10,
      deliveryAddress: "Zone Industrielle Nord, Lyon",
      comments: "",
      context: "salonmoto",
    },
    {
      id: "3",
      createdAt: new Date(Date.now() - 2000000).toISOString(),
      advertiser: "Leroy Merlin",
      provider: "Agence Lyon",
      format: "400x300 (Laguiole)",
      visibleFormat: "400x300",
      quantity: 25,
      deliveryAddress: "15 Rue de la République, 69002 Lyon",
      comments: "Salon Habitat Lyon 2024",
      context: "salonhabitat",
    },
  ];

  private campaigns: Campaign[] = [
    { slug: "salonhabitat", displayName: "Salon de l'Habitat" },
    { slug: "salonmoto", displayName: "Salon de la Moto" },
  ];

  // --- Public API ---

  async submitNeed(
    need: Omit<DisplayNeed, "id" | "createdAt">,
  ): Promise<DisplayNeed> {
    await delay(800); // Simulate network
    const newNeed: DisplayNeed = {
      ...need,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
    };
    this.needs.unshift(newNeed);

    // Update local history for the public user
    this.addToLocalHistory(newNeed);

    return newNeed;
  }

  // --- Admin API ---

  async login(password: string): Promise<boolean> {
    await delay(500);
    // Simple mock password check
    if (password === "admin") {
      localStorage.setItem("admin_session", "valid");
      return true;
    }
    return false;
  }

  isAuthenticated(): boolean {
    return localStorage.getItem("admin_session") === "valid";
  }

  logout() {
    localStorage.removeItem("admin_session");
  }

  async getAllNeeds(context?: string): Promise<DisplayNeed[]> {
    await delay(600);
    if (context) {
      return this.needs.filter((n) => n.context === context);
    }
    return [...this.needs];
  }

  async deleteNeed(id: string): Promise<void> {
    await delay(300);
    this.needs = this.needs.filter((n) => n.id !== id);
  }

  async clearAllNeeds(context?: string): Promise<void> {
    await delay(500);
    if (context) {
      this.needs = this.needs.filter((n) => n.context !== context);
    } else {
      this.needs = [];
    }
  }

  // --- Campaign Management ---

  async getCampaigns(): Promise<Campaign[]> {
    await delay(300);
    return [...this.campaigns];
  }

  async addCampaign(campaign: Campaign): Promise<Campaign> {
    await delay(300);
    // Prevent duplicates
    if (!this.campaigns.find((c) => c.slug === campaign.slug)) {
      this.campaigns.push(campaign);
    }
    return campaign;
  }

  async deleteCampaign(slug: string): Promise<void> {
    await delay(300);
    this.campaigns = this.campaigns.filter((c) => c.slug !== slug);
  }

  // --- Local Storage History (24h retention) ---

  private addToLocalHistory(need: DisplayNeed) {
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

export const api = new MockApiService();
