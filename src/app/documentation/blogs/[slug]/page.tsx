import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { notFound } from "next/navigation";
import { getBlogPost, blogPosts } from "@/content/blogs";
import { StaticPageShell } from "@/components/landing/StaticPageShell";
import { Reveal } from "@/components/landing/Reveal";

type BlogPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogPosts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) {
    return { title: "Blog | Ficungini" };
  }

  return {
    title: `${post.title} | Ficungini`,
    description: post.excerpt,
  };
}

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  const post = getBlogPost(slug);

  if (!post) notFound();

  return (
    <StaticPageShell>
      <div className="mx-auto max-w-4xl px-6 pb-20 pt-20 sm:pt-28">
        <Reveal>
          <Link
            href="/documentation#blogs"
            className="inline-flex items-center gap-2 font-mono-code text-xs uppercase tracking-wider text-ink-500 transition-colors hover:text-pantone"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            All blogs
          </Link>
          <div className="mt-12 flex flex-wrap items-center gap-3 font-mono-code text-xs uppercase tracking-wider text-pantone">
            <span>{post.number}</span>
            <span aria-hidden className="text-ink-300">
              /
            </span>
            <span>{post.concept}</span>
          </div>
          <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-tight text-ink-900 font-sans-title sm:text-6xl">
            {post.title}
          </h1>
          <p className="mt-6 max-w-2xl text-xl leading-relaxed text-ink-600">{post.excerpt}</p>
          <div className="mt-8 flex flex-wrap gap-x-5 gap-y-2 font-mono-code text-xs uppercase tracking-wider text-ink-500">
            <span>{post.publishedAt}</span>
            <span>{post.readTime}</span>
          </div>
          <p className="mt-5 max-w-2xl text-sm leading-relaxed text-ink-500">
            Researched and written by Ficungini AI agents without human intervention.
          </p>
        </Reveal>

        <div className="mt-16 space-y-14">
          {post.sections.map((section, index) => (
            <Reveal key={section.heading} delayMs={index * 50}>
              <section>
                {section.heading && <h2 className="max-w-2xl text-2xl font-bold text-ink-900 font-sans-title sm:text-3xl">
                  {section.heading}
                </h2>}
                <div className="mt-5 max-w-2xl space-y-5 text-lg leading-relaxed text-ink-600">
                  {section.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
                {section.bullets && (
                  <ul className="mt-6 max-w-2xl space-y-3 border-l-2 border-pantone-300 pl-5 text-base leading-relaxed text-ink-700">
                    {section.bullets.map((bullet) => (
                      <li key={bullet}>{bullet}</li>
                    ))}
                  </ul>
                )}
              </section>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-16 max-w-2xl border-y border-ink-200 py-8 text-xl font-medium leading-relaxed text-ink-900">
            {post.closing}
          </p>
        </Reveal>

        {post.sources.length > 0 && <Reveal>
          <section className="mt-16 max-w-2xl border-t border-ink-200 pt-8">
            <p className="font-mono-code text-xs uppercase tracking-wider text-pantone">Research notes</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              Market references below reflect public product pages reviewed for this article. Product capabilities and
              availability can change; visit each source for the current detail.
            </p>
            <ul className="mt-5 space-y-3">
              {post.sources.map((source) => (
                <li key={source.href}>
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-start gap-2 text-sm text-ink-700 transition-colors hover:text-pantone"
                  >
                    <span>
                      <span className="font-medium">{source.label}</span>
                      <span className="ml-2 text-ink-500">{source.note}</span>
                    </span>
                    <ArrowUpRight className="mt-0.5 h-3.5 w-3.5 shrink-0 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>}
      </div>
    </StaticPageShell>
  );
}
