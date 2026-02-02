// Non è necessario usare document.addEventListener('DOMContentLoaded') 
// se lo script è accodato con 'true' (nel footer)

// Carosello 1: .slidename
var splideSlidename = document.querySelector(".slidename");

if (splideSlidename) {
	new Splide(splideSlidename, {
		type: "loop",
		autoplay: true,
		interval: 3000,
		perPage: 1, // Impostazione base (desktop)
		gap: '20px',
		arrows: true,
		pagination: false,
		breakpoints: {
			1024: {
				perPage: 1,
			},
			767: {
				gap: '10px',
				perPage: 3, // Attenzione: perPage 3 su 767px è strano. Forse intendevi perPage: 1?
				perMove: 1, 
			},
		},
	}).mount();
}


// Carosello 2: .focus
var splideFocus = document.querySelector(".focus");

if (splideFocus) {
	new Splide(splideFocus, {
		type: 'loop',
		perPage: 4.5, 
		focus: 'center',
		gap: '2rem',
		arrows: true,
		pagination: true,
		autoplay: true,
		interval: 4000,
		breakpoints: {
			768: {
				perPage: 1,
				gap: '1rem',
			},
		},
	}).mount();
}
