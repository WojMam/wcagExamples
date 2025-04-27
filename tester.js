document.addEventListener("DOMContentLoaded", function () {
	// Load header and footer content
	loadHeader();
	loadFooter();

	// Initialize the application
	initApp();

	// Set current date by default
	document.getElementById("audit-date").valueAsDate = new Date();

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

// WCAG Guideline data
const wcagGuidelines = {
	"1. Perceivable": {
		"1.1 Text Alternatives": [
			{
				id: "1.1.1",
				level: "A",
				name: "Non-text Content",
				description:
					"All non-text content that is presented to the user has a text alternative that serves the equivalent purpose.",
			},
		],
		"1.2 Time-based Media": [
			{
				id: "1.2.1",
				level: "A",
				name: "Audio-only and Video-only (Prerecorded)",
				description:
					"For prerecorded audio-only and prerecorded video-only media, an alternative is provided.",
			},
			{
				id: "1.2.2",
				level: "A",
				name: "Captions (Prerecorded)",
				description:
					"Captions are provided for all prerecorded audio content in synchronized media.",
			},
			{
				id: "1.2.3",
				level: "A",
				name: "Audio Description or Media Alternative (Prerecorded)",
				description:
					"An alternative for time-based media or audio description of the prerecorded video content is provided.",
			},
			{
				id: "1.2.4",
				level: "AA",
				name: "Captions (Live)",
				description:
					"Captions are provided for all live audio content in synchronized media.",
			},
			{
				id: "1.2.5",
				level: "AA",
				name: "Audio Description (Prerecorded)",
				description:
					"Audio description is provided for all prerecorded video content in synchronized media.",
			},
			{
				id: "1.2.6",
				level: "AAA",
				name: "Sign Language (Prerecorded)",
				description:
					"Sign language interpretation is provided for all prerecorded audio content in synchronized media.",
			},
			{
				id: "1.2.7",
				level: "AAA",
				name: "Extended Audio Description (Prerecorded)",
				description:
					"Where pauses in foreground audio are insufficient to allow audio descriptions to convey the sense of the video, extended audio description is provided.",
			},
			{
				id: "1.2.8",
				level: "AAA",
				name: "Media Alternative (Prerecorded)",
				description:
					"An alternative for time-based media is provided for all prerecorded synchronized media and for all prerecorded video-only media.",
			},
			{
				id: "1.2.9",
				level: "AAA",
				name: "Audio-only (Live)",
				description:
					"An alternative for time-based media that presents equivalent information for live audio-only content is provided.",
			},
		],
		"1.3 Adaptable": [
			{
				id: "1.3.1",
				level: "A",
				name: "Info and Relationships",
				description:
					"Information, structure, and relationships conveyed through presentation can be programmatically determined or are available in text.",
			},
			{
				id: "1.3.2",
				level: "A",
				name: "Meaningful Sequence",
				description:
					"When the sequence in which content is presented affects its meaning, a correct reading sequence can be programmatically determined.",
			},
			{
				id: "1.3.3",
				level: "A",
				name: "Sensory Characteristics",
				description:
					"Instructions provided for understanding and operating content do not rely solely on sensory characteristics of components.",
			},
			{
				id: "1.3.4",
				level: "AA",
				name: "Orientation",
				description:
					"Content does not restrict its view and operation to a single display orientation.",
			},
			{
				id: "1.3.5",
				level: "AA",
				name: "Identify Input Purpose",
				description:
					"The purpose of each input field collecting information about the user can be programmatically determined.",
			},
			{
				id: "1.3.6",
				level: "AAA",
				name: "Identify Purpose",
				description:
					"In content implemented using markup languages, the purpose of User Interface Components, icons, and regions can be programmatically determined.",
			},
		],
		"1.4 Distinguishable": [
			{
				id: "1.4.1",
				level: "A",
				name: "Use of Color",
				description:
					"Color is not used as the only visual means of conveying information, indicating an action, prompting a response, or distinguishing a visual element.",
			},
			{
				id: "1.4.2",
				level: "A",
				name: "Audio Control",
				description:
					"If any audio on a Web page plays automatically for more than 3 seconds, either a mechanism is available to pause or stop the audio, or a mechanism is available to control audio volume.",
			},
			{
				id: "1.4.3",
				level: "AA",
				name: "Contrast (Minimum)",
				description:
					"The visual presentation of text and images of text has a contrast ratio of at least 4.5:1.",
			},
			{
				id: "1.4.4",
				level: "AA",
				name: "Resize Text",
				description:
					"Except for captions and images of text, text can be resized without assistive technology up to 200 percent without loss of content or functionality.",
			},
			{
				id: "1.4.5",
				level: "AA",
				name: "Images of Text",
				description:
					"If the technologies being used can achieve the visual presentation, text is used to convey information rather than images of text.",
			},
			{
				id: "1.4.6",
				level: "AAA",
				name: "Contrast (Enhanced)",
				description:
					"The visual presentation of text and images of text has a contrast ratio of at least 7:1.",
			},
			{
				id: "1.4.7",
				level: "AAA",
				name: "Low or No Background Audio",
				description:
					"For prerecorded audio-only content that contains primarily speech in the foreground, background sounds are at least 20 decibels lower than the foreground speech content.",
			},
			{
				id: "1.4.8",
				level: "AAA",
				name: "Visual Presentation",
				description:
					"For the visual presentation of blocks of text, a mechanism is available for specific formatting requirements.",
			},
			{
				id: "1.4.9",
				level: "AAA",
				name: "Images of Text (No Exception)",
				description:
					"Images of text are only used for pure decoration or where a particular presentation of text is essential to the information being conveyed.",
			},
			{
				id: "1.4.10",
				level: "AA",
				name: "Reflow",
				description:
					"Content can be presented without loss of information or functionality, and without requiring scrolling in two dimensions.",
			},
			{
				id: "1.4.11",
				level: "AA",
				name: "Non-Text Contrast",
				description:
					"The visual presentation of User Interface Components and graphical objects has a contrast ratio of at least 3:1 against adjacent color(s).",
			},
			{
				id: "1.4.12",
				level: "AA",
				name: "Text Spacing",
				description:
					"In content implemented using markup languages, specific line/character spacing can be set without loss of content or functionality.",
			},
			{
				id: "1.4.13",
				level: "AA",
				name: "Content on Hover or Focus",
				description:
					"Where receiving and then removing pointer hover or keyboard focus triggers additional content to become visible and then hidden, specific conditions are met.",
			},
		],
	},
	"2. Operable": {
		"2.1 Keyboard Accessible": [
			{
				id: "2.1.1",
				level: "A",
				name: "Keyboard",
				description:
					"All functionality of the content is operable through a keyboard interface without requiring specific timings for individual keystrokes.",
			},
			{
				id: "2.1.2",
				level: "A",
				name: "No Keyboard Trap",
				description:
					"If keyboard focus can be moved to a component using a keyboard interface, then focus can be moved away from that component using only a keyboard interface.",
			},
			{
				id: "2.1.3",
				level: "AAA",
				name: "Keyboard (No Exception)",
				description:
					"All functionality of the content is operable through a keyboard interface without requiring specific timings for individual keystrokes.",
			},
			{
				id: "2.1.4",
				level: "A",
				name: "Character Key Shortcuts",
				description:
					"If a keyboard shortcut is implemented in content using only letter, punctuation, number, or symbol characters, then various ways to turn it off or remap are available.",
			},
		],
		"2.2 Enough Time": [
			{
				id: "2.2.1",
				level: "A",
				name: "Timing Adjustable",
				description:
					"For each time limit that is set by the content, at least one of the specific conditions is met.",
			},
			{
				id: "2.2.2",
				level: "A",
				name: "Pause, Stop, Hide",
				description:
					"For moving, blinking, scrolling, or auto-updating information, all of the following are true.",
			},
			{
				id: "2.2.3",
				level: "AAA",
				name: "No Timing",
				description:
					"Timing is not an essential part of the event or activity presented by the content, except for non-interactive synchronized media and real-time events.",
			},
			{
				id: "2.2.4",
				level: "AAA",
				name: "Interruptions",
				description:
					"Interruptions can be postponed or suppressed by the user, except interruptions involving an emergency.",
			},
			{
				id: "2.2.5",
				level: "AAA",
				name: "Re-authenticating",
				description:
					"When an authenticated session expires, the user can continue the activity without loss of data after re-authenticating.",
			},
			{
				id: "2.2.6",
				level: "AAA",
				name: "Timeouts",
				description:
					"Users are warned of the duration of any user inactivity that could cause data loss, unless the data is preserved for more than 20 hours when the user does not take any actions.",
			},
		],
		"2.3 Seizures and Physical Reactions": [
			{
				id: "2.3.1",
				level: "A",
				name: "Three Flashes or Below Threshold",
				description:
					"Web pages do not contain anything that flashes more than three times in any one second period, or the flash is below the general flash and red flash thresholds.",
			},
			{
				id: "2.3.2",
				level: "AAA",
				name: "Three Flashes",
				description:
					"Web pages do not contain anything that flashes more than three times in any one second period.",
			},
			{
				id: "2.3.3",
				level: "AAA",
				name: "Animation from Interactions",
				description:
					"Motion animation triggered by interaction can be disabled, unless the animation is essential to the functionality or the information being conveyed.",
			},
		],
		"2.4 Input": [
			{
				id: "2.4.1",
				level: "A",
				name: "Bypass Blocks",
				description:
					"A mechanism is available to bypass blocks of content that are repeated on multiple Web pages.",
			},
			{
				id: "2.4.2",
				level: "A",
				name: "Page Titled",
				description: "Web pages have titles that describe topic or purpose.",
			},
			{
				id: "2.4.3",
				level: "A",
				name: "Focus Order",
				description:
					"If a Web page can be navigated sequentially and the navigation sequences affect meaning or operation, focusable components receive focus in an order that preserves meaning and operability.",
			},
			{
				id: "2.4.4",
				level: "A",
				name: "Link Purpose (In Context)",
				description:
					"The purpose of each link can be determined from the link text alone or from the link text together with its programmatically determined link context.",
			},
			{
				id: "2.4.5",
				level: "AA",
				name: "Multiple Ways",
				description:
					"More than one way is available to locate a Web page within a set of Web pages except where the Web Page is the result of, or a step in, a process.",
			},
			{
				id: "2.4.6",
				level: "AA",
				name: "Headings and Labels",
				description: "Headings and labels describe topic or purpose.",
			},
			{
				id: "2.4.7",
				level: "AA",
				name: "Focus Visible",
				description:
					"Any keyboard operable user interface has a mode of operation where the keyboard focus indicator is visible.",
			},
			{
				id: "2.4.8",
				level: "AAA",
				name: "Location",
				description:
					"Information about the user's location within a set of Web pages is available.",
			},
			{
				id: "2.4.9",
				level: "AAA",
				name: "Link Purpose (Link Only)",
				description:
					"A mechanism is available to allow the purpose of each link to be identified from link text alone.",
			},
			{
				id: "2.4.10",
				level: "AAA",
				name: "Section Headings",
				description: "Section headings are used to organize the content.",
			},
		],
		"2.5 Input Modalities": [
			{
				id: "2.5.1",
				level: "A",
				name: "Pointer Gestures",
				description:
					"All functionality that uses multipoint or path-based gestures for operation can be operated with a single pointer without a path-based gesture.",
			},
			{
				id: "2.5.2",
				level: "A",
				name: "Pointer Cancellation",
				description:
					"For functionality that can be operated using a single pointer, specific conditions for preventing accidental activation are met.",
			},
			{
				id: "2.5.3",
				level: "A",
				name: "Label in Name",
				description:
					"For user interface components with labels that include text or images of text, the name contains the text that is presented visually.",
			},
			{
				id: "2.5.4",
				level: "A",
				name: "Motion Actuation",
				description:
					"Functionality that can be operated by device motion or user motion can also be operated by user interface components and responding to the motion can be disabled.",
			},
			{
				id: "2.5.5",
				level: "AAA",
				name: "Target Size",
				description:
					"The size of the target for pointer inputs is at least 44 by 44 CSS pixels.",
			},
			{
				id: "2.5.6",
				level: "AAA",
				name: "Concurrent Input Mechanisms",
				description:
					"Web content does not restrict use of input modalities available on a platform except where the restriction is essential.",
			},
		],
	},
	"3. Understandable": {
		"3.1 Readable": [
			{
				id: "3.1.1",
				level: "A",
				name: "Language of Page",
				description:
					"The default human language of each Web page can be programmatically determined.",
			},
			{
				id: "3.1.2",
				level: "AA",
				name: "Language of Parts",
				description:
					"The human language of each passage or phrase in the content can be programmatically determined.",
			},
			{
				id: "3.1.3",
				level: "AAA",
				name: "Unusual Words",
				description:
					"A mechanism is available for identifying specific definitions of words or phrases used in an unusual or restricted way.",
			},
			{
				id: "3.1.4",
				level: "AAA",
				name: "Abbreviations",
				description:
					"A mechanism for identifying the expanded form or meaning of abbreviations is available.",
			},
			{
				id: "3.1.5",
				level: "AAA",
				name: "Reading Level",
				description:
					"When text requires reading ability more advanced than the lower secondary education level, supplemental content is available.",
			},
			{
				id: "3.1.6",
				level: "AAA",
				name: "Pronunciation",
				description:
					"A mechanism is available for identifying specific pronunciation of words where meaning is ambiguous without knowing the pronunciation.",
			},
		],
		"3.2 Predictable": [
			{
				id: "3.2.1",
				level: "A",
				name: "On Focus",
				description:
					"When any user interface component receives focus, it does not initiate a change of context.",
			},
			{
				id: "3.2.2",
				level: "A",
				name: "On Input",
				description:
					"Changing the setting of any user interface component does not automatically cause a change of context unless the user has been advised of the behavior before using the component.",
			},
			{
				id: "3.2.3",
				level: "AA",
				name: "Consistent Navigation",
				description:
					"Navigational mechanisms that are repeated on multiple Web pages within a set of Web pages occur in the same relative order each time they are repeated.",
			},
			{
				id: "3.2.4",
				level: "AA",
				name: "Consistent Identification",
				description:
					"Components that have the same functionality within a set of Web pages are identified consistently.",
			},
			{
				id: "3.2.5",
				level: "AAA",
				name: "Change on Request",
				description:
					"Changes of context are initiated only by user request or a mechanism is available to turn off such changes.",
			},
		],
		"3.3 Input Assistance": [
			{
				id: "3.3.1",
				level: "A",
				name: "Error Identification",
				description:
					"If an input error is automatically detected, the item that is in error is identified and the error is described to the user in text.",
			},
			{
				id: "3.3.2",
				level: "A",
				name: "Labels or Instructions",
				description:
					"Labels or instructions are provided when content requires user input.",
			},
			{
				id: "3.3.3",
				level: "AA",
				name: "Error Suggestion",
				description:
					"If an input error is automatically detected and suggestions for correction are known, then the suggestions are provided to the user.",
			},
			{
				id: "3.3.4",
				level: "AA",
				name: "Error Prevention (Legal, Financial, Data)",
				description:
					"For Web pages that cause legal commitments or financial transactions for the user to occur, that modify or delete user-controllable data in data storage systems, or that submit user test responses, specific conditions are met.",
			},
			{
				id: "3.3.5",
				level: "AAA",
				name: "Help",
				description: "Context-sensitive help is available.",
			},
			{
				id: "3.3.6",
				level: "AAA",
				name: "Error Prevention (All)",
				description:
					"For Web pages that require the user to submit information, specific conditions are met.",
			},
		],
	},
	"4. Robust": {
		"4.1 Compatible": [
			{
				id: "4.1.1",
				level: "A",
				name: "Parsing",
				description:
					"In content implemented using markup languages, elements have complete start and end tags, elements are nested according to their specifications, elements do not contain duplicate attributes, and any IDs are unique.",
			},
			{
				id: "4.1.2",
				level: "A",
				name: "Name, Role, Value",
				description:
					"For all user interface components, the name and role can be programmatically determined; states, properties, and values can be programmatically set; and notification of changes to these items is available to user agents.",
			},
			{
				id: "4.1.3",
				level: "AA",
				name: "Status Messages",
				description:
					"In content implemented using markup languages, status messages can be programmatically determined through role or properties.",
			},
		],
		"4.2 Enough": [
			{
				id: "4.2.1",
				level: "A",
				name: "Time-based Media",
				description:
					"All time-based media can be programmatically controlled or are replaced with Web-based alternatives.",
			},
			{
				id: "4.2.2",
				level: "A",
				name: "Live Captions",
				description:
					"Live captions are provided for all prerecorded audio content in synchronized media.",
			},
			{
				id: "4.2.3",
				level: "A",
				name: "Sign Language",
				description:
					"Sign language interpretation is provided for all prerecorded audio content in synchronized media.",
			},
			{
				id: "4.2.4",
				level: "A",
				name: "Audio Description",
				description:
					"Audio description is provided for all prerecorded video content in synchronized media.",
			},
			{
				id: "4.2.5",
				level: "AA",
				name: "Extended Audio Description",
				description:
					"Extended audio description is provided for all prerecorded video content in synchronized media.",
			},
			{
				id: "4.2.6",
				level: "AAA",
				name: "Media Alternative",
				description:
					"An alternative for time-based media is provided for all prerecorded synchronized media and for all prerecorded video-only media.",
			},
			{
				id: "4.2.7",
				level: "AAA",
				name: "Audio Description",
				description:
					"Audio description is provided for all prerecorded video content in synchronized media.",
			},
		],
		"4.3 Input Assistance": [
			{
				id: "4.3.1",
				level: "A",
				name: "Pointer Gestures",
				description:
					"A mechanism is available to interact with content using pointer gestures.",
			},
			{
				id: "4.3.2",
				level: "A",
				name: "Keyboard Gestures",
				description:
					"A mechanism is available to interact with content using keyboard gestures.",
			},
			{
				id: "4.3.3",
				level: "A",
				name: "Character Key Shortcuts",
				description:
					"A mechanism is available to interact with content using character key shortcuts.",
			},
			{
				id: "4.3.4",
				level: "AA",
				name: "Pointer Cancellation",
				description:
					"A mechanism is available to cancel a pointer action, except where the pointer action would cause harm.",
			},
			{
				id: "4.3.5",
				level: "AA",
				name: "Keyboard Cancellation",
				description:
					"A mechanism is available to cancel a keyboard action, except where the keyboard action would cause harm.",
			},
			{
				id: "4.3.6",
				level: "AAA",
				name: "Dragging",
				description:
					"A mechanism is available to cancel a dragging action, except where the dragging action would cause harm.",
			},
			{
				id: "4.3.7",
				level: "AAA",
				name: "Target Size",
				description:
					"The size of the target for pointer input is at least 44 by 44 CSS pixels.",
			},
			{
				id: "4.3.8",
				level: "AAA",
				name: "Input Assistance",
				description:
					"A mechanism is available to help users with disabilities understand, use, and navigate Web pages or to access Web content in ways that are as equivalent as possible to the ways users without disabilities access the same content.",
			},
		],
	},
};

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
