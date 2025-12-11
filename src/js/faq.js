document.addEventListener("DOMContentLoaded", () => {
    const faqButtons = document.querySelectorAll(".faq-item__button");

    faqButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const item = button.closest(".faq-item");
            if (!item) return;

            // on toggle juste une classe pour l’animation du +
            item.classList.toggle("faq-item--open");
        });
    });
});
