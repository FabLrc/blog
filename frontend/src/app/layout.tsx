import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import { ThemeProvider } from "@/components/theme-provider";
import { getSiteConfig } from "@/lib/strapi";
import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

// Configuration de la police DM Sans avec Next.js Font Optimization
const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const siteConfig = await getSiteConfig();
  
  return {
    title: {
      default: siteConfig.siteName,
      template: `%s | ${siteConfig.siteName}`,
    },
    description: siteConfig.siteDescription || siteConfig.metaDescription,
    keywords: siteConfig.metaKeywords?.split(',').map((k: string) => k.trim()),
    authors: [{ name: siteConfig.profileName }],
    metadataBase: new URL(siteConfig.siteUrl || 'http://localhost:3000'),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteConfig = await getSiteConfig();
  return (
    <html lang="fr" suppressHydrationWarning className={dmSans.variable}>
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${siteConfig.siteName} - Flux RSS`}
          href="/rss.xml"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="flex flex-col min-h-screen font-sans">
        <ThemeProvider>
          <Navbar siteConfig={siteConfig} />
          <main className="flex-1">{children}</main>
          <Footer siteConfig={siteConfig} />
        </ThemeProvider>
      </body>
    </html>
  );
}
