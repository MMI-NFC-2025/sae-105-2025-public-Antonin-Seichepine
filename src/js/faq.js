document.addEventListener("DOMContentLoaded", () => {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
        const button = item.querySelector(".faq-item__button");
        const answer = item.querySelector(".faq-item__answer");

        if (!button || !answer) return;

        button.addEventListener("click", () => {
            const isOpen = item.classList.toggle("faq-item--open");

            // on montre / cache la réponse
            if (isOpen) {
                answer.hidden = false;
            } else {
                answer.hidden = true;
            }
        });
    });
});
