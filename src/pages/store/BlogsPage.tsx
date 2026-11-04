

import { BlogCard } from '../../components/molecules/BlogCard/BlogCard';
import { blogPosts } from '../../data/blogPosts';

export function BlogsPage() {
  return (
    <main className="container py-5">
      <header className="blogs-heading">
        <span className="archive-eyebrow">ARCHIVE[src] Journal</span>

        <h1>Noticias importantes</h1>

        <p>
          Historias de archivo, preservación técnica de calzado y cultura
          urbana contemporánea.
        </p>
      </header>

      <section className="blogs-list" aria-label="Artículos publicados">
        {blogPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </section>
    </main>
  );
}