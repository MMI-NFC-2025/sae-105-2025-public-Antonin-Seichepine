const menuBtn = document.querySelector('.header__menu-btn');
const siteMenu = document.getElementById('site-menu');

if (menuBtn && siteMenu) {
    const overlay = siteMenu.querySelector('.site-menu__overlay');
    const closeBtn = siteMenu.querySelector('.site-menu__close');

    const openMenu = () => {
        siteMenu.hidden = false;
        menuBtn.classList.add('menu-btn--open');
        menuBtn.setAttribute('aria-expanded', 'true');
        siteMenu.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    };

    const closeMenu = () => {
        menuBtn.classList.remove('menu-btn--open');
        menuBtn.setAttribute('aria-expanded', 'false');
        siteMenu.setAttribute('aria-hidden', 'true');

        setTimeout(() => {
            if (siteMenu.getAttribute('aria-hidden') === 'true') {
                siteMenu.hidden = true;
            }
        }, 300);

        document.body.style.overflow = '';
    };

    menuBtn.addEventListener('click', () => {
        const isOpen = siteMenu.getAttribute('aria-hidden') === 'false';
        isOpen ? closeMenu() : openMenu();
    });

    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMenu();
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const carousel = document.querySelector(".partners-carousel");
    if (!carousel) return;

    const track = carousel.querySelector(".partners-carousel__track");
    const items = Array.from(track.querySelectorAll(".partners-carousel__item"));

    const prevBtn = carousel.querySelector(".carousel__control--prev");
    const nextBtn = carousel.querySelector(".carousel__control--next");

    if (!items.length || !prevBtn || !nextBtn) return;

    let currentIndex = 0;

    function updateCarousel() {
        items.forEach((item, index) => {
            const isActive = index === currentIndex;
            item.classList.toggle("is-active", isActive);
            item.setAttribute("aria-hidden", isActive ? "false" : "true");
        });
    }

    // ---- ANIMATION 100% JS (zoom + ombre + retour smooth) ----
    function animateButton(btn) {
        // Si une anim est déjà en cours sur ce bouton, on la reset
        if (btn._animTimeout) {
            clearTimeout(btn._animTimeout);
            btn._animTimeout = null;
        }

        // Transition un peu plus lente & smooth
        btn.style.transition = "transform 220ms cubic-bezier(0.25, 0.1, 0.25, 1)";
        // On part de l'état normal
        btn.style.transform = "scale(1)";
        // On enlève toute ombre résiduelle
        btn.style.boxShadow = "none";

        // Lancer le zoom + ombre au prochain frame
        requestAnimationFrame(() => {
            btn.style.transform = "scale(1.25)";
            // Ombre pendant le clic (tu peux ajuster si tu veux)
            btn.style.boxShadow = "0 6px 18px rgba(0, 0, 0, 0.18)";
        });

        // Puis retour à la normale + on enlève l’ombre
        btn._animTimeout = setTimeout(() => {
            btn.style.transform = "scale(1)";
            btn.style.boxShadow = "none";
            btn._animTimeout = null;
        }, 220);
    }

    // état initial
    updateCarousel();

    prevBtn.addEventListener("click", () => {
        animateButton(prevBtn);
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();
    });

    nextBtn.addEventListener("click", () => {
        animateButton(nextBtn);
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    });
});
