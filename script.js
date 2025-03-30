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

	// Load footer content
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
 * Funkcja ładująca zawartość stopki z pliku footer.html
 */
function loadFooter() {
	const footerElement = document.querySelector("footer");

	if (footerElement) {
		// Określ ścieżkę do pliku footer.html
		let footerPath = "footer.html";

		// Sprawdź, czy jesteśmy w podfolderze (np. guidelines)
		if (window.location.pathname.includes("/guidelines/")) {
			footerPath = "../footer.html";
		}

		// Użyj fetch API do pobrania zawartości footer.html
		fetch(footerPath)
			.then(response => {
				if (!response.ok) {
					throw new Error("Nie udało się załadować stopki");
				}
				return response.text();
			})
			.then(html => {
				footerElement.innerHTML = html;
			})
			.catch(error => {
				console.error("Błąd ładowania stopki:", error);
				// W przypadku błędu, wyświetl domyślną stopkę
				footerElement.innerHTML = `
					<p>&copy; Nieoficjalny przewodnik WCAG 2.1 - Autor: Wojciech Mamys</p>
					<p>
						<a href="https://www.w3.org/TR/WCAG21/" target="_blank" rel="noopener">Oficjalna dokumentacja WCAG 2.1</a>
					</p>
				`;
			});
	}
}
