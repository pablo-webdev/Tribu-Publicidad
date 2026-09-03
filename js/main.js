/* ==========================================================================
   01. INICIALIZACIÓN Y MENÚ MÓVIL RESPONSIVE - INICIO
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // Inicializar iconos de Lucide de forma segura
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // Toggle de menú móvil responsive con sincronización de animación hamburguesa
  const menuToggle = document.getElementById("menu-toggle");
  const mainNav = document.getElementById("main-nav");

  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      menuToggle.classList.toggle("active"); // <--- Esto le da la animación de "X" al botón
      mainNav.classList.toggle("active"); // <--- Esto despliega el menú
      document.body.style.overflow = mainNav.classList.contains("active")
        ? "hidden"
        : "";
    });

    const navLinks = mainNav.querySelectorAll(".nav__link");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("active");
        menuToggle.classList.remove("active"); // <--- Esto regresa la "X" a hamburguesa al hacer clic en un enlace
        document.body.style.overflow = "";
      });
    });
  }
  /* ==========================================================================
   01. INICIALIZACIÓN Y MENÚ MÓVIL RESPONSIVE - FIN
   ========================================================================== */

  /* ==========================================================================
   02. SISTEMA DE PARTÍCULAS ADAPTABLE EN CANVAS - INICIO
   ========================================================================== */
  const canvas = document.getElementById("particles-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    window.addEventListener("resize", () => {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    });

    const particles = [];
    const particleCount = window.innerWidth < 768 ? 15 : 30;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        color:
          Math.random() > 0.5
            ? "rgba(132, 204, 22, 0.6)"
            : "rgba(255, 255, 255, 0.4)",
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4 - 0.2,
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }
  /* ==========================================================================
   02. SISTEMA DE PARTÍCULAS ADAPTABLE EN CANVAS - FIN
   ========================================================================== */

  /* ==========================================================================
   03. SIMULADOR DE ALCANCE ULTRA-REALISTA (EJE VIAL 1) - INICIO
   ========================================================================== */
  const simService = document.getElementById("sim-service");
  const simMonths = document.getElementById("sim-months");
  const simUnits = document.getElementById("sim-units");

  const lblServiceVal = document.getElementById("lbl-service-val");
  const lblMonthsVal = document.getElementById("lbl-months-val");
  const lblUnitsVal = document.getElementById("lbl-units-val");

  const resImpacts = document.getElementById("res-impacts");
  const resFreq = document.getElementById("res-freq");

  function updateSimulator() {
    if (!simService || !simMonths || !simUnits) return;

    const serviceType = simService.value;
    const months = parseInt(simMonths.value);
    const units = parseInt(simUnits.value);
    const days = months * 30; // Mínimo 2 meses = 60 días

    let serviceName = "Paradas de Combi (Eje Vial 1)";
    // Flujo conservador y ultra-realista de 400 impactos diarios por parabús/unidad (Población SCLC: 215,874 habitantes)
    let dailyImpactsPerUnit = 400;

    if (serviceType === "dooh") {
      serviceName = "Pantallas LED DOOH";
      dailyImpactsPerUnit = 600;
    } else if (serviceType === "granformato") {
      serviceName = "Gran Formato / Espectaculares";
      dailyImpactsPerUnit = 800;
    }

    lblServiceVal.textContent = serviceName;
    lblMonthsVal.textContent = `${months} meses (${days} días)`;
    lblUnitsVal.textContent = `${units} ${units === 1 ? "soporte" : "soportes"}`;

    // Cálculo matemático conservador y aterrizado (Ej: 2 meses x 60 días * 2 soportes * 400 impactos = 48,000 impactos)
    const totalImpacts = days * units * dailyImpactsPerUnit;
    const frequency = (1.2 + units * 0.05).toFixed(1);

    resImpacts.textContent = totalImpacts.toLocaleString("es-MX");
    resFreq.textContent = `${frequency}x`;
  }

  if (simService && simMonths && simUnits) {
    simService.addEventListener("change", updateSimulator);
    simMonths.addEventListener("input", updateSimulator);
    simUnits.addEventListener("input", updateSimulator);
    updateSimulator();
  }
});
/* ==========================================================================
   03. SIMULADOR DE ALCANCE ULTRA-REALISTA (EJE VIAL 1) - FIN
   ========================================================================== */
