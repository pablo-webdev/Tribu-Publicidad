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
    const intervalTime = 6000;

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

    if (btnNext)
      btnNext.addEventListener("click", () => {
        nextSlide();
        resetInterval();
      });
    if (btnPrev)
      btnPrev.addEventListener("click", () => {
        prevSlide();
        resetInterval();
      });

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
      startInterval();
    }

    if (heroSlider) {
      heroSlider.addEventListener("mouseenter", () =>
        clearInterval(slideInterval),
      );
      heroSlider.addEventListener("mouseleave", () => startInterval());
    }

    startInterval();
  }

  // Sistema de Partículas Canvas
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
    const particleCount = window.innerWidth < 768 ? 15 : 35;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        color:
          Math.random() > 0.5
            ? "rgba(204, 255, 0, 0.6)"
            : "rgba(255, 255, 255, 0.4)",
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4 - 0.2,
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      // Dibujar partículas y líneas de conexión
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

        // Conectar partículas cercanas con líneas tenues
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
