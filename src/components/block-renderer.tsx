import parse, { DOMNode, Element } from 'html-react-parser';
import Image from 'next/image';
import { CodeBlock } from "@/components/code-block";
import { HeadingWithAnchor } from "@/components/heading-with-anchor";

interface BlockRendererProps {
  content: string;
}

export default function BlockRenderer({ content }: BlockRendererProps) {
  const options = {
    replace: (domNode: DOMNode) => {
      if (domNode instanceof Element && domNode.attribs) {
        // Replace <img> with Next.js Image
        if (domNode.name === 'img') {
          const { src, alt, width, height, class: className } = domNode.attribs;
          
          // If we have width and height, use them
          if (width && height) {
            return (
              <Image
                src={src}
                alt={alt || ''}
                width={parseInt(width, 10)}
                height={parseInt(height, 10)}
                className={`h-auto w-full rounded-lg ${className || ''}`}
              />
            );
          }
          
          // Otherwise fallback to standard img or fill (requires container)
          return (
            <img 
              src={src} 
              alt={alt || ''} 
              className={`h-auto w-full rounded-lg ${className || ''}`}
              loading="lazy"
            />
          );
        }

        // Replace <pre><code> with CodeBlock
        if (domNode.name === 'pre') {
          const codeNode = domNode.children.find(
            (child) => child instanceof Element && child.name === 'code'
          ) as Element | undefined;

          if (codeNode) {
            // Extract class for language (e.g., "language-js")
            const className = codeNode.attribs.class || '';
            const languageMatch = className.match(/language-(\w+)/);
            const language = languageMatch ? languageMatch[1] : 'text';
            
            // Get text content
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const code = (codeNode.children[0] as any)?.data || '';

            return (
              <div className="my-6">
                <CodeBlock
                  language={language}
                  code={code}
                  showLineNumbers={true}
                />
              </div>
            );
          }
        }

        // Replace headings with HeadingWithAnchor
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(domNode.name)) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const text = (domNode.children[0] as any)?.data || '';
          const level = parseInt(domNode.name.replace('h', ''), 10) as 1 | 2 | 3 | 4 | 5 | 6;
          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          
          return (
            <HeadingWithAnchor level={level} id={id} className="mt-8 mb-4 font-bold">
              {text}
            </HeadingWithAnchor>
          );
        }
      }
    },
  };

  return <div className="prose prose-neutral dark:prose-invert max-w-none">{parse(content, options)}</div>;
}
