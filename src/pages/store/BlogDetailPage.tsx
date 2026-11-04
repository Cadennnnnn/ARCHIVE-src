

import { Link, Navigate, useParams } from 'react-router-dom';
import { blogPosts } from '../../data/blogPosts';

export function BlogDetailPage() {
  const { slug } = useParams<{ slug: string }>();

  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    return <Navigate to="/blogs" replace />;
  }

  return (
    <main className="container py-5">
      <article className="blog-detail">
        <header className="blog-detail__header">
          <span className="blog-detail__label">{post.label}</span>

          <p className="blog-detail__category">{post.category}</p>

          <h1>{post.title}</h1>
        </header>

        <figure className="blog-detail__image">
          <img src={post.image} alt={post.imageAlt} />
        </figure>

        <div className="blog-detail__content">
          {post.content.map((paragraph, index) => (
            <p key={`${post.slug}-paragraph-${index}`}>
              {paragraph}
            </p>
          ))}
        </div>

        <div className="blog-detail__footer">
          <Link to="/blogs" className="blog-detail__back">
            <span aria-hidden="true">←</span> Volver a Blogs
          </Link>
        </div>
      </article>
    </main>
  );
}