/* ==========================================================================
   INTERACCIONES DEL CATÁLOGO DE SERVICIOS
   ========================================================================== */
document.addEventListener("DOMContentLoaded", () => {
  // Lógica de carruseles de imágenes en tarjetas y banners
  document
    .querySelectorAll(".service-card, .hero-service-banner")
    .forEach((container) => {
      const slides = container.querySelectorAll(".gallery-slide");
      const dots = container.querySelectorAll(".dot-mini");
      const btnNext = container.querySelector(".slider-arrow.next");
      const btnPrev = container.querySelector(".slider-arrow.prev");

      if (slides.length <= 1) return;

      let currentIndex = 0;

      function showSlide(index) {
        slides.forEach((s) => s.classList.remove("active"));
        dots.forEach((d) => d.classList.remove("active"));

        currentIndex = (index + slides.length) % slides.length;
        slides[currentIndex].classList.add("active");
        if (dots[currentIndex]) dots[currentIndex].classList.add("active");
      }

      showSlide(0);

      if (btnNext) {
        btnNext.addEventListener("click", (e) => {
          e.stopPropagation();
          showSlide(currentIndex + 1);
        });
      }

      if (btnPrev) {
        btnPrev.addEventListener("click", (e) => {
          e.stopPropagation();
          showSlide(currentIndex - 1);
        });
      }

      dots.forEach((dot, index) => {
        dot.addEventListener("click", (e) => {
          e.stopPropagation();
          showSlide(index);
        });
      });
    });

  // Filtros interactivos de categoría
  const filterBtns = document.querySelectorAll(".catalog-filter-btn");
  const categoryBlocks = document.querySelectorAll(".category-block");
  const promoBanner = document.querySelector(".catalog-promo-banner");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterValue = btn.getAttribute("data-filter");

      categoryBlocks.forEach((block) => {
        if (
          filterValue === "all" ||
          block.getAttribute("data-category") === filterValue
        ) {
          block.style.display = "block";
        } else {
          block.style.display = "none";
        }
      });

      if (promoBanner) {
        promoBanner.style.display =
          filterValue === "all" || filterValue === "ooh" ? "" : "none";
      }
    });
  });

  // Control de apertura y cierre de ventanas modales
  const modalTriggers = document.querySelectorAll("[data-modal]");
  const closeBtns = document.querySelectorAll(
    ".service-modal__close, .service-modal__overlay",
  );

  modalTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      const modalId = trigger.getAttribute("data-modal");
      const targetModal = document.getElementById(modalId);
      if (targetModal) {
        targetModal.classList.add("active");
        document.body.style.overflow = "hidden";
        if (typeof lucide !== "undefined") lucide.createIcons();
      }
    });
  });

  closeBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const modal = btn.closest(".service-modal");
      if (modal) {
        modal.classList.remove("active");
        document.body.style.overflow = "";
      }
    });
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      document.querySelectorAll(".service-modal.active").forEach((modal) => {
        modal.classList.remove("active");
        document.body.style.overflow = "";
      });
    }
  });
});

// Selección de miniaturas para modales de imagen masiva
window.selectModalThumb = function (thumbElement, mainImgId) {
  const mainImg = document.getElementById(mainImgId);
  if (mainImg) {
    mainImg.src = thumbElement.src;
  }

  const container = thumbElement.parentElement;
  if (container) {
    container
      .querySelectorAll(".modal-thumb")
      .forEach((t) => t.classList.remove("active"));
  }
  thumbElement.classList.add("active");
};

// Carga dinámicamente galerías de 1 a 100+ imágenes
window.loadScalableGallery = function (containerId, imageList, mainImgId) {
  const gridContainer = document.getElementById(containerId);
  if (!gridContainer) return;

  gridContainer.innerHTML = "";
  imageList.forEach((imgSrc, index) => {
    const img = document.createElement("img");
    img.src = imgSrc;
    img.alt = `Ubicación ${index + 1}`;
    img.className = `modal-thumb ${index === 0 ? "active" : ""}`;
    img.loading = "lazy";
    img.onclick = function () {
      selectModalThumb(this, mainImgId);
    };
    gridContainer.appendChild(img);
  });
};
// TOUCH START

document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll(
    ".hero-banner__gallery, .gallery-slider",
  );

  sliders.forEach((slider) => {
    let touchStartX = 0;
    let touchEndX = 0;

    slider.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      { passive: true },
    );

    slider.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe(slider);
      },
      { passive: true },
    );

    function handleSwipe(element) {
      const threshold = 50; // Mínimo de pixeles de arrastre para considerarlo un gesto
      if (touchEndX < touchStartX - threshold) {
        // Deslizó hacia la izquierda -> Siguiente imagen
        const nextBtn = element
          .closest(".hero-banner__gallery")
          ?.querySelector(".slider-arrow.next");
        if (nextBtn) nextBtn.click();
      }
      if (touchEndX > touchStartX + threshold) {
        // Deslizó hacia la derecha -> Imagen anterior
        const prevBtn = element
          .closest(".hero-banner__gallery")
          ?.querySelector(".slider-arrow.prev");
        if (prevBtn) prevBtn.click();
      }
    }
  });
});
