/**
 * External Tools Generator
 * Skrypt do generowania narzędzi zewnętrznych z pliku JSON
 */

class ExternalToolsGenerator {
	constructor(jsonPath = "./external-tools.json") {
		this.jsonPath = jsonPath;
		this.tools = [];
	}

	/**
	 * Ładuje dane narzędzi z pliku JSON
	 */
	async loadTools() {
		try {
			const response = await fetch(this.jsonPath);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const data = await response.json();
			this.tools = data.tools;
			console.log(`Załadowano ${this.tools.length} narzędzi zewnętrznych`);
		} catch (error) {
			console.error("Błąd podczas ładowania narzędzi:", error);
			this.tools = [];
		}
	}

	/**
	 * Generuje HTML dla typu narzędzia
	 */
	generateToolTypeHTML(types, typeLabels) {
		if (!types || types.length === 0) return "";

		const typeItems = types
			.map((type, index) => {
				const label =
					typeLabels && typeLabels[index] ? typeLabels[index] : type;
				return `<span class="tool-type-item ${type}">${label}</span>`;
			})
			.join("\n                    ");

		return `
                <div class="tool-type">
                    ${typeItems}
                </div>`;
	}

	/**
	 * Generuje HTML dla platform narzędzia
	 */
	generatePlatformHTML(platforms, platformLabels) {
		if (!platforms || platforms.length === 0) return "";

		const platformItems = platforms
			.map((platform, index) => {
				const label =
					platformLabels && platformLabels[index]
						? platformLabels[index]
						: platform;
				return `<span class="platform-item ${platform}">${label}</span>`;
			})
			.join(", ");

		return `
                <div class="tool-platforms">
                    <i class="fa-solid fa-desktop"></i>
                    ${platformItems}
                </div>`;
	}

	/**
	 * Generuje HTML dla pojedynczego narzędzia
	 */
	generateToolHTML(tool) {
		const toolTypeHTML = this.generateToolTypeHTML(tool.types, tool.typeLabels);
		const platformHTML = this.generatePlatformHTML(
			tool.platforms,
			tool.platformLabels
		);

		const additionalLinkHTML = tool.additionalLink
			? `<a href="${tool.additionalLink}" class="tile-link" target="_blank" rel="noopener">Dodatkowy opis</a>`
			: `<a href="#" class="tile-link disabled">Dodatkowy opis</a>`;

		return `
            <div class="tile">
                ${toolTypeHTML}
                <div class="tile-header">
                    <span class="tile-icon"><i class="${tool.icon}"></i></span>
                    ${tool.name}
                </div>
                <div class="tile-content">
                    <p class="tile-description">${tool.description}</p>
                    ${platformHTML}
                </div>
                <div class="tile-footer">
                    <a href="${tool.mainLink}" class="tile-link" target="_blank" rel="noopener">Strona narzędzia</a>
                    ${additionalLinkHTML}
                </div>
            </div>`;
	}

	/**
	 * Generuje HTML dla wszystkich narzędzi
	 */
	generateAllToolsHTML() {
		if (!this.tools || this.tools.length === 0) {
			return "<p>Brak dostępnych narzędzi zewnętrznych.</p>";
		}

		const toolsHTML = this.tools
			.map(tool => this.generateToolHTML(tool))
			.join("\n");

		return `<div class="dashboard">${toolsHTML}\n        </div>`;
	}

	/**
	 * Renderuje narzędzia w określonym kontenerze
	 */
	renderTools(containerId = "tools-container") {
		const container = document.getElementById(containerId);
		if (!container) {
			console.error(`Nie znaleziono kontenera o ID: ${containerId}`);
			return;
		}

		container.innerHTML = this.generateAllToolsHTML();
	}

	/**
	 * Inicjalizuje generator i renderuje narzędzia
	 */
	async init(containerId = "tools-container") {
		await this.loadTools();
		this.renderTools(containerId);
	}

	/**
	 * Dodaje nowe narzędzie do listy
	 */
	addTool(tool) {
		// Walidacja podstawowych pól
		if (!tool.name || !tool.description || !tool.mainLink) {
			console.error("Narzędzie musi mieć nazwę, opis i główny link");
			return false;
		}

		// Ustawienie domyślnych wartości
		const newTool = {
			name: tool.name,
			icon: tool.icon || "fa-solid fa-tools",
			description: tool.description,
			types: tool.types || ["online"],
			typeLabels: tool.typeLabels || ["Web App"],
			platforms: tool.platforms || ["windows", "mac", "linux"],
			platformLabels: tool.platformLabels || ["Windows", "macOS", "Linux"],
			mainLink: tool.mainLink,
			additionalLink: tool.additionalLink || null,
		};

		this.tools.push(newTool);
		console.log(`Dodano narzędzie: ${newTool.name}`);
		return true;
	}

	/**
	 * Usuwa narzędzie z listy
	 */
	removeTool(toolName) {
		const initialLength = this.tools.length;
		this.tools = this.tools.filter(tool => tool.name !== toolName);

		if (this.tools.length < initialLength) {
			console.log(`Usunięto narzędzie: ${toolName}`);
			return true;
		} else {
			console.log(`Nie znaleziono narzędzia: ${toolName}`);
			return false;
		}
	}

	/**
	 * Filtruje narzędzia według typu
	 */
	filterByType(type) {
		return this.tools.filter(tool => tool.types && tool.types.includes(type));
	}

	/**
	 * Filtruje narzędzia według platformy
	 */
	filterByPlatform(platform) {
		return this.tools.filter(
			tool => tool.platforms && tool.platforms.includes(platform)
		);
	}

	/**
	 * Wyszukuje narzędzia według nazwy lub opisu
	 */
	search(query) {
		const lowerQuery = query.toLowerCase();
		return this.tools.filter(
			tool =>
				tool.name.toLowerCase().includes(lowerQuery) ||
				tool.description.toLowerCase().includes(lowerQuery)
		);
	}

	/**
	 * Eksportuje aktualne narzędzia do JSON
	 */
	exportToJSON() {
		return JSON.stringify({ tools: this.tools }, null, 2);
	}

	/**
	 * Pobiera statystyki narzędzi
	 */
	getStats() {
		const stats = {
			total: this.tools.length,
			byType: {},
			byPlatform: {},
		};

		this.tools.forEach(tool => {
			if (tool.types) {
				tool.types.forEach(type => {
					stats.byType[type] = (stats.byType[type] || 0) + 1;
				});
			}
			if (tool.platforms) {
				tool.platforms.forEach(platform => {
					stats.byPlatform[platform] = (stats.byPlatform[platform] || 0) + 1;
				});
			}
		});

		return stats;
	}
}

// Eksport dla użycia w innych plikach
if (typeof module !== "undefined" && module.exports) {
	module.exports = ExternalToolsGenerator;
}

// Globalna instancja dla łatwego użycia
window.ExternalToolsGenerator = ExternalToolsGenerator;
