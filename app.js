const STORAGE_KEY = "arccos-input-entries";
const ROUND_NAME_STORAGE_KEY = "arccos-input-round-name";
const ROUND_PLAN_STORAGE_KEY = "arccos-input-round-plan";
const GENERAL_NOTES_STORAGE_KEY = "arccos-input-general-notes";
const CURRENT_HOLE_STORAGE_KEY = "arccos-input-current-hole";

const teeClubs = [
  { name: "Driver" },
  { name: "Mini Driver" },
  { name: "3 Wood HL" },
  { name: "7 Wood" },
  { name: "3 Hybrid" },
  { name: "5 Iron" },
  { name: "6 Iron" },
  { name: "7 Iron" },
  { name: "8 Iron" },
  { name: "9 Iron" },
  { name: "Pitching Wedge" },
  { name: "Gap Wedge" },
  { name: "52 Degree Wedge" },
  { name: "56 Degree Wedge" },
  { name: "60 Degree Wedge" }
  ];

const secondShotClubs = [
  { name: "3 Wood HL" },
  { name: "7 Wood" },
  { name: "3 Hybrid" },
  { name: "5 Iron" },
  { name: "6 Iron" },
  { name: "7 Iron" },
  { name: "8 Iron" },
  { name: "9 Iron" },
  { name: "Pitching Wedge" },
  { name: "Gap Wedge" },
  { name: "52 Degree Wedge" },
  { name: "56 Degree Wedge" },
  { name: "60 Degree Wedge" }
  ];

const approachClubs = [
  { name: "60 Degree Wedge" },
  { name: "56 Degree Wedge" },
  { name: "52 Degree Wedge" },
  { name: "Gap Wedge" },
  { name: "Pitching Wedge" },
  { name: "9 Iron" },
  { name: "8 Iron" },
  { name: "7 Iron" },
  { name: "6 Iron" },
  { name: "5 Iron" },
  { name: "7 Wood" },
  { name: "3 Hybrid" },
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
const additionalShotsContainer = document.querySelector("#additionalShotsContainer");
const puttsInput = document.querySelector("#puttsInput");
const puttsGroup = document.querySelector("#puttsGroup");
const historyList = document.querySelector("#historyList");
const emptyState = document.querySelector("#emptyState");
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
let additionalShots = [];
let currentView = "entryPanel";

bootstrap();

function bootstrap() {
  renderTeeClubPicker();
  renderOptionGroup(parGroup, parInput, parOptions, "option-button", syncParView);
  renderOptionGroup(secondShotClubGroup, secondShotClubInput, secondShotClubs.map((club) => club.name));
  renderOptionGroup(approachClubGroup, approachClubInput, approachClubs.map((club) => club.name));
  renderOptionGroup(addAnotherShotGroup, addAnotherShotInput, additionalShotOptions, "option-button", syncAdditionalShotView);
  renderOptionGroup(puttsGroup, puttsInput, puttOptions, "option-button");

  form.addEventListener("submit", handleSubmit);
  resetFormButton.addEventListener("click", resetForm);
  startRoundButton.addEventListener("click", startNewRound);
  clearAllButton.addEventListener("click", clearAllEntries);
  exportButton.addEventListener("click", exportEntriesAsCsv);
  historyList.addEventListener("click", handleDeleteClick);
  roundPlanInput.addEventListener("input", handleRoundPlanInput);
  generalNotesInput.addEventListener("input", handleGeneralNotesInput);
  holeInput.addEventListener("input", handleHoleInput);
  navButtons.forEach((button) => {
    button.addEventListener("click", () => switchView(button.dataset.viewTarget));
  });
  window.addEventListener("resize", handleResize);

  roundNameInput.value = loadSavedRoundName();
  roundPlanInput.value = loadSavedRoundPlan();
  generalNotesInput.value = loadSavedGeneralNotes();
  resetFormWithHole(getResumeHoleNumber());
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

  if (showExtraShot && additionalShots.length === 0) {
      additionalShots = [createAdditionalShot()];
    }

  if (!showExtraShot) {
    additionalShots = [];
    }

  renderAdditionalShots();
}

function createAdditionalShot() {
  return {
    club: "",
    addAnotherShot: "No"
  };
}

function renderAdditionalShots() {
  additionalShotsContainer.innerHTML = "";

    additionalShots.forEach((shot, index) => {
    const section = document.createElement("div");
    section.className = "entry-section";

    const header = document.createElement("div");
    header.className = "entry-header";
    const shotTitle = index === 0 ? "One more shot in" : "Additional shot " + (index + 1);
    header.innerHTML =
      '<p class="section-kicker">Additional Shot</p>' +
      '<h3>' + shotTitle + '</h3>';
    section.appendChild(header);

    const clubField = document.createElement("div");
    clubField.className = "field field-span-full";
    clubField.innerHTML = "<span>Shot club</span>";

    const clubInput = document.createElement("input");
    clubInput.type = "hidden";
    clubInput.value = shot.club;

    const clubGroup = document.createElement("div");
    clubGroup.className = "option-grid option-grid-clubs";
    renderOptionGroup(clubGroup, clubInput, approachClubs.map((club) => club.name), "option-button", () => {
      shot.club = clubInput.value;
    });
    syncOptionButtons(clubGroup, clubInput.value);

    clubField.appendChild(clubInput);
    clubField.appendChild(clubGroup);
    section.appendChild(clubField);

    const anotherField = document.createElement("div");
    anotherField.className = "field";
    anotherField.innerHTML = "<span>Add another shot?</span>";

    const anotherInput = document.createElement("input");
    anotherInput.type = "hidden";
    anotherInput.value = shot.addAnotherShot || "No";

    const anotherGroup = document.createElement("div");
    anotherGroup.className = "option-grid option-grid-two";
    renderOptionGroup(anotherGroup, anotherInput, additionalShotOptions, "option-button", () => {
      shot.addAnotherShot = anotherInput.value;

      if (shot.addAnotherShot === "Yes" && index === additionalShots.length - 1) {
        additionalShots.push(createAdditionalShot());
      }

      if (shot.addAnotherShot === "No") {
        additionalShots = additionalShots.slice(0, index + 1);
      }

      renderAdditionalShots();
    });
    syncOptionButtons(anotherGroup, anotherInput.value);

    anotherField.appendChild(anotherInput);
    anotherField.appendChild(anotherGroup);
    section.appendChild(anotherField);

    additionalShotsContainer.appendChild(section);
  });
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
  if (addAnotherShotInput.value === "Yes") {
    if (!additionalShots.length) {
      additionalShots = [createAdditionalShot()];
      renderAdditionalShots();
    }

    additionalShots.forEach((shot, index) => {
      if (!shot.club) {
        missingSelections.push(`additional shot ${index + 1} club`);
    }
  });
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

  const additionalShotClubs = addAnotherShotInput.value === "Yes"
    ? additionalShots.map((shot) => shot.club).filter(Boolean)
    : [];

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
    additionalShotClubs,
    extraApproachClub: additionalShotClubs[0] || "N/A",
    putts: Number(puttsInput.value),
    notes: normalizeText(data.get("notes"))
  };

  entries = [entry, ...entries];
  persistEntries();

  let nextHole = entry.hole + 1;
  let nextView = "entryPanel";

  if (entry.hole >= 18) {
    const finishedRound = window.confirm(
      "Finished with your round? Tap OK if you are done, or Cancel to continue to hole 1."
    );

    nextHole = finishedRound ? 18 : 1;
    nextView = finishedRound ? "historyPanel" : "entryPanel";
}

  prepareNextHole(nextHole);
  updateSaveFeedback(entry);
  render();
  switchView(nextView);
}

function resetForm() {
  const currentHole = Number(holeInput.value) || getResumeHoleNumber();
  resetFormWithHole(currentHole);
}

function resetFormWithHole(holeNumber) {
  const savedRoundName = loadSavedRoundName();
  const normalizedHole = Math.min(Math.max(Number(holeNumber) || 1, 1), 18);

  form.reset();
  roundNameInput.value = savedRoundName;
  holeInput.value = String(normalizedHole);
  saveCurrentHole(normalizedHole);
  parInput.value = "4";
  teeClubInput.value = "";
  secondShotClubInput.value = "";
  approachClubInput.value = "";
  addAnotherShotInput.value = "No";
  additionalShots = [];
  puttsInput.value = "2";

  syncOptionButtons(parGroup, parInput.value);
  syncOptionButtons(secondShotClubGroup, secondShotClubInput.value);
  syncOptionButtons(approachClubGroup, approachClubInput.value);
  syncOptionButtons(addAnotherShotGroup, addAnotherShotInput.value);
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
  resetFormWithHole(1);
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

function handleHoleInput() {
  const hole = Number(holeInput.value);

  if (Number.isInteger(hole) && hole >= 1 && hole <= 18) {
    saveCurrentHole(hole);
    }
}

function render() {
  renderHeroSummary();
  renderHistory();
  exportButton.disabled = entries.length === 0;
}

function renderHeroSummary() {
  const latestEntry = getLatestEntry();
  const summaryItems = [
    { value: latestEntry ? `#${latestEntry.hole}` : "-", label: "Last hole" }
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
      { label: "Additional clubs", value: formatAdditionalShotClubs(entry) },
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
    "Additional Shot Clubs",
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
    formatAdditionalShotClubs(entry),
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
          additionalShotClubs: normalizeAdditionalShotClubs(entry),
          extraApproachClub: normalizeAdditionalShotClubs(entry)[0] || "N/A"
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

function loadSavedCurrentHole() {
  try {
    const savedHole = Number(localStorage.getItem(CURRENT_HOLE_STORAGE_KEY));
    return Number.isInteger(savedHole) && savedHole >= 1 && savedHole <= 18
      ? savedHole
      : null;
  } catch (error) {
    console.error("Unable to load current hole", error);
    return null;
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

function saveCurrentHole(hole) {
  try {
    localStorage.setItem(CURRENT_HOLE_STORAGE_KEY, String(hole));
  } catch (error) {
    console.error("Unable to save current hole", error);
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

function normalizeAdditionalShotClubs(entry) {
  if (Array.isArray(entry.additionalShotClubs)) {
    return entry.additionalShotClubs.filter(Boolean);
    }

  if (entry.extraApproachClub && entry.extraApproachClub !== "N/A") {
    return [entry.extraApproachClub];
    }

  return [];
}

function formatAdditionalShotClubs(entry) {
  const clubs = normalizeAdditionalShotClubs(entry);
  return clubs.length ? clubs.join("; ") : "N/A";
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

function getResumeHoleNumber() {
  const savedHole = loadSavedCurrentHole();

  if (savedHole !== null) {
    return savedHole;
    }

  const latestEntry = getLatestEntry();
  return latestEntry ? Math.min(latestEntry.hole + 1, 18) : 1;
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
