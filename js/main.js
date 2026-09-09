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
      menuToggle.classList.toggle("active");
      mainNav.classList.toggle("active");
      document.body.style.overflow = mainNav.classList.contains("active")
        ? "hidden"
        : "";
    });

    const navLinks = mainNav.querySelectorAll(".nav__link");
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("active");
        menuToggle.classList.remove("active");
        document.body.style.overflow = "";
      });
    });
  }

  // Header scroll effect
  const mainHeader = document.getElementById("main-header");
  window.addEventListener("scroll", () => {
    if (mainHeader) {
      if (window.scrollY > 30) {
        mainHeader.classList.add("scrolled");
      } else {
        mainHeader.classList.remove("scrolled");
      }
    }
  });
  /* ==========================================================================
   01. INICIALIZACIÓN Y MENÚ MÓVIL RESPONSIVE - FIN
   ========================================================================== */

  /* ==========================================================================
   02. SLIDER INTERACTIVO DE HERO Y PARTÍCULAS - INICIO
   ========================================================================== */
  const slides = document.querySelectorAll(".hero__slide");
  const dots = document.querySelectorAll(".slider-dots .dot");
  const btnPrev = document.getElementById("slider-prev");
  const btnNext = document.getElementById("slider-next");
  const heroSlider = document.getElementById("hero-slider");

  if (slides.length > 0) {
    let currentIndex = 0;
    let slideInterval;
    const intervalTime = 10000;

    // SEGURO DE VIDA: Si editaste el HTML y ningún slide tiene la clase .active, activa el primero.
    const activeSlide = document.querySelector(".hero__slide.active");
    if (!activeSlide) {
      slides[0].classList.add("active");
      if (dots[0]) dots[0].classList.add("active");
    } else {
      // Si ya hay uno activo, sincroniza el índice inicial
      slides.forEach((slide, idx) => {
        if (slide.classList.contains("active")) currentIndex = idx;
      });
    }

    function goToSlide(index) {
      slides.forEach((slide) => slide.classList.remove("active"));
      dots.forEach((dot) => dot.classList.remove("active"));

      currentIndex = (index + slides.length) % slides.length;

      slides[currentIndex].classList.add("active");
      if (dots[currentIndex]) {
        dots[currentIndex].classList.add("active");
      }

      if (typeof lucide !== "undefined") {
        lucide.createIcons();
      }
    }

    function nextSlide() {
      goToSlide(currentIndex + 1);
    }

    function prevSlide() {
      goToSlide(currentIndex - 1);
    }

    if (btnNext) {
      btnNext.addEventListener("click", (e) => {
        e.preventDefault();
        nextSlide();
        resetInterval();
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener("click", (e) => {
        e.preventDefault();
        prevSlide();
        resetInterval();
      });
    }

    dots.forEach((dot, idx) => {
      dot.addEventListener("click", () => {
        goToSlide(idx);
        resetInterval();
      });
    });

    function startInterval() {
      slideInterval = setInterval(nextSlide, intervalTime);
    }

    function resetInterval() {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, intervalTime);
    }

    startInterval();
  }

  // Sistema de Partículas Canvas (Tu código exacto con fallback de tamaño)
  const canvas = document.getElementById("particles-canvas");
  if (canvas) {
    const ctx = canvas.getContext("2d");

    function resizeCanvas() {
      width = canvas.width = canvas.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.offsetHeight || window.innerHeight;
    }

    let width = (canvas.width = canvas.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.offsetHeight || window.innerHeight);

    window.addEventListener("resize", resizeCanvas);

    const particles = [];
    const particleCount = window.innerWidth < 768 ? 15 : 40;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2.5 + 1.2,
        color:
          Math.random() > 0.5
            ? "rgba(204, 255, 0, 0.6)"
            : "rgba(255, 255, 255, 0.4)",
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.7) * 0.4 - 0.4,
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        let p = particles[i];
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

        for (let j = i + 1; j < particles.length; j++) {
          let p2 = particles[j];
          let dx = p.x - p2.x;
          let dy = p.y - p2.y;
          let dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.15 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }
  /* ==========================================================================
   02. SLIDER INTERACTIVO DE HERO Y PARTÍCULAS - FIN
   ========================================================================== */

  /* ==========================================================================
   03. SIMULADOR DE ALCANCE ULTRA-REALISTA (EJE VIAL 1) - INICIO
   ========================================================================== */
  /* ==========================================================================
   03.1 MAPA DE DISPONIBILIDAD EN TIEMPO REAL (EJE VIAL 1) - GOOGLE SHEETS
   ========================================================================== */

  function initMapaDisponibilidad() {
    const mapElement = document.getElementById("mapa-eje-vial");
    if (!mapElement || typeof L === "undefined") return;

    const SHEET_CSV_URL =
      "https://docs.google.com/spreadsheets/d/e/2PACX-1vRZCc1Om6n4F3VJAcm7JpBkLSbyQNikgEOSdMKU5CvYE9j7LiLVtPcaR86UemwXlvOwxSUAVKG_u071/pub?output=csv";

    const map = L.map("mapa-eje-vial").setView([16.737, -92.637], 13.5);

    // Desactiva el zoom con la rueda del mouse para no trabar el scroll de la página
    map.scrollWheelZoom.disable();

    // Desactiva el arrastre con un solo dedo en móviles para no atorar el scroll táctil
    if (L.Browser.mobile) {
      map.dragging.disable();
    }

    L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}",
      {
        maxZoom: 16,
        attribution: "Tiles © Esri",
      },
    ).addTo(map);

    const ejeCoordinates = [
      [16.7585, -92.6302],
      [16.749, -92.6325],
      [16.738, -92.636],
      [16.728, -92.64],
      [16.715, -92.646],
    ];

    L.polyline(ejeCoordinates, {
      color: "#ffffff",
      weight: 3,
      opacity: 0.3,
      dashArray: "6, 8",
    }).addTo(map);

    function parseCSV(text) {
      const lines = text.trim().split(/\r?\n/);
      if (lines.length <= 1) return [];

      const headers = lines[0].split(",").map((h) =>
        h
          .trim()
          .toLowerCase()
          .replace(/^["'\s]+|["'\s]+$/g, ""),
      );

      return lines.slice(1).map((line) => {
        const values = line
          .split(",")
          .map((v) => v.trim().replace(/^["'\s]+|["'\s]+$/g, ""));
        let obj = {};
        headers.forEach((h, i) => (obj[h] = values[i]));
        return obj;
      });
    }

    fetch(SHEET_CSV_URL + "&t=" + new Date().getTime())
      .then((res) => res.text())
      .then((csvText) => {
        const paradasData = parseCSV(csvText);
        let countDisp = 0;
        let countOcup = 0;

        paradasData.forEach((parada) => {
          const lat = parseFloat(parada.lat);
          const lng = parseFloat(parada.lng || parada.ing);

          if (isNaN(lat) || isNaN(lng)) return;

          const isDisponible =
            (parada.estado || "").trim().toLowerCase() === "disponible";
          if (isDisponible) countDisp++;
          else countOcup++;

          // Colores más intensos y realistas (Verde neón / Rojo vibrante)
          const colorHex = isDisponible ? "#00e676" : "#ff1744";

          const marker = L.circleMarker([lat, lng], {
            radius: 9,
            fillColor: colorHex,
            color: "#ffffff",
            weight: 2,
            opacity: 0.95,
            fillOpacity: 0.9,
          }).addTo(map);

          // Mensaje dinámico de WhatsApp para la parada
          const waMsg = encodeURIComponent(
            `Hola, me interesa cotizar la parada ${parada.id || ""} (${parada.nombre || ""}) del Eje Vial 1.`,
          );
          const waUrl = `https://wa.me/529671378393?text=${waMsg}`;

          const popupContent = `
          <div class="popup-info">
            <small class="popup-code">Código: ${parada.id || ""}</small>
            <h4 class="popup-title">${parada.nombre || "Parada"}</h4>
            <span class="popup-status ${isDisponible ? "disponible" : "ocupado"}">
              ${isDisponible ? "DISPONIBLE PARA RENTA" : "RENTADO / OCUPADO"}
            </span>
            ${
              isDisponible
                ? `<a href="${waUrl}" target="_blank" rel="noopener" class="btn-popup-wa">
                     Cotizar por WhatsApp
                   </a>`
                : ""
            }
          </div>
        `;
          marker.bindPopup(popupContent);
        });

        const elDisp = document.getElementById("count-disponibles");
        const elOcup = document.getElementById("count-ocupados");
        if (elDisp) elDisp.textContent = countDisp;
        if (elOcup) elOcup.textContent = countOcup;
      })
      .catch((err) =>
        console.error("Error al conectar con Google Sheets:", err),
      );

    setTimeout(() => map.invalidateSize(), 300);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initMapaDisponibilidad);
  } else {
    initMapaDisponibilidad();
  }
  /* ==========================================================================
   03.1 MAPA DE DISPONIBILIDAD EN TIEMPO REAL (EJE VIAL 1) - GOOGLE SHEETS FIN
   ========================================================================== */

  //CÓDIGO ORIGINAL DEL SIMULADOR DE ALCANCE ULTRA-REALISTA (EJE VIAL 1)

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
    const days = months * 30;

    let serviceName = "Paradas de Combi (Eje Vial 1)";
    let dailyImpactsPerUnit = 400;

    if (serviceType === "dooh") {
      serviceName = "Pantallas LED DOOH";
      dailyImpactsPerUnit = 600;
    } else if (serviceType === "granformato") {
      serviceName = "Gran Formato / Espectaculares";
      dailyImpactsPerUnit = 800;
    }

    if (lblServiceVal) lblServiceVal.textContent = serviceName;
    if (lblMonthsVal)
      lblMonthsVal.textContent = `${months} meses (${days} días)`;
    if (lblUnitsVal)
      lblUnitsVal.textContent = `${units} ${units === 1 ? "soporte" : "soportes"}`;

    const totalImpacts = days * units * dailyImpactsPerUnit;
    const frequency = (1.2 + units * 0.05).toFixed(1);

    if (resImpacts)
      resImpacts.textContent = totalImpacts.toLocaleString("es-MX");
    if (resFreq) resFreq.textContent = `${frequency}x`;
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

// ==========================================================================
// OBSERVER DINÁMICO ESCALABLE - INICIO
// ==========================================================================
const autoRevealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
      }
    });
  },
  { threshold: 0.15 },
);

function initScrollReveals() {
  // AHORA ESCUCHA AMBAS CLASES:
  document
    .querySelectorAll(".reveal-on-scroll, .reveal-scale")
    .forEach((el) => {
      autoRevealObserver.observe(el);
    });
}

document.addEventListener("DOMContentLoaded", initScrollReveals);
// ==========================================================================
// OBSERVER DINÁMICO ESCALABLE - FIN
// ==========================================================================
