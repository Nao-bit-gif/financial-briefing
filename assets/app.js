const SLOT_LABEL = { morning: "朝の回", evening: "夜の回" };

function formatDate(iso) {
  try {
    const d = new Date(iso);
    return new Intl.DateTimeFormat("ja-JP", {
      dateStyle: "medium",
      timeStyle: "short",
      timeZone: "Asia/Tokyo",
    }).format(d) + " JST";
  } catch {
    return iso;
  }
}

function renderSection(section) {
  const el = document.createElement("article");
  el.className = "report-section";

  const h2 = document.createElement("h2");
  h2.textContent = section.title;
  el.appendChild(h2);

  const body = document.createElement("div");
  body.className = "body";
  body.textContent = section.body;
  el.appendChild(body);

  if (Array.isArray(section.sources) && section.sources.length) {
    const sources = document.createElement("div");
    sources.className = "sources";
    section.sources.forEach((s) => {
      const a = document.createElement("a");
      a.href = s.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.textContent = s.title || s.url;
      sources.appendChild(a);
    });
    el.appendChild(sources);
  }

  return el;
}

function render(data) {
  document.getElementById("slot-badge").textContent = SLOT_LABEL[data.slot] || data.slot || "更新";
  document.getElementById("updated-at").textContent = "更新: " + formatDate(data.updated_at);
  document.getElementById("headline").textContent = data.headline || "";

  const sectionsEl = document.getElementById("sections");
  sectionsEl.innerHTML = "";
  (data.sections || []).forEach((s) => sectionsEl.appendChild(renderSection(s)));

  if (data.insight) {
    document.getElementById("insight").textContent = data.insight;
    document.getElementById("insight-card").hidden = false;
  }
}

async function renderHistory() {
  try {
    const res = await fetch("data/index.json", { cache: "no-store" });
    if (!res.ok) return;
    const index = await res.json();
    if (!Array.isArray(index) || !index.length) return;

    const list = document.getElementById("history-list");
    list.innerHTML = "";
    index
      .slice()
      .reverse()
      .slice(0, 14)
      .forEach((entry) => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = "data/history/" + entry.file;
        a.textContent = entry.label;
        a.addEventListener("click", async (e) => {
          e.preventDefault();
          const r = await fetch(a.href, { cache: "no-store" });
          if (r.ok) render(await r.json());
          window.scrollTo({ top: 0, behavior: "smooth" });
        });
        li.appendChild(a);
        list.appendChild(li);
      });
    document.getElementById("history").hidden = false;
  } catch {
    // history is optional; ignore failures
  }
}

async function main() {
  try {
    const res = await fetch("data/latest.json", { cache: "no-store" });
    if (!res.ok) throw new Error("data/latest.json not found");
    render(await res.json());
  } catch (err) {
    document.getElementById("main").innerHTML =
      '<div class="error-banner">最新データを読み込めませんでした。しばらくしてから再読み込みしてください。</div>';
  }
  renderHistory();
}

main();
