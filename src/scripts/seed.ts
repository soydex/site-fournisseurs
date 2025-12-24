const API_URL = "http://localhost:3001/api/besoins";

// Sample Data Pools
const ADVERTISERS = [
  "Coca Cola",
  "Nike",
  "Apple",
  "Samsung",
  "L'Oréal",
  "Renault",
  "Peugeot",
  "Amazon",
  "Google",
  "Microsoft",
  "Tesla",
  "Adidas",
  "Puma",
  "Decathlon",
];

const PROVIDERS = [
  "JCDecaux",
  "Clear Channel",
  "Exterion Media",
  "Local Print",
  "Giraudy",
  "Mediakiosk",
  "Insert",
  "Phenix",
];

const FORMATS = [
  { format: "120x176 (Abribus)", visible: "110x170" },
  { format: "320x240 (4x3)", visible: "320x240" },
  { format: "400x300 (Laguiole)", visible: "400x300" },
  { format: "200x150 (Kiosque)", visible: "190x140" },
  { format: "800x600 (Bâche)", visible: "800x600" },
];

const CITIES = [
  "Paris",
  "Lyon",
  "Marseille",
  "Bordeaux",
  "Lille",
  "Toulouse",
  "Nice",
  "Nantes",
  "Strasbourg",
  "Montpellier",
];

const STREETS = [
  "Rue de la République",
  "Avenue des Champs",
  "Boulevard Haussmann",
  "Place Bellecour",
  "Quai des Chartrons",
  "Grand Rue",
  "Avenue Jean Jaurès",
];

const COMMENTS = [
  "Livraison urgente avant vendredi.",
  "Attention au code couleur spécifique.",
  "Campagne de lancement produit.",
  "Réassort pour le salon.",
  "Vérifier les épreuves avant impression.",
  "",
  "",
  "", // Empty comments common
];

const CONTEXTS = ["salonhabitat", "salonmoto", "foirevins", ""];

// Random Helper
const random = <T>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomNumber = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

async function seed() {
  console.log("🚀 Starting data seeding to", API_URL);

  const COUNT = 20; // Number of items to add

  let successCount = 0;
  let errorCount = 0;

  for (let i = 0; i < COUNT; i++) {
    const formatObj = random(FORMATS);
    const city = random(CITIES);

    // Construct the payload matching BackendBesoin (minus _id, dateCreation)
    const payload = {
      nomAnnonceur: random(ADVERTISERS),
      nomPrestataire: random(PROVIDERS),
      format: formatObj.format,
      formatVisible: formatObj.visible,
      nombreAffiches: randomNumber(10, 500),
      adresseLivraison: `${randomNumber(1, 150)} ${random(STREETS)}, ${randomNumber(10000, 95000)} ${city}`,
      commentaires: random(COMMENTS),
      context: random(CONTEXTS),
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        successCount++;
        process.stdout.write("."); // Progress dot
      } else {
        errorCount++;
        process.stdout.write("x");
      }
    } catch (err) {
      errorCount++;
      process.stdout.write("E");
      console.error("\nError posting:", err);
    }
  }

  console.log("\n\n✅ Seeding complete!");
  console.log(`Success: ${successCount}`);
  console.log(`Errors:  ${errorCount}`);
}

seed();
