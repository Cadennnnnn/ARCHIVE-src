
import type { BlogPost } from '../types/blog';

const hydrationImage =
  'https://i.redd.it/i-bought-some-retro-jordan-3s-they-are-dry-rotted-to-ruin-v0-py552pcoc5sa1.jpg?width=4032&format=pjpg&auto=webp&s=109f76efce4b5cc31a0432cfd5f91ada4863ea99';

const gorpcoreImage =
  'https://cdn.evrysz.net/assets/mag/blog/Gorpcore-Styles-Salomon-XT-6-GTX-Hoka-Project-Transport-On-Feet-TNF-x-Undercover-Vectiv-Sky-Outfit-Titel.jpg?width=880&quality=80';

export const blogPosts: BlogPost[] = [
  {
    slug: 'hidrolisis-zapatillas-vintage',
    category: 'Preservación & Archivo',
    label: 'Caso Curioso #1',
    title:
      'Hidrólisis en Zapatillas Vintage: El Fenómeno Químico del Coleccionismo',
    excerpt:
      '¿Por qué la suela de poliuretano de las zapatillas vintage se desintegra con los años y cómo prevenir el temido fenómeno de la hidrólisis mediante almacenamiento profesional?',
    image: hydrationImage,
    imageAlt: 'Zapatillas vintage con deterioro en la suela',
    content: [
      'La hidrólisis es una reacción química en la que las moléculas de agua rompen los enlaces de los polímeros de poliuretano (PU) comúnmente utilizados en entresuelas de calzado deportivo. Contrario a la creencia popular de mantener las zapatillas guardadas en cajas herméticas sin uso, la falta de compresión mecánica acelera la acumulación de humedad interna. El uso periódico disipa las microgotas atrapadas, prolongando la vida útil del producto de archivo.',
    ],
  },
  {
    slug: 'gorpcore-funcionalidad-trail-running',
    category: 'Diseño & Tendencia',
    label: 'Caso Curioso #2',
    title: 'Gorpcore y Funcionalidad: La Mutación del Trail Running',
    excerpt:
      'El ascenso del calzado de trail running en las pasarelas de Milán y Tokio: radiografía técnica al éxito global de siluetas utilitarias como la Salomon XT-6.',
    image: gorpcoreImage,
    imageAlt: 'Estilo Gorpcore con zapatillas Salomon XT-6',
    content: [
      'El término "Gorpcore" define la convergencia entre indumentaria de montaña de alto rendimiento y la moda callejera metropolitana. Diseñadas originalmente en 2013 para atletas de ultramaratón por los Alpes, siluetas como la Salomon XT-6 saltaron a las pasarelas parisinas gracias a su estética técnica, su membrana Gore-Tex y su chasis ACS estabilizador.',
    ],
  },
];