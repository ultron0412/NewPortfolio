const yearElement = document.getElementById("year");
if (yearElement) {
  yearElement.textContent = String(new Date().getFullYear());
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealElements = document.querySelectorAll(".reveal");

revealElements.forEach((element, index) => {
  const delay = element.dataset.delay ? Number(element.dataset.delay) : index * 45;
  element.style.setProperty("--reveal-delay", `${delay}ms`);
});

if (!prefersReducedMotion) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
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
  const target = document.getElementById(targetId);
  if (target) sectionMap.set(target, link);
});

if (sectionMap.size > 0) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => link.classList.remove("active"));
        const activeLink = sectionMap.get(entry.target);
        if (activeLink) activeLink.classList.add("active");
      });
    },
    {
      threshold: 0.4,
      rootMargin: "-20% 0px -45% 0px",
    }
  );

  sectionMap.forEach((link, section) => sectionObserver.observe(section));
}
