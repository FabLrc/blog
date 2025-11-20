import { getAllPosts, getAllCategories } from "@/lib/wordpress";
import { BlogList } from "@/components/blog-list";
import { Breadcrumb } from "@/components/breadcrumb";
import { Suspense } from "react";

export default async function BlogPage() {
  const [posts, categories] = await Promise.all([
    getAllPosts(100), // Fetch more posts for the list
    getAllCategories(),
  ]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb
          items={[{ label: "Blog" }]}
          className="mb-8"
        />

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Découvrez mes articles sur le développement web, les technologies
            modernes et les meilleures pratiques.
          </p>
        </div>

        {/* Articles with Filtering */}
        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground">
            Aucun article disponible pour le moment.
          </p>
        ) : (
          <Suspense fallback={<div>Chargement...</div>}>
            <BlogList initialPosts={posts} categories={categories} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
