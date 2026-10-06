/*
 * Portfolio content lives here so identity, links, and project details are easy
 * to maintain without touching the interface code.
 */
export const PORTFOLIO_CONFIG = {
  name: "Aayushman Baruah",
  role: "AI/ML Engineer",
  descriptor: "Python Developer · Machine Learning · Generative AI",
  intro:
    "Building thoughtful AI systems with Python, machine learning, and generative AI.",
  social: {
    github: "https://github.com/ayushmanbarua",
    linkedin: "https://www.linkedin.com/in/ayushman-barua/",
    // Add a real email address to enable the direct email action in the contact module.
    email: "",
  },
  projects: [
    {
      id: "P-01",
      slug: "ransomwarewatch",
      name: "RansomwareWatch",
      classification: "Security ML exploration",
      status: "EXPLORATORY",
      statusTone: "warning",
      technologies: ["Python", "Machine Learning", "Security"],
      summary:
        "A security-focused AI/ML project exploring ransomware detection and monitoring.",
      overview:
        "RansomwareWatch is a portfolio project focused on the problem space of ransomware detection and monitoring. Its project brief is intentionally scoped to exploration rather than making claims about production protection or measured outcomes.",
      problem:
        "Security teams need useful signals when behavior may warrant investigation. The project explores how a machine-learning workflow could support that monitoring conversation.",
      approach:
        "The work is framed around Python-based data handling, feature exploration, model experimentation, and a monitoring-oriented interface or workflow.",
      decisions:
        "Keep the system legible: separate data preparation, model experimentation, and monitoring concerns so that assumptions can be inspected and revised.",
      result:
        "Evaluation details and project results can be added here when they are ready to be published. No performance claim is implied by this interface.",
      github: "",
    },
    {
      id: "P-02",
      slug: "ai-ml-system-lab",
      name: "AI / ML System Lab",
      classification: "Experiment collection",
      status: "EXPERIMENTAL",
      statusTone: "cyan",
      technologies: ["TensorFlow", "Keras", "OpenCV", "WCGAN", "Python"],
      summary:
        "A collection of experiments across machine learning, deep learning, generative AI, computer vision, and model exploration.",
      overview:
        "AI / ML System Lab groups exploratory work across several AI disciplines in one evolving engineering space. It is a place for testing ideas, learning from model behavior, and turning experiments into better system intuition.",
      problem:
        "Different model families and input modalities create different engineering constraints. A shared lab makes it easier to examine those constraints deliberately.",
      approach:
        "Explore ML, deep learning, generative AI, and computer-vision workflows with Python and the relevant framework for each experiment.",
      decisions:
        "Treat experiments as traceable engineering artifacts. Keep the stack explicit and leave room to document datasets, assumptions, and evaluation methods per experiment.",
      result:
        "This is an evolving experiment collection. Specific outcomes should be documented alongside each individual experiment rather than generalized here.",
      github: "",
    },
    {
      id: "P-03",
      slug: "python-engineering-base",
      name: "Python Engineering Base",
      classification: "Foundational practice repository",
      status: "FOUNDATIONAL",
      statusTone: "neutral",
      technologies: ["Python", "Fundamentals", "Practice", "Mini Projects"],
      summary:
        "A structured Python fundamentals repository for examples, practice problems, mini projects, and interview preparation.",
      overview:
        "Python Engineering Base documents the steady, foundational work behind technical fluency: language concepts, small implementations, practice problems, and preparation material.",
      problem:
        "Strong AI/ML work depends on reliable software fundamentals. A structured base creates a repeatable space for practicing those fundamentals.",
      approach:
        "Organize concepts, examples, practice exercises, mini projects, and interview-oriented material into a navigable Python learning repository.",
      decisions:
        "Favor structure and consistency over inflated claims. The repository is designed to make progress, examples, and areas for iteration easy to find.",
      result:
        "The repository represents ongoing engineering discipline. Add individual repository links or milestones here as they become public.",
      github: "",
    },
  ],
  stack: [
    {
      group: "Languages",
      label: "CORE",
      tools: ["Python", "SQL", "JavaScript"],
    },
    {
      group: "Data",
      label: "WORKING",
      tools: ["Pandas", "NumPy", "Matplotlib"],
    },
    {
      group: "Machine Learning",
      label: "ACTIVE",
      tools: ["scikit-learn", "XGBoost"],
    },
    {
      group: "Deep Learning",
      label: "ACTIVE",
      tools: ["TensorFlow", "Keras"],
    },
    {
      group: "Computer Vision",
      label: "WORKING",
      tools: ["OpenCV"],
    },
    {
      group: "Generative AI",
      label: "EXPERIMENTAL",
      tools: ["Generative AI", "LLM workflows"],
    },
    {
      group: "Tools",
      label: "CORE",
      tools: ["Git", "GitHub", "Streamlit"],
    },
    {
      group: "Web",
      label: "WORKING",
      tools: ["MERN"],
    },
  ],
};
