const toggleBtn = document.getElementById("toggle-projects");
const extraWrapper = document.getElementById("extra-wrapper");
const extraProjects = document.getElementById("extra-projects");
const extraCards = document.querySelectorAll(".card-extra");

let expanded = false;

toggleBtn.addEventListener("click", () => {
    if (!expanded) {
        // Mostrar visualmente os cards
        extraCards.forEach((card) => {
            card.classList.remove("opacity-0", "translate-y-4");
            card.classList.add("opacity-100", "translate-y-0");
        });

        // Expandir altura suavemente
        const fullHeight = extraProjects.scrollHeight;
        extraWrapper.style.height = fullHeight + "px";

        setTimeout(() => {
            extraWrapper.style.height = "auto";
        }, 700);

        toggleBtn.textContent = "Ver menos projetos";
    } else {
        // Fixar altura antes de recolher
        extraWrapper.style.height = extraProjects.scrollHeight + "px";
        void extraWrapper.offsetWidth; // força reflow
        extraWrapper.style.height = "0px";

        // Esconder visualmente os cards
        extraCards.forEach((card) => {
            card.classList.remove("opacity-100", "translate-y-0");
            card.classList.add("opacity-0", "translate-y-4");
        });

        toggleBtn.textContent = "Ver mais projetos";
    }

    expanded = !expanded;
});