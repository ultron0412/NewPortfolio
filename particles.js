if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    if (typeof window.initParticleCanvas === "function") {
      window.initParticleCanvas();
    }
  });
} else if (typeof window.initParticleCanvas === "function") {
  window.initParticleCanvas();
}
