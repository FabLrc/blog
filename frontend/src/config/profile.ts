// Configuration du profil personnel pour le blog

export const profileConfig = {
  // Informations personnelles
  name: "Fabien Laurence",
  title: "Développeur Full-Stack",
  avatar: "/profile.jpg", // Placez votre image de profil dans /public/profile.jpg
  
  // Biographie
  bio: {
    intro: "Je suis un développeur web passionné par la création d'applications modernes et intuitives. Ce blog est mon espace personnel où je partage mes découvertes, mes projets et mes réflexions sur le monde du développement.",
    journey: "J'ai commencé à coder il y a plusieurs années et depuis, je n'ai jamais cessé d'apprendre. Chaque projet est une nouvelle opportunité de découvrir de nouvelles technologies et de relever de nouveaux défis.",
    personal: "Quand je ne suis pas devant mon écran, vous me trouverez probablement en train de lire, de découvrir de nouveaux cafés ou de discuter tech avec d'autres passionnés.",
  },
  
  // Liens sociaux
  social: {
    github: "https://github.com/FabLrc",
    linkedin: "https://www.linkedin.com/in/flaurence/",
    x: "https://x.com/FabienLrc", // Anciennement Twitter
    email: "contact@fabienlaurence.com", // Utilisé pour l'obfuscation dans la page contact
  },
  
  // Compétences
  skills: [
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Tailwind CSS",
    "Strapi",
    "PostgreSQL",
    "Git",
  ],
} as const;

// Type pour l'autocomplétion
export type ProfileConfig = typeof profileConfig;
