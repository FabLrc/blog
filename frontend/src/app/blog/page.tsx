import ArticleCard from "@/components/article-card";
import { getArticles } from "@/lib/strapi";

export default async function BlogPage() {
  const articles = await getArticles();
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez mes articles sur le développement web, les technologies
            modernes et les meilleures pratiques.
          </p>
        </div>

        {/* Articles Grid */}
        {articles.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Aucun article disponible pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <ArticleCard
                key={article.slug}
                slug={article.slug}
                title={article.title}
                excerpt={article.description}
                coverImage={article.cover?.url || ""}
                category={article.category?.name || "Non catégorisé"}
                publishedAt={article.publishedAt}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
