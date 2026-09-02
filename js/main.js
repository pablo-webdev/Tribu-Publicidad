/**
 * main.js - Interactividad Limpia (Menú móvil, Sombra en header, Partículas en canvas & Contadores)
 */

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initHeaderScroll();
  initHeroParticles();
  initTrustCounters();
  initContactForm();
});

/* ==========================================================================
   1. Menú Móvil Responsive
   ========================================================================== */
function initMobileMenu() {
  const headerContainer = document.querySelector(".header__container");
  const nav = document.querySelector(".nav");

  if (!headerContainer || !nav) return;

  let menuToggle = document.querySelector(".menu-toggle");
  if (!menuToggle) {
    menuToggle = document.createElement("button");
    menuToggle.className = "menu-toggle";
    menuToggle.type = "button";
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menú de navegación");
    menuToggle.innerHTML = `
            <span class="menu-toggle__bar"></span>
            <span class="menu-toggle__bar"></span>
            <span class="menu-toggle__bar"></span>
        `;
    headerContainer.appendChild(menuToggle);
  }

  const toggleMenu = (shouldOpen) => {
    const isOpen =
      shouldOpen !== undefined
        ? shouldOpen
        : !nav.classList.contains("nav--open");
    nav.classList.toggle("nav--open", isOpen);
    menuToggle.classList.toggle("menu-toggle--active", isOpen);
    menuToggle.setAttribute("aria-expanded", isOpen.toString());
    document.body.style.overflow = isOpen ? "hidden" : "";
  };

  menuToggle.addEventListener("click", () => toggleMenu());

  const navLinks = nav.querySelectorAll(".nav__link");
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      if (nav.classList.contains("nav--open")) toggleMenu(false);
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && nav.classList.contains("nav--open"))
      toggleMenu(false);
  });
}

/* ==========================================================================
   2. Sombra en Header al Hacer Scroll
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector(".header");
  if (!header) return;

  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      header.classList.add("header--scrolled");
    } else {
      header.classList.remove("header--scrolled");
    }
  });
}

/* ==========================================================================
   3. Canvas de Partículas Fluidas Optimizadas en Hero
   ========================================================================== */
function initHeroParticles() {
  const canvas = document.getElementById("particles-canvas");
  if (!canvas) return;

  const heroSection = canvas.closest(".hero");
  const ctx = canvas.getContext("2d");

  let width = (canvas.width = canvas.parentElement.offsetWidth);
  let height = (canvas.height = canvas.offsetHeight);

  let particles = [];
  const particleCount = Math.floor(width / 35);

  const mouse = {
    x: null,
    y: null,
    radius: 120,
  };

  if (heroSection) {
    heroSection.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    heroSection.addEventListener("mouseleave", () => {
      mouse.x = null;
      mouse.y = null;
    });
  }

  class Particle {
    constructor() {
      this.reset(true);
    }

    reset(initial = false) {
      this.x = Math.random() * width;
      this.y = initial ? Math.random() * height : height + Math.random() * 20;
      this.baseVy = -(Math.random() * 0.4 + 0.1);
      this.vy = this.baseVy;
      this.vx = (Math.random() - 0.5) * 0.2;
      this.radius = Math.random() * 2 + 1;
      this.alpha = Math.random() * 0.4 + 0.2;
    }

    update() {
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const force = (mouse.radius - distance) / mouse.radius;
          const angle = Math.atan2(dy, dx);
          this.x -= Math.cos(angle) * force * 1.5;
          this.y -= Math.sin(angle) * force * 1.5;
        }
      }

      this.y += this.vy;
      this.x += this.vx;

      if (this.y < -10 || this.x < 0 || this.x > width) {
        this.reset(false);
      }
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(132, 204, 22, ${this.alpha})`;
      ctx.fill();
    }
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i++) {
      particles[i].update();
      particles[i].draw();
    }
    requestAnimationFrame(animate);
  }

  window.addEventListener("resize", () => {
    if (!canvas.parentElement) return;
    width = canvas.width = canvas.parentElement.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
    createParticles();
  });

  createParticles();
  animate();
}

/* ==========================================================================
   4. Animación de Contadores Numéricos (Trust Bar)
   ========================================================================== */
function initTrustCounters() {
  const counters = document.querySelectorAll(".trust-card__number");
  if (counters.length === 0) return;

  const speed = 60;

  const animateCounter = (counter) => {
    const target = +counter.getAttribute("data-target");
    let count = 0;

    const updateCount = () => {
      const increment = target / speed;
      count += increment;

      if (count < target) {
        counter.innerText = Math.ceil(count).toLocaleString();
        setTimeout(updateCount, 25);
      } else {
        counter.innerText = target.toLocaleString();
      }
    };

    updateCount();
  };

  const observer = new IntersectionObserver(
    (entries, observerInstance) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          animateCounter(counter);
          observerInstance.unobserve(counter);
        }
      });
    },
    { threshold: 0.5 },
  );

  counters.forEach((counter) => observer.observe(counter));
}

/* ==========================================================================
   5. Validación o Manejo del Formulario de Contacto
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    alert(
      "¡Solicitud enviada con éxito! Un especialista de Tribu Publicidad se pondrá en contacto contigo en breve.",
    );
    form.reset();
  });
}
