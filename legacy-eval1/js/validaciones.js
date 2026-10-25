// Arreglo protegido de Regiones y Comunas (evita colisiones con data.js)
if (typeof window.CHILE_GEO === "undefined") {
  window.CHILE_GEO = [
    { region: "Arica y Parinacota", comunas: ["Arica", "Camarones", "Putre", "General Lagos"] },
    { region: "Tarapacá", comunas: ["Iquique", "Alto Hospicio", "Pozo Almonte", "Camiña", "Colchane", "Huara", "Pica"] },
    { region: "Antofagasta", comunas: ["Antofagasta", "Mejillones", "Sierra Gorda", "Taltal", "Calama", "Ollagüe", "San Pedro de Atacama", "Tocopilla", "María Elena"] },
    { region: "Atacama", comunas: ["Copiapó", "Caldera", "Tierra Amarilla", "Chañaral", "Diego de Almagro", "Vallenar", "Alto del Carmen", "Freirina", "Huasco"] },
    { region: "Coquimbo", comunas: ["La Serena", "Coquimbo", "Andacollo", "La Higuera", "Paiguano", "Vicuña", "Illapel", "Canela", "Los Vilos", "Salamanca", "Ovalle", "Combarbalá", "Monte Patria", "Punitaqui", "Río Hurtado"] },
    { region: "Valparaíso", comunas: ["Valparaíso", "Casablanca", "Concón", "Juan Fernández", "Puchuncaví", "Quintero", "Viña del Mar", "Isla de Pascua", "Los Andes", "Calle Larga", "Rinconada", "San Esteban", "La Ligua", "Cabildo", "Papudo", "Petorca", "Zapallar", "Quillota", "Calera", "Hijuelas", "La Cruz", "Nogales", "San Antonio", "Algarrobo", "Cartagena", "El Quisco", "El Tabo", "Santo Domingo", "San Felipe", "Catemu", "Llaillay", "Panquehue", "Putaendo", "Santa María", "Quilpué", "Limache", "Olmué", "Villa Alemana"] },
    { region: "Metropolitana de Santiago", comunas: ["Santiago", "Cerrillos", "Cerro Navia", "Conchalí", "El Bosque", "Estación Central", "Huechuraba", "Independencia", "La Cisterna", "La Florida", "La Granja", "La Pintana", "La Reina", "Las Condes", "Lo Barnechea", "Lo Espejo", "Lo Prado", "Macul", "Maipú", "Ñuñoa", "Pedro Aguirre Cerda", "Peñalolén", "Providencia", "Pudahuel", "Quilicura", "Quinta Normal", "Recoleta", "Renca", "San Joaquín", "San Miguel", "San Ramón", "Vitacura", "Puente Alto", "Pirque", "San José de Maipo", "Colina", "Lampa", "Til Til", "San Bernardo", "Buin", "Calera de Tango", "Paine", "Melipilla", "Alhué", "Curacaví", "María Pinto", "San Pedro", "Talagante", "El Monte", "Isla de Maipo", "Padre Hurtado", "Peñaflor"] },
    { region: "Libertador General Bernardo O'Higgins", comunas: ["Rancagua", "Codegua", "Coinco", "Coltauco", "Doñihue", "Graneros", "Las Cabras", "Machalí", "Malloa", "Mostazal", "Olivar", "Peumo", "Pichidegua", "Quinta de Tilcoco", "Rengo", "Requínoa", "San Vicente", "Pichilemu", "La Estrella", "Litueche", "Marchihue", "Navidad", "Paredones", "San Fernando", "Chépica", "Chimbarongo", "Lolol", "Nancagua", "Palmilla", "Peralillo", "Placilla", "Pumanque", "Santa Cruz"] },
    { region: "Maule", comunas: ["Talca", "Constitución", "Curepto", "Empedrado", "Maule", "Pelarco", "Pencahue", "Río Claro", "San Clemente", "San Rafael", "Cauquenes", "Chanco", "Pelluhue", "Curicó", "Hualañé", "Licantén", "Molina", "Rauco", "Romeral", "Sagrada Familia", "Teno", "Vichuquén", "Linares", "Colbún", "Longaví", "Parral", "Retiro", "San Javier", "Villa Alegre", "Yerbas Buenas"] },
    { region: "Ñuble", comunas: ["Chillán", "Bulnes", "Cobquecura", "Coelemu", "Coihueco", "Chillán Viejo", "El Carmen", "Ninhue", "Ñiquén", "Pemuco", "Pinto", "Portezuelo", "Quillón", "Quirihue", "Ránquil", "San Carlos", "San Fabián", "San Ignacio", "San Nicolás", "Treguaco", "Yungay"] },
    { region: "Biobío", comunas: ["Concepción", "Coronel", "Chiguayante", "Florida", "Hualqui", "Lota", "Penco", "San Pedro de la Paz", "Santa Juana", "Talcahuano", "Tomé", "Hualpén", "Lebu", "Arauco", "Cañete", "Contulmo", "Curanilahue", "Los Álamos", "Tirúa", "Los Ángeles", "Antuco", "Cabrero", "Laja", "Mulchén", "Nacimiento", "Negrete", "Quilaco", "Quilleco", "San Rosendo", "Santa Bárbara", "Tucapel", "Yumbel", "Alto Biobío"] },
    { region: "La Araucanía", comunas: ["Temuco", "Carahue", "Cunco", "Curarrehue", "Freire", "Galvarino", "Gorbea", "Lautaro", "Loncoche", "Melipeuco", "Nueva Imperial", "Padre Las Casas", "Perquenco", "Pitrufquén", "Pucón", "Saavedra", "Teodoro Schmidt", "Toltén", "Vilcún", "Villarrica", "Cholchol", "Angol", "Collipulli", "Curacautín", "Ercilla", "Lonquimay", "Los Sauces", "Lumaco", "Purén", "Renaico", "Traiguén", "Victoria"] },
    { region: "Los Ríos", comunas: ["Valdivia", "Corral", "Lanco", "Los Lagos", "Máfil", "Mariquina", "Paillaco", "Panguipulli", "La Unión", "Futrono", "Lago Ranco", "Río Bueno"] },
    { region: "Los Lagos", comunas: ["Puerto Montt", "Calbuco", "Cochamó", "Fresia", "Frutillar", "Los Muermos", "Llanquihue", "Maullín", "Puerto Varas", "Castro", "Ancud", "Chonchi", "Curaco de Vélez", "Dalcahue", "Puqueldón", "Queilén", "Quellón", "Quemchi", "Quinchao", "Osorno", "Puerto Octay", "Purranque", "Puyehue", "Río Negro", "San Juan de la Costa", "San Pablo", "Chaitén", "Futaleufú", "Hualaihué", "Palena"] },
    { region: "Aysén del General Carlos Ibáñez del Campo", comunas: ["Coyhaique", "Lago Verde", "Aysén", "Cisnes", "Guaitecas", "Cochrane", "O'Higgins", "Tortel", "Chile Chico", "Río Ibáñez"] },
    { region: "Magallanes y de la Antártica Chilena", comunas: ["Punta Arenas", "Laguna Blanca", "Río Verde", "San Gregorio", "Cabo de Hornos", "Antártica", "Porvenir", "Primavera", "Timaukel", "Natales", "Torres del Paine"] }
  ];
}

// Control visual de errores
function reportarError(inputElement, idSpan, mensaje) {
  if (inputElement) {
    inputElement.classList.add("is-invalid");
  }
  const span = document.getElementById(idSpan);
  if (span) {
    span.textContent = mensaje;
  }
}

// Validaciones de formato
function validarFormatoRun(run) {
  const cleanRun = run.trim().toUpperCase();
  const runRegex = /^[0-9]{7,8}[0-9K]$/;
  return runRegex.test(cleanRun);
}

function validarCorreoPermitido(correo) {
  const dominios = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
  const correoLimpio = correo.trim().toLowerCase();
  if (correoLimpio.length > 100) return false;
  return dominios.some(dom => correoLimpio.endsWith(dom));
}

function validarPassword(pass) {
  return pass.length >= 4 && pass.length <= 10;
}

// Carga de selectores dinámicos
function inicializarSelectoresChile(regionSelectId, comunaSelectId) {
  const selectRegion = document.getElementById(regionSelectId);
  const selectComuna = document.getElementById(comunaSelectId);
  if (!selectRegion || !selectComuna) return;

  selectRegion.innerHTML = `<option value="">-- Seleccione la región --</option>`;
  selectComuna.innerHTML = `<option value="">-- Seleccione la comuna --</option>`;

  window.CHILE_GEO.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item.region;
    opt.textContent = item.region;
    selectRegion.appendChild(opt);
  });

  selectRegion.addEventListener("change", () => {
    selectComuna.innerHTML = `<option value="">-- Seleccione la comuna --</option>`;
    const regionSeleccionada = window.CHILE_GEO.find(r => r.region === selectRegion.value);
    if (regionSeleccionada) {
      regionSeleccionada.comunas.forEach(c => {
        const opt = document.createElement("option");
        opt.value = c;
        opt.textContent = c;
        selectComuna.appendChild(opt);
      });
    }
  });
}

// Formulario de Registro (Guarda usuario en localStorage para recordarlo en el Login)
function vincularFormularioRegistro() {
  const form = document.getElementById("form-registro");
  if (!form) return;

  inicializarSelectoresChile("reg-region", "reg-comuna");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let esValido = true;

    const run = document.getElementById("reg-run");
    const nombre = document.getElementById("reg-nombre");
    const apellidos = document.getElementById("reg-apellidos");
    const correo = document.getElementById("reg-correo");
    const pass = document.getElementById("reg-pass");
    const pass2 = document.getElementById("reg-pass2");
    const region = document.getElementById("reg-region");
    const comuna = document.getElementById("reg-comuna");
    const direccion = document.getElementById("reg-direccion");

    [run, nombre, apellidos, correo, pass, pass2, region, comuna, direccion].forEach(el => {
      if (el) el.classList.remove("is-invalid");
    });
    document.querySelectorAll(".field-msg").forEach(el => el.textContent = "");

    if (!run || run.value.trim() === "") {
      reportarError(run, "msg-run", "El RUN es obligatorio y no puede quedar vacío.");
      esValido = false;
    } else if (!validarFormatoRun(run.value)) {
      reportarError(run, "msg-run", "RUN inválido. Debe tener entre 7 y 9 caracteres sin puntos ni guion (ej: 19011022K).");
      esValido = false;
    }

    if (!nombre || nombre.value.trim() === "") {
      reportarError(nombre, "msg-nombre", "El nombre es obligatorio y no puede quedar vacío.");
      esValido = false;
    } else if (nombre.value.trim().length > 50) {
      reportarError(nombre, "msg-nombre", "El nombre no puede superar los 50 caracteres.");
      esValido = false;
    }

    if (!apellidos || apellidos.value.trim() === "") {
      reportarError(apellidos, "msg-apellidos", "Los apellidos son obligatorios y no pueden quedar vacíos.");
      esValido = false;
    } else if (apellidos.value.trim().length > 100) {
      reportarError(apellidos, "msg-apellidos", "Los apellidos no pueden superar los 100 caracteres.");
      esValido = false;
    }

    if (!correo || correo.value.trim() === "") {
      reportarError(correo, "msg-correo", "El correo electrónico es obligatorio y no puede quedar vacío.");
      esValido = false;
    } else if (!validarCorreoPermitido(correo.value)) {
      reportarError(correo, "msg-correo", "Solo se autorizan cuentas @duoc.cl, @profesor.duoc.cl o @gmail.com.");
      esValido = false;
    }

    if (!pass || pass.value.trim() === "") {
      reportarError(pass, "msg-pass", "La contraseña es obligatoria y no puede quedar vacía.");
      esValido = false;
    } else if (!validarPassword(pass.value)) {
      reportarError(pass, "msg-pass", "La contraseña debe poseer entre 4 y 10 caracteres.");
      esValido = false;
    }

    if (!pass2 || pass2.value.trim() === "") {
      reportarError(pass2, "msg-pass2", "Debe confirmar la contraseña.");
      esValido = false;
    } else if (pass.value !== pass2.value) {
      reportarError(pass2, "msg-pass2", "Las contraseñas ingresadas no coinciden.");
      esValido = false;
    }

    if (!region || !region.value) {
      reportarError(region, "msg-region", "Debe seleccionar una región de la lista.");
      esValido = false;
    }

    if (!comuna || !comuna.value) {
      reportarError(comuna, "msg-comuna", "Debe seleccionar una comuna de la lista.");
      esValido = false;
    }

    if (!direccion || direccion.value.trim() === "") {
      reportarError(direccion, "msg-direccion", "La dirección es obligatoria y no puede quedar vacía.");
      esValido = false;
    } else if (direccion.value.trim().length > 300) {
      reportarError(direccion, "msg-direccion", "La dirección no puede superar los 300 caracteres.");
      esValido = false;
    }

    if (esValido) {
      // Guardar usuario en localStorage
      const usuarios = JSON.parse(localStorage.getItem("ARCHIVE_USERS") || "[]");
      const nuevoUsuario = {
        run: run.value.trim().toUpperCase(),
        nombre: nombre.value.trim(),
        apellidos: apellidos.value.trim(),
        correo: correo.value.trim().toLowerCase(),
        region: region.value,
        comuna: comuna.value,
        direccion: direccion.value.trim()
      };
      usuarios.push(nuevoUsuario);
      localStorage.setItem("ARCHIVE_USERS", JSON.stringify(usuarios));

      if (typeof Swal !== "undefined") {
        Swal.fire({
          title: "¡REGISTRO EXITOSO!",
          text: `Bienvenido/a ${nuevoUsuario.nombre}. Tu cuenta ha sido creada, ya puedes iniciar sesión.`,
          icon: "success",
          confirmButtonColor: "#1B2A4A",
          confirmButtonText: "INGRESAR",
          customClass: { popup: "rounded-0 border border-dark", confirmButton: "rounded-0 fw-bold px-4" }
        }).then((result) => {
          if (result.isConfirmed) {
            form.reset();
            window.location.href = "login.html";
          }
        });
      } else {
        alert("Registro exitoso.");
        form.reset();
        window.location.href = "login.html";
      }
    }
  });
}

// Formulario de Inicio de Sesión (Muestra el nombre del cliente en el popup)
function vincularFormularioLogin() {
  const form = document.getElementById("form-login");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let esValido = true;

    const correo = document.getElementById("login-correo");
    const pass = document.getElementById("login-pass");

    [correo, pass].forEach(el => {
      if (el) el.classList.remove("is-invalid");
    });
    document.querySelectorAll(".field-msg").forEach(el => el.textContent = "");

    if (!correo || correo.value.trim() === "") {
      reportarError(correo, "msg-login-correo", "El correo es obligatorio y no puede quedar vacío.");
      esValido = false;
    } else if (!validarCorreoPermitido(correo.value)) {
      reportarError(correo, "msg-login-correo", "Solo cuentas @duoc.cl, @profesor.duoc.cl o @gmail.com.");
      esValido = false;
    }

    if (!pass || pass.value.trim() === "") {
      reportarError(pass, "msg-login-pass", "La contraseña es obligatoria y no puede quedar vacía.");
      esValido = false;
    } else if (!validarPassword(pass.value)) {
      reportarError(pass, "msg-login-pass", "La contraseña debe tener entre 4 y 10 caracteres.");
      esValido = false;
    }

    if (esValido) {
      const correoLimpio = correo.value.trim().toLowerCase();
      let rolAsignado = "";
      let rutaDestino = "";
      let mensajeTexto = "";

      // Buscar si el usuario fue registrado previamente
      const usuarios = JSON.parse(localStorage.getItem("ARCHIVE_USERS") || "[]");
      const usuarioEncontrado = usuarios.find(u => u.correo === correoLimpio);

      // Si existe, usar su nombre; de lo contrario, generar uno legible a partir del correo
      let nombreCliente = "";
      if (usuarioEncontrado && usuarioEncontrado.nombre) {
        nombreCliente = usuarioEncontrado.nombre;
      } else {
        const alias = correoLimpio.split("@")[0].replace(/[._-]/g, " ");
        nombreCliente = alias.charAt(0).toUpperCase() + alias.slice(1);
      }

      if (correoLimpio.endsWith("@gmail.com")) {
        rolAsignado = "Cliente";
        rutaDestino = "index.html";
        mensajeTexto = `Hola ${nombreCliente},Bienvenido, estas siendo redirigido a la tienda...`;
      } else if (correoLimpio.includes("admin")) {
        rolAsignado = "Administrador";
        rutaDestino = "admin/index.html";
        mensajeTexto = `Hola ${nombreCliente}, acceso autorizado como Administrador. Abriendo panel...`;
      } else {
        rolAsignado = "Vendedor";
        rutaDestino = "admin/index.html";
        mensajeTexto = `Hola ${nombreCliente}, acceso autorizado como Vendedor. Abriendo panel...`;
      }

      localStorage.setItem("ARCHIVE_AUTH_ROLE", rolAsignado);
      localStorage.setItem("ARCHIVE_USER_EMAIL", correoLimpio);
      localStorage.setItem("ARCHIVE_USER_NAME", nombreCliente);

      if (typeof Swal !== "undefined") {
        Swal.fire({
          title: `¡BIENVENIDO, ${nombreCliente.toUpperCase()}!`,
          text: mensajeTexto,
          icon: "success",
          timer: 2300,
          showConfirmButton: false,
          customClass: { popup: "rounded-0 border border-dark", title: "fw-bolder" }
        }).then(() => {
          window.location.href = rutaDestino;
        });
      } else {
        alert(mensajeTexto);
        window.location.href = rutaDestino;
      }
    }
  });
}

// Formulario de Contacto
function vincularFormularioContacto() {
  const form = document.getElementById("form-contacto");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let esValido = true;

    const nombre = document.getElementById("cont-nombre");
    const correo = document.getElementById("cont-correo");
    const mensaje = document.getElementById("cont-mensaje");

    [nombre, correo, mensaje].forEach(el => {
      if (el) el.classList.remove("is-invalid");
    });
    document.querySelectorAll(".field-msg").forEach(el => el.textContent = "");

    if (!nombre || nombre.value.trim() === "") {
      reportarError(nombre, "msg-cont-nombre", "El nombre es obligatorio y no puede quedar vacío.");
      esValido = false;
    } else if (nombre.value.trim().length > 100) {
      reportarError(nombre, "msg-cont-nombre", "Máximo 100 caracteres permitidos.");
      esValido = false;
    }

    if (!correo || correo.value.trim() === "") {
      reportarError(correo, "msg-cont-correo", "El correo es obligatorio y no puede quedar vacío.");
      esValido = false;
    } else if (!validarCorreoPermitido(correo.value)) {
      reportarError(correo, "msg-cont-correo", "Solo dominios @duoc.cl, @profesor.duoc.cl o @gmail.com.");
      esValido = false;
    }

    if (!mensaje || mensaje.value.trim() === "") {
      reportarError(mensaje, "msg-cont-mensaje", "El comentario es obligatorio y no puede quedar vacío.");
      esValido = false;
    } else if (mensaje.value.trim().length > 500) {
      reportarError(mensaje, "msg-cont-mensaje", "Máximo 500 caracteres permitidos.");
      esValido = false;
    }

    if (esValido) {
      if (typeof Swal !== "undefined") {
        Swal.fire({
          title: "MENSAJE ENVIADO",
          text: "Tu consulta fue recibida en ARCHIVE[src]. Te responderemos a la brevedad.",
          icon: "success",
          confirmButtonColor: "#1B2A4A",
          confirmButtonText: "ENTENDIDO",
          customClass: { popup: "rounded-0 border border-dark", confirmButton: "rounded-0 fw-bold px-4" }
        }).then(() => {
          form.reset();
        });
      } else {
        alert("Mensaje enviado con éxito.");
        form.reset();
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  vincularFormularioRegistro();
  vincularFormularioLogin();
  vincularFormularioContacto();
});