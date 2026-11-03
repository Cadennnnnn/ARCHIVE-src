
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { products } from '../../data/products';
import { ProductCard } from '../../components/molecules/ProductCard/ProductCard';

interface HeroSlide {
  label: string;
  title: string;
  text: string;
  action: string;
  image: string;
  imageAlt: string;
  variant: 'primary' | 'outline';
}

const slides: HeroSlide[] = [
  {
    label: 'Lanzamiento',
    title: 'ARCHIVE[src]',
    text: 'Volver a la fuente de la cultura. Un archivo seleccionado con tranquilidad: zapatillas, prendas y accesorios esenciales directo desde su [source] original.',
    action: 'Ver productos',
    image: '/img/hero.image.jpg',
    imageAlt: 'Colección de zapatillas y prendas ARCHIVE',
    variant: 'primary',
  },
  {
    label: 'Indumentaria',
    title: 'NUEVA ERA',
    text: 'Equipamiento técnico, siluetas utilitarias y cortes pesados diseñados bajo estándares de conservación textil.',
    action: 'Explorar ropa',
    image: 'https://cdn.shopify.com/s/files/1/0271/9658/8125/files/gorpcore-fashion.jpg?v=1693332721',
    imageAlt: 'Indumentaria técnica y estilo gorpcore',
    variant: 'outline',
  },
  {
    label: 'Accesorios',
    title: 'ESSENTIAL GOODS',
    text: 'Detalles que marcan la diferencia en tu rotación diaria: gorros, bolsos utilitarios y piezas limitadas.',
    action: 'Ver accesorios',
    image: 'https://moredrops.cl/medias/desktop-drops.webp?context=bWFzdGVyfGltYWdlc3wzNjc3MjZ8aW1hZ2Uvd2VicHxhR0kzTDJneFppOHhNREUzTWpRME56TTVNVGMzTkM5a1pYTnJkRzl3TFdSeWIzQnpMbmRsWW5BfGZkNGVlYmNmNzVjMTFlNTdiODhlNDUxMGY5YzEyNjJkMWUxNzBlNzY4ZTIxNDMwOGQ5NmFlN2IxMjQzZTFmMzY',
    imageAlt: 'Selección de accesorios y productos streetwear',
    variant: 'primary',
  },
  {
    label: 'Bóveda',
    title: 'GRAILS DEL ARCHIVO',
    text: 'Siluetas históricas verificadas manualmente una a una. Revisa nuestra selección exclusiva de calzado.',
    action: 'Explorar zapatillas',
    image: 'https://hips.hearstapps.com/hmg-prod/images/travis-scott-jordan-1-low-1670838159.jpg',
    imageAlt: 'Selección de zapatillas de colección',
    variant: 'outline',
  },
];

export function HomePage() {
  const [activeSlide, setActiveSlide] = useState(0);
  const slide = slides[activeSlide];

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  const showSlide = (index: number) => {
    setActiveSlide(index);
  };

  return (
    <div className="container py-4 py-lg-5">
      <section className="archive-hero" aria-roledescription="carrusel">
        <div className="archive-hero__copy" key={slide.title}>
          <span className="archive-eyebrow">{slide.label}</span>
          <h1>{slide.title}</h1>
          <p>{slide.text}</p>

          <Link
            className={`archive-button archive-button--${slide.variant}`}
            to="/productos"
          >
            {slide.action} →
          </Link>
        </div>

        <div className="archive-hero__visual" key={slide.image}>
          <img
            src={slide.image}
            alt={slide.imageAlt}
            onError={(event) => {
              event.currentTarget.style.visibility = 'hidden';
            }}
          />
        </div>

        <div className="archive-hero__controls" aria-label="Controles del carrusel">
          {slides.map((item, index) => (
            <button
              key={item.title}
              type="button"
              aria-label={`Mostrar diapositiva ${index + 1}`}
              aria-pressed={activeSlide === index}
              className={activeSlide === index ? 'active' : ''}
              onClick={() => showSlide(index)}
            />
          ))}
        </div>
      </section>

      <section className="archive-section">
        <div className="archive-section__heading">
          <div>
            <span className="archive-eyebrow">Selección ARCHIVE</span>
            <h2>Lanzamientos recientes</h2>
          </div>
          <Link to="/productos">Ver todo →</Link>
        </div>

        <div className="row g-4">
          {products.slice(0, 4).map((product) => (
            <div className="col-12 col-sm-6 col-lg-3" key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      <section className="archive-newsletter">
        <div>
          <span className="archive-eyebrow">Stay in touch</span>
          <h2>Únete al archivo.</h2>
          <p>Recibe acceso prioritario a los próximos drops y noticias de la tienda.</p>
        </div>

        <form
          onSubmit={(event) => {
            event.preventDefault();
            window.alert('¡Gracias por suscribirte a ARCHIVE!');
            event.currentTarget.reset();
          }}
        >
          <label className="visually-hidden" htmlFor="newsletter-email">
            Correo electrónico
          </label>
          <input
            id="newsletter-email"
            type="email"
            placeholder="Tu correo electrónico"
            required
          />
          <button className="archive-button archive-button--primary" type="submit">
            Suscribirme
          </button>
        </form>
      </section>
    </div>
  );
}
