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
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
      const count = Math.max(28, Math.floor(width / 30));
      for (let index = 0; index < count; index += 1) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.55,
          vy: (Math.random() - 0.5) * 0.55,
          radius: 0.8 + Math.random() * 1.6,
        });
      }
    }

    function drawConnections() {
      const maxDistance = 110;
      for (let i = 0; i < particles.length; i += 1) {
        for (let j = i + 1; j < particles.length; j += 1) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.hypot(dx, dy);

          if (distance < maxDistance) {
            const alpha = 1 - distance / maxDistance;
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

    function drawFrame() {
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

    function bootstrap() {
      resizeCanvas();
      createParticles();
      if (!prefersReducedMotion) {
        drawFrame();
      } else {
        context.clearRect(0, 0, width, height);
      }
    }

    window.addEventListener("resize", () => {
      resizeCanvas();
      createParticles();
    });

    canvas.dataset.initialized = "true";
    bootstrap();

    return function destroy() {
      if (animationFrame) {
        window.cancelAnimationFrame(animationFrame);
      }
    };
  }

  window.initParticleCanvas = initParticleCanvas;
})();
