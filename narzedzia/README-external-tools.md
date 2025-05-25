# System Narzędzi Zewnętrznych

Ten system pozwala na dynamiczne zarządzanie narzędziami zewnętrznymi poprzez plik JSON i skrypt JavaScript.

## Struktura plików

- `external-tools.json` - Plik konfiguracyjny zawierający wszystkie narzędzia
- `external-tools-generator.js` - Główny skrypt generujący HTML z danych JSON
- `zewnetrzne-dynamic.html` - Nowa wersja strony używająca dynamicznego generatora
- `example-usage.js` - Przykłady użycia i funkcje pomocnicze
- `zewnetrzne.html` - Oryginalna statyczna wersja (zachowana dla porównania)

## Struktura narzędzia w JSON

Każde narzędzie w pliku `external-tools.json` ma następującą strukturę:

```json
{
	"name": "Nazwa narzędzia",
	"icon": "fa-solid fa-icon-name",
	"description": "Opis narzędzia...",
	"types": ["extension", "online"],
	"typeLabels": ["Wtyczka", "Web App"],
	"mainLink": "https://example.com",
	"additionalLink": "https://example.com/docs" // lub null
}
```

### Pola obowiązkowe:

- `name` - Nazwa narzędzia
- `description` - Opis narzędzia
- `mainLink` - Główny link do narzędzia

### Pola opcjonalne:

- `icon` - Ikona Font Awesome (domyślnie: `fa-solid fa-tools`)
- `types` - Tablica typów narzędzia (domyślnie: `["online"]`)
- `typeLabels` - Tablica etykiet dla typów (domyślnie: `["Web App"]`)
- `additionalLink` - Dodatkowy link (domyślnie: `null`)

### Dostępne typy narzędzi:

- `extension` - Rozszerzenia przeglądarek
- `app` - Aplikacje desktopowe
- `online` - Aplikacje webowe
- `repo` - Repozytoria kodu
- `library` - Biblioteki programistyczne
- `screenreader` - Czytniki ekranu

## Użycie podstawowe

### 1. Ładowanie narzędzi z JSON

```javascript
const toolsGenerator = new ExternalToolsGenerator("./external-tools.json");
await toolsGenerator.loadTools();
```

### 2. Renderowanie narzędzi na stronie

```javascript
// Renderowanie w kontenerze o ID 'tools-container'
toolsGenerator.renderTools("tools-container");

// Lub inicjalizacja z automatycznym renderowaniem
await toolsGenerator.init("tools-container");
```

### 3. Dodawanie nowego narzędzia

```javascript
const newTool = {
	name: "Moje Narzędzie",
	icon: "fa-solid fa-star",
	description: "Opis mojego narzędzia",
	types: ["online", "extension"],
	typeLabels: ["Web App", "Wtyczka"],
	mainLink: "https://example.com",
	additionalLink: "https://example.com/docs",
};

toolsGenerator.addTool(newTool);
toolsGenerator.renderTools("tools-container"); // Ponowne renderowanie
```

### 4. Wyszukiwanie i filtrowanie

```javascript
// Wyszukiwanie według nazwy lub opisu
const results = toolsGenerator.search("WAVE");

// Filtrowanie według typu
const extensions = toolsGenerator.filterByType("extension");

// Statystyki
const stats = toolsGenerator.getStats();
console.log(`Łącznie: ${stats.total} narzędzi`);
```

## Funkcje pomocnicze

W pliku `example-usage.js` znajdują się gotowe funkcje, które można wywołać z konsoli przeglądarki:

- `addToolFromForm()` - Dodanie narzędzia przez formularz
- `exportToolsToFile()` - Eksport narzędzi do pliku JSON
- `showDetailedStats()` - Wyświetlenie szczegółowych statystyk
- `searchAndDisplay()` - Wyszukiwanie z wyświetleniem wyników

## Zarządzanie narzędziami

### Dodawanie nowego narzędzia

1. **Przez kod JavaScript:**

   ```javascript
   window.toolsGenerator.addTool(newToolObject);
   ```

2. **Przez formularz (w przeglądarce):**

   ```javascript
   addToolFromForm(); // Wywołaj w konsoli
   ```

3. **Bezpośrednio w JSON:**
   Edytuj plik `external-tools.json` i dodaj nowy obiekt do tablicy `tools`.

### Usuwanie narzędzia

```javascript
toolsGenerator.removeTool("Nazwa narzędzia");
```

### Eksport do pliku

```javascript
// Eksport do stringa JSON
const jsonString = toolsGenerator.exportToJSON();

// Eksport do pliku (w przeglądarce)
exportToolsToFile(); // Wywołaj w konsoli
```

## Integracja z istniejącą stroną

Aby zintegrować system z istniejącą stroną:

1. Dołącz skrypt generatora:

   ```html
   <script src="external-tools-generator.js"></script>
   ```

2. Utwórz kontener dla narzędzi:

   ```html
   <div id="tools-container"></div>
   ```

3. Zainicjalizuj generator:
   ```javascript
   document.addEventListener("DOMContentLoaded", async function () {
   	const toolsGenerator = new ExternalToolsGenerator("./external-tools.json");
   	await toolsGenerator.init("tools-container");
   });
   ```

## Stylowanie

System używa tych samych klas CSS co oryginalna strona:

- `.dashboard` - Kontener główny
- `.tile` - Pojedyncze narzędzie
- `.tile-header`, `.tile-content`, `.tile-footer` - Sekcje narzędzia
- `.tool-type`, `.tool-type-item` - Typy narzędzi
- `.tile-link` - Linki

## Rozszerzanie funkcjonalności

Klasa `ExternalToolsGenerator` może być łatwo rozszerzona o dodatkowe funkcje:

```javascript
class MyCustomGenerator extends ExternalToolsGenerator {
  // Dodaj własne metody
  customFilter(criteria) {
    return this.tools.filter(tool => /* własna logika */);
  }
}
```

## Debugowanie

W konsoli przeglądarki dostępne są globalne obiekty:

- `window.toolsGenerator` - Instancja generatora
- `window.ExternalToolsGenerator` - Klasa generatora

Przykład debugowania:

```javascript
console.log(window.toolsGenerator.tools); // Wszystkie narzędzia
console.log(window.toolsGenerator.getStats()); // Statystyki
```

## Migracja z wersji statycznej

Aby przejść z statycznej wersji na dynamiczną:

1. Skopiuj dane z `zewnetrzne.html` do `external-tools.json`
2. Zastąp zawartość strony kodem z `zewnetrzne-dynamic.html`
3. Dostosuj ścieżki do plików CSS i JS
4. Przetestuj funkcjonalność

## Zalety nowego systemu

- **Łatwość zarządzania** - Wszystkie narzędzia w jednym pliku JSON
- **Dynamiczność** - Możliwość dodawania/usuwania narzędzi bez edycji HTML
- **Wyszukiwanie** - Wbudowane funkcje wyszukiwania i filtrowania
- **Eksport/Import** - Łatwy eksport i import danych
- **Rozszerzalność** - Możliwość dodawania nowych funkcji
- **Konsystencja** - Automatyczne zachowanie spójnego formatowania
