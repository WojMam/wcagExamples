document.addEventListener("DOMContentLoaded", function () {
	// Load header and footer content
	loadHeader();
	loadFooter();

	// Initialize the application
	initApp();

	// Set current date by default
	document.getElementById("audit-date").valueAsDate = new Date();

	// Load language selector
	setupLanguageSelector();

	// Event listeners
	document.getElementById("new-audit-btn").addEventListener("click", newAudit);
	document.getElementById("load-audit-btn").addEventListener("click", () => {
		document.getElementById("load-file").click();
	});
	document.getElementById("load-file").addEventListener("change", loadAudit);
	document
		.getElementById("save-audit-btn")
		.addEventListener("click", saveAudit);
	document
		.getElementById("generate-report-btn")
		.addEventListener("click", generateReport);
	document
		.getElementById("toggle-view-btn")
		.addEventListener("click", toggleView);
	document
		.getElementById("audit-level")
		.addEventListener("change", updateGuidelinesBasedOnLevel);
});

// Current language
let currentLanguage = "pl";

// WCAG Guideline data (default Polish)
let wcagGuidelines = {};

// Load guidelines based on language
function loadGuidelinesForLanguage(language) {
	currentLanguage = language;
	fetch(`wcag-guidelines-${language}.json`)
		.then(response => response.json())
		.then(data => {
			wcagGuidelines = data;
			// Update guidelines with new language
			updateGuidelinesBasedOnLevel();
		})
		.catch(error => {
			console.error("Error loading guidelines:", error);
		});
}

// Setup language selector
function setupLanguageSelector() {
	// Add language selector to the audit form
	const auditForm = document.querySelector(".audit-form");
	const langSelectorDiv = document.createElement("div");
	langSelectorDiv.className = "form-group language-form-group";
	langSelectorDiv.innerHTML = `
		<label for="language-select">Język / Language</label>
		<div class="language-controls">
			<select id="language-select" class="language-select">
				<option value="en">English</option>
				<option value="pl" selected>Polski</option>
			</select>
			<div class="language-buttons">
				<button type="button" data-lang="pl" class="lang-btn lang-btn-active">PL</button>
				<button type="button" data-lang="en" class="lang-btn">EN</button>
			</div>
		</div>
	`;
	auditForm.appendChild(langSelectorDiv);

	// Add event listener for select
	document
		.getElementById("language-select")
		.addEventListener("change", function (e) {
			loadGuidelinesForLanguage(e.target.value);
			updateLanguageButtons(e.target.value);
		});

	// Add event listeners for buttons
	document.querySelectorAll(".lang-btn").forEach(btn => {
		btn.addEventListener("click", function () {
			const lang = this.getAttribute("data-lang");
			loadGuidelinesForLanguage(lang);
			document.getElementById("language-select").value = lang;
			updateLanguageButtons(lang);
		});
	});

	// Function to update active button
	function updateLanguageButtons(lang) {
		document.querySelectorAll(".lang-btn").forEach(btn => {
			if (btn.getAttribute("data-lang") === lang) {
				btn.classList.add("lang-btn-active");
			} else {
				btn.classList.remove("lang-btn-active");
			}
		});
	}

	// Load default language
	loadGuidelinesForLanguage("pl");
}

// Initialization for wcagGuidelines before JSON is loaded
// WCAG Guideline data placeholder

// Application state
let auditState = {
	name: "",
	url: "",
	date: "",
	level: "AA",
	guidelines: {},
	detailedView: false,
};

/**
 * Initialize the application
 */
function initApp() {
	// Create empty guidelines structure
	resetAuditState();

	// Generate guidelines based on selected level
	updateGuidelinesBasedOnLevel();

	// Add CSS for language selector
	const style = document.createElement("style");
	style.textContent = `
		.language-form-group {
			grid-column: 1 / -1;
		}
		.language-controls {
			display: flex;
			align-items: center;
			gap: 1rem;
		}
		.language-select {
			padding: 0.75rem;
			border: 1px solid #ddd;
			border-radius: 4px;
			font-size: 1rem;
			transition: border-color 0.3s;
			flex: 1;
		}
		.language-select:focus {
			border-color: var(--primary-color);
			outline: none;
			box-shadow: 0 0 0 2px rgba(0, 90, 156, 0.2);
		}
		.language-buttons {
			display: flex;
			gap: 0.5rem;
		}
		.lang-btn {
			padding: 0.5rem 1rem;
			border: 1px solid #ddd;
			border-radius: 4px;
			background-color: #f5f5f5;
			cursor: pointer;
			font-weight: bold;
			transition: all 0.2s;
		}
		.lang-btn:hover {
			background-color: #e9e9e9;
		}
		.lang-btn-active {
			border-color: var(--primary-color);
			background-color: rgba(0, 90, 156, 0.1);
			color: var(--primary-color);
		}
	`;
	document.head.appendChild(style);
}

/**
 * Reset audit state to default values
 */
function resetAuditState() {
	auditState = {
		name: "",
		url: "",
		date: new Date().toISOString().split("T")[0],
		level: "AA",
		guidelines: {},
		detailedView: false,
	};

	// Reset form fields
	document.getElementById("audit-name").value = "";
	document.getElementById("audit-url").value = "";
	document.getElementById("audit-date").value = auditState.date;
	document.getElementById("audit-level").value = auditState.level;
}

/**
 * Update guidelines based on selected level
 */
function updateGuidelinesBasedOnLevel() {
	const selectedLevel = document.getElementById("audit-level").value;
	auditState.level = selectedLevel;

	// Reset guidelines
	auditState.guidelines = {};

	// Generate guidelines for selected level
	generateGuidelinesForLevel(selectedLevel);

	// Render guidelines
	renderGuidelines();
}

/**
 * Generate guidelines based on selected level
 */
function generateGuidelinesForLevel(level) {
	let levelRanking = { A: 1, AA: 2, AAA: 3 };
	let selectedLevelRank = levelRanking[level];

	// Iterate through all guidelines
	for (const category in wcagGuidelines) {
		if (!auditState.guidelines[category]) {
			auditState.guidelines[category] = {};
		}

		for (const section in wcagGuidelines[category]) {
			if (!auditState.guidelines[category][section]) {
				auditState.guidelines[category][section] = [];
			}

			for (const guideline of wcagGuidelines[category][section]) {
				if (levelRanking[guideline.level] <= selectedLevelRank) {
					auditState.guidelines[category][section].push({
						id: guideline.id,
						name: guideline.name,
						level: guideline.level,
						description: guideline.description,
						status: "not-checked",
						errorDescription: "",
						recommendation: "",
					});
				}
			}
		}
	}
}

/**
 * Render guidelines in the UI
 */
function renderGuidelines() {
	const container = document.querySelector(".guidelines-container");
	container.innerHTML = "";

	// Iterate through categories
	for (const category in auditState.guidelines) {
		const categoryElement = document.createElement("div");
		categoryElement.className = "guideline-category animate-in";

		// Create category header
		const categoryHeader = document.createElement("div");
		categoryHeader.className = "category-header";
		categoryHeader.innerHTML = `
			<h3>${category}</h3>
			<span class="toggle-indicator">▼</span>
		`;
		categoryElement.appendChild(categoryHeader);

		// Create category content
		const categoryContent = document.createElement("div");
		categoryContent.className = "category-content";

		// Iterate through sections
		for (const section in auditState.guidelines[category]) {
			const sectionElement = document.createElement("div");
			sectionElement.className = "guideline-section";

			// Add section title
			const sectionTitle = document.createElement("h4");
			sectionTitle.textContent = section;
			sectionElement.appendChild(sectionTitle);

			// Iterate through guidelines
			for (const guideline of auditState.guidelines[category][section]) {
				const guidelineElement = document.createElement("div");
				guidelineElement.className = "guideline-item";
				guidelineElement.setAttribute("data-id", guideline.id);

				// Create guideline header
				const guidelineHeader = document.createElement("div");
				guidelineHeader.className = "guideline-header";

				// Add guideline title and level
				const titleContainer = document.createElement("div");
				titleContainer.className = "guideline-title";
				titleContainer.innerHTML = `
					<span>${guideline.id} ${guideline.name}</span>
					<span class="wcag-level ${guideline.level}">${guideline.level}</span>
				`;
				guidelineHeader.appendChild(titleContainer);

				// Add status selectors
				const statusSelector = document.createElement("div");
				statusSelector.className = "status-selector";

				// Create status buttons
				const passButton = document.createElement("button");
				passButton.type = "button";
				passButton.className = `status-button ${
					guideline.status === "pass" ? "selected pass" : ""
				}`;
				passButton.textContent = "Zaliczono";
				passButton.setAttribute("data-status", "pass");
				passButton.addEventListener("click", () =>
					updateGuidelineStatus(guideline.id, "pass", guidelineElement)
				);

				const failButton = document.createElement("button");
				failButton.type = "button";
				failButton.className = `status-button ${
					guideline.status === "fail" ? "selected fail" : ""
				}`;
				failButton.textContent = "Niezaliczono";
				failButton.setAttribute("data-status", "fail");
				failButton.addEventListener("click", () =>
					updateGuidelineStatus(guideline.id, "fail", guidelineElement)
				);

				const naButton = document.createElement("button");
				naButton.type = "button";
				naButton.className = `status-button ${
					guideline.status === "na" ? "selected na" : ""
				}`;
				naButton.textContent = "Nie dotyczy";
				naButton.setAttribute("data-status", "na");
				naButton.addEventListener("click", () =>
					updateGuidelineStatus(guideline.id, "na", guidelineElement)
				);

				statusSelector.appendChild(passButton);
				statusSelector.appendChild(failButton);
				statusSelector.appendChild(naButton);

				guidelineHeader.appendChild(statusSelector);
				guidelineElement.appendChild(guidelineHeader);

				// Create guideline content (detailed view)
				const guidelineContent = document.createElement("div");
				guidelineContent.className = `guideline-content ${
					auditState.detailedView ? "expanded" : ""
				}`;

				// Add description
				const description = document.createElement("div");
				description.className = "guideline-description";
				description.textContent = guideline.description;
				guidelineContent.appendChild(description);

				// Add error description and recommendation fields
				const errorDescriptionContainer = document.createElement("div");
				errorDescriptionContainer.className = "form-group";
				const errorDescriptionLabel = document.createElement("label");
				errorDescriptionLabel.setAttribute("for", `error-${guideline.id}`);
				errorDescriptionLabel.textContent = "Opis błędu:";
				const errorDescriptionInput = document.createElement("textarea");
				errorDescriptionInput.id = `error-${guideline.id}`;
				errorDescriptionInput.rows = 3;
				errorDescriptionInput.value = guideline.errorDescription || "";
				errorDescriptionInput.addEventListener("input", e => {
					updateGuidelineField(
						guideline.id,
						"errorDescription",
						e.target.value
					);
				});
				errorDescriptionContainer.appendChild(errorDescriptionLabel);
				errorDescriptionContainer.appendChild(errorDescriptionInput);
				guidelineContent.appendChild(errorDescriptionContainer);

				const recommendationContainer = document.createElement("div");
				recommendationContainer.className = "form-group";
				const recommendationLabel = document.createElement("label");
				recommendationLabel.setAttribute(
					"for",
					`recommendation-${guideline.id}`
				);
				recommendationLabel.textContent = "Rekomendacja:";
				const recommendationInput = document.createElement("textarea");
				recommendationInput.id = `recommendation-${guideline.id}`;
				recommendationInput.rows = 3;
				recommendationInput.value = guideline.recommendation || "";
				recommendationInput.addEventListener("input", e => {
					updateGuidelineField(guideline.id, "recommendation", e.target.value);
				});
				recommendationContainer.appendChild(recommendationLabel);
				recommendationContainer.appendChild(recommendationInput);
				guidelineContent.appendChild(recommendationContainer);

				guidelineElement.appendChild(guidelineContent);
				sectionElement.appendChild(guidelineElement);
			}

			categoryContent.appendChild(sectionElement);
		}

		categoryElement.appendChild(categoryContent);
		container.appendChild(categoryElement);

		// Add toggle functionality for category
		categoryHeader.addEventListener("click", () => {
			categoryContent.style.display =
				categoryContent.style.display === "none" ? "block" : "none";
			categoryHeader.querySelector(".toggle-indicator").textContent =
				categoryContent.style.display === "none" ? "▶" : "▼";
		});
	}
}

/**
 * Update guideline status
 */
function updateGuidelineStatus(id, status, element) {
	// Find the guideline in the state
	for (const category in auditState.guidelines) {
		for (const section in auditState.guidelines[category]) {
			for (
				let i = 0;
				i < auditState.guidelines[category][section].length;
				i++
			) {
				const guideline = auditState.guidelines[category][section][i];
				if (guideline.id === id) {
					guideline.status = status;
					break;
				}
			}
		}
	}

	// Update the UI
	const statusButtons = element.querySelectorAll(".status-button");
	statusButtons.forEach(button => {
		button.classList.remove("selected", "pass", "fail", "na");
		if (button.getAttribute("data-status") === status) {
			button.classList.add("selected");
			button.classList.add(status);
		}
	});

	// If status is 'fail', expand the content to show error fields
	if (status === "fail") {
		const content = element.querySelector(".guideline-content");
		content.classList.add("expanded");
	}
}

/**
 * Update a field in a guideline
 */
function updateGuidelineField(id, field, value) {
	// Find the guideline in the state
	for (const category in auditState.guidelines) {
		for (const section in auditState.guidelines[category]) {
			for (
				let i = 0;
				i < auditState.guidelines[category][section].length;
				i++
			) {
				const guideline = auditState.guidelines[category][section][i];
				if (guideline.id === id) {
					guideline[field] = value;
					break;
				}
			}
		}
	}
}

/**
 * Create a new audit
 */
function newAudit() {
	if (
		confirm(
			"Czy na pewno chcesz rozpocząć nowy audyt? Wszystkie niezapisane dane zostaną utracone."
		)
	) {
		resetAuditState();
		updateGuidelinesBasedOnLevel();

		// Hide download links
		document.getElementById("download-link").classList.add("hidden");
		document.getElementById("report-link").classList.add("hidden");
	}
}

/**
 * Save audit to JSON file
 */
function saveAudit() {
	// Get form values
	const name = document.getElementById("audit-name").value;
	const url = document.getElementById("audit-url").value;
	const date = document.getElementById("audit-date").value;

	if (!name || !url || !date) {
		alert("Proszę wypełnić wszystkie wymagane pola formularza.");
		return;
	}

	// Update audit state
	auditState.name = name;
	auditState.url = url;
	auditState.date = date;

	// Create a JSON blob
	const jsonData = JSON.stringify(auditState, null, 2);
	const blob = new Blob([jsonData], { type: "application/json" });
	const url_download = URL.createObjectURL(blob);

	// Create download link
	const downloadLink = document.getElementById("download-link");
	downloadLink.href = url_download;
	downloadLink.download = `wcag-audit-${name
		.replace(/\s+/g, "-")
		.toLowerCase()}.json`;
	downloadLink.classList.remove("hidden");

	alert(
		'Audyt został zapisany. Kliknij przycisk "Pobierz plik JSON", aby pobrać plik z wynikami audytu.'
	);
}

/**
 * Load audit from JSON file
 */
function loadAudit(event) {
	const file = event.target.files[0];
	if (!file) return;

	const reader = new FileReader();
	reader.onload = function (e) {
		try {
			const loadedState = JSON.parse(e.target.result);

			// Validate loaded file
			if (
				!loadedState.name ||
				!loadedState.url ||
				!loadedState.date ||
				!loadedState.guidelines
			) {
				throw new Error("Nieprawidłowy format pliku.");
			}

			// Update audit state
			auditState = loadedState;

			// Update form values
			document.getElementById("audit-name").value = auditState.name;
			document.getElementById("audit-url").value = auditState.url;
			document.getElementById("audit-date").value = auditState.date;
			document.getElementById("audit-level").value = auditState.level;

			// Render guidelines
			renderGuidelines();

			// Update view
			updateView();

			alert("Audyt został wczytany pomyślnie.");
		} catch (error) {
			alert(
				"Nie udało się wczytać pliku audytu. Upewnij się, że wybrany plik ma prawidłowy format JSON."
			);
			console.error("Error loading audit:", error);
		}
	};
	reader.readAsText(file);

	// Reset file input
	event.target.value = "";
}

/**
 * Toggle between simple and detailed view
 */
function toggleView() {
	auditState.detailedView = !auditState.detailedView;
	updateView();
}

/**
 * Update view based on detailedView setting
 */
function updateView() {
	const guidelineContents = document.querySelectorAll(".guideline-content");
	const toggleButton = document.getElementById("toggle-view-btn");

	guidelineContents.forEach(content => {
		if (auditState.detailedView) {
			content.classList.add("expanded");
		} else {
			content.classList.remove("expanded");
		}
	});

	toggleButton.textContent = auditState.detailedView
		? "Przełącz na widok prosty"
		: "Przełącz na widok szczegółowy";
}

/**
 * Generate HTML report
 */
function generateReport() {
	// Get form values
	const name = document.getElementById("audit-name").value;
	const url = document.getElementById("audit-url").value;
	const date = document.getElementById("audit-date").value;

	if (!name || !url || !date) {
		alert("Proszę wypełnić wszystkie wymagane pola formularza.");
		return;
	}

	// Update audit state
	auditState.name = name;
	auditState.url = url;
	auditState.date = date;

	// Count results
	let stats = {
		pass: 0,
		fail: 0,
		na: 0,
		notChecked: 0,
		total: 0,
	};

	for (const category in auditState.guidelines) {
		for (const section in auditState.guidelines[category]) {
			for (const guideline of auditState.guidelines[category][section]) {
				stats.total++;
				if (guideline.status === "pass") stats.pass++;
				else if (guideline.status === "fail") stats.fail++;
				else if (guideline.status === "na") stats.na++;
				else stats.notChecked++;
			}
		}
	}

	// Create HTML report
	let htmlReport = `
<!DOCTYPE html>
<html lang="pl">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Raport dostępności WCAG 2.1 - ${auditState.name}</title>
	<style>
		:root {
			--primary-color: #005a9c;
			--secondary-color: #0078d4;
			--accent-color: #4caf50;
			--warning-color: #ffc107;
			--error-color: #f44336;
			--neutral-color: #9e9e9e;
			--text-color: #333;
			--bg-color: #f5f5f5;
			--card-bg: #fff;
		}
		
		body {
			font-family: Arial, sans-serif;
			line-height: 1.6;
			color: var(--text-color);
			background-color: var(--bg-color);
			margin: 0;
			padding: 20px;
		}
		
		.report-container {
			max-width: 1200px;
			margin: 0 auto;
			background-color: white;
			border-radius: 8px;
			box-shadow: 0 2px 10px rgba(0,0,0,0.1);
			padding: 30px;
		}
		
		header {
			margin-bottom: 30px;
			padding-bottom: 20px;
			border-bottom: 2px solid var(--primary-color);
		}
		
		h1, h2, h3, h4 {
			color: var(--primary-color);
			margin-top: 1.5em;
			margin-bottom: 0.5em;
		}
		
		h1 {
			font-size: 2em;
			margin-top: 0;
		}
		
		table {
			width: 100%;
			border-collapse: collapse;
			margin: 20px 0;
		}
		
		th, td {
			border: 1px solid #ddd;
			padding: 12px;
			text-align: left;
		}
		
		th {
			background-color: var(--primary-color);
			color: white;
		}
		
		tr:nth-child(even) {
			background-color: #f2f2f2;
		}
		
		.stats {
			display: flex;
			justify-content: space-between;
			flex-wrap: wrap;
			margin: 30px 0;
			gap: 15px;
		}
		
		.stat-box {
			flex: 1;
			min-width: 150px;
			background-color: white;
			padding: 20px;
			border-radius: 8px;
			box-shadow: 0 2px 8px rgba(0,0,0,0.1);
			text-align: center;
		}
		
		.stat-box h3 {
			margin-top: 0;
			color: var(--text-color);
		}
		
		.stat-box .value {
			font-size: 2.5em;
			font-weight: bold;
			margin: 10px 0;
		}
		
		.stat-box .label {
			color: #666;
		}
		
		.pass-box {
			border-top: 4px solid var(--accent-color);
		}
		
		.pass-box .value {
			color: var(--accent-color);
		}
		
		.fail-box {
			border-top: 4px solid var(--error-color);
		}
		
		.fail-box .value {
			color: var(--error-color);
		}
		
		.na-box {
			border-top: 4px solid var(--neutral-color);
		}
		
		.na-box .value {
			color: var(--neutral-color);
		}
		
		.total-box {
			border-top: 4px solid var(--primary-color);
		}
		
		.total-box .value {
			color: var(--primary-color);
		}
		
		.status {
			padding: 4px 8px;
			border-radius: 4px;
			font-weight: bold;
			display: inline-block;
		}
		
		.status-pass {
			background-color: rgba(76, 175, 80, 0.2);
			color: #2e7d32;
		}
		
		.status-fail {
			background-color: rgba(244, 67, 54, 0.2);
			color: #c62828;
		}
		
		.status-na {
			background-color: rgba(158, 158, 158, 0.2);
			color: #616161;
		}
		
		.status-not-checked {
			background-color: rgba(255, 193, 7, 0.2);
			color: #ff8f00;
		}
		
		.wcag-level {
			display: inline-block;
			padding: 2px 6px;
			border-radius: 4px;
			font-size: 0.8em;
			font-weight: bold;
			color: white;
			margin-left: 8px;
		}
		
		.wcag-level.A {
			background-color: #4caf50;
		}
		
		.wcag-level.AA {
			background-color: #ff9800;
		}
		
		.wcag-level.AAA {
			background-color: #f44336;
		}
		
		@media print {
			body {
				background-color: white;
			}
			
			.report-container {
				box-shadow: none;
				border: none;
				padding: 0;
			}
		}
	</style>
</head>
<body>
	<div class="report-container">
		<header>
			<h1>Raport dostępności WCAG 2.1</h1>
			<p><strong>Nazwa audytu:</strong> ${auditState.name}</p>
			<p><strong>URL strony:</strong> ${auditState.url}</p>
			<p><strong>Data audytu:</strong> ${new Date(auditState.date).toLocaleDateString(
				"pl-PL"
			)}</p>
			<p><strong>Poziom dostępności:</strong> ${auditState.level}</p>
		</header>
		
		<section>
			<h2>Podsumowanie wyników</h2>
			
			<div class="stats">
				<div class="stat-box pass-box">
					<h3>Zaliczono</h3>
					<div class="value">${stats.pass}</div>
					<div class="label">${Math.round((stats.pass / stats.total) * 100)}%</div>
				</div>
				
				<div class="stat-box fail-box">
					<h3>Niezaliczono</h3>
					<div class="value">${stats.fail}</div>
					<div class="label">${Math.round((stats.fail / stats.total) * 100)}%</div>
				</div>
				
				<div class="stat-box na-box">
					<h3>Nie dotyczy</h3>
					<div class="value">${stats.na}</div>
					<div class="label">${Math.round((stats.na / stats.total) * 100)}%</div>
				</div>
				
				<div class="stat-box total-box">
					<h3>Razem</h3>
					<div class="value">${stats.total}</div>
					<div class="label">100%</div>
				</div>
			</div>
		</section>
		
		<section>
			<h2>Szczegółowe wyniki</h2>
`;

	// Add detailed results
	for (const category in auditState.guidelines) {
		htmlReport += `
				<h3>${category}</h3>
`;

		for (const section in auditState.guidelines[category]) {
			htmlReport += `
				<h4>${section}</h4>
				<table>
					<thead>
						<tr>
							<th>Kryterium</th>
							<th>Poziom</th>
							<th>Status</th>
							<th>Opis błędu</th>
							<th>Rekomendacja</th>
						</tr>
					</thead>
					<tbody>
`;

			for (const guideline of auditState.guidelines[category][section]) {
				let statusClass, statusText;

				switch (guideline.status) {
					case "pass":
						statusClass = "status-pass";
						statusText = "Zaliczono";
						break;
					case "fail":
						statusClass = "status-fail";
						statusText = "Niezaliczono";
						break;
					case "na":
						statusClass = "status-na";
						statusText = "Nie dotyczy";
						break;
					default:
						statusClass = "status-not-checked";
						statusText = "Nie sprawdzono";
				}

				htmlReport += `
						<tr>
							<td>${guideline.id} ${guideline.name}</td>
							<td><span class="wcag-level ${guideline.level}">${guideline.level}</span></td>
							<td><span class="status ${statusClass}">${statusText}</span></td>
							<td>${guideline.errorDescription || "-"}</td>
							<td>${guideline.recommendation || "-"}</td>
						</tr>
`;
			}

			htmlReport += `
					</tbody>
				</table>
`;
		}
	}

	// Close HTML
	htmlReport += `
		</section>
		
		<footer>
			<p>Raport wygenerowany ${new Date().toLocaleString("pl-PL")}</p>
		</footer>
	</div>
</body>
</html>
`;

	// Create blob and download link
	const blob = new Blob([htmlReport], { type: "text/html" });
	const report_url = URL.createObjectURL(blob);

	const reportLink = document.getElementById("report-link");
	reportLink.href = report_url;
	reportLink.download = `wcag-audit-report-${name
		.replace(/\s+/g, "-")
		.toLowerCase()}.html`;
	reportLink.classList.remove("hidden");

	alert(
		'Raport został wygenerowany. Kliknij przycisk "Pobierz raport HTML", aby pobrać plik z raportem.'
	);
}

/**
 * Funkcja ładująca zawartość nagłówka z pliku header.html
 */
function loadHeader() {
	const headerElement = document.querySelector("header");

	if (headerElement) {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", "header.html", true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					headerElement.innerHTML = xhr.responseText;
				} else {
					// W przypadku błędu, wstaw bezpośrednio uproszczoną zawartość nagłówka
					headerElement.innerHTML = `
					<h1>WCAG 2.1 - Nieoficjalny przewodnik dostępności</h1>
					<p class="subtitle">Praktyczne przykłady implementacji wytycznych WCAG 2.1</p>
					<nav aria-label="Główna nawigacja">
						<ul class="main-nav">
							<li><a href="index.html">Strona główna</a></li>
							<li><a href="wytyczne.html">Wytyczne WCAG 2.1</a></li>
							<li><a href="tester.html" aria-current="page">Tester dostępności</a></li>
						</ul>
					</nav>
					`;
				}
			}
		};
		xhr.send();
	}
}

/**
 * Funkcja ładująca zawartość stopki z pliku footer.html
 */
function loadFooter() {
	const footerElement = document.querySelector("footer");

	if (footerElement) {
		const xhr = new XMLHttpRequest();
		xhr.open("GET", "footer.html", true);
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					footerElement.innerHTML = xhr.responseText;
				} else {
					// W przypadku błędu, wstaw bezpośrednio uproszczoną zawartość stopki
					footerElement.innerHTML = `
					<p>&copy; ${new Date().getFullYear()} WCAG 2.1 - Nieoficjalny przewodnik dostępności</p>
					`;
				}
			}
		};
		xhr.send();
	}
}
