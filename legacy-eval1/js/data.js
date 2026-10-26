const ARCHIVE_PRODUCTS = [
  {
    id: 1,
    codigo: "SNK-001",
    nombre: "NIKE AIR MAX 1/97 SW",
    categoria: "Zapatillas",
    precio: 169990,
    imagen: "https://images.stockx.com/images/Nike-Air-Max-1-97-Sean-Wotherspoon-NA-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1738193358",
    descripcion: "Diseño híbrido icónico creado por Sean Wotherspoon con capellada de corderoy multicolor sobre la amortiguación clásica Air Max 1.",
    tallas: ["US 8", "US 9", "US 10", "US 11"],
    stock: 8
  },
  {
    id: 2,
    codigo: "SNK-002",
    nombre: "SALOMON XT-6",
    categoria: "Zapatillas",
    precio: 189990,
    imagen: "https://cdn.dam.salomon.com/cbbc0a38-d9b4-4f98-83de-b2f301471c94/L47866100/PNG-2000px-max-72dpi.png?width=1200&fit=cover&optimize=medium&bg-color=f5f5f5&format=pjpg&auto=avif&canvas=116p%2C144p",
    descripcion: "Silueta de trail running técnico adaptada al streetwear con chasis ACS para máxima estabilidad y lazada rápida Quicklace.",
    tallas: ["US 8.5", "US 9.5", "US 10.5"],
    stock: 5
  },
  {
    id: 3,
    codigo: "APP-101",
    nombre: "FOG ESSENTIALS HOODIE",
    categoria: "Ropa",
    precio: 54990,
    imagen: "https://images.stockx.com/images/Fear-of-God-Essentials-Fleece-Hoodie-FW24-Black-Product.jpg?fit=fill&bg=FFFFFF&w=576&h=384&q=60&dpr=1&trim=color&updated_at=1761486481",
    descripcion: "Polerón con capucha de corte boxy oversize confeccionado en polar de algodón pesado con logotipo serigrafiado en el pecho y espalda.",
    tallas: ["S", "M", "L", "XL"],
    stock: 12
  },
  {
    id: 4,
    codigo: "ACC-201",
    nombre: "OFF-WHITE VIRGIL SUNGLASSES",
    categoria: "Accesorios",
    precio: 319990,
    imagen: "https://images.stockx.com/images/OFF-WHITE-Virgil-Sunglasses-Black-Dark-Grey-OERI126C99PLA0011307.jpg?fit=fill&bg=FFFFFF&w=576&h=384&q=60&dpr=1&trim=color&trimcolor=ffffff&updated_at=1748535346",
    descripcion: "Lentes de sol de diseño arquitectónico con armazón grueso de acetato italiano, cristales tintados y detalles metálicos con flechas de la marca.",
    tallas: ["Única"],
    stock: 15
  }, 
  {
    id: 5,
    codigo: "SNK-003",
    nombre: "ASICS GEL-NYC",
    categoria: "Zapatillas",
    precio: 199990,
    imagen: "https://imgs.search.brave.com/QEZIVZs4alOwLlzPk7_oSRJYMGdeUiPZITldPjsLPBo/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9tLm1l/ZGlhLWFtYXpvbi5j/b20vaW1hZ2VzL0kv/NjFGVWo1YVZ2Q0wu/anBn",
    descripcion: "Fusión retro running que combina elementos de la GEL-Nimbus 3 y MC-PLUS V con tecnología de amortiguación GEL visible en la mediasuela.",
    tallas: ["US 8.5", "US 9.5", "US 10"],
    stock: 4
  },
  {
    id: 6,
    codigo: "APP-102",
    nombre: "PALACE X NIKE SOLO SWOOSH TRACK JACKET",
    categoria: "ROPA",
    precio: 189990,
    imagen: "https://images.stockx.com/images/Palace-x-Nike-England-Solo-Swoosh-Track-Jacket-Pewter-Grey-Cool-Grey.jpg?fit=fill&bg=FFFFFF&w=576&h=384&q=60&dpr=1&trim=color&updated_at=1781209848",
    descripcion: "Fruto de la histórica colaboración entre Palace Skateboards y Nike en homenaje a la selección inglesa. Fabricada en nylon técnico de alta resistencia con forro interior transpirable, cremallera frontal completa y el distintivo Swoosh bordado en el pecho junto a la heráldica híbrida de la colección. Una pieza utilitaria de archivo indispensable para coleccionistas.",
    tallas: ["S", "M", "L", "XL"],
    stock: 16
  },
  {
    id: 7,
    codigo: "SNK-004",
    nombre: "ADIDAS JELLYFISH TRIPLE BLACK",
    categoria: "ZAPATILLAS",
    precio: 259990,
    imagen: "https://images.stockx.com/images/adidas-Adistar-Jellyfish-Pharrell-Williams-Triple-Black-Product.jpg?fit=fill&bg=FFFFFF&w=700&h=500&fm=webp&auto=compress&q=90&dpr=2&trim=color&updated_at=1788383767",
    descripcion: "Silueta envolvente moldeada en polímero flexible de una pieza con ventilación integrada.",
    tallas: ["US 8", "US 9", "US 10", "US 11"],
    stock: 8
  },
  {
  id: 8,
  codigo: "ACC-202",
  nombre: "OFF-WHITE x CHICAGO WHITE SOX CAP",
  categoria: "Accesorios",
  precio: 129990,
  imagen: "https://images.stockx.com/images/OFF-WHITE-x-MLB-Chicago-White-Sox-Cap-Black-White.jpg?fit=fill&bg=FFFFFF&w=576&h=384&q=57&dpr=2&trim=color&updated_at=1652436603",
  descripcion: "Pieza de archivo de la colaboración entre OFF-WHITE y la MLB. Confeccionada en sarga de algodón de alta densidad, con bordado frontal de los Chicago White Sox y detalles tipográficos industriales característicos de la marca.",
  tallas: ["Ajustable"],
  stock: 5
}
  

];

const CHILE_GEO = [
  {
    region: "Región Metropolitana de Santiago",
    comunas: ["Santiago", "Providencia", "Las Condes", "Maipú", "Ñuñoa", "Puente Alto"]
  },
  {
    region: "Región de Valparaíso",
    comunas: ["Valparaíso", "Viña del Mar", "Concón", "Quilpué", "Villa Alemana"]
  },
  {
    region: "Región del Biobío",
    comunas: ["Concepción", "Talcahuano", "San Pedro de la Paz", "Chiguayante"]
  },
  {
    region: "Región de la Araucanía",
    comunas: ["Temuco", "Padre Las Casas", "Villarrica", "Pucón"]
  }
];