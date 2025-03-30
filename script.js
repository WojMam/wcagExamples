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
			path.includes("/audio/")
		) {
			headerPath = "../header.html";
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
					html = html.replace(/href="index.html/g, 'href="../index.html');
					html = html.replace(/src="images\//g, 'src="../images/');
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
				? `
				<h1>WCAG 2.1 - Nieoficjalny przewodnik dostępności</h1>
				<p class="subtitle">Przykłady implementacji wytycznych dostępności stron internetowych</p>

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
						<li>
							<a href="../index.html#section-1">1. Postrzegalność</a>
							<ul class="subnav">
								<li><a href="../index.html#guideline-1-1">1.1 Alternatywa tekstowa</a></li>
								<li><a href="../index.html#guideline-1-2">1.2 Media zsynchronizowane</a></li>
								<li><a href="../index.html#guideline-1-3">1.3 Możliwość adaptacji</a></li>
								<li><a href="../index.html#guideline-1-4">1.4 Możliwość rozróżnienia</a></li>
							</ul>
						</li>
					</ul>
				</nav>
			`
				: `
				<h1>WCAG 2.1 - Nieoficjalny przewodnik dostępności</h1>
				<p class="subtitle">Przykłady implementacji wytycznych dostępności stron internetowych</p>

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
						<li>
							<a href="index.html#section-1">1. Postrzegalność</a>
							<ul class="subnav">
								<li><a href="index.html#guideline-1-1">1.1 Alternatywa tekstowa</a></li>
								<li><a href="index.html#guideline-1-2">1.2 Media zsynchronizowane</a></li>
								<li><a href="index.html#guideline-1-3">1.3 Możliwość adaptacji</a></li>
								<li><a href="index.html#guideline-1-4">1.4 Możliwość rozróżnienia</a></li>
							</ul>
						</li>
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
			window.location.pathname.includes("/audio/")
		) {
			footerPath = "../footer.html";
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
