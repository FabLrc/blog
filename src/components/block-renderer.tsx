import parse, { DOMNode, Element, Text } from 'html-react-parser';
import Image from 'next/image';
import { CodeBlock } from "@/components/code-block";
import { HeadingWithAnchor } from "@/components/heading-with-anchor";

interface BlockRendererProps {
  content: string;
}

/**
 * Extrait récursivement le texte brut d'un nœud DOM et de ses enfants
 * Ignore les balises HTML et ne garde que le contenu textuel
 */
function extractTextContent(node: DOMNode): string {
  // Nœud texte direct
  if (node instanceof Text) {
    return node.data;
  }
  
  // Élément avec enfants
  if (node instanceof Element && node.children) {
    return node.children.map(child => extractTextContent(child as DOMNode)).join('');
  }
  
  // Fallback pour les autres types de nœuds texte
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ((node as any)?.data) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (node as any).data;
  }
  
  return '';
}

/**
 * Décode les entités HTML (WordPress encode souvent le code)
 */
function decodeHtmlEntities(text: string): string {
  const entities: Record<string, string> = {
    '&lt;': '<',
    '&gt;': '>',
    '&amp;': '&',
    '&quot;': '"',
    '&#039;': "'",
    '&apos;': "'",
    '&nbsp;': ' ',
    '&#91;': '[',
    '&#93;': ']',
    '&rsquo;': "'",
    '&lsquo;': "'",
    '&rdquo;': '"',
    '&ldquo;': '"',
    '&ndash;': '–',
    '&mdash;': '—',
  };
  
  let decoded = text;
  for (const [entity, char] of Object.entries(entities)) {
    decoded = decoded.split(entity).join(char);
  }
  
  // Décoder les entités numériques (&#123;)
  decoded = decoded.replace(/&#(\d+);/g, (_, num) => String.fromCharCode(parseInt(num, 10)));
  
  return decoded;
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

        // Replace <pre><code> with CodeBlock (WordPress code blocks)
        if (domNode.name === 'pre' && domNode.attribs.class?.includes('wp-block-code')) {
          // WordPress Syntax Highlighter plugin uses data-shcb-language-slug
          const preAttribs = domNode.attribs;
          let language = 'text';
          
          // Check for SHCB plugin attributes on <pre>
          if (preAttribs['data-shcb-language-slug']) {
            language = preAttribs['data-shcb-language-slug'];
          }
          
          // Find the <code> element inside
          const codeNode = domNode.children.find(
            (child) => child instanceof Element && child.name === 'code'
          ) as Element | undefined;
          
          // Also check for <span> wrapper (SHCB wraps code in <span><code>)
          const spanNode = domNode.children.find(
            (child) => child instanceof Element && child.name === 'span'
          ) as Element | undefined;
          
          let targetNode: Element | undefined = codeNode;
          
          if (spanNode && !codeNode) {
            // Look for code inside span
            targetNode = spanNode.children.find(
              (child) => child instanceof Element && child.name === 'code'
            ) as Element | undefined;
          }
          
          if (targetNode) {
            // Check for language class on code element too
            const codeClassName = targetNode.attribs.class || '';
            if (!preAttribs['data-shcb-language-slug']) {
              const langMatch = codeClassName.match(/language-(\w+)/);
              if (langMatch) {
                language = langMatch[1];
              }
            }
            
            // Extract raw text content (removes all HTML tags like <span class="hljs-...">)
            let code = extractTextContent(targetNode);
            code = decodeHtmlEntities(code);
            code = code.replace(/\n$/, ''); // Remove trailing newline
            
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

        // Generic <pre><code> blocks (non-WordPress)
        if (domNode.name === 'pre' && !domNode.attribs.class?.includes('wp-block-code')) {
          const codeNode = domNode.children.find(
            (child) => child instanceof Element && child.name === 'code'
          ) as Element | undefined;

          if (codeNode) {
            const className = codeNode.attribs.class || '';
            const languageMatch = className.match(/language-(\w+)/);
            const language = languageMatch ? languageMatch[1] : 'text';
            
            let code = extractTextContent(codeNode);
            code = decodeHtmlEntities(code);
            code = code.replace(/\n$/, '');

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

        // Replace <a> to open in new tab
        if (domNode.name === 'a') {
          const { href, ...otherAttribs } = domNode.attribs;
          
          // Only modify external links (not internal anchors or relative links)
          if (href && (href.startsWith('http://') || href.startsWith('https://'))) {
            return (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                {...otherAttribs}
              >
                {domNode.children && parse(domNode.children.map(child => {
                  if (child instanceof Text) return child.data;
                  if (child instanceof Element) return child;
                  return '';
                }).join(''))}
              </a>
            );
          }
        }

        // Replace headings with HeadingWithAnchor
        if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(domNode.name)) {
          const text = extractTextContent(domNode);
          const level = parseInt(domNode.name.replace('h', ''), 10) as 1 | 2 | 3 | 4 | 5 | 6;
          const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
          
          // Margins adapted to heading level for better visual rhythm
          const marginClasses = {
            1: "mt-12 mb-6",
            2: "mt-12 mb-5",
            3: "mt-10 mb-4",
            4: "mt-8 mb-3",
            5: "mt-6 mb-2",
            6: "mt-6 mb-2",
          };
          
          return (
            <HeadingWithAnchor level={level} id={id} className={marginClasses[level]}>
              {text}
            </HeadingWithAnchor>
          );
        }
      }
    },
  };

  return <div className="prose prose-neutral dark:prose-invert max-w-none">{parse(content, options)}</div>;
}
