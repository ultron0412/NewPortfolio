(function () {
  function initParticleCanvas() {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas || canvas.dataset.initialized === "true") {
      return;
    }

    const context = canvas.getContext("2d");
    if (!context) {
      return;
    }

    const particles = [];
    let width = 0;
    let height = 0;
    let animationFrame = 0;
    let resizeTimeout = 0;
    let lastFrameTime = 0;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const performanceLite = document.documentElement.classList.contains("perf-lite");
    const targetFPS = performanceLite ? 20 : 30;
    const frameInterval = 1000 / targetFPS;
    const maxDistance = performanceLite ? 0 : 95;
    const maxDistanceSq = maxDistance * maxDistance;

    const stopAnimation = () => {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      }
    };

    function resizeCanvas() {
      const dpr = Math.max(1, Math.min(window.devicePixelRatio || 1, 2));
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    function createParticles() {
      particles.length = 0;
      const densityDivisor = performanceLite ? 58 : 40;
      const minimumCount = performanceLite ? 14 : 24;
      const count = Math.max(minimumCount, Math.floor(width / densityDivisor));

      for (let index = 0; index < count; index += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * (performanceLite ? 0.36 : 0.5),
          vy: (Math.random() - 0.5) * (performanceLite ? 0.36 : 0.5),
          radius: 0.8 + Math.random() * 1.6,
        });
      }
    }

    function drawConnections() {
      if (maxDistance <= 0) {
        return;
      }

      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distanceSq = dx * dx + dy * dy;

          if (distanceSq < maxDistanceSq) {
            const alpha = 1 - distanceSq / maxDistanceSq;
            context.strokeStyle = `rgba(180, 216, 246, ${alpha * 0.18})`;
            context.lineWidth = 0.7;
            context.beginPath();
            context.moveTo(particles[i].x, particles[i].y);
            context.lineTo(particles[j].x, particles[j].y);
            context.stroke();
          }
        }
      }
    }

    function drawFrame(timestamp) {
      if (document.hidden) {
        stopAnimation();
        return;
      }

      if (timestamp - lastFrameTime < frameInterval) {
        animationFrame = window.requestAnimationFrame(drawFrame);
        return;
      }
      lastFrameTime = timestamp;

      context.clearRect(0, 0, width, height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > width) {
          particle.vx *= -1;
        }

        if (particle.y < 0 || particle.y > height) {
          particle.vy *= -1;
        }

        context.fillStyle = "rgba(231, 245, 255, 0.75)";
        context.beginPath();
        context.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        context.fill();
      });

      drawConnections();
      animationFrame = window.requestAnimationFrame(drawFrame);
    }

    const startAnimation = () => {
      if (animationFrame || prefersReducedMotion || document.hidden) {
        return;
      }
      lastFrameTime = 0;
      animationFrame = window.requestAnimationFrame(drawFrame);
    };

    function bootstrap() {
      resizeCanvas();
      createParticles();
      if (!prefersReducedMotion) {
        startAnimation();
      } else {
        context.clearRect(0, 0, width, height);
      }
    }

    const handleResize = () => {
      if (resizeTimeout) {
        window.clearTimeout(resizeTimeout);
      }
      resizeTimeout = window.setTimeout(() => {
        resizeCanvas();
        createParticles();
        startAnimation();
      }, 120);
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopAnimation();
      } else {
        startAnimation();
      }
    };

    window.addEventListener("resize", handleResize, { passive: true });
    document.addEventListener("visibilitychange", handleVisibilityChange);

    canvas.dataset.initialized = "true";
    bootstrap();

    return function destroy() {
      if (resizeTimeout) {
        window.clearTimeout(resizeTimeout);
      }
      stopAnimation();
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }

  window.initParticleCanvas = initParticleCanvas;
})();
