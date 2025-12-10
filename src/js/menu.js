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

    // état initial
    updateCarousel();

    prevBtn.addEventListener("click", () => {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();
    });

    nextBtn.addEventListener("click", () => {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    });
});
