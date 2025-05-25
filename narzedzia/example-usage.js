/**
 * Przykład użycia External Tools Generator
 * Ten plik pokazuje, jak używać generatora narzędzi zewnętrznych
 */

// Przykład użycia generatora narzędzi zewnętrznych
async function exampleUsage() {
	console.log("=== Przykład użycia External Tools Generator ===");

	// 1. Utworzenie instancji generatora
	const toolsGenerator = new ExternalToolsGenerator("./external-tools.json");

	// 2. Załadowanie narzędzi z pliku JSON
	await toolsGenerator.loadTools();
	console.log(`Załadowano ${toolsGenerator.tools.length} narzędzi`);

	// 3. Wyświetlenie statystyk
	const stats = toolsGenerator.getStats();
	console.log("Statystyki narzędzi:", stats);

	// 4. Wyszukiwanie narzędzi
	const waveTools = toolsGenerator.search("WAVE");
	console.log(
		'Narzędzia zawierające "WAVE":',
		waveTools.map(t => t.name)
	);

	// 5. Filtrowanie według typu
	const extensions = toolsGenerator.filterByType("extension");
	console.log(
		"Rozszerzenia przeglądarek:",
		extensions.map(t => t.name)
	);

	// 6. Dodanie nowego narzędzia
	const newTool = {
		name: "Moje Nowe Narzędzie",
		icon: "fa-solid fa-star",
		description: "To jest przykład nowego narzędzia dodanego programowo.",
		types: ["online", "app"],
		typeLabels: ["Web App", "Aplikacja"],
		mainLink: "https://example.com",
		additionalLink: "https://example.com/docs",
	};

	const added = toolsGenerator.addTool(newTool);
	if (added) {
		console.log("Dodano nowe narzędzie:", newTool.name);
	}

	// 7. Eksport do JSON
	const jsonExport = toolsGenerator.exportToJSON();
	console.log(
		"Eksport do JSON (pierwsze 200 znaków):",
		jsonExport.substring(0, 200) + "..."
	);

	// 8. Usunięcie narzędzia
	const removed = toolsGenerator.removeTool("Moje Nowe Narzędzie");
	if (removed) {
		console.log("Usunięto narzędzie testowe");
	}

	// 9. Renderowanie narzędzi (jeśli jesteśmy w przeglądarce)
	if (typeof document !== "undefined") {
		// Utworzenie kontenera testowego
		const testContainer = document.createElement("div");
		testContainer.id = "test-container";
		document.body.appendChild(testContainer);

		// Renderowanie narzędzi
		toolsGenerator.renderTools("test-container");
		console.log("Narzędzia zostały wyrenderowane w kontenerze testowym");
	}
}

// Funkcja do dodawania narzędzia przez formularz
function addToolFromForm() {
	const name = prompt("Nazwa narzędzia:");
	const description = prompt("Opis narzędzia:");
	const mainLink = prompt("Główny link:");
	const icon =
		prompt("Ikona Font Awesome (np. fa-solid fa-tools):") ||
		"fa-solid fa-tools";
	const types = prompt(
		"Typy (oddzielone przecinkami, np. extension,online):"
	)?.split(",") || ["online"];
	const typeLabels = prompt("Etykiety typów (oddzielone przecinkami):")?.split(
		","
	) || ["Web App"];

	if (!name || !description || !mainLink) {
		alert("Nazwa, opis i główny link są wymagane!");
		return;
	}

	const newTool = {
		name: name.trim(),
		icon: icon.trim(),
		description: description.trim(),
		types: types.map(t => t.trim()),
		typeLabels: typeLabels.map(t => t.trim()),
		mainLink: mainLink.trim(),
		additionalLink: null,
	};

	if (window.toolsGenerator) {
		const added = window.toolsGenerator.addTool(newTool);
		if (added) {
			// Ponowne renderowanie
			window.toolsGenerator.renderTools("tools-container");
			alert(`Dodano narzędzie: ${newTool.name}`);
		}
	} else {
		alert("Generator narzędzi nie jest dostępny");
	}
}

// Funkcja do eksportu narzędzi do pliku
function exportToolsToFile() {
	if (!window.toolsGenerator) {
		alert("Generator narzędzi nie jest dostępny");
		return;
	}

	const jsonData = window.toolsGenerator.exportToJSON();
	const blob = new Blob([jsonData], { type: "application/json" });
	const url = URL.createObjectURL(blob);

	const a = document.createElement("a");
	a.href = url;
	a.download = "external-tools-export.json";
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);

	alert("Narzędzia zostały wyeksportowane do pliku");
}

// Funkcja do wyświetlenia szczegółowych statystyk
function showDetailedStats() {
	if (!window.toolsGenerator) {
		alert("Generator narzędzi nie jest dostępny");
		return;
	}

	const stats = window.toolsGenerator.getStats();
	let message = `Łączna liczba narzędzi: ${stats.total}\n\nRozkład według typów:\n`;

	Object.entries(stats.byType).forEach(([type, count]) => {
		message += `- ${type}: ${count}\n`;
	});

	alert(message);
}

// Funkcja do wyszukiwania i wyświetlenia wyników
function searchAndDisplay() {
	const query = prompt("Wpisz frazę do wyszukania:");
	if (!query || !window.toolsGenerator) {
		return;
	}

	const results = window.toolsGenerator.search(query);
	if (results.length === 0) {
		alert("Nie znaleziono narzędzi dla podanej frazy");
		return;
	}

	const resultNames = results.map(tool => tool.name).join("\n- ");
	alert(`Znaleziono ${results.length} narzędzi:\n- ${resultNames}`);
}

// Dodanie funkcji do obiektu window dla łatwego dostępu z konsoli
if (typeof window !== "undefined") {
	window.exampleUsage = exampleUsage;
	window.addToolFromForm = addToolFromForm;
	window.exportToolsToFile = exportToolsToFile;
	window.showDetailedStats = showDetailedStats;
	window.searchAndDisplay = searchAndDisplay;

	console.log("Dostępne funkcje przykładowe:");
	console.log("- exampleUsage() - demonstracja podstawowego użycia");
	console.log("- addToolFromForm() - dodanie narzędzia przez formularz");
	console.log("- exportToolsToFile() - eksport narzędzi do pliku");
	console.log("- showDetailedStats() - wyświetlenie szczegółowych statystyk");
	console.log("- searchAndDisplay() - wyszukiwanie i wyświetlenie wyników");
}

// Automatyczne uruchomienie przykładu, jeśli plik jest uruchamiany bezpośrednio
if (typeof require !== "undefined" && require.main === module) {
	exampleUsage();
}
