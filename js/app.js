import { PORTFOLIO_CONFIG } from "./config.js";
import { CoreVisual } from "./core-visual.js";
import { CommandConsole } from "./console.js";

const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
const $ = (selector, parent = document) => parent.querySelector(selector);
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

function escapeHTML(value = "") {
  return String(value).replace(/[&<>'"]/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    };
    return entities[character];
  });
}

function createTechTags(items, className = "tech-list") {
  const list = document.createElement("ul");
  list.className = className;
  items.forEach((item) => {
    const tag = document.createElement("li");
    tag.textContent = item;
    list.appendChild(tag);
  });
  return list;
}

function hydrateProfile() {
  document.title = `${PORTFOLIO_CONFIG.name} — AI/ML Engineering System`;
  $$('[data-config="name"]').forEach((element) => {
    element.textContent = PORTFOLIO_CONFIG.name;
  });
  $$('[data-config="role"]').forEach((element) => {
    element.textContent = PORTFOLIO_CONFIG.role;
  });
  $$('[data-config="intro"]').forEach((element) => {
    element.textContent = PORTFOLIO_CONFIG.intro;
  });

  $("#projectCount").textContent = `${String(PORTFOLIO_CONFIG.projects.length).padStart(2, "0")} modules`;
  $("#footerYear").textContent = new Date().getFullYear();

  const githubLink = $("#githubLink");
  const linkedinLink = $("#linkedinLink");
  githubLink.href = PORTFOLIO_CONFIG.social.github;
  linkedinLink.href = PORTFOLIO_CONFIG.social.linkedin;
  updateEmailChannel();
}

function updateEmailChannel() {
  const currentChannel = $("#emailChannel");
  const email = PORTFOLIO_CONFIG.social.email?.trim();
  if (!currentChannel || !email) return;

  const emailLink = document.createElement("a");
  emailLink.className = "contact-channel";
  emailLink.id = "emailChannel";
  emailLink.href = `mailto:${email}`;
  emailLink.innerHTML = `
    <span class="contact-channel__code">03 / EMAIL</span>
    <strong>${escapeHTML(email)}</strong>
    <i aria-hidden="true">↗</i>
  `;
  currentChannel.replaceWith(emailLink);
}

function renderProjects() {
  const grid = $("#projectGrid");
  if (!grid) return;
  grid.replaceChildren();

  PORTFOLIO_CONFIG.projects.forEach((project, index) => {
    const article = document.createElement("article");
    article.className = `project-card reveal-item project-card--${project.statusTone || "cyan"}`;
    article.dataset.project = project.slug;
    article.style.setProperty("--project-order", index);

    const header = document.createElement("div");
    header.className = "project-card__header";
    header.innerHTML = `
      <span class="project-card__id">${escapeHTML(project.id)}</span>
      <span class="status-label status-label--${escapeHTML(project.statusTone || "cyan")}">${escapeHTML(project.status)}</span>
    `;

    const classification = document.createElement("p");
    classification.className = "project-card__classification";
    classification.textContent = project.classification;

    const name = document.createElement("h3");
    name.textContent = project.name;

    const summary = document.createElement("p");
    summary.className = "project-card__summary";
    summary.textContent = project.summary;

    const metadata = document.createElement("div");
    metadata.className = "project-card__metadata";
    const technologyLabel = document.createElement("span");
    technologyLabel.textContent = "Technology";
    metadata.appendChild(technologyLabel);
    metadata.appendChild(createTechTags(project.technologies, "project-tech"));

    const diagnostics = document.createElement("div");
    diagnostics.className = "project-card__diagnostics";
    diagnostics.innerHTML = `
      <span>DIAGNOSTIC / ${escapeHTML(project.id)}</span>
      <span>RECORD CLASS: ${escapeHTML(project.classification.toUpperCase())}</span>
      <span>BRIEF: AVAILABLE</span>
    `;

    const footer = document.createElement("div");
    footer.className = "project-card__footer";
    const openButton = document.createElement("button");
    openButton.type = "button";
    openButton.className = "project-card__open";
    openButton.dataset.openProject = project.slug;
    openButton.innerHTML = '<span>View system</span><i aria-hidden="true">↗</i>';
    footer.appendChild(openButton);

    article.append(header, classification, name, summary, metadata, diagnostics, footer);
    grid.appendChild(article);
  });
}

function renderStack() {
  const matrix = $("#stackMatrix");
  if (!matrix) return;
  matrix.replaceChildren();

  PORTFOLIO_CONFIG.stack.forEach((group) => {
    const card = document.createElement("article");
    card.className = "stack-card reveal-item";

    const heading = document.createElement("div");
    heading.className = "stack-card__heading";
    heading.innerHTML = `<h3>${escapeHTML(group.group)}</h3><span>${escapeHTML(group.label)}</span>`;

    const tools = document.createElement("ul");
    tools.className = "stack-card__tools";
    group.tools.forEach((tool) => {
      const item = document.createElement("li");
      item.textContent = tool;
      tools.appendChild(item);
    });

    card.append(heading, tools);
    matrix.appendChild(card);
  });
}

function setupProjectDialog() {
  const dialog = $("#projectDialog");
  const closeButton = $("#dialogClose");
  const githubLink = $("#dialogGithub");
  const githubNote = $("#dialogGithubNote");
  let triggerElement = null;

  const closeDialog = () => {
    if (dialog.open) dialog.close();
  };

  const openProject = (slug, trigger) => {
    const project = PORTFOLIO_CONFIG.projects.find((item) => item.slug === slug);
    if (!project) return;

    triggerElement = trigger || document.activeElement;
    $("#dialogProjectId").textContent = project.id;
    const status = $("#dialogProjectStatus");
    status.textContent = project.status;
    status.className = `status-label status-label--${project.statusTone || "cyan"}`;
    $("#dialogProjectName").textContent = project.name;
    $("#dialogProjectSummary").textContent = project.summary;
    $("#dialogOverview").textContent = project.overview;
    $("#dialogProblem").textContent = project.problem;
    $("#dialogApproach").textContent = project.approach;
    $("#dialogDecisions").textContent = project.decisions;
    $("#dialogResult").textContent = project.result;

    const technology = $("#dialogTechnology");
    technology.replaceChildren();
    project.technologies.forEach((item) => {
      const tag = document.createElement("span");
      tag.textContent = item;
      technology.appendChild(tag);
    });

    if (project.github) {
      githubLink.href = project.github;
      githubLink.hidden = false;
      githubNote.hidden = true;
      githubNote.textContent = "";
    } else {
      githubLink.removeAttribute("href");
      githubLink.hidden = true;
      githubNote.hidden = false;
      githubNote.textContent = "Repository URL awaiting project configuration in js/config.js.";
    }

    if (typeof dialog.showModal === "function") {
      dialog.showModal();
    } else {
      dialog.setAttribute("open", "");
    }
    closeButton.focus();
  };

  document.addEventListener("click", (event) => {
    const button = event.target.closest("[data-open-project]");
    if (button) openProject(button.dataset.openProject, button);
  });

  closeButton.addEventListener("click", closeDialog);
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) closeDialog();
  });
  dialog.addEventListener("close", () => {
    triggerElement?.focus?.();
  });

  return { openProject };
}

function createVoiceController() {
  const status = $("#voiceStatus");
  const consoleElement = $("#voiceConsole");
  const waveform = $("#voiceWaveform");
  const waveformBars = $$("i", waveform);
  const voiceButtons = [$("#voiceButton"), $("#headerVoiceButton")].filter(Boolean);
  const isSupported = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  let activeRequest = 0;
  let waveTimer = null;

  const setStatus = (message, isSpeaking = false) => {
    status.textContent = message;
    consoleElement.classList.toggle("is-speaking", isSpeaking);
    voiceButtons.forEach((button) => button.classList.toggle("is-speaking", isSpeaking));
  };

  const setWaveLevels = (active) => {
    waveformBars.forEach((bar, index) => {
      const phase = index / Math.max(waveformBars.length - 1, 1);
      const level = active
        ? 0.18 + Math.abs(Math.sin(Date.now() * 0.009 + phase * 9)) * (0.45 + Math.random() * 0.42)
        : 0.16;
      bar.style.setProperty("--wave-level", level.toFixed(2));
    });
  };

  const stopWave = () => {
    window.clearInterval(waveTimer);
    waveTimer = null;
    setWaveLevels(false);
  };

  const startWave = () => {
    stopWave();
    setWaveLevels(true);
    if (!reducedMotionQuery.matches) {
      waveTimer = window.setInterval(() => setWaveLevels(true), 120);
    }
  };

  const chooseVoice = () => {
    const voices = window.speechSynthesis.getVoices();
    const browserLanguage = (navigator.language || "en-US").toLowerCase();
    return (
      voices.find((voice) => voice.lang.toLowerCase() === browserLanguage) ||
      voices.find((voice) => voice.lang.toLowerCase().startsWith("en")) ||
      null
    );
  };

  const speak = () => {
    if (!isSupported) {
      setStatus("Voice output is unavailable in this browser. Explore the interface visually instead.");
      return false;
    }

    const requestId = ++activeRequest;
    window.speechSynthesis.cancel();

    const introduction = `Interface online. Welcome to ${PORTFOLIO_CONFIG.name}'s engineering portfolio. You can explore projects, systems, capabilities, and contact information.`;
    const utterance = new SpeechSynthesisUtterance(introduction);
    const selectedVoice = chooseVoice();
    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.lang = selectedVoice?.lang || navigator.language || "en-US";
    utterance.rate = 0.96;
    utterance.pitch = 0.95;
    utterance.volume = 0.9;

    const finish = (message) => {
      if (requestId !== activeRequest) return;
      stopWave();
      setStatus(message, false);
    };

    utterance.onstart = () => {
      if (requestId !== activeRequest) return;
      startWave();
      setStatus("Voice output active — introduction transmitting.", true);
    };
    utterance.onend = () => finish("Voice transmission complete. Interface remains ready.");
    utterance.onerror = (event) => {
      if (event.error === "interrupted" || event.error === "canceled") return;
      finish("Voice output could not start. Your browser may be blocking speech playback.");
    };

    try {
      startWave();
      setStatus("Initializing browser voice output…", true);
      window.speechSynthesis.resume();
      window.speechSynthesis.speak(utterance);
      return true;
    } catch (error) {
      finish("Voice output could not start. Explore the interface visually instead.");
      return false;
    }
  };

  voiceButtons.forEach((button) => button.addEventListener("click", speak));
  window.speechSynthesis?.addEventListener?.("voiceschanged", chooseVoice);
  setWaveLevels(false);

  return { speak, isSupported };
}

function setupBootSequence() {
  const screen = $("#bootScreen");
  const list = $("#bootLines");
  const skipButton = $("#skipBoot");
  const progress = $("#bootProgressBar");
  const status = $("#bootStatusText");
  const clock = $("#bootClock");
  const bootItems = [
    "CORE SYSTEM",
    "NEURAL INTERFACE",
    "PROJECT DATABASE",
    "ENGINEERING PROFILE",
    "VISUAL HUD",
    "VOICE INTERFACE",
  ];
  const timers = [];
  let complete = false;

  const updateClock = () => {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString("en-GB", { hour12: false });
  };
  updateClock();
  const clockTimer = window.setInterval(updateClock, 1000);

  const endSequence = (wasSkipped = false) => {
    if (complete) return;
    complete = true;
    timers.forEach(window.clearTimeout);
    window.clearInterval(clockTimer);
    progress.style.transform = "scaleX(1)";
    status.textContent = wasSkipped ? "INTERFACE HANDOFF COMPLETE" : "SYSTEM ONLINE";
    document.body.classList.remove("booting");
    document.body.classList.add("interface-online");
    screen.classList.add("is-complete");
    screen.setAttribute("aria-hidden", "true");
    window.setTimeout(() => {
      screen.setAttribute("hidden", "");
    }, reducedMotionQuery.matches ? 0 : 520);
  };

  const interval = reducedMotionQuery.matches ? 40 : 185;
  bootItems.forEach((item, index) => {
    const timer = window.setTimeout(() => {
      if (complete) return;
      const line = document.createElement("li");
      line.innerHTML = `<span>[ OK ]</span> ${item}`;
      list.appendChild(line);
      requestAnimationFrame(() => line.classList.add("is-visible"));
      progress.style.transform = `scaleX(${(index + 1) / bootItems.length})`;
      if (index === bootItems.length - 1) {
        status.textContent = "CORE LINK ESTABLISHED";
      }
    }, interval * (index + 1));
    timers.push(timer);
  });
  timers.push(window.setTimeout(() => endSequence(), interval * (bootItems.length + 1) + (reducedMotionQuery.matches ? 80 : 360)));

  skipButton.addEventListener("click", () => endSequence(true));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !complete) endSequence(true);
  });
}

function setupReveals() {
  const revealItems = $$(".reveal-item");
  if (reducedMotionQuery.matches || !("IntersectionObserver" in window)) {
    revealItems.forEach((element) => element.classList.add("is-visible"));
    return;
  }

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -4% 0px" },
  );

  revealItems.forEach((element) => revealObserver.observe(element));
}

function setupModuleNavigation() {
  const railLabel = $("#activeModule");
  const railIndex = $("#activeSectionIndex");
  const sections = $$("[data-module]");
  const navLinks = $$("[data-nav]");
  let currentModule = "HOME";

  const setActive = (section) => {
    const module = section.dataset.module;
    if (!module || currentModule === module) return;
    currentModule = module;
    railLabel.textContent = module;
    railIndex.textContent = section.dataset.index || "00";
    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link.dataset.nav === section.id);
    });
  };

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const activeEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (activeEntry) setActive(activeEntry.target);
      },
      { rootMargin: "-32% 0px -56% 0px", threshold: [0, 0.08, 0.3] },
    );
    sections.forEach((section) => observer.observe(section));
  }
}

function setupMobileNavigation() {
  const toggle = $("#navToggle");
  const header = $("#siteHeader");
  const nav = $("#primaryNavigation");

  toggle.addEventListener("click", () => {
    const open = header.classList.toggle("is-nav-open");
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close system navigation" : "Open system navigation");
  });

  nav.addEventListener("click", (event) => {
    if (!event.target.closest("a")) return;
    header.classList.remove("is-nav-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-label", "Open system navigation");
  });
}

function setupToast() {
  const toast = $("#interfaceToast");
  let timer;
  return (message) => {
    window.clearTimeout(timer);
    toast.textContent = message;
    toast.classList.add("is-visible");
    timer = window.setTimeout(() => toast.classList.remove("is-visible"), 3400);
  };
}

function setupKeyboardShortcut(commandInput) {
  document.addEventListener("keydown", (event) => {
    const active = document.activeElement;
    const typing = active?.matches?.("input, textarea, select, [contenteditable='true']");
    if (event.key === "/" && !typing && !$("#projectDialog").open) {
      event.preventDefault();
      document.getElementById("console").scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => commandInput.focus(), 450);
    }
  });
}

function setupCore(voice, notify) {
  const core = $("#arcCore");
  const stage = $("#coreStage");
  let activationTimer;

  const visual = new CoreVisual(core, {
    reducedMotion: reducedMotionQuery.matches,
    onActivate: () => {
      stage.classList.remove("is-activated");
      // Restart the short diagnostic sequence on repeated activation.
      void stage.offsetWidth;
      stage.classList.add("is-activated");
      window.clearTimeout(activationTimer);
      activationTimer = window.setTimeout(() => stage.classList.remove("is-activated"), 3000);
      notify("Core link established. Voice interface requested.");
      voice.speak();
    },
  });
  visual.init();

  const updateMotion = (event) => visual.setReducedMotion(event.matches);
  reducedMotionQuery.addEventListener?.("change", updateMotion);
}

function bootstrap() {
  document.body.classList.add("js-ready");
  hydrateProfile();
  renderProjects();
  renderStack();
  setupProjectDialog();

  const notify = setupToast();
  const voice = createVoiceController();
  setupCore(voice, notify);

  const terminal = new CommandConsole({
    form: $("#terminalForm"),
    input: $("#commandInput"),
    output: $("#terminalOutput"),
    suggestions: $("#commandSuggestions"),
    config: PORTFOLIO_CONFIG,
    onVoice: () => {
      const started = voice.speak();
      if (started) notify("Voice interface activated from command console.");
    },
    onNavigate: () => notify("Interface route engaged."),
  });
  terminal.init();

  setupBootSequence();
  setupReveals();
  setupModuleNavigation();
  setupMobileNavigation();
  setupKeyboardShortcut($("#commandInput"));
}

bootstrap();
