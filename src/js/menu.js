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

    // Sélecteurs des éléments interactifs
    const interactiveElements = document.querySelectorAll(`
        button,
        .btn,
        .infos-card,
        .faq-item__button,
        .header__menu-btn,
        .site-menu__close
    `);

    interactiveElements.forEach(el => {
        // Valeur du grow
        const scaleUp = 1.03;
        const scaleDown = 1;

        // On prépare la transition directement en JS
        el.style.transition = "transform 0.15s ease";

        // GROW
        el.addEventListener("mouseenter", () => {
            el.style.transform = `scale(${scaleUp})`;
        });

        // RETOUR À NORMAL
        el.addEventListener("mouseleave", () => {
            el.style.transform = `scale(${scaleDown})`;
        });

        // Sur mobile : effet au clic
        el.addEventListener("touchstart", () => {
            el.style.transform = `scale(${scaleUp})`;
        });

        el.addEventListener("touchend", () => {
            el.style.transform = `scale(${scaleDown})`;
        });
    });

});
