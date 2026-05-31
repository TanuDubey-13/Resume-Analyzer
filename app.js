const resumeText = document.querySelector("#resumeText");
const targetRole = document.querySelector("#targetRole");
const analyzeBtn = document.querySelector("#analyzeBtn");
const loadSample = document.querySelector("#loadSample");
const resumeFile = document.querySelector("#resumeFile");
const scoreRing = document.querySelector("#scoreRing");
const scoreValue = document.querySelector("#scoreValue");
const scoreTitle = document.querySelector("#scoreTitle");
const scoreSummary = document.querySelector("#scoreSummary");
const keywordMetric = document.querySelector("#keywordMetric");
const impactMetric = document.querySelector("#impactMetric");
const formatMetric = document.querySelector("#formatMetric");
const insightList = document.querySelector("#insightList");
const radarBoard = document.querySelector("#radarBoard");
const heroScore = document.querySelector("#heroScore");

const roleKeywords = {
  "product manager": ["roadmap", "stakeholder", "strategy", "analytics", "user", "launch", "experiment", "growth", "prioritize", "metrics"],
  "software engineer": ["javascript", "python", "api", "system", "testing", "database", "cloud", "react", "performance", "architecture"],
  "data analyst": ["sql", "python", "tableau", "dashboard", "analysis", "statistics", "excel", "metrics", "forecast", "insights"],
  "designer": ["figma", "prototype", "research", "accessibility", "wireframe", "visual", "interaction", "design system", "user", "brand"],
  "marketing manager": ["campaign", "seo", "brand", "conversion", "content", "pipeline", "analytics", "growth", "email", "revenue"]
};

const defaultKeywords = ["leadership", "collaboration", "metrics", "strategy", "delivery", "communication", "analysis", "automation", "customer", "growth"];

const sampleResume = `Avery Singh
Product Manager

Summary
Product manager with 6 years of experience leading SaaS roadmap strategy, user research, analytics, and cross-functional launches.

Experience
Senior Product Manager, Cloudline
- Led a pricing experiment that increased trial-to-paid conversion by 18% in one quarter.
- Partnered with engineering, design, sales, and customer success to launch three analytics features for 42,000 users.
- Built roadmap prioritization model using SQL dashboards, user feedback, and revenue impact.

Product Analyst, BrightCart
- Automated weekly funnel reporting and reduced manual analysis time by 12 hours per week.
- Presented customer insights to executives and influenced a checkout redesign that lifted revenue by 9%.

Skills
Roadmap planning, stakeholder management, SQL, analytics, experimentation, launch planning, user research, communication`;

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9+#.\s-]/g, " ");
}

function getKeywords(role) {
  const key = normalize(role).trim();
  return roleKeywords[key] || defaultKeywords;
}

function percent(value) {
  return `${Math.round(value)}%`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function analyzeResume() {
  const text = resumeText.value.trim();
  const role = targetRole.value.trim() || "target role";

  if (!text) {
    updateResults({
      score: 0,
      keywordFit: 0,
      impact: 0,
      structure: 0,
      title: "Resume needed",
      summary: "Paste resume content or upload a text file to start the analysis.",
      insights: [
        ["Add resume text", "The analyzer needs resume content before it can score role fit and improvement areas."]
      ],
      keywords: getKeywords(role).map((word) => ({ word, found: false }))
    });
    return;
  }

  const clean = normalize(text);
  const words = clean.split(/\s+/).filter(Boolean);
  const keywords = getKeywords(role);
  const foundKeywords = keywords.filter((word) => clean.includes(word));
  const keywordFit = (foundKeywords.length / keywords.length) * 100;

  const numberMatches = text.match(/\b(\d+%?|\$[0-9,.]+|[0-9,.]+\s?(k|m|million|hours|users|customers|x))\b/gi) || [];
  const actionMatches = clean.match(/\b(led|built|launched|improved|reduced|increased|created|managed|owned|designed|automated|delivered)\b/g) || [];
  const impact = clamp(numberMatches.length * 10 + actionMatches.length * 5, 0, 100);

  const sections = ["experience", "skills", "education", "summary", "projects"].filter((section) =>
    clean.includes(section)
  );

  const readableLength = clamp((words.length / 450) * 70, 0, 70);
  const structure = clamp(sections.length * 12 + readableLength, 0, 100);

  const score = Math.round(keywordFit * 0.42 + impact * 0.32 + structure * 0.26);
  const missing = keywords.filter((word) => !clean.includes(word)).slice(0, 4);

  const insights = buildInsights({
    score,
    role,
    foundKeywords,
    missing,
    numberMatches,
    actionMatches,
    sections,
    words
  });

  updateResults({
    score,
    keywordFit,
    impact,
    structure,
    title: score >= 82 ? "Strong match" : score >= 62 ? "Promising fit" : "Needs sharpening",
    summary: `This resume shows ${foundKeywords.length} of ${keywords.length} target ${role} signals with ${numberMatches.length} measurable impact proof points.`,
    insights,
    keywords: keywords.map((word) => ({ word, found: clean.includes(word) }))
  });
}

function buildInsights({ score, role, foundKeywords, missing, numberMatches, actionMatches, sections, words }) {
  const insights = [];

  if (foundKeywords.length) {
    insights.push([
      "Strong role signals",
      `Matched keywords include ${foundKeywords.slice(0, 5).join(", ")} for the ${role} direction.`
    ]);
  } else {
    insights.push([
      "Weak keyword alignment",
      `Add language that mirrors the ${role} posting, especially tools, outcomes, and domain terms.`
    ]);
  }

  if (missing.length) {
    insights.push([
      "Keyword gaps",
      `Consider adding honest evidence for ${missing.join(", ")} if those skills match your experience.`
    ]);
  }

  if (numberMatches.length < 3) {
    insights.push([
      "Add quantified wins",
      "Use numbers for scale, efficiency, revenue, users, quality, or time saved so impact feels concrete."
    ]);
  } else {
    insights.push([
      "Impact is measurable",
      "The resume includes quantified outcomes, which helps recruiters understand scope and value quickly."
    ]);
  }

  if (actionMatches.length < 5) {
    insights.push([
      "Lead bullets with verbs",
      "Start more bullets with strong ownership verbs like led, built, launched, improved, or automated."
    ]);
  }

  if (!sections.includes("skills")) {
    insights.push([
      "Add a skills section",
      "A compact skills section improves parsing and makes technical or domain strengths easier to scan."
    ]);
  }

  if (words.length < 180) {
    insights.push([
      "Expand detail",
      "The resume appears short. Add selected achievements, tools, teams, and business context."
    ]);
  }

  if (score >= 82) {
    insights.push([
      "Next best edit",
      "Tailor the top summary and first three bullets to the exact job description before applying."
    ]);
  }

  return insights.slice(0, 5);
}

function updateResults(result) {
  scoreRing.style.setProperty("--score", result.score);
  scoreValue.textContent = result.score;
  heroScore.textContent = result.score || 92;
  scoreTitle.textContent = result.title;
  scoreSummary.textContent = result.summary;
  keywordMetric.textContent = percent(result.keywordFit);
  impactMetric.textContent = percent(result.impact);
  formatMetric.textContent = percent(result.structure);

  insightList.replaceChildren();

  result.insights.forEach(([title, body]) => {
    const article = document.createElement("article");
    const heading = document.createElement("strong");
    const copy = document.createElement("p");

    article.className = "insight";
    heading.textContent = title;
    copy.textContent = body;

    article.append(heading, copy);
    insightList.append(article);
  });

  renderRadar(result.keywords);
}

function renderRadar(keywords) {
  radarBoard.innerHTML = "";

  keywords.forEach((item, index) => {
    const tag = document.createElement("span");
    const angle = (index / keywords.length) * Math.PI * 2;
    const radius = item.found ? 34 + (index % 4) * 9 : 43 + (index % 3) * 11;
    const x = 50 + Math.cos(angle) * radius;
    const y = 50 + Math.sin(angle) * Math.min(radius, 38);

    tag.textContent = item.word;
    tag.style.left = `${clamp(x, 12, 88)}%`;
    tag.style.top = `${clamp(y, 16, 84)}%`;
    tag.style.borderColor = item.found ? "rgba(89, 240, 154, 0.45)" : "rgba(255, 255, 255, 0.12)";
    tag.style.background = item.found ? "rgba(89, 240, 154, 0.16)" : "rgba(255, 255, 255, 0.07)";
    tag.style.color = item.found ? "#ccffe0" : "#9ba8bd";

    radarBoard.appendChild(tag);
  });
}

loadSample.addEventListener("click", () => {
  resumeText.value = sampleResume;
  targetRole.value = "Product Manager";
  analyzeResume();
  document.querySelector("#workspace").scrollIntoView({ behavior: "smooth" });
});

analyzeBtn.addEventListener("click", analyzeResume);
targetRole.addEventListener("change", analyzeResume);

resumeFile.addEventListener("change", async (event) => {
  const [file] = event.target.files;
  if (!file) return;

  try {
    resumeText.value = "Reading resume file...";

    if (file.type === "application/pdf" || file.name.toLowerCase().endsWith(".pdf")) {
      resumeText.value = await readPdfText(file);
    } else {
      resumeText.value = await file.text();
    }

    analyzeResume();
  } catch (error) {
    resumeText.value = "";

    updateResults({
      score: 0,
      keywordFit: 0,
      impact: 0,
      structure: 0,
      title: "Could not read file",
      summary: "Try a text-based PDF, TXT, MD, or CSV resume. Scanned image PDFs may need OCR first.",
      insights: [
        ["PDF reading failed", "This browser could not extract text from the uploaded file. If it is a scanned PDF, convert it with OCR and upload again."]
      ],
      keywords: getKeywords(targetRole.value).map((word) => ({ word, found: false }))
    });
  }
});

async function readPdfText(file) {
  if (!window.pdfjsLib) {
    throw new Error("PDF parser is not available.");
  }

  pdfjsLib.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js";

  const data = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data }).promise;
  const pages = [];

  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const text = content.items.map((item) => item.str).join(" ");
    pages.push(text);
  }

  return pages.join("\n\n").trim();
}

function startSignalCanvas() {
  const canvas = document.querySelector("#signalCanvas");
  const ctx = canvas.getContext("2d");

  const points = Array.from({ length: 58 }, () => ({
    x: Math.random(),
    y: Math.random(),
    vx: (Math.random() - 0.5) * 0.0007,
    vy: (Math.random() - 0.5) * 0.0007
  }));

  function resize() {
    canvas.width = window.innerWidth * window.devicePixelRatio;
    canvas.height = window.innerHeight * window.devicePixelRatio;
    ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
  }

  function draw() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    ctx.clearRect(0, 0, width, height);

    points.forEach((point) => {
      point.x += point.vx;
      point.y += point.vy;

      if (point.x < 0 || point.x > 1) point.vx *= -1;
      if (point.y < 0 || point.y > 1) point.vy *= -1;
    });

    for (let i = 0; i < points.length; i += 1) {
      for (let j = i + 1; j < points.length; j += 1) {
        const a = points[i];
        const b = points[j];
        const dx = (a.x - b.x) * width;
        const dy = (a.y - b.y) * height;
        const distance = Math.hypot(dx, dy);

        if (distance < 150) {
          ctx.strokeStyle = `rgba(49, 215, 255, ${0.18 - distance / 900})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x * width, a.y * height);
          ctx.lineTo(b.x * width, b.y * height);
          ctx.stroke();
        }
      }
    }

    points.forEach((point) => {
      ctx.fillStyle = "rgba(247, 251, 255, 0.38)";
      ctx.beginPath();
      ctx.arc(point.x * width, point.y * height, 1.6, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();
}

renderRadar(getKeywords(targetRole.value).map((word) => ({ word, found: false })));
startSignalCanvas();
