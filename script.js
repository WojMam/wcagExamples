document.addEventListener("DOMContentLoaded", function () {
	// Add a "skip to content" link for keyboard users
	const skipLink = document.createElement("a");
	skipLink.href = "#main";
	skipLink.textContent = "Przejdź do treści głównej";
	skipLink.className = "skip-link";
	skipLink.style.position = "absolute";
	skipLink.style.top = "-40px";
	skipLink.style.left = "0";
	skipLink.style.backgroundColor = "#005a9c";
	skipLink.style.color = "white";
	skipLink.style.padding = "8px";
	skipLink.style.zIndex = "100";
	skipLink.style.transition = "top 0.3s";

	skipLink.addEventListener("focus", function () {
		this.style.top = "0";
	});

	skipLink.addEventListener("blur", function () {
		this.style.top = "-40px";
	});

	document.body.prepend(skipLink);

	// Load header and footer content
	loadHeader();
	loadFooter();

	// Example of accessible form validation
	const forms = document.querySelectorAll("form");
	forms.forEach(form => {
		form.addEventListener("submit", function (event) {
			const requiredInputs = form.querySelectorAll("[required]");
			let isValid = true;

			requiredInputs.forEach(input => {
				if (!input.value.trim()) {
					event.preventDefault();
					isValid = false;

					// Clear previous error messages
					const existingError = input.nextElementSibling;
					if (
						existingError &&
						existingError.classList.contains("error-message")
					) {
						existingError.remove();
					}

					// Add error message
					const errorMessage = document.createElement("span");
					errorMessage.textContent = "To pole jest wymagane";
					errorMessage.className = "error-message";
					errorMessage.style.color = "var(--bad-color)";
					errorMessage.style.display = "block";
					errorMessage.setAttribute("role", "alert");

					input.after(errorMessage);
					input.setAttribute("aria-invalid", "true");

					// Focus on the first invalid input
					if (isValid) {
						input.focus();
					}
				} else {
					input.removeAttribute("aria-invalid");

					// Remove error message if exists
					const existingError = input.nextElementSibling;
					if (
						existingError &&
						existingError.classList.contains("error-message")
					) {
						existingError.remove();
					}
				}
			});
		});
	});

	// Add a button to toggle high contrast mode
	const contrastButton = document.createElement("button");
	contrastButton.textContent = "Wysoki kontrast";
	contrastButton.className = "contrast-button";
	contrastButton.setAttribute("aria-pressed", "false");
	contrastButton.style.position = "fixed";
	contrastButton.style.right = "20px";
	contrastButton.style.bottom = "20px";
	contrastButton.style.padding = "10px";
	contrastButton.style.backgroundColor = "#333";
	contrastButton.style.color = "white";
	contrastButton.style.border = "none";
	contrastButton.style.borderRadius = "5px";
	contrastButton.style.cursor = "pointer";

	contrastButton.addEventListener("click", function () {
		const isPressed = this.getAttribute("aria-pressed") === "true";
		this.setAttribute("aria-pressed", !isPressed);

		if (!isPressed) {
			document.body.classList.add("high-contrast");
			this.textContent = "Normalny kontrast";
		} else {
			document.body.classList.remove("high-contrast");
			this.textContent = "Wysoki kontrast";
		}
	});

	document.body.appendChild(contrastButton);

	// Dodaj nawigację do stron z kryteriami
	setupCriterionNavigation();
});

/**
 * Funkcja ładująca zawartość nagłówka z pliku header.html
 */
function loadHeader() {
	const headerElement = document.querySelector("header");
	console.log("Funkcja loadHeader() uruchomiona");
	console.log("Znaleziony element nagłówka:", headerElement);

	if (headerElement) {
		// Określ ścieżkę do pliku header.html
		let headerPath = "header.html";
		// Flaga określająca, czy jesteśmy w podkatalogu
		let isSubdirectory = false;

		// Sprawdź, czy jesteśmy w podfolderze (np. guidelines)
		const path = window.location.pathname;
		console.log("Aktualna ścieżka:", path);

		if (path.includes("/guidelines/")) {
			headerPath = "../header.html";
			isSubdirectory = true;
			console.log("Wykryto katalog guidelines, ustawiam ścieżkę:", headerPath);
		} else if (
			path.includes("/videos/") ||
			path.includes("/images/") ||
			path.includes("/audio/") ||
			path.includes("/narzedzia/")
		) {
			// Sprawdź czy jesteśmy w podkatalogu narzędzi (np. /narzedzia/wewnetrzne/)
			if (path.includes("/narzedzia/wewnetrzne/")) {
				headerPath = "../../header.html";
			} else {
				headerPath = "../header.html";
			}
			isSubdirectory = true;
			console.log("Wykryto inny podkatalog, ustawiam ścieżkę:", headerPath);
		} else {
			console.log("Wykryto katalog główny, ustawiam ścieżkę:", headerPath);
		}

		console.log("Ładowanie nagłówka z:", headerPath);

		// Tymczasowo wyświetl zawartość awaryjną, żeby coś było widoczne
		headerElement.innerHTML = `<h1>Ładowanie nagłówka...</h1>`;

		try {
			// Użyj XMLHttpRequest zamiast fetch dla plików lokalnych
			const xhr = new XMLHttpRequest();
			xhr.open("GET", headerPath, false); // tryb synchroniczny
			xhr.send();

			if (xhr.status === 200) {
				let html = xhr.responseText;
				console.log("Pobrano zawartość nagłówka, długość:", html.length);

				// Dostosuj ścieżki do obrazów i linków w zależności od lokalizacji
				if (isSubdirectory) {
					if (path.includes("/narzedzia/wewnetrzne/")) {
						// Dla głębszych podkatalogów (np. /narzedzia/wewnetrzne/)
						html = html.replace(/href="index.html/g, 'href="../../index.html');
						html = html.replace(
							/href="wytyczne.html/g,
							'href="../../wytyczne.html'
						);
						html = html.replace(/src="images\//g, 'src="../../images/');
					} else {
						// Dla zwykłych podkatalogów
						html = html.replace(/href="index.html/g, 'href="../index.html');
						html = html.replace(
							/href="wytyczne.html/g,
							'href="../wytyczne.html'
						);
						html = html.replace(/src="images\//g, 'src="../images/');
					}
					console.log("Dostosowano ścieżki dla podkatalogu");
				}

				headerElement.innerHTML = html;
				console.log("Zaktualizowano zawartość nagłówka");
			} else {
				throw new Error(
					"Nie udało się załadować nagłówka, status: " + xhr.status
				);
			}
		} catch (error) {
			console.error("Błąd ładowania nagłówka:", error);
			// W przypadku błędu, wstaw bezpośrednio zawartość nagłówka
			const headerContent = isSubdirectory
				? path.includes("/narzedzia/wewnetrzne/")
					? `
				<h1>WCAG 2.1 - Nieoficjalny przewodnik dostępności</h1>
				<p class="subtitle">Praktyczne przykłady implementacji wytycznych WCAG 2.1</p>

				<div class="disclaimer-banner" role="alert">
					<img src="../../images/under-development-banner.png" alt="Projekt w trakcie rozwoju" width="80" height="80"
						style="float: left; margin-right: 20px; margin-bottom: 10px;">
					<div style="overflow: hidden;">
						<strong>Uwaga! To nie jest oficjalna strona WCAG!</strong>
						Ta strona służy jedynie do celów edukacyjnych i ćwiczeniowych. Nie jest to oficjalna dokumentacja WCAG 2.1.
						Na stronie mogą występować błędy lub niektóre funkcje mogą nie działać poprawnie, ponieważ projekt jest w
						trakcie rozwoju.
					</div>
					<div style="clear: both;"></div>
				</div>

				<nav aria-label="Główna nawigacja">
					<ul class="main-nav">
						<li><a href="../../index.html">Strona główna</a></li>
						<li><a href="../../wytyczne.html">Przykłady wytycznych</a></li>
					</ul>
				</nav>
			`
					: `
				<h1>WCAG 2.1 - Nieoficjalny przewodnik dostępności</h1>
				<p class="subtitle">Praktyczne przykłady implementacji wytycznych WCAG 2.1</p>

				<div class="disclaimer-banner" role="alert">
					<img src="../images/under-development-banner.png" alt="Projekt w trakcie rozwoju" width="80" height="80"
						style="float: left; margin-right: 20px; margin-bottom: 10px;">
					<div style="overflow: hidden;">
						<strong>Uwaga! To nie jest oficjalna strona WCAG!</strong>
						Ta strona służy jedynie do celów edukacyjnych i ćwiczeniowych. Nie jest to oficjalna dokumentacja WCAG 2.1.
						Na stronie mogą występować błędy lub niektóre funkcje mogą nie działać poprawnie, ponieważ projekt jest w
						trakcie rozwoju.
					</div>
					<div style="clear: both;"></div>
				</div>

				<nav aria-label="Główna nawigacja">
					<ul class="main-nav">
						<li><a href="../index.html">Strona główna</a></li>
						<li><a href="../wytyczne.html">Przykłady wytycznych</a></li>
					</ul>
				</nav>
			`
				: `
				<h1>WCAG 2.1 - Nieoficjalny przewodnik dostępności</h1>
				<p class="subtitle">Praktyczne przykłady implementacji wytycznych WCAG 2.1</p>

				<div class="disclaimer-banner" role="alert">
					<img src="images/under-development-banner.png" alt="Projekt w trakcie rozwoju" width="80" height="80"
						style="float: left; margin-right: 20px; margin-bottom: 10px;">
					<div style="overflow: hidden;">
						<strong>Uwaga! To nie jest oficjalna strona WCAG!</strong>
						Ta strona służy jedynie do celów edukacyjnych i ćwiczeniowych. Nie jest to oficjalna dokumentacja WCAG 2.1.
						Na stronie mogą występować błędy lub niektóre funkcje mogą nie działać poprawnie, ponieważ projekt jest w
						trakcie rozwoju.
					</div>
					<div style="clear: both;"></div>
				</div>

				<nav aria-label="Główna nawigacja">
					<ul class="main-nav">
						<li><a href="index.html">Strona główna</a></li>
						<li><a href="wytyczne.html">Przykłady wytycznych</a></li>
					</ul>
				</nav>
			`;

			headerElement.innerHTML = headerContent;
			console.log("Załadowano zawartość nagłówka bezpośrednio z kodu");
		}
	} else {
		console.error("Nie znaleziono elementu nagłówka na stronie!");
	}
}

/**
 * Funkcja ładująca zawartość stopki z pliku footer.html
 */
function loadFooter() {
	const footerElement = document.querySelector("footer");

	if (footerElement) {
		// Określ ścieżkę do pliku footer.html
		let footerPath = "footer.html";
		// Flaga określająca, czy jesteśmy w podkatalogu
		let isSubdirectory = false;

		// Sprawdź, czy jesteśmy w podfolderze (np. guidelines)
		if (window.location.pathname.includes("/guidelines/")) {
			footerPath = "../footer.html";
			isSubdirectory = true;
		} else if (
			window.location.pathname.includes("/videos/") ||
			window.location.pathname.includes("/images/") ||
			window.location.pathname.includes("/audio/") ||
			window.location.pathname.includes("/narzedzia/")
		) {
			// Sprawdź czy jesteśmy w podkatalogu narzędzi (np. /narzedzia/wewnetrzne/)
			if (window.location.pathname.includes("/narzedzia/wewnetrzne/")) {
				footerPath = "../../footer.html";
			} else {
				footerPath = "../footer.html";
			}
			isSubdirectory = true;
		}

		try {
			// Użyj XMLHttpRequest zamiast fetch dla plików lokalnych
			const xhr = new XMLHttpRequest();
			xhr.open("GET", footerPath, false); // tryb synchroniczny
			xhr.send();

			if (xhr.status === 200) {
				let html = xhr.responseText;
				footerElement.innerHTML = html;
			} else {
				throw new Error(
					"Nie udało się załadować stopki, status: " + xhr.status
				);
			}
		} catch (error) {
			console.error("Błąd ładowania stopki:", error);
			// W przypadku błędu, wstaw bezpośrednio zawartość stopki
			footerElement.innerHTML = `
				<p>&copy; Nieoficjalny przewodnik WCAG 2.1 - Autor: Wojciech Mamys</p>
				<p>
					<a href="https://www.w3.org/TR/WCAG21/" target="_blank" rel="noopener">Oficjalna dokumentacja WCAG 2.1</a>
				</p>
			`;
		}
	}
}

/**
 * Funkcja dodająca ścieżkę nawigacyjną (breadcrumbs) do stron z kryteriami
 */
function setupCriterionNavigation() {
	// Sprawdź czy jesteśmy na stronie kryterium
	const path = window.location.pathname;
	console.log("setupCriterionNavigation - ścieżka:", path);
	const isGuidelinePage = path.includes("/guidelines/");
	console.log("Jest to strona wytycznych:", isGuidelinePage);

	if (!isGuidelinePage) return;

	const mainContent = document.querySelector("main");
	if (!mainContent) {
		console.log("Nie znaleziono elementu main");
		return;
	}

	// Pobierz informacje o kryterium z URL
	const pathParts = path.split("/");
	const filename = pathParts[pathParts.length - 1];
	const criterionId = filename.replace(".html", "");
	console.log("ID kryterium:", criterionId);

	// Znajdź element nawigacji kryteriów
	const criterionNav = document.querySelector(".criterion-nav ul");
	if (criterionNav) {
		console.log("Znaleziono nawigację kryteriów");
		// Sprawdź, czy już mamy link do listy wytycznych
		const hasReturnLink = Array.from(
			criterionNav.querySelectorAll("li a")
		).some(link => link.href.includes("wytyczne.html"));
		console.log("Czy jest już link powrotu:", hasReturnLink);

		// Jeśli nie ma linku powrotu, dodaj go
		if (!hasReturnLink) {
			const middleItem = document.createElement("li");
			const returnLink = document.createElement("a");
			returnLink.href = "../wytyczne.html";
			returnLink.textContent = "Powrót do listy wytycznych";
			middleItem.appendChild(returnLink);

			// Jeśli mamy co najmniej dwa elementy (poprzedni, następny)
			if (criterionNav.children.length >= 2) {
				criterionNav.insertBefore(middleItem, criterionNav.children[1]);
			} else {
				criterionNav.appendChild(middleItem);
			}
			console.log("Dodano link powrotu do nawigacji");
		}
	} else {
		console.log("Nie znaleziono nawigacji kryteriów");
	}

	// Sprawdź czy już istnieje ścieżka nawigacyjna
	if (document.querySelector(".breadcrumbs")) {
		console.log("Breadcrumbs już istnieje - pomijam");
		return;
	}

	// Parsuj ID kryterium, np. 1.3.4 -> wytyczna: 1.3, kryterium: 4
	const parts = criterionId.split(".");
	if (parts.length < 2) {
		console.log("Nieprawidłowy format ID kryterium");
		return;
	}

	const guidelinePrefix = parts[0] + "." + parts[1]; // np. 1.3
	console.log("Prefiks wytycznej:", guidelinePrefix);

	// Znajdź i pobierz tytuł kryterium
	const criterionTitle =
		document.querySelector("h1")?.textContent.trim() || criterionId;
	console.log("Tytuł kryterium:", criterionTitle);

	// Utwórz breadcrumbs
	const breadcrumbs = document.createElement("div");
	breadcrumbs.className = "breadcrumbs";

	const breadcrumbsList = document.createElement("ul");

	// Dodaj link do strony głównej
	const homeItem = document.createElement("li");
	const homeLink = document.createElement("a");
	homeLink.href = "../index.html";
	homeLink.textContent = "Strona główna";
	homeItem.appendChild(homeLink);
	breadcrumbsList.appendChild(homeItem);

	// Dodaj link do listy wytycznych
	const guidelinesItem = document.createElement("li");
	const guidelinesLink = document.createElement("a");
	guidelinesLink.href = "../wytyczne.html";
	guidelinesLink.textContent = "Lista wytycznych";
	guidelinesItem.appendChild(guidelinesLink);
	breadcrumbsList.appendChild(guidelinesItem);

	// Dodaj wytyczną (np. 1.3 Możliwość adaptacji)
	const guideline = document.createElement("li");
	const guidelineLink = document.createElement("a");
	guidelineLink.href = guidelinePrefix + ".html";
	guidelineLink.textContent =
		guidelinePrefix + " " + getGuidelineName(guidelinePrefix);
	guideline.appendChild(guidelineLink);
	breadcrumbsList.appendChild(guideline);

	// Dodaj aktualne kryterium
	const criterionItem = document.createElement("li");
	criterionItem.textContent = criterionId;
	breadcrumbsList.appendChild(criterionItem);

	breadcrumbs.appendChild(breadcrumbsList);

	// Dodaj nawigację na początku treści
	mainContent.insertBefore(breadcrumbs, mainContent.firstChild);
	console.log("Dodano breadcrumbs");
}

/**
 * Funkcja zwracająca nazwę wytycznej na podstawie prefiksu (np. 1.3)
 */
function getGuidelineName(prefix) {
	const guidelineNames = {
		1.1: "Alternatywa tekstowa",
		1.2: "Multimedia",
		1.3: "Możliwość adaptacji",
		1.4: "Możliwość rozróżnienia",
		2.1: "Dostępność z klawiatury",
		2.2: "Wystarczająca ilość czasu",
		2.3: "Ataki padaczki",
		2.4: "Możliwość nawigacji",
		2.5: "Sposoby wprowadzania danych",
		3.1: "Możliwość odczytania",
		3.2: "Przewidywalność",
		3.3: "Pomoc przy wprowadzaniu informacji",
		4.1: "Kompatybilność",
	};

	return guidelineNames[prefix] || "Nieznana wytyczna";
}
