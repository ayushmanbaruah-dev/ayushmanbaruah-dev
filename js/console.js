const COMMAND_ORDER = [
  "help",
  "about",
  "projects",
  "stack",
  "systems",
  "contact",
  "voice",
  "status",
  "clear",
];

export class CommandConsole {
  constructor({ form, input, output, suggestions, config, onVoice, onNavigate }) {
    this.form = form;
    this.input = input;
    this.output = output;
    this.suggestions = suggestions;
    this.config = config;
    this.onVoice = onVoice;
    this.onNavigate = onNavigate;
    this.selectedSuggestion = -1;
  }

  init() {
    if (!this.form || !this.input || !this.output) return;

    this.write("AB TERMINAL v1.0 / PORTFOLIO INTERFACE", "muted");
    this.write("Type HELP to inspect available commands.", "system");
    this.renderSuggestions("");

    this.form.addEventListener("submit", (event) => {
      event.preventDefault();
      this.execute(this.input.value);
    });

    this.input.addEventListener("input", () => {
      this.selectedSuggestion = -1;
      this.renderSuggestions(this.input.value);
    });

    this.input.addEventListener("keydown", (event) => this.handleKeys(event));

    this.suggestions?.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-command]");
      if (!button) return;
      this.execute(button.dataset.command);
      this.input.focus();
    });
  }

  handleKeys(event) {
    const matchingCommands = this.getMatchingCommands(this.input.value);

    if (event.key === "Tab" && matchingCommands.length) {
      event.preventDefault();
      this.input.value = matchingCommands[0];
      this.renderSuggestions(this.input.value);
      return;
    }

    if (event.key === "ArrowDown" && matchingCommands.length) {
      event.preventDefault();
      this.selectedSuggestion = (this.selectedSuggestion + 1) % matchingCommands.length;
      this.setSuggestionSelection();
      return;
    }

    if (event.key === "ArrowUp" && matchingCommands.length) {
      event.preventDefault();
      this.selectedSuggestion =
        this.selectedSuggestion <= 0 ? matchingCommands.length - 1 : this.selectedSuggestion - 1;
      this.setSuggestionSelection();
      return;
    }

    if (event.key === "Enter" && this.selectedSuggestion >= 0 && matchingCommands.length) {
      event.preventDefault();
      this.execute(matchingCommands[this.selectedSuggestion]);
    }
  }

  execute(rawInput) {
    const command = rawInput.trim().toLowerCase();
    if (!command) return;

    this.write(`operator@ab:~$ ${command}`, "command");
    this.input.value = "";
    this.selectedSuggestion = -1;
    this.renderSuggestions("");

    if (command === "clear") {
      this.output.replaceChildren();
      this.write("TERMINAL BUFFER CLEARED.", "muted");
      return;
    }

    const handlers = {
      help: () => {
        this.write(
          "AVAILABLE COMMANDS\nHELP      command reference\nABOUT     operator profile\nPROJECTS  project records\nSTACK     technology matrix\nSYSTEMS   capability modules\nCONTACT   connection channels\nVOICE     activate voice output\nSTATUS    interface diagnostics\nCLEAR     clear terminal buffer",
          "system",
        );
      },
      about: () => {
        this.write(
          `${this.config.name.toUpperCase()}\n${this.config.role.toUpperCase()}\n${this.config.descriptor.toUpperCase()}\n\n${this.config.intro}`,
          "system",
        );
      },
      projects: () => {
        const records = this.config.projects
          .map((project) => `${project.id}  ${project.name.toUpperCase()}  /  ${project.status}`)
          .join("\n");
        this.write(`PROJECT CONTROL CENTER LOADED\n${records}`, "system");
        this.navigate("projects");
      },
      stack: () => {
        const categories = this.config.stack
          .map((item) => `${item.group.toUpperCase()}: ${item.tools.join(", ")}`)
          .join("\n");
        this.write(`ENGINEERING STACK LOADED\n${categories}`, "system");
        this.navigate("stack");
      },
      systems: () => {
        this.write(
          "SYSTEM ARCHITECTURE LOADED\nMODULE 01 / MACHINE LEARNING\nMODULE 02 / GENERATIVE AI\nMODULE 03 / AI SYSTEM ENGINEERING",
          "system",
        );
        this.navigate("systems");
      },
      contact: () => {
        const emailLine = this.config.social.email
          ? `EMAIL: ${this.config.social.email}`
          : "EMAIL: CONFIGURE IN js/config.js";
        this.write(
          `CONNECTION CHANNELS AVAILABLE\nGITHUB: ${this.config.social.github}\nLINKEDIN: ${this.config.social.linkedin}\n${emailLine}`,
          "system",
        );
        this.navigate("contact");
      },
      voice: () => {
        this.write("VOICE INTERFACE REQUESTED.", "system");
        this.onVoice?.();
      },
      status: () => {
        this.write(
          "INTERFACE STATUS\nCORE: STABLE\nPROFILE INDEX: READY\nPROJECT DATABASE: CONNECTED\nVOICE CHANNEL: BROWSER DEPENDENT\n\nStatus labels describe this interface, not production infrastructure.",
          "system",
        );
      },
    };

    const handler = handlers[command];
    if (handler) {
      handler();
    } else {
      this.write(`UNKNOWN COMMAND: ${command.toUpperCase()}\nUse HELP for available commands.`, "error");
    }
  }

  write(message, type = "system") {
    const line = document.createElement("p");
    line.className = `terminal-line terminal-line--${type}`;
    line.textContent = message;
    this.output.appendChild(line);
    this.output.scrollTop = this.output.scrollHeight;
  }

  navigate(sectionId) {
    const section = document.getElementById(sectionId);
    if (!section) return;

    window.setTimeout(() => {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      this.onNavigate?.(sectionId);
    }, 120);
  }

  getMatchingCommands(query) {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return COMMAND_ORDER;
    return COMMAND_ORDER.filter((command) => command.startsWith(normalized));
  }

  renderSuggestions(query) {
    if (!this.suggestions) return;
    const matchingCommands = this.getMatchingCommands(query).slice(0, 6);
    this.suggestions.replaceChildren();

    matchingCommands.forEach((command, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.dataset.command = command;
      button.className = "command-suggestion";
      button.textContent = command;
      button.setAttribute("aria-label", `Run ${command} command`);
      if (index === this.selectedSuggestion) button.classList.add("is-selected");
      this.suggestions.appendChild(button);
    });
  }

  setSuggestionSelection() {
    const buttons = this.suggestions?.querySelectorAll("button");
    buttons?.forEach((button, index) => {
      button.classList.toggle("is-selected", index === this.selectedSuggestion);
    });
  }
}
