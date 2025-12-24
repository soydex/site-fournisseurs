import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Tableau de Bord",
    description: "Gestion des campagnes, des demandes et monitoring en temps réel.",
};

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
