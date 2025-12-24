import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Connexion",
    description: "Portail d'administration pour la gestion des campagnes.",
};

export default function LoginLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
