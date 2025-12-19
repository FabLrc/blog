import Footer from "@/components/footer";
import Navbar from "@/components/navbar";
import SeasonalTheme from "@/components/seasonal-theme";
import { ThemeProvider } from "@/components/theme-provider";
import { getGeneralSettings } from "@/lib/wordpress";
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
  const siteConfig = await getGeneralSettings();
  
  return {
    title: {
      default: siteConfig?.title || "Mon Blog",
      template: `%s | ${siteConfig?.title || "Mon Blog"}`,
    },
    description: siteConfig?.description || "Blog personnel",
    metadataBase: new URL(siteConfig?.url || 'http://localhost:3000'),
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const siteConfig = await getGeneralSettings();
  return (
    <html lang="fr" suppressHydrationWarning className={dmSans.variable}>
      <head>
        <link
          rel="alternate"
          type="application/rss+xml"
          title={`${siteConfig?.title || "Mon Blog"} - Flux RSS`}
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
        {/* Skip Link for keyboard navigation accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary focus:text-primary-foreground focus:rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
        >
          Aller au contenu principal
        </a>
        <ThemeProvider>
          <SeasonalTheme />
          <Navbar siteConfig={siteConfig} />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer siteConfig={siteConfig} />
        </ThemeProvider>
      </body>
    </html>
  );
}
