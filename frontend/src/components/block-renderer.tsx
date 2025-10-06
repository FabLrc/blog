import Image from "next/image";
import { getStrapiImageUrl } from "@/lib/strapi";
import { Card, CardContent } from "@/components/ui/card";

interface Block {
  __component: string;
  id: number;
}

interface RichTextBlock extends Block {
  __component: "shared.rich-text";
  body: string;
}

interface QuoteBlock extends Block {
  __component: "shared.quote";
  title: string;
  body: string;
}

interface MediaBlock extends Block {
  __component: "shared.media";
  file?: {
    url: string;
    alternativeText?: string;
    caption?: string;
  };
}

interface SliderBlock extends Block {
  __component: "shared.slider";
  files?: Array<{
    url: string;
    alternativeText?: string;
    caption?: string;
  }>;
}

export type BlockType = RichTextBlock | QuoteBlock | MediaBlock | SliderBlock;

interface BlockRendererProps {
  blocks: unknown[];
}

function RichText({ body }: { body: string }) {
  return (
    <div
      className="prose prose-lg max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-primary"
      dangerouslySetInnerHTML={{
        __html: body.replace(/\n/g, "<br />").replace(/## /g, "<h2>").replace(/<\/h2><br \/>/g, "</h2>"),
      }}
    />
  );
}

function Quote({ title, body }: { title: string; body: string }) {
  return (
    <Card className="border-l-4 border-primary bg-muted/50 my-8">
      <CardContent className="pt-6">
        <blockquote className="space-y-2">
          <p className="text-lg italic text-foreground">&ldquo;{body}&rdquo;</p>
          {title && (
            <footer className="text-sm text-muted-foreground">
              — <cite>{title}</cite>
            </footer>
          )}
        </blockquote>
      </CardContent>
    </Card>
  );
}

function Media({ file }: { file?: MediaBlock["file"] }) {
  if (!file) return null;

  const imageUrl = getStrapiImageUrl(file.url);

  return (
    <figure className="my-8">
      <div className="relative w-full h-96 rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt={file.alternativeText || "Article image"}
          fill
          className="object-cover"
        />
      </div>
      {file.caption && (
        <figcaption className="text-sm text-muted-foreground text-center mt-2">
          {file.caption}
        </figcaption>
      )}
    </figure>
  );
}

function Slider({ files }: { files?: SliderBlock["files"] }) {
  if (!files || files.length === 0) return null;

  return (
    <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-4">
      {files.map((file, index) => {
        const imageUrl = getStrapiImageUrl(file.url);
        return (
          <div key={index} className="relative h-64 rounded-lg overflow-hidden">
            <Image
              src={imageUrl}
              alt={file.alternativeText || `Slide ${index + 1}`}
              fill
              className="object-cover"
            />
          </div>
        );
      })}
    </div>
  );
}

export default function BlockRenderer({ blocks }: BlockRendererProps) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {blocks.map((blockData) => {
        const block = blockData as BlockType;
        switch (block.__component) {
          case "shared.rich-text":
            return <RichText key={block.id} body={block.body} />;
          case "shared.quote":
            return <Quote key={block.id} title={block.title} body={block.body} />;
          case "shared.media":
            return <Media key={block.id} file={block.file} />;
          case "shared.slider":
            return <Slider key={block.id} files={block.files} />;
          default:
            return null;
        }
      })}
    </div>
  );
}
