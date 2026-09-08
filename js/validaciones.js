// Validación de RUN Chileno (Formato 7-9 caracteres, sin puntos ni guion)
function validarFormatoRun(run) {
  const cleanRun = run.trim().toUpperCase();
  const runRegex = /^[0-9]{7,8}[0-9K]$/;
  return runRegex.test(cleanRun);
}

// Validación de Dominios de Correo Permitidos
function validarCorreoPermitido(correo) {
  const dominios = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];
  const correoLimpio = correo.trim().toLowerCase();
  if (correoLimpio.length > 100) return false;
  return dominios.some(dom => correoLimpio.endsWith(dom));
}

// Validación de Longitud de Contraseña (4 - 10 caracteres)
function validarPassword(pass) {
  return pass.length >= 4 && pass.length <= 10;
}

// Carga Dinámica de Región y Comuna
function inicializarSelectoresChile(regionSelectId, comunaSelectId) {
  const selectRegion = document.getElementById(regionSelectId);
  const selectComuna = document.getElementById(comunaSelectId);
  if (!selectRegion || !selectComuna) return;

  selectRegion.innerHTML = `<option value="">-- Seleccione la región --</option>`;
  CHILE_GEO.forEach(item => {
    const opt = document.createElement("option");
    opt.value = item.region;
    opt.textContent = item.region;
    selectRegion.appendChild(opt);
  });

  selectRegion.addEventListener("change", () => {
    selectComuna.innerHTML = `<option value="">-- Seleccione la comuna --</option>`;
    const regionSeleccionada = CHILE_GEO.find(r => r.region === selectRegion.value);
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

// Validación Formulario Registro de Usuario
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

    // Limpiar errores
    document.querySelectorAll(".field-msg").forEach(el => el.textContent = "");

    if (!validarFormatoRun(run.value)) {
      document.getElementById("msg-run").textContent = "RUN inválido. Ingrese entre 7 y 9 caracteres sin puntos ni guion (ej: 19011022K).";
      esValido = false;
    }
    if (nombre.value.trim().length === 0 || nombre.value.length > 50) {
      document.getElementById("msg-nombre").textContent = "Nombre requerido (máx. 50 caracteres).";
      esValido = false;
    }
    if (apellidos.value.trim().length === 0 || apellidos.value.length > 100) {
      document.getElementById("msg-apellidos").textContent = "Apellidos requeridos (máx. 100 caracteres).";
      esValido = false;
    }
    if (!validarCorreoPermitido(correo.value)) {
      document.getElementById("msg-correo").textContent = "Correo inválido. Solo dominios @duoc.cl, @profesor.duoc.cl o @gmail.com.";
      esValido = false;
    }
    if (!validarPassword(pass.value)) {
      document.getElementById("msg-pass").textContent = "La contraseña debe tener entre 4 y 10 caracteres.";
      esValido = false;
    }
    if (pass.value !== pass2.value) {
      document.getElementById("msg-pass2").textContent = "Las contraseñas no coinciden.";
      esValido = false;
    }
    if (!region.value) {
      document.getElementById("msg-region").textContent = "Seleccione una región.";
      esValido = false;
    }
    if (!comuna.value) {
      document.getElementById("msg-comuna").textContent = "Seleccione una comuna.";
      esValido = false;
    }
    if (direccion.value.trim().length === 0 || direccion.value.length > 300) {
      document.getElementById("msg-direccion").textContent = "Dirección requerida (máx. 300 caracteres).";
      esValido = false;
    }

    if (esValido) {
      alert("Registro exitoso. Redirigiendo al inicio de sesión...");
      form.reset();
      window.location.href = "login.html";
    }
  });
}

// Validación Formulario Inicio de Sesión
function vincularFormularioLogin() {
  const form = document.getElementById("form-login");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let esValido = true;

    const correo = document.getElementById("login-correo");
    const pass = document.getElementById("login-pass");

    document.querySelectorAll(".field-msg").forEach(el => el.textContent = "");

    if (!validarCorreoPermitido(correo.value)) {
      document.getElementById("msg-login-correo").textContent = "Correo inválido. Solo dominios @duoc.cl, @profesor.duoc.cl o @gmail.com.";
      esValido = false;
    }
    if (!validarPassword(pass.value)) {
      document.getElementById("msg-login-pass").textContent = "Contraseña inválida (debe poseer entre 4 y 10 caracteres).";
      esValido = false;
    }

    if (esValido) {
      // Simulación de rol administrativo para fines evaluativos
      if (correo.value.includes("admin")) {
        localStorage.setItem("ARCHIVE_AUTH_ROLE", "Administrador");
      } else {
        localStorage.setItem("ARCHIVE_AUTH_ROLE", "Vendedor");
      }
      alert("Autenticación correcta. Ingresando al panel...");
      window.location.href = "admin/index.html";
    }
  });
}

// Validación Formulario Contacto
function vincularFormularioContacto() {
  const form = document.getElementById("form-contacto");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let esValido = true;

    const nombre = document.getElementById("cont-nombre");
    const correo = document.getElementById("cont-correo");
    const mensaje = document.getElementById("cont-mensaje");

    document.querySelectorAll(".field-msg").forEach(el => el.textContent = "");

    if (nombre.value.trim().length === 0 || nombre.value.length > 100) {
      document.getElementById("msg-cont-nombre").textContent = "Nombre requerido (máx. 100 caracteres).";
      esValido = false;
    }
    if (!validarCorreoPermitido(correo.value)) {
      document.getElementById("msg-cont-correo").textContent = "Correo no autorizado (@duoc.cl, @profesor.duoc.cl o @gmail.com).";
      esValido = false;
    }
    if (mensaje.value.trim().length === 0 || mensaje.value.length > 500) {
      document.getElementById("msg-cont-mensaje").textContent = "Comentario requerido (máx. 500 caracteres).";
      esValido = false;
    }

    if (esValido) {
      alert("Mensaje enviado con éxito a ARCHIVE[src]. Te responderemos a la brevedad.");
      form.reset();
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  vincularFormularioRegistro();
  vincularFormularioLogin();
  vincularFormularioContacto();
});