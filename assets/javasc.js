const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const prefersCoarsePointer = window.matchMedia("(pointer: coarse)").matches;
const saveDataEnabled = Boolean(navigator.connection && navigator.connection.saveData);
const lowCpuDevice =
  typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4;
const lowMemoryDevice = typeof navigator.deviceMemory === "number" && navigator.deviceMemory <= 4;
const performanceLite = prefersCoarsePointer || saveDataEnabled || lowCpuDevice || lowMemoryDevice;

if (performanceLite) {
  document.documentElement.classList.add("perf-lite");
}

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
  let isQueued = false;

  const updateProgress = () => {
    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const progress = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
    progressElement.style.width = `${Math.min(100, Math.max(0, progress))}%`;
    isQueued = false;
  };

  const queueProgressUpdate = () => {
    if (isQueued) return;
    isQueued = true;
    window.requestAnimationFrame(updateProgress);
  };

  window.addEventListener("scroll", queueProgressUpdate, { passive: true });
  window.addEventListener("resize", queueProgressUpdate);
  queueProgressUpdate();
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

const inlinePdfThumbs = Array.from(document.querySelectorAll(".pdf-thumb iframe[data-src]"));

if (inlinePdfThumbs.length > 0) {
  inlinePdfThumbs.forEach((frame) => {
    frame.closest(".pdf-thumb")?.classList.add("pdf-thumb-loading");
  });

  if (prefersReducedMotion || performanceLite) {
    inlinePdfThumbs.forEach((frame) => {
      const holder = frame.closest(".pdf-thumb");
      if (!holder) return;
      holder.classList.remove("pdf-thumb-loading");
      holder.classList.add("pdf-thumb-placeholder");
    });
  } else {
    const pdfThumbObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const frame = entry.target;
          const source = frame.getAttribute("data-src");
          if (source && !frame.getAttribute("src")) {
            frame.setAttribute("src", source);
          }
          frame.closest(".pdf-thumb")?.classList.remove("pdf-thumb-loading");
          frame.closest(".pdf-thumb")?.classList.add("pdf-thumb-loaded");
          observer.unobserve(frame);
        });
      },
      {
        threshold: 0.08,
        rootMargin: "160px 0px",
      }
    );

    inlinePdfThumbs.forEach((frame) => pdfThumbObserver.observe(frame));

    window.addEventListener(
      "beforeunload",
      () => {
        pdfThumbObserver.disconnect();
      },
      { once: true }
    );
  }
}

const heroSection = document.getElementById("home");
const heroAnimatedBg = heroSection?.querySelector(".hero-animated-bg");

if (heroSection && heroAnimatedBg && !prefersReducedMotion && !performanceLite && !prefersCoarsePointer) {
  let frame = 0;
  let targetX = 0;
  let targetY = 0;
  let currentX = 0;
  let currentY = 0;
  let running = false;
  let heroVisible = true;

  const stopParallax = () => {
    if (frame) {
      window.cancelAnimationFrame(frame);
      frame = 0;
    }
    running = false;
  };

  const animateParallax = () => {
    currentX += (targetX - currentX) * 0.14;
    currentY += (targetY - currentY) * 0.14;
    heroAnimatedBg.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;

    const needsMoreFrames =
      Math.abs(targetX - currentX) > 0.05 || Math.abs(targetY - currentY) > 0.05;

    if (needsMoreFrames && heroVisible) {
      frame = window.requestAnimationFrame(animateParallax);
      return;
    }

    stopParallax();
  };

  const startParallax = () => {
    if (running || !heroVisible) return;
    running = true;
    frame = window.requestAnimationFrame(animateParallax);
  };

  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      const [entry] = entries;
      if (!entry) return;
      heroVisible = entry.isIntersecting;
      if (!heroVisible) {
        stopParallax();
      }
    },
    { threshold: 0.05 }
  );
  visibilityObserver.observe(heroSection);

  heroSection.addEventListener("mousemove", (event) => {
    if (!heroVisible) return;

    const rect = heroSection.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    targetX = x * 16;
    targetY = y * 12;
    startParallax();
  };

  heroSection.addEventListener("mouseleave", () => {
    targetX = 0;
    targetY = 0;
    startParallax();
  });

  window.addEventListener(
    "beforeunload",
    () => {
      stopParallax();
      visibilityObserver.disconnect();
    },
    { once: true }
  );
}
