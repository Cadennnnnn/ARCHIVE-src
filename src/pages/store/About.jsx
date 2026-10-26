const PILARES = [
  { n: "01", titulo: "Selección Estricta", texto: "Cada par de zapatillas e indumentaria es seleccionado a mano tras un exhaustivo filtro de relevancia cultural, estado de conservación y longevidad técnica." },
  { n: "02", titulo: "Autenticación Manual", texto: "Verificamos costuras, densidad textil, códigos de caja, tipografías de etiqueta interna y procedencia para garantizar un estándar de originalidad absoluto." },
  { n: "03", titulo: "Showroom Físico", texto: "Contamos con punto de inspección y retiro en Providencia para que la comunidad pueda experimentar los materiales y tallajes antes de concretar su compra." },
];

export default function About() {
  return (
    <main className="container my-5 flex-grow-1">
      <section className="border-bottom pb-4 mb-5">
        <span className="badge bg-dark rounded-0 text-uppercase px-3 py-2 mb-3 font-monospace">Manifiesto de Marca</span>
        <h1 className="display-4 fw-bolder mb-3" style={{ letterSpacing: "-0.03em" }}>VOLVER A LA FUENTE DEL STREETWEAR</h1>
        <p className="lead text-muted col-lg-9 ps-0">
          ARCHIVE[src] nace como una respuesta a la producción efímera. Curamos, documentamos y distribuimos piezas que definieron épocas: siluetas descatalogadas, indumentaria utilitaria de archivo y artefactos de colección seleccionados uno a uno directo desde su fuente de origen [source].
        </p>
      </section>

      <section className="row g-5 align-items-center mb-5">
        <div className="col-lg-6">
          <h2 className="h3 fw-bold mb-3">EL CONCEPTO ARCHIVE</h2>
          <p className="text-muted mb-3" style={{ lineHeight: 1.6 }}>
            Inspirados en la estética cruda de espacios como Dover Street Market y la cultura del resell que lidera More Drops, operamos bajo la premisa de que las prendas históricas tienen un valor patrimonial. No seguimos calendarios comerciales convencionales: trabajamos mediante lanzamientos cerrados donde cada zapatilla y chaqueta cuenta una historia de diseño industrial, subcultura musical o colaboraciones de culto.
          </p>
          <p className="text-muted mb-4" style={{ lineHeight: 1.6 }}>
            Creemos en la durabilidad material, en las siluetas pesadas y en democratizar el acceso a piezas que antes solo circulaban en mercados cerrados de Tokio, Londres o Nueva York.
          </p>
          <div className="p-3 bg-light border-start border-3 border-dark">
            <p className="mb-0 small fw-bold text-uppercase">
              "No vendemos tendencias de temporada. Preservamos las piezas que construyeron la cultura urbana contemporánea."
            </p>
          </div>
        </div>
        <div className="col-lg-6">
          <div className="border p-2 bg-light text-center">
            <img
              src="https://jingdaily.com/_next/image?url=https%3A%2F%2Fcdn.sanity.io%2Fimages%2Ff8lauh0h%2Fproduction%2Fc9d150ce0d3cd5c772e8182fd97209f0f5d409a8-2490x1346.jpg%3Fq%3D90%26fit%3Dmax%26auto%3Dformat&w=1080&q=90"
              alt="Cultura de Archivo y Zapatillas"
              className="img-fluid w-100 object-fit-cover"
              style={{ maxHeight: 420 }}
            />
          </div>
        </div>
      </section>

      <section className="my-5 py-4 border-top border-bottom">
        <div className="text-center mb-5">
          <h2 className="h3 fw-bold">PILARES DE AUTENTICIDAD</h2>
          <p className="text-muted small text-uppercase">El estándar con el que catalogamos cada pieza</p>
        </div>
        <div className="row g-4">
          {PILARES.map((p) => (
            <div className="col-md-4" key={p.n}>
              <div className="border p-4 h-100 bg-white">
                <span className="fs-1 fw-bold font-monospace d-block mb-2" style={{ color: "var(--color-navy)" }}>{p.n}</span>
                <h5 className="fw-bold text-uppercase mb-2">{p.titulo}</h5>
                <p className="text-muted small mb-0">{p.texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}