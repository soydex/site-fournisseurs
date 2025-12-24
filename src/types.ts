export interface DisplayNeed {
  id: string;
  createdAt: string; // ISO String
  advertiser: string;
  provider: string; // "Vous" in the form
  format: string;
  visibleFormat: string;
  quantity: number;
  deliveryAddress: string;
  comments: string;
  context?: string; // Campaign slug (e.g., "salonhabitat")
}

export interface Campaign {
  slug: string;
  displayName: string;
}

export interface CampaignLinkConfig {
  context: string;
  displayName: string;
}

export const FORMAT_OPTIONS = [
  "120X176 (Abribus)",
  "400X300 (Affiche 4x3)",
  "275x68 (Flanc de bus)",
  "320X240 COLLE (Panneau collé)",
  "99X83 (Petit format)",
  "240X160 (Affiche moyenne)",
  "320X240 DEROULANT (Panneau déroulant)",
  "AUTRE FORMAT (Préciser en commentaire)",
];

export interface UserSession {
  token: string;
  expiresAt: number;
}
