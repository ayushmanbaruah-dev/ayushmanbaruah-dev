# AAYUSHMAN BARUAH

> **AI / ML ENGINEER**
>
> Python · Machine Learning · Generative AI · AI Systems · Computer Vision · Data / ML Engineering

A personal portfolio built as an interactive engineering interface—not a conventional developer landing page. It uses a restrained industrial HUD language, an animated energy core, a browser-native voice introduction, and a working command console to make the work itself the center of the experience.

[Explore the portfolio interface](#run-locally) · [GitHub](https://github.com/ayushmanbarua) · [LinkedIn](https://www.linkedin.com/in/ayushman-barua/)

---

## // PROFILE

I am focused on building thoughtful AI systems with Python, machine learning, and generative AI. The portfolio is designed to communicate a systems mindset: model work should be inspectable, usable, and connected to a clear engineering purpose.

## // FEATURED PROJECT RECORDS

| ID | Project | Focus |
| --- | --- | --- |
| `P-01` | **RansomwareWatch** | A security-focused AI/ML project exploring ransomware detection and monitoring. |
| `P-02` | **AI / ML System Lab** | Explorations across machine learning, deep learning, generative AI, computer vision, and model experimentation. |
| `P-03` | **Python Engineering Base** | Structured Python examples, fundamentals, practice problems, mini projects, and interview preparation. |

Project descriptions are intentionally precise. This site does not imply production deployments, performance metrics, or outcomes that have not been published.

## // ENGINEERING STACK

| System group | Working set |
| --- | --- |
| **Languages** | Python, SQL, JavaScript |
| **Data** | Pandas, NumPy, Matplotlib |
| **Machine Learning** | scikit-learn, XGBoost |
| **Deep Learning** | TensorFlow, Keras |
| **Computer Vision** | OpenCV |
| **Generative AI** | Generative AI, LLM workflows |
| **Tools** | Git, GitHub, Streamlit |
| **Web** | MERN |

## // PORTFOLIO ARCHITECTURE

```text
.
├── index.html                 # Semantic static page and UI structure
├── css/
│   └── styles.css             # Responsive HUD visual system and motion rules
├── js/
│   ├── config.js              # Single editable profile / links / projects config
│   ├── app.js                 # Page orchestration, voice, boot, modal, navigation
│   ├── core-visual.js         # Interactive SVG + canvas energy core controller
│   └── console.js             # Command console and autocomplete behavior
└── assets/
    ├── icons/
    │   └── ab-core.svg        # Original interface favicon
    └── images/                # Reserved for future original project imagery
```

### Interface features

- Short, skippable system boot sequence
- Interactive CSS/SVG/canvas energy core with pointer response and activation state
- Browser-native voice introduction through the Web Speech API, with a graceful fallback
- Project control records with hover diagnostics and accessible detail dialogs
- Technology matrix without arbitrary percentage skill bars
- Working command console: `help`, `about`, `projects`, `stack`, `systems`, `contact`, `voice`, `status`, and `clear`
- Responsive HUD navigation, section state indicator, keyboard support, focus styles, and reduced-motion support
- Zero build step and no backend dependency—ready for GitHub Pages

## // CUSTOMIZE CONTENT

All high-frequency edits are in **[`js/config.js`](js/config.js)**:

```js
export const PORTFOLIO_CONFIG = {
  name: "Aayushman Baruah",
  role: "AI/ML Engineer",
  social: {
    github: "https://github.com/ayushmanbarua",
    linkedin: "https://www.linkedin.com/in/ayushman-barua/",
    email: "", // add an email address to enable the email channel
  },
  projects: [/* project records */],
  stack: [/* technology groups */],
};
```

Before publishing, add an email address and repository URLs for any project that is public. The project modal intentionally displays a configuration note instead of inventing a repository link when a project URL is absent.

## // RUN LOCALLY

No package install is required. Serve the directory with any static web server:

```bash
# Clone your repository, then:
cd ayushmanbaruah-dev
python3 -m http.server 4173
```

Open [http://localhost:4173](http://localhost:4173) in a modern browser.

> The voice action depends on the browser's Web Speech API and typically requires a user interaction. If it is unavailable or blocked, the interface displays a clear visual fallback.

## // DEPLOY TO GITHUB PAGES

1. Push the repository to GitHub.
2. Open the repository on GitHub and select **Settings** → **Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Choose the branch containing this site (usually `main`) and select the `/ (root)` folder.
5. Click **Save**.
6. After GitHub finishes publishing, open the URL displayed in the Pages panel—usually:

   ```text
   https://<github-username>.github.io/<repository-name>/
   ```

There is no build command, environment variable, or backend service to configure.

## // DESIGN PRINCIPLES

- Original engineering-interface inspiration; no character imagery, movie screenshots, trademarks, or imitation voice
- Dark industrial palette with controlled cyan and limited warm-alert accents
- Motion is present to communicate system state, not as decoration
- Clear content hierarchy and accessible controls take priority over visual effects
- `prefers-reduced-motion` dramatically reduces animated behavior

---

**Connection channels**

[GitHub](https://github.com/ayushmanbarua) · [LinkedIn](https://www.linkedin.com/in/ayushman-barua/)
