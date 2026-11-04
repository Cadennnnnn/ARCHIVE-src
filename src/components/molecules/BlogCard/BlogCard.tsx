
import { Link } from 'react-router-dom';
import type { BlogPost } from '../../../types/blog';

interface BlogCardProps {
  post: BlogPost;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="blog-card">
      <Link
        to={`/blogs/${post.slug}`}
        className="blog-card__image"
        aria-label={`Leer artículo: ${post.title}`}
      >
        <img
          src={post.image}
          alt={post.imageAlt}
          loading="lazy"
        />
      </Link>

      <div className="blog-card__content">
        <span className="blog-card__category">{post.category}</span>

        <p className="blog-card__label">{post.label}</p>

        <h2 className="blog-card__title">
          <Link to={`/blogs/${post.slug}`}>
            {post.title}
          </Link>
        </h2>

        <p className="blog-card__excerpt">{post.excerpt}</p>

        <Link
          to={`/blogs/${post.slug}`}
          className="blog-card__link"
        >
          Ver caso completo <span aria-hidden="true">→</span>
        </Link>
      </div>
    </article>
  );
}