const SVG_NS = "http://www.w3.org/2000/svg";

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

/**
 * A small, dependency-free canvas/SVG controller for the interactive core.
 * SVG supplies precise HUD geometry while canvas supplies low-cost particles.
 */
export class CoreVisual {
  constructor(element, { onActivate, reducedMotion = false } = {}) {
    this.element = element;
    this.canvas = element.querySelector("#coreParticles");
    this.tickGroup = element.querySelector("#coreTicks");
    this.onActivate = onActivate;
    this.reducedMotion = reducedMotion;
    this.context = this.canvas?.getContext("2d");
    this.particles = [];
    this.pointer = { x: 0.5, y: 0.5, active: false };
    this.activationTimer = null;
    this.frame = null;
    this.lastTime = 0;
    this.resizeObserver = null;
    this.boundResize = this.resize.bind(this);
    this.boundFrame = this.draw.bind(this);
  }

  init() {
    if (!this.element || !this.canvas || !this.context) return;

    this.createTicks();
    this.createParticles();
    this.resize();
    this.bindEvents();
    this.element.classList.add("is-online");

    if (!this.reducedMotion) {
      this.frame = window.requestAnimationFrame(this.boundFrame);
    } else {
      this.draw(0);
    }
  }

  bindEvents() {
    this.element.addEventListener("pointermove", (event) => this.handlePointer(event));
    this.element.addEventListener("pointerenter", (event) => {
      this.pointer.active = true;
      this.element.classList.add("is-engaged");
      this.handlePointer(event);
    });
    this.element.addEventListener("pointerleave", () => this.resetPointer());
    this.element.addEventListener("focus", () => {
      this.element.classList.add("is-engaged");
    });
    this.element.addEventListener("blur", () => this.resetPointer());
    this.element.addEventListener("click", () => this.activate());

    if ("ResizeObserver" in window) {
      this.resizeObserver = new ResizeObserver(this.boundResize);
      this.resizeObserver.observe(this.element);
    } else {
      window.addEventListener("resize", this.boundResize, { passive: true });
    }
  }

  createTicks() {
    if (!this.tickGroup || this.tickGroup.childElementCount) return;

    const center = 250;
    const tickCount = 64;

    for (let index = 0; index < tickCount; index += 1) {
      const angle = (index / tickCount) * Math.PI * 2 - Math.PI / 2;
      const major = index % 8 === 0;
      const medium = index % 4 === 0;
      const outerRadius = major ? 218 : 212;
      const innerRadius = major ? 194 : medium ? 201 : 206;
      const line = document.createElementNS(SVG_NS, "line");

      line.setAttribute("x1", (center + Math.cos(angle) * innerRadius).toFixed(2));
      line.setAttribute("y1", (center + Math.sin(angle) * innerRadius).toFixed(2));
      line.setAttribute("x2", (center + Math.cos(angle) * outerRadius).toFixed(2));
      line.setAttribute("y2", (center + Math.sin(angle) * outerRadius).toFixed(2));
      line.setAttribute("class", major ? "svg-tick svg-tick--major" : "svg-tick");
      this.tickGroup.appendChild(line);
    }
  }

  createParticles() {
    this.particles = Array.from({ length: 46 }, (_, index) => ({
      angle: Math.random() * Math.PI * 2,
      radius: 52 + Math.random() * 175,
      speed: (0.00012 + Math.random() * 0.00034) * (index % 2 === 0 ? 1 : -1),
      drift: Math.random() * Math.PI * 2,
      size: 0.65 + Math.random() * 1.35,
      opacity: 0.13 + Math.random() * 0.42,
    }));
  }

  resize() {
    if (!this.context) return;

    const rect = this.element.getBoundingClientRect();
    const size = Math.max(1, Math.min(rect.width, rect.height));
    const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

    this.canvas.width = Math.floor(size * pixelRatio);
    this.canvas.height = Math.floor(size * pixelRatio);
    this.canvas.style.width = `${size}px`;
    this.canvas.style.height = `${size}px`;
    this.context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);

    if (this.reducedMotion) this.draw(0);
  }

  handlePointer(event) {
    const rect = this.element.getBoundingClientRect();
    const x = clamp((event.clientX - rect.left) / rect.width, 0, 1);
    const y = clamp((event.clientY - rect.top) / rect.height, 0, 1);
    const fromCenter = Math.hypot(x - 0.5, y - 0.5);
    const energy = clamp(1 - fromCenter * 1.5, 0.2, 1);

    this.pointer = { x, y, active: true };
    this.element.style.setProperty("--pointer-x", x.toFixed(3));
    this.element.style.setProperty("--pointer-y", y.toFixed(3));
    this.element.style.setProperty("--tilt-x", `${((0.5 - y) * 8).toFixed(2)}deg`);
    this.element.style.setProperty("--tilt-y", `${((x - 0.5) * 8).toFixed(2)}deg`);
    this.element.style.setProperty("--core-energy", energy.toFixed(2));
  }

  resetPointer() {
    this.pointer = { x: 0.5, y: 0.5, active: false };
    this.element.classList.remove("is-engaged");
    this.element.style.setProperty("--pointer-x", "0.5");
    this.element.style.setProperty("--pointer-y", "0.5");
    this.element.style.setProperty("--tilt-x", "0deg");
    this.element.style.setProperty("--tilt-y", "0deg");
    this.element.style.setProperty("--core-energy", "0.42");
  }

  activate() {
    if (this.element.classList.contains("is-activating")) return;

    this.element.classList.add("is-activating");
    window.clearTimeout(this.activationTimer);
    this.activationTimer = window.setTimeout(() => {
      this.element.classList.remove("is-activating");
    }, this.reducedMotion ? 300 : 2300);

    if (typeof this.onActivate === "function") this.onActivate();
  }

  draw(timestamp) {
    if (!this.context || !this.canvas) return;

    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const ctx = this.context;
    const scale = Math.min(width, height) / 500;
    const centerX = width / 2;
    const centerY = height / 2;
    const time = this.reducedMotion ? 0 : timestamp;

    ctx.clearRect(0, 0, width, height);

    const cursorX = this.pointer.x * width;
    const cursorY = this.pointer.y * height;

    this.particles.forEach((particle, index) => {
      const wave = Math.sin(time * 0.001 + particle.drift) * 4;
      const angle = particle.angle + time * particle.speed;
      const radius = (particle.radius + wave) * scale;
      let x = centerX + Math.cos(angle) * radius;
      let y = centerY + Math.sin(angle) * radius;
      const distanceToCursor = Math.hypot(x - cursorX, y - cursorY);
      const interaction = this.pointer.active
        ? clamp(1 - distanceToCursor / (110 * scale), 0, 1)
        : 0;

      if (interaction) {
        x += (x - cursorX) * interaction * 0.2;
        y += (y - cursorY) * interaction * 0.2;
      }

      const alpha = particle.opacity + interaction * 0.42;
      const size = (particle.size + interaction * 1.1) * scale;

      ctx.beginPath();
      ctx.fillStyle = `rgba(118, 232, 255, ${alpha})`;
      ctx.arc(x, y, Math.max(size, 0.55), 0, Math.PI * 2);
      ctx.fill();

      if (interaction > 0.55 && index % 3 === 0) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(138, 239, 255, ${interaction * 0.2})`;
        ctx.moveTo(x, y);
        ctx.lineTo(x + Math.cos(angle) * 12 * scale, y + Math.sin(angle) * 12 * scale);
        ctx.stroke();
      }
    });

    if (!this.reducedMotion) {
      this.frame = window.requestAnimationFrame(this.boundFrame);
    }
  }

  setReducedMotion(shouldReduce) {
    if (this.reducedMotion === shouldReduce) return;
    this.reducedMotion = shouldReduce;

    if (shouldReduce) {
      window.cancelAnimationFrame(this.frame);
      this.frame = null;
      this.draw(0);
    } else if (!this.frame) {
      this.frame = window.requestAnimationFrame(this.boundFrame);
    }
  }

  destroy() {
    window.cancelAnimationFrame(this.frame);
    window.clearTimeout(this.activationTimer);
    this.resizeObserver?.disconnect();
    window.removeEventListener("resize", this.boundResize);
  }
}
