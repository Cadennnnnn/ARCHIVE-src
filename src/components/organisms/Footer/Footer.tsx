
// Archivo: src/components/organisms/Footer/Footer.tsx
import { Link } from 'react-router-dom';

const categories = [
  { label: 'Sneakers', path: '/productos?categoria=Sneakers' },
  { label: 'Apparel', path: '/productos?categoria=Apparel' },
  { label: 'Goods', path: '/productos?categoria=Goods' },
];

const information = [
  { label: 'Sobre nosotros', path: '/nosotros' },
  { label: 'Contacto y Ayuda', path: '/contacto' },
  { label: 'Panel Administrativo', path: '/admin' },
];

const socialNetworks = [
  { label: 'Instagram', url: 'https://www.instagram.com/' },
  { label: 'TikTok', url: 'https://www.tiktok.com/' },
  { label: 'X (Twitter)', url: 'https://x.com/' },
];

export function Footer() {
  return (
    <footer className="archive-footer">
      <div className="container">
        <div className="row archive-footer__content">
          <div className="col-12 col-md-4 archive-footer__brand-column">
            <Link
              to="/"
              className="archive-footer__brand"
              aria-label="ARCHIVE inicio"
            >
              <span className="archive-footer__brand-main">A</span>
              <span className="archive-footer__brand-source">[src]</span>
            </Link>
          </div>

          <div className="col-6 col-md-2 archive-footer__column">
            <h2>Categorías</h2>
            <span className="archive-footer__divider" />

            <ul>
              {categories.map((category) => (
                <li key={category.label}>
                  <Link to={category.path}>{category.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-6 col-md-3 archive-footer__column">
            <h2>Información</h2>
            <span className="archive-footer__divider" />

            <ul>
              {information.map((item) => (
                <li key={item.label}>
                  <Link to={item.path}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-12 col-md-3 archive-footer__column archive-footer__social">
            <h2>Síguenos</h2>
            <span className="archive-footer__divider" />

            <ul>
              {socialNetworks.map((network) => (
                <li key={network.label}>
                  <a
                    href={network.url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {network.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="archive-footer__bottom">
          <p className="archive-footer__contact">
            <strong>Dirección:</strong> Av. Providencia 1234, Local 10
            <span className="archive-footer__separator">|</span>
            <strong>Teléfono:</strong> +56 9 1234 5678
          </p>

          <p className="archive-footer__copyright">
            © {new Date().getFullYear()} ARCHIVE[src] - Todos los derechos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
