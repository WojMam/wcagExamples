/**
 * Dostępny Slider zgodny z WCAG
 * Implementuje automatyczne przesuwanie z możliwością zatrzymania,
 * nawigację klawiaturową i wsparcie dla czytników ekranu
 */

class AccessibleSlider {
	constructor() {
		this.currentSlide = 1;
		this.totalSlides = 4;
		this.isPlaying = true;
		this.autoplayInterval = null;
		this.autoplayDelay = 4000; // 4 sekundy

		this.initElements();
		this.initEventListeners();
		this.startAutoplay();
		this.updateSlideCounter();
	}

	initElements() {
		// Główne elementy
		this.sliderTrack = document.getElementById("slider-track");
		this.playPauseBtn = document.getElementById("play-pause-btn");
		this.prevBtn = document.getElementById("prev-btn");
		this.nextBtn = document.getElementById("next-btn");
		this.slideCounter = document.getElementById("slide-counter");

		// Slides i dots
		this.slides = document.querySelectorAll(".slide");
		this.dots = document.querySelectorAll(".dot");

		// Sprawdzenie czy wszystkie elementy istnieją
		if (
			!this.sliderTrack ||
			!this.playPauseBtn ||
			!this.prevBtn ||
			!this.nextBtn
		) {
			console.error("Slider: Nie znaleziono wymaganych elementów");
			return;
		}
	}

	initEventListeners() {
		// Przycisk play/pause
		this.playPauseBtn.addEventListener("click", () => this.toggleAutoplay());

		// Nawigacja strzałkami
		this.prevBtn.addEventListener("click", () => this.goToPrevSlide());
		this.nextBtn.addEventListener("click", () => this.goToNextSlide());

		// Dots navigation
		this.dots.forEach((dot, index) => {
			dot.addEventListener("click", () => this.goToSlide(index + 1));
		});

		// Nawigacja klawiaturą
		document.addEventListener("keydown", e => this.handleKeyNavigation(e));

		// Zatrzymanie autoplay przy hover (opcjonalne)
		this.sliderTrack.addEventListener("mouseenter", () => {
			if (this.isPlaying) {
				this.pauseAutoplay();
			}
		});

		this.sliderTrack.addEventListener("mouseleave", () => {
			if (this.isPlaying) {
				this.startAutoplay();
			}
		});

		// Zatrzymanie autoplay przy focus na kontrolkach
		[this.prevBtn, this.nextBtn, ...this.dots].forEach(element => {
			element.addEventListener("focus", () => {
				if (this.isPlaying) {
					this.pauseAutoplay();
				}
			});

			element.addEventListener("blur", () => {
				if (this.isPlaying) {
					this.startAutoplay();
				}
			});
		});
	}

	goToSlide(slideNumber) {
		if (slideNumber < 1 || slideNumber > this.totalSlides) return;

		this.currentSlide = slideNumber;
		this.updateSlider();
		this.updateSlideCounter();
		this.updateDots();
		this.updateSlideStates();
	}

	goToNextSlide() {
		const nextSlide =
			this.currentSlide >= this.totalSlides ? 1 : this.currentSlide + 1;
		this.goToSlide(nextSlide);
	}

	goToPrevSlide() {
		const prevSlide =
			this.currentSlide <= 1 ? this.totalSlides : this.currentSlide - 1;
		this.goToSlide(prevSlide);
	}

	updateSlider() {
		const translateX = -((this.currentSlide - 1) * 100);
		this.sliderTrack.style.transform = `translateX(${translateX}%)`;
	}

	updateSlideCounter() {
		if (this.slideCounter) {
			this.slideCounter.textContent = `Slajd ${this.currentSlide} z ${this.totalSlides}`;
		}
	}

	updateDots() {
		this.dots.forEach((dot, index) => {
			const isActive = index + 1 === this.currentSlide;
			dot.classList.toggle("active", isActive);
			dot.setAttribute("aria-selected", isActive);
		});
	}

	updateSlideStates() {
		this.slides.forEach((slide, index) => {
			const isActive = index + 1 === this.currentSlide;
			slide.classList.toggle("active", isActive);

			// Aktualizacja dla czytników ekranu
			const img = slide.querySelector("img");
			if (img) {
				img.setAttribute("aria-hidden", !isActive);
			}
		});
	}

	startAutoplay() {
		if (this.autoplayInterval) {
			clearInterval(this.autoplayInterval);
		}

		this.autoplayInterval = setInterval(() => {
			this.goToNextSlide();
		}, this.autoplayDelay);
	}

	pauseAutoplay() {
		if (this.autoplayInterval) {
			clearInterval(this.autoplayInterval);
			this.autoplayInterval = null;
		}
	}

	toggleAutoplay() {
		this.isPlaying = !this.isPlaying;

		if (this.isPlaying) {
			this.startAutoplay();
			this.playPauseBtn.innerHTML = `
                <span aria-hidden="true">⏸️</span>
                <span class="btn-text">Pauza</span>
            `;
			this.playPauseBtn.setAttribute(
				"aria-label",
				"Zatrzymaj automatyczne przesuwanie"
			);
		} else {
			this.pauseAutoplay();
			this.playPauseBtn.innerHTML = `
                <span aria-hidden="true">▶️</span>
                <span class="btn-text">Odtwórz</span>
            `;
			this.playPauseBtn.setAttribute(
				"aria-label",
				"Uruchom automatyczne przesuwanie"
			);
		}
	}

	handleKeyNavigation(event) {
		// Sprawdź czy focus jest na sliderze
		const sliderContainer = document.querySelector(".slider-container");
		if (!sliderContainer.contains(document.activeElement)) {
			return;
		}

		switch (event.key) {
			case "ArrowLeft":
				event.preventDefault();
				this.goToPrevSlide();
				break;
			case "ArrowRight":
				event.preventDefault();
				this.goToNextSlide();
				break;
			case "Home":
				event.preventDefault();
				this.goToSlide(1);
				break;
			case "End":
				event.preventDefault();
				this.goToSlide(this.totalSlides);
				break;
			case " ":
			case "Spacebar":
				// Jeśli focus jest na przycisku play/pause, nie obsługuj spacją
				if (document.activeElement === this.playPauseBtn) {
					return;
				}
				event.preventDefault();
				this.toggleAutoplay();
				break;
			case "Escape":
				event.preventDefault();
				if (this.isPlaying) {
					this.toggleAutoplay();
				}
				break;
		}
	}

	// Publiczne metody dla external kontroli
	play() {
		if (!this.isPlaying) {
			this.toggleAutoplay();
		}
	}

	pause() {
		if (this.isPlaying) {
			this.toggleAutoplay();
		}
	}

	destroy() {
		this.pauseAutoplay();
		// Tutaj można dodać cleanup event listenerów jeśli potrzeba
	}
}

// Inicjalizacja slidera po załadowaniu DOM
document.addEventListener("DOMContentLoaded", () => {
	// Sprawdź czy slider istnieje na stronie
	if (document.querySelector(".slider-container")) {
		window.accessibleSlider = new AccessibleSlider();

		// Dodaj informację dla deweloperów
		console.log("Dostępny slider został zainicjalizowany.");
		console.log(
			"Nawigacja klawiaturą: ← → (strzałki), Space (play/pause), Home/End (pierwszy/ostatni slajd), Escape (pause)"
		);
	}
});

// Cleanup przy zamknięciu strony
window.addEventListener("beforeunload", () => {
	if (window.accessibleSlider) {
		window.accessibleSlider.destroy();
	}
});
