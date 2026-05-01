const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealElements = document.querySelectorAll(".reveal");

revealElements.forEach((element, index) => {
  const delay = element.dataset.delay ? Number(element.dataset.delay) : index * 40;
  element.style.setProperty("--reveal-delay", `${delay}ms`);
});

if (!prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.14 }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

const navLinks = Array.from(document.querySelectorAll(".nav-links a"));
const sectionMap = new Map();

navLinks.forEach((link) => {
  const targetId = link.getAttribute("href")?.replace("#", "");
  if (!targetId) return;

  const section = document.getElementById(targetId);
  if (!section) return;

  sectionMap.set(section, link);

  link.addEventListener("click", (event) => {
    event.preventDefault();
    section.scrollIntoView({ behavior: "smooth", block: "start" });
  });
});

if (sectionMap.size > 0) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => link.classList.remove("active"));
        const activeLink = sectionMap.get(entry.target);
        if (activeLink) {
          activeLink.classList.add("active");
        }
      });
    },
    {
      threshold: 0.45,
      rootMargin: "-20% 0px -45% 0px",
    }
  );

  sectionMap.forEach((link, section) => sectionObserver.observe(section));
}

const progressElement = document.getElementById("scroll-progress");
if (progressElement) {
  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
    progressElement.style.width = `${Math.min(100, Math.max(0, progress))}%`;
  };

  window.addEventListener("scroll", updateProgress, { passive: true });
  window.addEventListener("resize", updateProgress);
  updateProgress();
}

const previewInline = document.getElementById("cert-preview-inline");
const previewTitle = document.getElementById("cert-preview-inline-title");
const previewClose = document.getElementById("cert-preview-inline-close");
const previewPdf = document.getElementById("cert-preview-inline-pdf");
const previewImage = document.getElementById("cert-preview-inline-image");
const previewOpen = document.getElementById("cert-preview-inline-open");
const previewButtons = document.querySelectorAll(".cert-preview-btn");

if (
  previewInline &&
  previewTitle &&
  previewClose &&
  previewPdf &&
  previewImage &&
  previewOpen &&
  previewButtons.length > 0
) {
  const resetPreview = () => {
    previewPdf.style.display = "none";
    previewImage.style.display = "none";
    previewPdf.src = "about:blank";
    previewImage.removeAttribute("src");
  };

  const closePreview = () => {
    previewInline.hidden = true;
    resetPreview();
  };

  const openPreview = (source, type, title) => {
    resetPreview();

    previewTitle.textContent = title || "Certificate Preview";
    previewOpen.setAttribute("href", source);

    if (type === "pdf") {
      previewPdf.src = source;
      previewPdf.style.display = "block";
    } else {
      previewImage.src = source;
      previewImage.style.display = "block";
    }

    previewInline.hidden = false;
    previewInline.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  previewButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const source = button.getAttribute("data-cert-src");
      const type = button.getAttribute("data-cert-type");
      const title = button.getAttribute("data-cert-title");

      if (!source || !type) return;
      openPreview(source, type, title);
    });
  });

  previewClose.addEventListener("click", closePreview);
}

const heroSection = document.getElementById("home");
const heroAnimatedBg = heroSection?.querySelector(".hero-animated-bg");

if (heroSection && heroAnimatedBg && !prefersReducedMotion) {
  let frame = 0;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;

  const animateParallax = () => {
    currentX += (targetX - currentX) * 0.08;
    currentY += (targetY - currentY) * 0.08;
    heroAnimatedBg.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
    frame = window.requestAnimationFrame(animateParallax);
  };

  heroSection.addEventListener("mousemove", (event) => {
    const rect = heroSection.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    targetX = x * 24;
    targetY = y * 18;
  });

  heroSection.addEventListener("mouseleave", () => {
    targetX = 0;
    targetY = 0;
  });

  frame = window.requestAnimationFrame(animateParallax);

  window.addEventListener("beforeunload", () => {
    if (frame) {
      window.cancelAnimationFrame(frame);
    }
  });
}
