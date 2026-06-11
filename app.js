const STORAGE_KEY = "arccos-input-entries";
const ROUND_NAME_STORAGE_KEY = "arccos-input-round-name";
const ROUND_PLAN_STORAGE_KEY = "arccos-input-round-plan";
const GENERAL_NOTES_STORAGE_KEY = "arccos-input-general-notes";

const teeClubs = [
  { name: "Driver" },
  { name: "Mini Driver" },
  { name: "3 Wood HL" },
  { name: "7 Wood" },
  { name: "5 Iron" },
  { name: "6 Iron" },
  { name: "7 Iron" },
  { name: "8 Iron" },
  { name: "9 Iron" },
  { name: "Pitching Wedge" },
  { name: "48 Degree Wedge" },
  { name: "52 Degree Wedge" },
  { name: "56 Degree Wedge" },
  { name: "60 Degree Wedge" }
];

const secondShotClubs = [
  { name: "3 Wood HL" },
  { name: "7 Wood" },
  { name: "5 Iron" },
  { name: "6 Iron" },
  { name: "7 Iron" },
  { name: "8 Iron" },
  { name: "9 Iron" },
  { name: "Pitching Wedge" },
  { name: "48 Degree Wedge" },
  { name: "52 Degree Wedge" },
  { name: "56 Degree Wedge" },
  { name: "60 Degree Wedge" }
];

const approachClubs = [
  { name: "60 Degree Wedge" },
  { name: "56 Degree Wedge" },
  { name: "52 Degree Wedge" },
  { name: "48 Degree Wedge" },
  { name: "Pitching Wedge" },
  { name: "9 Iron" },
  { name: "8 Iron" },
  { name: "7 Iron" },
  { name: "6 Iron" },
  { name: "5 Iron" },
  { name: "7 Wood" },
  { name: "3 Wood HL" }
];

const parOptions = ["3", "4", "5"];
const puttOptions = ["0", "1", "2", "3"];
const additionalShotOptions = ["No", "Yes"];

const form = document.querySelector("#shotForm");
const roundNameInput = document.querySelector('input[name="roundName"]');
const holeInput = document.querySelector('input[name="hole"]');
const parInput = document.querySelector("#parInput");
const parGroup = document.querySelector("#parGroup");
const teeShotSection = document.querySelector("#teeShotSection");
const teeClubPicker = document.querySelector("#teeClubPicker");
const teeClubInput = document.querySelector("#teeClubInput");
const secondShotSection = document.querySelector("#secondShotSection");
const secondShotClubInput = document.querySelector("#secondShotClubInput");
const secondShotClubGroup = document.querySelector("#secondShotClubGroup");
const approachClubInput = document.querySelector("#approachClubInput");
const approachClubGroup = document.querySelector("#approachClubGroup");
const addAnotherShotInput = document.querySelector("#addAnotherShotInput");
const addAnotherShotGroup = document.querySelector("#addAnotherShotGroup");
const extraApproachSection = document.querySelector("#extraApproachSection");
const extraApproachClubInput = document.querySelector("#extraApproachClubInput");
const extraApproachClubGroup = document.querySelector("#extraApproachClubGroup");
const puttsInput = document.querySelector("#puttsInput");
const puttsGroup = document.querySelector("#puttsGroup");
const historyList = document.querySelector("#historyList");
const emptyState = document.querySelector("#emptyState");
const statsGrid = document.querySelector("#statsGrid");
const clubReport = document.querySelector("#clubReport");
const heroSummary = document.querySelector("#heroSummary");
const startRoundButton = document.querySelector("#startRoundButton");
const resetFormButton = document.querySelector("#resetFormButton");
const clearAllButton = document.querySelector("#clearAllButton");
const exportButton = document.querySelector("#exportButton");
const historyTemplate = document.querySelector("#historyItemTemplate");
const saveFeedback = document.querySelector("#saveFeedback");
const roundPlanInput = document.querySelector("#roundPlanInput");
const generalNotesInput = document.querySelector("#generalNotesInput");
const mobileNav = document.querySelector(".mobile-nav");
const navButtons = document.querySelectorAll(".mobile-nav-button");
const panels = document.querySelectorAll(".dashboard, .dashboard-panel");

let entries = loadEntries();
let currentView = "entryPanel";

bootstrap();

function bootstrap() {
  renderTeeClubPicker();
  renderOptionGroup(parGroup, parInput, parOptions, "option-button", syncParView);
  renderOptionGroup(secondShotClubGroup, secondShotClubInput, secondShotClubs.map((club) => club.name));
  renderOptionGroup(approachClubGroup, approachClubInput, approachClubs.map((club) => club.name));
  renderOptionGroup(addAnotherShotGroup, addAnotherShotInput, additionalShotOptions, "option-button", syncAdditionalShotView);
  renderOptionGroup(extraApproachClubGroup, extraApproachClubInput, approachClubs.map((club) => club.name));
  renderOptionGroup(puttsGroup, puttsInput, puttOptions, "option-button");

  form.addEventListener("submit", handleSubmit);
  resetFormButton.addEventListener("click", resetForm);
  startRoundButton.addEventListener("click", startNewRound);
  clearAllButton.addEventListener("click", clearAllEntries);
  exportButton.addEventListener("click", exportEntriesAsCsv);
  historyList.addEventListener("click", handleDeleteClick);
  roundPlanInput.addEventListener("input", handleRoundPlanInput);
  generalNotesInput.addEventListener("input", handleGeneralNotesInput);
  navButtons.forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.viewTarget));
  });
  window.addEventListener("resize", handleResize);

  roundNameInput.value = loadSavedRoundName();
  roundPlanInput.value = loadSavedRoundPlan();
  generalNotesInput.value = loadSavedGeneralNotes();
  resetForm();
  updateSaveFeedback();
  registerServiceWorker();
  render();
  switchView("entryPanel");
}

function renderTeeClubPicker() {
  teeClubPicker.innerHTML = "";

  teeClubs.forEach((club) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "club-tile club-tile-text";
    button.dataset.value = club.name;
    button.innerHTML = `<span>${club.name}</span>`;
    button.addEventListener("click", () => {
      teeClubInput.value = club.name;
      syncClubPicker();
    });
    teeClubPicker.appendChild(button);
  });
}

function renderOptionGroup(container, input, options, buttonClass = "option-button", onChange) {
  container.innerHTML = "";

  options.forEach((option) => {
    const value = typeof option === "string" ? option : option.value;
    const label = typeof option === "string" ? option : option.label;
    const button = document.createElement("button");
    button.type = "button";
    button.className = buttonClass;
    button.dataset.value = value;
    button.textContent = label;
    button.addEventListener("click", () => {
      input.value = value;
      syncOptionButtons(container, input.value);
      if (onChange) {
        onChange();
      }
    });
    container.appendChild(button);
  });
}

function syncOptionButtons(container, selectedValue) {
  container.querySelectorAll("button").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.value === selectedValue);
  });
}

function syncClubPicker() {
  teeClubPicker.querySelectorAll(".club-tile").forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.value === teeClubInput.value);
  });
}

function syncAdditionalShotView() {
  const showExtraShot = addAnotherShotInput.value === "Yes";
  extraApproachSection.classList.toggle("is-hidden", !showExtraShot);

  if (!showExtraShot) {
    extraApproachClubInput.value = "";
    syncOptionButtons(extraApproachClubGroup, extraApproachClubInput.value);
  }
}

function handleSubmit(event) {
  event.preventDefault();

  if (!form.reportValidity()) {
    return;
  }

  const par = Number(parInput.value || "4");
  const isPar3 = par === 3;
  const isPar5 = par === 5;
  const missingSelections = [];

  if (!isPar3 && !teeClubInput.value) {
    missingSelections.push("tee club");
  }
  if (isPar5 && !secondShotClubInput.value) {
    missingSelections.push("second shot club");
  }
  if (!approachClubInput.value) {
    missingSelections.push("approach club");
  }
  if (!addAnotherShotInput.value) {
    missingSelections.push("add another shot");
  }
  if (addAnotherShotInput.value === "Yes" && !extraApproachClubInput.value) {
    missingSelections.push("additional shot club");
  }
  if (!puttsInput.value) {
    missingSelections.push("number of putts");
  }

  if (missingSelections.length) {
    window.alert(`Please select: ${missingSelections.join(", ")}.`);
    return;
  }

  const data = new FormData(form);
  const submittedRoundName = normalizeText(data.get("roundName"));
  const rememberedRoundName = loadSavedRoundName();
  const roundName = submittedRoundName || rememberedRoundName || "Practice Round";

  saveRoundName(roundName);
  roundNameInput.value = roundName;

  const entry = {
    id: createEntryId(),
    createdAt: new Date().toISOString(),
    roundName,
    hole: Number(data.get("hole")),
    par,
    teeClub: isPar3 ? "N/A (Par 3)" : teeClubInput.value,
    secondShotClub: isPar5 ? secondShotClubInput.value : "N/A",
    approachClub: approachClubInput.value,
    addAnotherShot: addAnotherShotInput.value,
    extraApproachClub: addAnotherShotInput.value === "Yes" ? extraApproachClubInput.value : "N/A",
    putts: Number(puttsInput.value),
    notes: normalizeText(data.get("notes"))
  };

  entries = [entry, ...entries];
  persistEntries();
  prepareNextHole(entry.hole + 1);
  updateSaveFeedback(entry);
  render();

  if (entry.hole >= 18) {
    switchView("statsPanel");
  } else {
    switchView("entryPanel");
  }
}

function resetForm() {
  resetFormWithHole(1);
}

function resetFormWithHole(holeNumber) {
  const savedRoundName = loadSavedRoundName();

  form.reset();
  roundNameInput.value = savedRoundName;
  holeInput.value = String(Math.min(Math.max(holeNumber, 1), 18));
  parInput.value = "4";
  teeClubInput.value = "";
  secondShotClubInput.value = "";
  approachClubInput.value = "";
  addAnotherShotInput.value = "No";
  extraApproachClubInput.value = "";
  puttsInput.value = "2";

  syncOptionButtons(parGroup, parInput.value);
  syncOptionButtons(secondShotClubGroup, secondShotClubInput.value);
  syncOptionButtons(approachClubGroup, approachClubInput.value);
  syncOptionButtons(addAnotherShotGroup, addAnotherShotInput.value);
  syncOptionButtons(extraApproachClubGroup, extraApproachClubInput.value);
  syncOptionButtons(puttsGroup, puttsInput.value);
  syncClubPicker();
  syncParView();
  syncAdditionalShotView();
  updateSaveFeedback();
}

function prepareNextHole(nextHoleNumber) {
  resetFormWithHole(nextHoleNumber > 18 ? 18 : nextHoleNumber);
}

function clearAllEntries() {
  const confirmed = window.confirm("Delete all saved Arccos input entries?");

  if (!confirmed) {
    return;
  }

  entries = [];
  persistEntries();
  updateSaveFeedback();
  render();
  switchView("entryPanel");
}

function startNewRound() {
  localStorage.removeItem(ROUND_NAME_STORAGE_KEY);
  resetFormWithHole(1);
  switchView("entryPanel");
  roundNameInput.focus();
}

function handleDeleteClick(event) {
  const target = event.target;

  if (!(target instanceof HTMLButtonElement) || !target.classList.contains("delete-button")) {
    return;
  }

  const card = target.closest(".history-card");
  const entryId = card?.dataset.entryId;

  if (!entryId) {
    return;
  }

  entries = entries.filter((entry) => entry.id !== entryId);
  persistEntries();
  updateSaveFeedback();
  render();
}

function handleRoundPlanInput() {
  saveRoundPlan(roundPlanInput.value);
}

function handleGeneralNotesInput() {
  saveGeneralNotes(generalNotesInput.value);
}

function render() {
  renderHeroSummary();
  renderStats();
  renderHistory();
  renderClubReport();
  exportButton.disabled = entries.length === 0;
}

function renderHeroSummary() {
  const latestEntry = getLatestEntry();
  const summaryItems = [
    { value: latestEntry ? `#${latestEntry.hole}` : "-", label: "Last hole" },
    { value: latestEntry ? `Par ${latestEntry.par}` : "-", label: "Last par" }
  ];

  heroSummary.innerHTML = summaryItems
    .map(
      (item) => `
        <div class="hero-summary-item">
          <strong>${item.value}</strong>
          <span>${item.label}</span>
        </div>
      `
    )
    .join("");
}

function renderStats() {
  const latestEntry = getLatestEntry();
  const averagePutts = entries.length
    ? (entries.reduce((sum, entry) => sum + entry.putts, 0) / entries.length).toFixed(1)
    : "0.0";
  const par3Count = entries.filter((entry) => entry.par === 3).length;
  const par4Count = entries.filter((entry) => entry.par === 4).length;
  const par5Count = entries.filter((entry) => entry.par === 5).length;
  const extraShotCount = entries.filter((entry) => entry.addAnotherShot === "Yes").length;

  const stats = [
    { label: "Holes tracked", value: String(entries.length) },
    { label: "Avg putts", value: `${averagePutts}` },
    { label: "Par 3 holes", value: String(par3Count) },
    { label: "Par 4 holes", value: String(par4Count) },
    { label: "Par 5 holes", value: String(par5Count) },
    { label: "Extra shots logged", value: String(extraShotCount) },
    { label: "Last saved", value: latestEntry ? formatDate(latestEntry.createdAt) : "None" }
  ];

  statsGrid.innerHTML = stats
    .map(
      (stat) => `
        <article class="stat-card">
          <p class="stat-label">${stat.label}</p>
          <p class="stat-value">${stat.value}</p>
        </article>
      `
    )
    .join("");
}

function renderClubReport() {
  if (!entries.length) {
    clubReport.innerHTML = `
      <div class="empty-state">Save a few holes to build approach-club usage.</div>
    `;
    return;
  }

  const clubTotals = new Map();

  entries.forEach((entry) => {
    [entry.approachClub, entry.extraApproachClub].forEach((clubName) => {
      if (!clubName || clubName === "N/A") {
        return;
      }

      const current = clubTotals.get(clubName) || {
        clubName,
        shots: 0
      };

      current.shots += 1;
      clubTotals.set(clubName, current);
    });
  });

  const totalShots = [...clubTotals.values()].reduce((sum, club) => sum + club.shots, 0) || 1;

  clubReport.innerHTML = [...clubTotals.values()]
    .sort((a, b) => b.shots - a.shots || a.clubName.localeCompare(b.clubName))
    .map((club) => {
      const usageRate = Math.round((club.shots / totalShots) * 100);
      return `
        <article class="club-report-card">
          <div class="club-report-card-top">
            <h4>${club.clubName}</h4>
            <span class="club-report-meta">${club.shots} shot${club.shots === 1 ? "" : "s"}</span>
          </div>
          <div class="club-report-stats">
            <div class="detail-chip"><strong>Usage</strong>${usageRate}%</div>
          </div>
        </article>
      `;
    })
    .join("");
}

function switchView(targetId) {
  currentView = targetId;
  applyViewState(targetId);
  scrollPanelIntoView(targetId);
}

function handleResize() {
  applyViewState(currentView);
}

function applyViewState(targetId) {
  if (window.innerWidth >= 1180) {
    panels.forEach((panel) => {
      panel.hidden = false;
    });
    navButtons.forEach((button) => button.classList.remove("is-active"));
    return;
  }

  panels.forEach((panel) => {
    panel.hidden = panel.id !== targetId;
  });

  navButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.viewTarget === targetId);
  });
}

function scrollPanelIntoView(targetId) {
  const targetPanel = document.querySelector(`#${targetId}`);

  if (!targetPanel) {
    return;
  }

  requestAnimationFrame(() => {
    if (targetId === "entryPanel") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const navOffset = mobileNav && getComputedStyle(mobileNav).display !== "none"
      ? mobileNav.offsetHeight + 24
      : 24;
    const panelTop = window.scrollY + targetPanel.getBoundingClientRect().top;

    window.scrollTo({
      top: Math.max(panelTop - navOffset, 0),
      behavior: "smooth"
    });
  });
}

function updateSaveFeedback(savedEntry) {
  if (savedEntry) {
    saveFeedback.textContent = `Saved hole ${savedEntry.hole} for ${savedEntry.roundName}.`;
    return;
  }

  const latestEntry = getLatestEntry();
  saveFeedback.textContent = latestEntry
    ? `Latest saved: hole ${latestEntry.hole} on ${formatDate(latestEntry.createdAt)}.`
    : "Nothing saved yet.";
}

function renderHistory() {
  const displayEntries = getHistoryEntries();

  historyList.innerHTML = "";
  emptyState.hidden = entries.length > 0;

  displayEntries.forEach((entry) => {
    const fragment = historyTemplate.content.cloneNode(true);
    const card = fragment.querySelector(".history-card");
    const round = fragment.querySelector(".history-round");
    const hole = fragment.querySelector(".history-hole");
    const details = fragment.querySelector(".history-details");
    const notes = fragment.querySelector(".history-notes");

    card.dataset.entryId = entry.id;
    round.textContent = `${entry.roundName} • ${formatDate(entry.createdAt)}`;
    hole.textContent = `Hole ${entry.hole}`;

    const detailItems = [
      { label: "Par", value: String(entry.par) },
      { label: "Tee club", value: entry.teeClub },
      { label: "2nd shot club", value: entry.secondShotClub || "N/A" },
      { label: "Approach club", value: entry.approachClub },
      { label: "Add another shot", value: entry.addAnotherShot || "No" },
      { label: "Additional club", value: entry.extraApproachClub || "N/A" },
      { label: "Putts", value: String(entry.putts) }
    ];

    detailItems.forEach((item) => {
      const chip = document.createElement("div");
      chip.className = "detail-chip";
      chip.innerHTML = `<strong>${item.label}</strong>${item.value}`;
      details.appendChild(chip);
    });

    if (entry.notes) {
      notes.textContent = entry.notes;
    } else {
      notes.remove();
    }

    historyList.appendChild(fragment);
  });
}

async function exportEntriesAsCsv() {
  if (!entries.length) {
    return;
  }

  const sortedEntries = [...entries].sort((a, b) => a.hole - b.hole);
  const headers = [
    "Course/Round",
    "Hole",
    "Par",
    "Date",
    "Tee Club",
    "Second Shot Club",
    "Approach Club",
    "Add Another Shot",
    "Additional Shot Club",
    "Number Of Putts",
    "Notes"
  ];

  const rows = sortedEntries.map((entry) => [
    entry.roundName,
    entry.hole,
    entry.par,
    formatExportDate(entry.createdAt),
    entry.teeClub,
    entry.secondShotClub || "N/A",
    entry.approachClub,
    entry.addAnotherShot || "No",
    entry.extraApproachClub || "N/A",
    entry.putts,
    entry.notes
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((value) => escapeCsvValue(value)).join(","))
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const latestEntry = getLatestEntry();
  const currentRoundName = normalizeText(roundNameInput.value);
  const baseName = currentRoundName || latestEntry?.roundName || "Arccos Input";
  const fileName = `${slugifyFileName(baseName)}.csv`;

  if (navigator.share && typeof File !== "undefined") {
    const file = new File([blob], fileName, { type: "text/csv" });

    try {
      await navigator.share({
        title: baseName,
        files: [file]
      });
      return;
    } catch (error) {
      if (error?.name === "AbortError") {
        return;
      }
    }
  }

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
}

function persistEntries() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

function loadEntries() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw
      ? JSON.parse(raw).map((entry) => ({
          ...entry,
          par: entry.par ? Number(entry.par) : 4,
          putts: entry.putts ? Number(entry.putts) : 0,
          secondShotClub: entry.secondShotClub || "N/A",
          addAnotherShot: entry.addAnotherShot || "No",
          extraApproachClub: entry.extraApproachClub || "N/A"
        }))
      : [];
  } catch (error) {
    console.error("Unable to load saved entries", error);
    return [];
  }
}

function loadSavedRoundName() {
  try {
    return localStorage.getItem(ROUND_NAME_STORAGE_KEY) || "";
  } catch (error) {
    console.error("Unable to load saved round name", error);
    return "";
  }
}

function loadSavedRoundPlan() {
  try {
    return localStorage.getItem(ROUND_PLAN_STORAGE_KEY) || "";
  } catch (error) {
    console.error("Unable to load saved round plan", error);
    return "";
  }
}

function loadSavedGeneralNotes() {
  try {
    return localStorage.getItem(GENERAL_NOTES_STORAGE_KEY) || "";
  } catch (error) {
    console.error("Unable to load saved general notes", error);
    return "";
  }
}

function saveRoundName(value) {
  try {
    localStorage.setItem(ROUND_NAME_STORAGE_KEY, value);
  } catch (error) {
    console.error("Unable to save round name", error);
  }
}

function saveRoundPlan(value) {
  try {
    localStorage.setItem(ROUND_PLAN_STORAGE_KEY, value);
  } catch (error) {
    console.error("Unable to save round plan", error);
  }
}

function saveGeneralNotes(value) {
  try {
    localStorage.setItem(GENERAL_NOTES_STORAGE_KEY, value);
  } catch (error) {
    console.error("Unable to save general notes", error);
  }
}

function syncParView() {
  const par = Number(parInput.value);
  const isPar3 = par === 3;
  const isPar5 = par === 5;
  teeShotSection.classList.toggle("is-hidden", isPar3);
  secondShotSection.classList.toggle("is-hidden", !isPar5);
}

function normalizeText(value) {
  return String(value || "").trim();
}

function getDisplayEntries() {
  return [...entries].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

function getHistoryEntries() {
  return [...entries].sort((a, b) => a.hole - b.hole || new Date(a.createdAt) - new Date(b.createdAt));
}

function getLatestEntry() {
  return getDisplayEntries()[0] || null;
}

function createEntryId() {
  if (window.crypto?.randomUUID) {
    return window.crypto.randomUUID();
  }

  return `entry-${Date.now()}-${Math.floor(Math.random() * 100000)}`;
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(new Date(value));
}

function formatExportDate(value) {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(value));
}

function escapeCsvValue(value) {
  const stringValue = String(value ?? "");
  return `"${stringValue.replaceAll('"', '""')}"`;
}

function slugifyFileName(value) {
  return String(value || "arccos-input")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function registerServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./sw.js").catch((error) => {
      console.error("Service worker registration failed", error);
    });
  });
}
