(() => {
  "use strict";

  const DRAFT_KEY = "chorecharteasy.activeDraft.v2";
  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const DAY_SHORT = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const TASKS_BY_AGE = {
    "3-4": [
      "Put toys in a basket",
      "Place clothes in the hamper",
      "Carry napkins to the table",
      "Put books on a shelf",
      "Wipe a small spill with adult help"
    ],
    "5-6": [
      "Make the bed",
      "Put clothes in the hamper",
      "Help set the table",
      "Pack toys after play",
      "Put school items by the door"
    ],
    "7-9": [
      "Make the bed",
      "Pack the school bag",
      "Clear the table",
      "Put away personal laundry",
      "Sweep a small area"
    ],
    "10-12": [
      "Sort and fold personal laundry",
      "Unload unbreakable dishes with adult approval",
      "Prepare a simple snack with adult approval",
      "Empty a small wastebasket",
      "Reset one shared room"
    ]
  };
  const MORNING_TASKS = ["Make the bed", "Get dressed", "Eat breakfast", "Brush teeth", "Pack what you need"];

  function morningTasksForAge(age) {
    if (!["3-4", "5-6"].includes(age)) return [...MORNING_TASKS];
    return MORNING_TASKS.map(text => {
      if (text === "Brush teeth") return "Brush teeth with adult help";
      if (text === "Pack what you need") return "Pack what you need with adult help";
      return text;
    });
  }

  let selectedAge = "5-6";
  let selectedStarter = "weekly";
  let chart = null;
  let storageEnabled = canUseStorage();
  let lastFocusedElement = null;

  const $ = selector => document.querySelector(selector);
  const $$ = selector => [...document.querySelectorAll(selector)];

  function canUseStorage() {
    try {
      const key = "__cce_draft_test__";
      localStorage.setItem(key, "1");
      localStorage.removeItem(key);
      return true;
    } catch (_) {
      return false;
    }
  }

  function blankDays() {
    return Array(7).fill(false);
  }

  function task(text) {
    return { text, days: blankDays() };
  }

  function safeDraft(value) {
    if (!value || typeof value !== "object" || !Array.isArray(value.tasks)) return null;
    const title = typeof value.title === "string" ? value.title.slice(0, 80) : "My Weekly Chore Chart";
    const tasks = value.tasks.slice(0, 16).map(item => ({
      text: typeof item?.text === "string" ? item.text.slice(0, 100) : "",
      days: Array.from({ length: 7 }, (_, index) => Boolean(item?.days?.[index]))
    }));
    if (!tasks.length) tasks.push(task(""));
    return {
      title,
      tasks,
      paper: value.paper === "a4" ? "a4" : "letter",
      starter: ["weekly", "morning", "blank", "multiple"].includes(value.starter) ? value.starter : "weekly",
      age: Object.hasOwn(TASKS_BY_AGE, value.age) ? value.age : "5-6"
    };
  }

  function readDraft() {
    if (!storageEnabled) return null;
    try {
      return safeDraft(JSON.parse(localStorage.getItem(DRAFT_KEY)));
    } catch (_) {
      return null;
    }
  }

  function saveDraft() {
    if (!storageEnabled || !chart) return;
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(chart));
      showSavedState("Saved in this browser");
    } catch (_) {
      storageEnabled = false;
      showStatus("Browser storage is unavailable. You can keep editing and print this chart, but the draft will not return after you leave.", "error");
      showSavedState("Draft not saved");
    }
  }

  function clearDraft() {
    if (storageEnabled) {
      try { localStorage.removeItem(DRAFT_KEY); } catch (_) {}
    }
    selectedAge = "5-6";
    selectedStarter = "weekly";
    setPressedState("[data-age]", "age", selectedAge);
    setPressedState("[data-starter]", "starter", selectedStarter);
    $("#nickname").value = "";
    $("#multi-children").hidden = true;
    chart = buildSingleChart("weekly", selectedAge, "");
    syncEditorFromChart();
    showStatus("Local chart data cleared. A fresh weekly starter is ready.", "info");
    showSavedState("Fresh draft");
  }

  function showSavedState(message) {
    const element = $("#save-state");
    if (element) element.textContent = message;
  }

  function showStatus(message, type = "info") {
    const element = $("#editor-status");
    if (!element) return;
    element.textContent = message;
    element.className = `status show ${type}`;
  }

  function announce(message) {
    const element = $("#editor-announcer");
    if (element) element.textContent = message;
  }

  function setPressedState(selector, key, value) {
    $$(selector).forEach(button => button.setAttribute("aria-pressed", String(button.dataset[key] === value)));
  }

  function starterTitle(starter, label = "") {
    if (starter === "morning") return label ? `${label}’s Morning Routine` : "My Morning Routine";
    if (starter === "blank") return label ? `${label}’s Chore Chart` : "My Chore Chart";
    if (starter === "multiple") return "Our Family Chore Chart";
    return label ? `${label}’s Weekly Chore Chart` : "My Weekly Chore Chart";
  }

  function buildSingleChart(starter, age, nickname) {
    const label = nickname.trim().slice(0, 30);
    let texts;
    if (starter === "blank") texts = ["", "", ""];
    else if (starter === "morning") texts = morningTasksForAge(age);
    else texts = [...TASKS_BY_AGE[age]];
    return {
      title: starterTitle(starter, label),
      tasks: texts.map(task),
      paper: selectedPaper(),
      starter,
      age
    };
  }

  function childRows() {
    return $$("#children-list .child-row").map((row, index) => ({
      label: row.querySelector(".child-label").value.trim().slice(0, 30) || `Child ${index + 1}`,
      age: row.querySelector(".child-age").value
    }));
  }

  function buildMultipleChart() {
    const children = childRows();
    const tasks = [];
    children.forEach((child, childIndex) => {
      TASKS_BY_AGE[child.age].slice(childIndex % 2, childIndex % 2 + 3).forEach(text => {
        tasks.push(task(`${child.label} — ${text}`));
      });
    });
    return {
      title: "Our Family Chore Chart",
      tasks,
      paper: selectedPaper(),
      starter: "multiple",
      age: selectedAge
    };
  }

  function selectedPaper() {
    return $("input[name='paper-size']:checked")?.value === "a4" ? "a4" : "letter";
  }

  function createStartingChart(options = {}) {
    const starter = options.starter || selectedStarter;
    if (starter === "multiple") {
      chart = buildMultipleChart();
    } else {
      chart = buildSingleChart(starter, selectedAge, $("#nickname").value);
    }
    selectedStarter = starter;
    chart.paper = selectedPaper();
    syncEditorFromChart();
    saveDraft();
    const childrenCount = starter === "multiple" ? childRows().length : 1;
    window.ChoreConsent?.track("plan_ready", { starter, children_count: childrenCount });
    showStatus("Your starting chart is ready. Edit any task before printing.", "info");
    announce("Starting chart created and ready to edit");
    if (options.scroll !== false) $("#chart-editor").scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function syncEditorFromChart() {
    $("#chart-title").value = chart.title;
    const paperInput = $(`#paper-${chart.paper}`);
    if (paperInput) paperInput.checked = true;
    renderTasks();
    updatePrintSheet();
  }

  function renderTasks() {
    const host = $("#task-list");
    host.textContent = "";
    chart.tasks.forEach((item, rowIndex) => {
      const row = document.createElement("tr");
      const taskCell = document.createElement("th");
      taskCell.scope = "row";
      taskCell.className = "task-col";
      const input = document.createElement("input");
      input.className = "task-input";
      input.maxLength = 100;
      input.value = item.text;
      input.placeholder = "Type a task";
      input.setAttribute("aria-label", `Task ${rowIndex + 1}`);
      input.addEventListener("input", () => {
        item.text = input.value;
        updateRowLabels(row, item, rowIndex);
        saveDraft();
      });
      taskCell.appendChild(input);
      row.appendChild(taskCell);

      item.days.forEach((checked, dayIndex) => {
        const cell = document.createElement("td");
        cell.className = "day-cell";
        const label = document.createElement("label");
        label.className = "check-control";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = checked;
        checkbox.setAttribute("aria-label", checkboxLabel(item, rowIndex, dayIndex));
        checkbox.addEventListener("change", () => {
          item.days[dayIndex] = checkbox.checked;
          saveDraft();
        });
        label.appendChild(checkbox);
        cell.appendChild(label);
        row.appendChild(cell);
      });

      const action = document.createElement("td");
      const remove = document.createElement("button");
      remove.type = "button";
      remove.className = "remove-task";
      remove.textContent = "×";
      remove.setAttribute("aria-label", `Remove ${item.text || `task ${rowIndex + 1}`}`);
      remove.addEventListener("click", () => removeTask(rowIndex));
      action.appendChild(remove);
      row.appendChild(action);
      host.appendChild(row);
    });
  }

  function checkboxLabel(item, rowIndex, dayIndex) {
    return `${item.text || `Task ${rowIndex + 1}`}, ${DAYS[dayIndex]}`;
  }

  function updateRowLabels(row, item, rowIndex) {
    row.querySelectorAll("input[type='checkbox']").forEach((box, dayIndex) => box.setAttribute("aria-label", checkboxLabel(item, rowIndex, dayIndex)));
    row.querySelector(".remove-task")?.setAttribute("aria-label", `Remove ${item.text || `task ${rowIndex + 1}`}`);
  }

  function addTask() {
    const input = $("#new-task");
    const text = input.value.trim();
    if (!text) {
      showStatus("Type a task before adding it.", "error");
      input.focus();
      return;
    }
    if (chart.tasks.length >= 16) {
      showStatus("A printable chart can include up to 16 task rows. Remove a row before adding another.", "error");
      return;
    }
    chart.tasks.push(task(text.slice(0, 100)));
    input.value = "";
    renderTasks();
    saveDraft();
    announce(`${text} added`);
  }

  function removeTask(index) {
    const removed = chart.tasks.splice(index, 1)[0];
    if (!chart.tasks.length) chart.tasks.push(task(""));
    renderTasks();
    saveDraft();
    announce(`${removed?.text || "Task"} removed`);
  }

  function updatePrintSheet() {
    if (!chart) return;
    chart.title = $("#chart-title").value.trim().slice(0, 80) || "My Chore Chart";
    chart.paper = selectedPaper();
    const sheet = $("#print-sheet");
    const mode = $("input[name='print-mode']:checked")?.value === "ink" ? "ink" : "color";
    sheet.dataset.paper = chart.paper;
    sheet.dataset.mode = mode;
    $("#print-title").textContent = chart.title;
    $("#print-paper-label").textContent = chart.paper === "a4" ? "A4" : "US Letter";
    const head = $("#print-days");
    head.textContent = "";
    const taskHeader = document.createElement("th");
    taskHeader.scope = "col";
    taskHeader.className = "print-task";
    taskHeader.textContent = "Task";
    head.appendChild(taskHeader);
    DAY_SHORT.forEach(day => {
      const th = document.createElement("th");
      th.scope = "col";
      th.textContent = day;
      head.appendChild(th);
    });
    const body = $("#print-rows");
    body.textContent = "";
    chart.tasks.forEach(item => {
      const row = document.createElement("tr");
      const name = document.createElement("th");
      name.scope = "row";
      name.className = "print-task";
      name.textContent = item.text || " ";
      row.appendChild(name);
      item.days.forEach(checked => {
        const cell = document.createElement("td");
        const box = document.createElement("span");
        box.className = `print-check${checked ? " checked" : ""}`;
        box.setAttribute("aria-hidden", "true");
        cell.appendChild(box);
        row.appendChild(cell);
      });
      body.appendChild(row);
    });
  }

  function openPrintPreview() {
    updatePrintSheet();
    saveDraft();
    const dialog = $("#print-dialog");
    lastFocusedElement = document.activeElement;
    if (!dialog.open) dialog.showModal();
    document.body.classList.add("dialog-open");
    const mode = $("input[name='print-mode']:checked")?.value || "color";
    window.ChoreConsent?.track("print_preview_opened", { paper: chart.paper, mode });
  }

  function closePrintPreview() {
    const dialog = $("#print-dialog");
    if (dialog.open) dialog.close();
    document.body.classList.remove("dialog-open");
    if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
  }

  function printChart() {
    updatePrintSheet();
    const mode = $("input[name='print-mode']:checked")?.value || "color";
    window.ChoreConsent?.track("print_confirmed", { paper: chart.paper, mode });
    window.print();
  }

  function addChildRow(label = "", age = "5-6") {
    const list = $("#children-list");
    if (list.children.length >= 4) return;
    const index = list.children.length;
    const row = document.createElement("div");
    row.className = "child-row";
    const input = document.createElement("input");
    input.className = "text-input child-label";
    input.maxLength = 30;
    input.placeholder = `Child ${index + 1}`;
    input.setAttribute("aria-label", `Child ${index + 1} nickname or initials`);
    input.value = label;
    const select = document.createElement("select");
    select.className = "select-input child-age";
    select.setAttribute("aria-label", `Child ${index + 1} age group`);
    [["3-4", "3–4"], ["5-6", "5–6"], ["7-9", "7–9"], ["10-12", "10–12"]].forEach(([value, text]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = text;
      option.selected = value === age;
      select.appendChild(option);
    });
    const remove = document.createElement("button");
    remove.type = "button";
    remove.className = "button button-danger";
    remove.textContent = "×";
    remove.setAttribute("aria-label", `Remove child ${index + 1}`);
    remove.addEventListener("click", () => {
      if (list.children.length <= 2) {
        showStatus("Multiple-kids mode needs at least two rows.", "error");
        return;
      }
      row.remove();
      renumberChildren();
    });
    row.append(input, select, remove);
    list.appendChild(row);
    renumberChildren();
  }

  function renumberChildren() {
    $$("#children-list .child-row").forEach((row, index) => {
      row.querySelector(".child-label").placeholder = `Child ${index + 1}`;
      row.querySelector(".child-label").setAttribute("aria-label", `Child ${index + 1} nickname or initials`);
      row.querySelector(".child-age").setAttribute("aria-label", `Child ${index + 1} age group`);
      row.querySelector("button").setAttribute("aria-label", `Remove child ${index + 1}`);
    });
    $("#add-child").disabled = $("#children-list").children.length >= 4;
  }

  function setStarter(starter) {
    selectedStarter = starter;
    setPressedState("[data-starter]", "starter", starter);
    const multiple = starter === "multiple";
    $("#multi-children").hidden = !multiple;
    if (multiple && !$("#children-list").children.length) {
      addChildRow("", "5-6");
      addChildRow("", "7-9");
    }
    window.ChoreConsent?.track("starter_loaded", { starter });
  }

  function initializeDraft() {
    const params = new URLSearchParams(location.search);
    const requested = params.get("template");
    const requestedAge = params.get("age");
    const requestedPaper = params.get("paper");
    if (requestedAge && Object.hasOwn(TASKS_BY_AGE, requestedAge)) selectedAge = requestedAge;
    if (["weekly", "morning", "blank", "multiple"].includes(requested)) selectedStarter = requested;
    setPressedState("[data-age]", "age", selectedAge);
    const saved = requested ? null : readDraft();
    if (saved) {
      chart = saved;
      selectedStarter = chart.starter;
      selectedAge = chart.age;
      setPressedState("[data-age]", "age", selectedAge);
      setPressedState("[data-starter]", "starter", selectedStarter);
      $("#multi-children").hidden = selectedStarter !== "multiple";
      syncEditorFromChart();
      showStatus("Your last active draft was restored from this browser.", "info");
      showSavedState("Draft restored");
      return;
    }
    setStarter(selectedStarter);
    chart = buildSingleChart(selectedStarter === "multiple" ? "weekly" : selectedStarter, selectedAge, "");
    if (selectedStarter === "multiple") chart = buildMultipleChart();
    if (["letter", "a4"].includes(requestedPaper)) chart.paper = requestedPaper;
    syncEditorFromChart();
    if (!storageEnabled) {
      showStatus("Browser storage is unavailable. The tool still works, but this draft will not return after you leave.", "error");
      showSavedState("Draft not saved");
    } else {
      showSavedState("Ready to edit");
    }
  }

  function bindEvents() {
    $$("[data-age]").forEach(button => button.addEventListener("click", () => {
      selectedAge = button.dataset.age;
      setPressedState("[data-age]", "age", selectedAge);
    }));
    $$("[data-starter]").forEach(button => button.addEventListener("click", () => setStarter(button.dataset.starter)));
    $$("[data-start]").forEach(button => button.addEventListener("click", () => {
      const starter = button.dataset.start;
      setStarter(starter);
      createStartingChart({ starter });
    }));
    $("#create-chart").addEventListener("click", () => createStartingChart());
    $("#add-child").addEventListener("click", () => addChildRow("", selectedAge));
    $("#chart-title").addEventListener("input", () => {
      chart.title = $("#chart-title").value;
      saveDraft();
    });
    $$('input[name="paper-size"]').forEach(input => input.addEventListener("change", () => {
      chart.paper = selectedPaper();
      saveDraft();
      updatePrintSheet();
    }));
    $$('input[name="print-mode"]').forEach(input => input.addEventListener("change", updatePrintSheet));
    $("#add-task").addEventListener("click", addTask);
    $("#new-task").addEventListener("keydown", event => { if (event.key === "Enter") addTask(); });
    $("#preview-print").addEventListener("click", openPrintPreview);
    $("#print-now").addEventListener("click", printChart);
    $("#close-print").addEventListener("click", closePrintPreview);
    $("#print-dialog").addEventListener("cancel", event => { event.preventDefault(); closePrintPreview(); });
    $("#clear-local-data").addEventListener("click", clearDraft);
    $$('[data-clear-local]').forEach(button => button.addEventListener("click", clearDraft));
    $("#early-access-button").addEventListener("click", () => {
      window.ChoreConsent?.track("early_access_click", { source: "home_pack" });
      $("#early-access-status").textContent = "The early-access list is not open yet. No information was submitted and no charge was made.";
    });
    $$(".mobile-menu a").forEach(link => link.addEventListener("click", () => $(".mobile-nav").removeAttribute("open")));
    window.addEventListener("beforeprint", () => {
      updatePrintSheet();
      document.body.classList.add("printing");
    });
    window.addEventListener("afterprint", () => {
      document.body.classList.remove("printing");
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    bindEvents();
    initializeDraft();
  });
})();
