

import { Link } from 'react-router-dom';

const pillars = [
  {
    number: '01',
    title: 'Selección estricta',
    description:
      'Cada par de zapatillas e indumentaria es seleccionado a mano considerando su relevancia cultural, estado de conservación y longevidad técnica.',
  },
  {
    number: '02',
    title: 'Autenticación manual',
    description:
      'Revisamos costuras, densidad textil, códigos de caja, tipografías de etiquetas y procedencia para mantener un estándar de originalidad.',
  },
  {
    number: '03',
    title: 'Showroom físico',
    description:
      'Contamos con un punto de inspección y retiro en Providencia para que la comunidad pueda revisar materiales y tallajes antes de comprar.',
  },
];

export function AboutPage() {
  return (
    <div className="about-page">
      <div className="container">
        <section className="about-page__intro">
          <span className="about-page__eyebrow">Manifiesto de marca</span>

          <h1>VOLVER A LA FUENTE DEL STREETWEAR</h1>

          <p>
            ARCHIVE[src] nace como una respuesta a la producción efímera.
            Curamos, documentamos y distribuimos piezas que definieron épocas:
            siluetas descatalogadas, indumentaria utilitaria de archivo y
            artefactos de colección seleccionados uno a uno desde su fuente
            de origen.
          </p>
        </section>

        <section className="about-page__concept">
          <div className="about-page__concept-copy">
            <span className="about-page__eyebrow">Nuestra identidad</span>

            <h2>EL CONCEPTO ARCHIVE</h2>

            <p>
              Inspirados en espacios como Dover Street Market y en la cultura
              del resell, operamos bajo la premisa de que las prendas
              históricas tienen un valor patrimonial. No seguimos calendarios
              comerciales convencionales: trabajamos mediante lanzamientos
              seleccionados donde cada zapatilla y chaqueta cuenta una historia
              de diseño industrial, subcultura musical o colaboraciones de
              culto.
            </p>

            <p>
              Creemos en la durabilidad material, en las siluetas pesadas y en
              democratizar el acceso a piezas que antes circulaban en mercados
              especializados de Tokio, Londres o Nueva York.
            </p>

            <blockquote className="about-page__statement">
              No vendemos tendencias de temporada. Preservamos las piezas que
              construyeron la cultura urbana contemporánea.
            </blockquote>
          </div>

          <figure className="about-page__image">
            <img
              src="https://jingdaily.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Ff8lauh0h%2Fproduction%2Fc9d150ce0d3cd5c772e8182fd97209f0f5d409a8-2490x1346.jpg%3Fq%3D90%26fit%3Dmax%26auto%3Dformat&w=1080&q=90"
              alt="Selección de zapatillas y cultura streetwear"
              loading="lazy"
            />
            <figcaption>Archivo, cultura y diseño.</figcaption>
          </figure>
        </section>

        <section className="about-page__pillars">
          <div className="about-page__section-heading">
            <span className="about-page__eyebrow">Nuestro estándar</span>
            <h2>PILARES DE AUTENTICIDAD</h2>
            <p>El estándar con el que catalogamos cada pieza.</p>
          </div>

          <div className="row g-4">
            {pillars.map((pillar) => (
              <div className="col-12 col-md-4" key={pillar.number}>
                <article className="about-page__pillar">
                  <span className="about-page__pillar-number">
                    {pillar.number}
                  </span>

                  <h3>{pillar.title}</h3>

                  <p>{pillar.description}</p>
                </article>
              </div>
            ))}
          </div>
        </section>

        <section className="about-page__closing">
          <div>
            <span className="about-page__eyebrow">Explora el archivo</span>
            <h2>ENCUENTRA TU PRÓXIMA PIEZA.</h2>
          </div>

          <Link
            className="about-page__button"
            to="/productos"
          >
            Explorar productos <span aria-hidden="true">→</span>
          </Link>
        </section>
      </div>
    </div>
  );
}
