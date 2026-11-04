
import { act, useState } from 'react';
import { createRoot } from 'react-dom/client';
import type { Root } from 'react-dom/client';
import {
  MemoryRouter,
  Route,
  Routes,
} from 'react-router-dom';
import { fireEvent } from '@testing-library/react';

import { Button } from '../../src/components/atoms/Button/Button';
import { FormInput } from '../../src/components/atoms/FormInput/FormInput';
import { ProductCard } from '../../src/components/molecules/ProductCard/ProductCard';
import { BlogCard } from '../../src/components/molecules/BlogCard/BlogCard';

import { BlogsPage } from '../../src/pages/store/BlogsPage';
import { BlogDetailPage } from '../../src/pages/store/BlogDetailPage';
import { AboutPage } from '../../src/pages/store/AboutPage';

import { blogPosts } from '../../src/data/blogPosts';

import type { Product } from '../../src/types/product';

(globalThis as typeof globalThis & {
  IS_REACT_ACT_ENVIRONMENT: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;

describe('Pruebas de componentes React', () => {
  let container: HTMLDivElement;
  let root: Root;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(() => {
    act(() => {
      root.unmount();
    });

    container.remove();
  });

  describe('Prueba de Render - ProductCard', () => {
    it('debe renderizar correctamente los datos del producto', () => {
      const product: Product = {
        id: 1,
        codigo: 'ARC001',
        nombre: 'SALOMON XT-6',
        categoria: 'Sneakers',
        precio: 151992,
        precioOriginal: 189990,
        imagen: '/img/salomon-xt6.jpg',
        descripcion: 'Zapatillas deportivas.',
        tallas: ['40', '41', '42'],
        stock: 5,
      };

      act(() => {
        root.render(
          <MemoryRouter>
            <ProductCard product={product} />
          </MemoryRouter>,
        );
      });

      const productName = container.querySelector('h3');
      const category = container.querySelector('.product-card__category');
      const image = container.querySelector('img');
      const saleBadge = container.querySelector('.product-card__badge');

      expect(productName?.textContent).toContain('SALOMON XT-6');
      expect(category?.textContent).toBe('Sneakers');
      expect(image?.getAttribute('alt')).toBe('SALOMON XT-6');
      expect(saleBadge?.textContent).toBe('-20%');
    });
  });

  describe('Prueba de Props - Button', () => {
    it('debe recibir y representar correctamente sus propiedades', () => {
      act(() => {
        root.render(
          <Button variant="outline">Comprar producto</Button>,
        );
      });

      const button = container.querySelector('button');

      expect(button).not.toBeNull();
      expect(button?.textContent).toBe('Comprar producto');
      expect(button?.className).toContain('archive-button--outline');
    });
  });

  describe('Prueba de State - FormInput', () => {
    function ControlledForm() {
      const [name, setName] = useState('');

      return (
        <div>
          <FormInput
            aria-label="Nombre"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />

          <p data-testid="current-name">{name}</p>
        </div>
      );
    }

    it('debe actualizar el estado cuando el usuario escribe', () => {
      act(() => {
        root.render(<ControlledForm />);
      });

      const input = container.querySelector('input') as HTMLInputElement;
      const currentName = container.querySelector(
        '[data-testid="current-name"]',
      );

      expect(input.value).toBe('');
      expect(currentName?.textContent).toBe('');

      act(() => {
        fireEvent.change(input, {
          target: { value: 'ARCHIVE' },
        });
      });

      expect(input.value).toBe('ARCHIVE');
      expect(currentName?.textContent).toBe('ARCHIVE');
    });
  });

  describe('Prueba de Evento - Button', () => {
    it('debe ejecutar onClick cuando el usuario presiona el botón', () => {
      const onClickSpy = jasmine.createSpy('onClick');

      act(() => {
        root.render(
          <Button onClick={onClickSpy}>Añadir al carro</Button>,
        );
      });

      const button = container.querySelector('button') as HTMLButtonElement;

      act(() => {
        button.dispatchEvent(
          new MouseEvent('click', { bubbles: true }),
        );
      });

      expect(onClickSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe('Pruebas de BlogCard', () => {
    it('debe mostrar los datos del artículo recibidos por props', () => {
      const post = blogPosts[0];

      act(() => {
        root.render(
          <MemoryRouter>
            <BlogCard post={post} />
          </MemoryRouter>,
        );
      });

      expect(container.textContent).toContain(post.category);
      expect(container.textContent).toContain(post.label);
      expect(container.textContent).toContain(post.title);
      expect(container.textContent).toContain(post.excerpt);

      const image = container.querySelector('img');

      expect(image?.getAttribute('src')).toBe(post.image);
      expect(image?.getAttribute('alt')).toBe(post.imageAlt);
    });

    it('debe dirigir los enlaces al detalle del artículo correspondiente', () => {
      const post = blogPosts[0];

      act(() => {
        root.render(
          <MemoryRouter>
            <BlogCard post={post} />
          </MemoryRouter>,
        );
      });

      const links = container.querySelectorAll('a');

      expect(links.length).toBe(3);

      links.forEach((link) => {
        expect(link.getAttribute('href')).toBe(`/blogs/${post.slug}`);
      });
    });
  });

  describe('Pruebas de BlogsPage', () => {
    it('debe mostrar el encabezado y los artículos publicados', () => {
      act(() => {
        root.render(
          <MemoryRouter>
            <BlogsPage />
          </MemoryRouter>,
        );
      });

      expect(container.querySelector('h1')?.textContent).toBe(
        'Noticias importantes',
      );

      expect(container.querySelectorAll('.blog-card').length).toBe(
        blogPosts.length,
      );

      blogPosts.forEach((post) => {
        expect(container.textContent).toContain(post.title);
      });
    });
  });

  describe('Pruebas de BlogDetailPage', () => {
    it('debe mostrar el contenido del artículo seleccionado por su slug', () => {
      const post = blogPosts[0];

      act(() => {
        root.render(
          <MemoryRouter
            initialEntries={[`/blogs/${post.slug}`]}
          >
            <Routes>
              <Route
                path="/blogs/:slug"
                element={<BlogDetailPage />}
              />
            </Routes>
          </MemoryRouter>,
        );
      });

      expect(container.querySelector('h1')?.textContent).toBe(post.title);
      expect(container.textContent).toContain(post.category);
      expect(container.textContent).toContain(post.label);
      expect(container.textContent).toContain(post.content[0]);

      const image = container.querySelector('.blog-detail__image img');

      expect(image?.getAttribute('src')).toBe(post.image);
      expect(image?.getAttribute('alt')).toBe(post.imageAlt);
    });

    it('debe redirigir al listado cuando el slug no existe', () => {
      act(() => {
        root.render(
          <MemoryRouter
            initialEntries={['/blogs/articulo-inexistente']}
          >
            <Routes>
              <Route path="/blogs" element={<p>Listado de blogs</p>} />
              <Route
                path="/blogs/:slug"
                element={<BlogDetailPage />}
              />
            </Routes>
          </MemoryRouter>,
        );
      });

      expect(container.textContent).toContain('Listado de blogs');
      expect(container.querySelector('.blog-detail')).toBeNull();
    });
  });

  describe('Pruebas de AboutPage', () => {
    it('debe mostrar el manifiesto y los tres pilares de autenticidad', () => {
      act(() => {
        root.render(
          <MemoryRouter>
            <AboutPage />
          </MemoryRouter>,
        );
      });

      expect(container.textContent).toContain(
        'VOLVER A LA FUENTE DEL STREETWEAR',
      );

      expect(container.textContent).toContain('Selección estricta');
      expect(container.textContent).toContain('Autenticación manual');
      expect(container.textContent).toContain('Showroom físico');

      expect(
        container.querySelectorAll('.about-page__pillar').length,
      ).toBe(3);
    });

    it('debe incluir el enlace para explorar los productos', () => {
      act(() => {
        root.render(
          <MemoryRouter>
            <AboutPage />
          </MemoryRouter>,
        );
      });

      const productsLink = container.querySelector(
        '.about-page__button',
      );

      expect(productsLink?.getAttribute('href')).toBe('/productos');
      expect(productsLink?.textContent).toContain('Explorar productos');
    });
  });
});
