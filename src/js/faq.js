document.addEventListener("DOMContentLoaded", () => {
    const faqItems = document.querySelectorAll(".faq-item");

    faqItems.forEach((item) => {
        const button = item.querySelector(".faq-item__button");
        const answer = item.querySelector(".faq-item__answer");

        if (!button || !answer) return;

        // Fermé par défaut
        answer.style.overflow = "hidden";
        answer.style.height = "0px";

        button.addEventListener("click", () => {
            const isOpen = item.classList.contains("faq-item--open");

            if (isOpen) {
                // FERMETURE ANIMÉE
                animateHeight(answer, answer.scrollHeight, 0, () => {
                    item.classList.remove("faq-item--open");
                    answer.hidden = true;
                });
            } else {
                // OUVERTURE ANIMÉE
                answer.hidden = false;
                const targetHeight = answer.scrollHeight;
                animateHeight(answer, 0, targetHeight, () => {
                    item.classList.add("faq-item--open");
                });
            }
        });
    });

    /**
     * Animation smooth de hauteur (JS pur)
     */
    function animateHeight(element, from, to, callback) {
        const duration = 220; // durée de l'anim (ms)
        const start = performance.now();

        function step(now) {
            const progress = Math.min((now - start) / duration, 1);
            const eased = easeOut(progress);

            element.style.height = from + (to - from) * eased + "px";

            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                if (to === 0) element.style.height = "0px";
                else element.style.height = "auto";
                callback && callback();
            }
        }

        requestAnimationFrame(step);
    }

    /**
     * Courbe d’animation smooth
     */
    function easeOut(t) {
        return 1 - Math.pow(1 - t, 3);
    }
});
