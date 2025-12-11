// URL: index.html, festival.html – Menu burger
function initMenuBurger() {
    const menuBtn = document.querySelector('.header__menu-btn');
    const siteMenu = document.getElementById('site-menu');
    if (!menuBtn || !siteMenu) return;

    const overlay = siteMenu.querySelector('.site-menu__overlay');
    const closeBtn = siteMenu.querySelector('.site-menu__close');
    const navLinks = siteMenu.querySelectorAll('.site-menu__link');
    const body = document.body;
    let lastFocusedElement = null;

    const getFocusableElements = () =>
        Array.from(
            siteMenu.querySelectorAll(
                'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
            )
        ).filter((el) => el.offsetParent !== null);

    const lockScroll = () => body.classList.add('lock-scroll', 'menu-open');
    const unlockScroll = () => body.classList.remove('lock-scroll', 'menu-open');

    const openMenu = () => {
        lastFocusedElement = document.activeElement;
        siteMenu.hidden = false;
        siteMenu.setAttribute('aria-hidden', 'false');
        menuBtn.classList.add('menu-btn--open');
        menuBtn.setAttribute('aria-expanded', 'true');
        lockScroll();

        requestAnimationFrame(() => {
            const focusables = getFocusableElements();
            if (focusables.length) {
                focusables[0].focus();
            }
        });
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

        unlockScroll();

        if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        } else {
            menuBtn.focus();
        }
    };

    const toggleMenu = () => {
        const isOpen = siteMenu.getAttribute('aria-hidden') === 'false';
        if (isOpen) {
            closeMenu();
        } else {
            openMenu();
        }
    };

    const handleKeydown = (e) => {
        const isOpen = siteMenu.getAttribute('aria-hidden') === 'false';
        if (!isOpen) return;

        if (e.key === 'Escape') {
            e.preventDefault();
            closeMenu();
            return;
        }

        if (e.key !== 'Tab') return;
        const focusables = getFocusableElements();
        if (!focusables.length) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    };

    menuBtn.setAttribute('aria-controls', 'site-menu');
    menuBtn.setAttribute('aria-expanded', 'false');

    menuBtn.addEventListener('click', toggleMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    if (overlay) overlay.addEventListener('click', closeMenu);
    navLinks.forEach((link) => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', handleKeydown);
}

function ensureSearchButton(searchForm) {
    const menuBtn = document.querySelector('.header__menu-btn');
    if (!menuBtn || !searchForm) return null;

    let searchBtn = document.querySelector('.header__search-btn');
    if (searchBtn) return searchBtn;

    searchBtn = document.createElement('button');
    searchBtn.type = 'button';
    searchBtn.className = 'header__search-btn';
    searchBtn.setAttribute('aria-label', 'Afficher la recherche');
    if (searchForm.id) searchBtn.setAttribute('aria-controls', searchForm.id);

    const glyph = document.createElement('span');
    glyph.className = 'header__search-glyph';
    glyph.setAttribute('aria-hidden', 'true');
    searchBtn.appendChild(glyph);

    menuBtn.parentNode.insertBefore(searchBtn, menuBtn);
    return searchBtn;
}

// URL: artistes.html – Carrousel partenaires
function initCarousel() {
    const carousel = document.querySelector('.partners-carousel');
    if (!carousel) return;

    const track = carousel.querySelector('.partners-carousel__track');
    const items = track ? Array.from(track.querySelectorAll('.partners-carousel__item')) : [];
    const prevBtn = carousel.querySelector('.carousel__control--prev');
    const nextBtn = carousel.querySelector('.carousel__control--next');
    if (!track || !items.length || !prevBtn || !nextBtn) return;

    carousel.setAttribute('role', 'region');
    carousel.setAttribute('aria-label', 'Carrousel des partenaires');
    if (!track.id) track.id = 'partners-carousel-track';
    track.setAttribute('role', 'list');
    items.forEach((item) => item.setAttribute('role', 'listitem'));
    prevBtn.setAttribute('aria-controls', track.id);
    nextBtn.setAttribute('aria-controls', track.id);

    const status = document.createElement('div');
    status.className = 'sr-only';
    status.setAttribute('aria-live', 'polite');
    status.setAttribute('role', 'status');
    carousel.appendChild(status);

    let currentIndex = 0;

    const updateCarousel = () => {
        items.forEach((item, index) => {
            const isActive = index === currentIndex;
            item.classList.toggle('is-active', isActive);
            item.setAttribute('aria-hidden', isActive ? 'false' : 'true');
            item.setAttribute('aria-current', isActive ? 'true' : 'false');
        });

        status.textContent = `Partenaire ${currentIndex + 1} sur ${items.length}`;
    };

    const animateButton = (btn) => {
        if (!btn) return;
        if (btn._animTimeout) {
            clearTimeout(btn._animTimeout);
            btn._animTimeout = null;
        }
        btn.style.transition = 'transform 220ms cubic-bezier(0.25, 0.1, 0.25, 1)';
        btn.style.transform = 'scale(1)';
        btn.style.boxShadow = 'none';
        requestAnimationFrame(() => {
            btn.style.transform = 'scale(1.25)';
            btn.style.boxShadow = '0 6px 18px rgba(0, 0, 0, 0.18)';
        });
        btn._animTimeout = setTimeout(() => {
            btn.style.transform = 'scale(1)';
            btn.style.boxShadow = 'none';
            btn._animTimeout = null;
        }, 220);
    };

    updateCarousel();

    prevBtn.addEventListener('click', () => {
        animateButton(prevBtn);
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        animateButton(nextBtn);
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    });
}

// URL: artistes.html – Barre de recherche (toggle)
function initSiteSearch() {
    if (!document.body.classList.contains('page--artists')) return;

    const searchForm = document.querySelector('.site-search');
    const searchInput = searchForm ? searchForm.querySelector('.site-search__input') : null;
    if (!searchForm || !searchInput) return;

    const searchBtn = ensureSearchButton(searchForm);
    if (!searchBtn) return;

    let searchableItems = [];

    const refreshItems = () => {
        searchableItems = Array.from(document.querySelectorAll('.artist-card'));
        return searchableItems.length;
    };

    refreshItems();

    const status = document.createElement('div');
    status.className = 'sr-only site-search__status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    searchForm.appendChild(status);

    const updateStatus = (visibleCount) => {
        const total = searchableItems.length;
        if (visibleCount === total) {
            status.textContent = 'Tous les résultats sont affichés.';
        } else if (visibleCount === 0) {
            status.textContent = 'Aucun résultat pour cette recherche.';
        } else {
            status.textContent = `${visibleCount} résultat${visibleCount > 1 ? 's' : ''} sur ${total} affiché${visibleCount > 1 ? 's' : ''}.`;
        }
    };

    const applyFilter = (value) => {
        const query = value.trim().toLowerCase();
        let visibleCount = 0;

        searchableItems.forEach((item) => {
            const container = item.closest('li') || item;
            const text = item.textContent.toLowerCase();
            const match = !query || text.includes(query);
            container.style.display = match ? '' : 'none';
            if (match) visibleCount += 1;
        });

        updateStatus(visibleCount);
    };

    const toggleSearch = () => {
        const isHidden = searchForm.hasAttribute('hidden');
        if (isHidden) {
            searchForm.removeAttribute('hidden');
            searchBtn.setAttribute('aria-expanded', 'true');
            searchInput.focus();
        } else {
            searchForm.setAttribute('hidden', '');
            searchBtn.setAttribute('aria-expanded', 'false');
        }
    };

    searchBtn.addEventListener('click', toggleSearch);
    searchBtn.setAttribute('aria-expanded', searchForm.hasAttribute('hidden') ? 'false' : 'true');

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
    });

    searchInput.addEventListener('input', (e) => {
        applyFilter(e.target.value);
    });

    document.addEventListener('artists:content-updated', () => {
        refreshItems();
        applyFilter(searchInput.value);
    });

    if (!searchableItems.length) return;

    applyFilter('');
}

// URL: artistes.html / artistes-7juin.html – Switch des onglets sans rechargement
function initArtistsTabsSwitcher() {
    if (!document.body.classList.contains('page--artists')) return;

    const tabsNav = document.querySelector('[data-artists-tabs]');
    const tabs = tabsNav ? Array.from(tabsNav.querySelectorAll('.artists-tabs__tab')) : [];
    let contentSection = document.querySelector('[data-artists-content]') || document.querySelector('.artists-day');

    if (!tabsNav || !tabs.length || !contentSection) return;

    const normalizeHref = (href) => new URL(href, window.location.href).pathname;

    const setActive = (path) => {
        tabs.forEach((tab) => {
            const isActive = normalizeHref(tab.getAttribute('href')) === path;
            tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
    };

    const fetchSection = async (href) => {
        const response = await fetch(href, { credentials: 'same-origin' });
        if (!response.ok) throw new Error('Impossible de récupérer la page');
        const html = await response.text();
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const section = doc.querySelector('[data-artists-content]') || doc.querySelector('.artists-day');
        const title = doc.querySelector('title');
        return { section, title: title ? title.textContent : null };
    };

    const swapContent = (newSection) => {
        newSection.classList.add('artists-day--entering');
        newSection.setAttribute('data-artists-content', '');
        contentSection.replaceWith(newSection);
        contentSection = newSection;
        requestAnimationFrame(() => {
            newSection.classList.add('artists-day--visible');
            newSection.classList.remove('artists-day--entering');
        });
    };

    let isLoading = false;

    const loadTab = async (href, { pushState = true } = {}) => {
        if (!href || isLoading) return;

        const targetPath = normalizeHref(href);
        const currentTab = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true');
        const currentPath = currentTab ? normalizeHref(currentTab.getAttribute('href')) : normalizeHref(location.href);
        if (targetPath === currentPath) return;

        isLoading = true;
        tabsNav.setAttribute('aria-busy', 'true');
        contentSection.classList.add('artists-day--switching');

        try {
            const { section, title } = await fetchSection(href);
            if (!section) throw new Error('Section introuvable');

            swapContent(section);
            setActive(targetPath);
            if (title) document.title = title;
            if (pushState) window.history.pushState({ artistsPath: targetPath }, '', href);
            document.dispatchEvent(new CustomEvent('artists:content-updated'));
        } catch (error) {
            window.location.href = href;
        } finally {
            contentSection.classList.remove('artists-day--switching');
            tabsNav.removeAttribute('aria-busy');
            isLoading = false;
        }
    };

    const initialPath = normalizeHref(location.href);
    setActive(initialPath);
    if (!history.state || !history.state.artistsPath) {
        history.replaceState({ artistsPath: initialPath }, '', location.href);
    }

    tabs.forEach((tab) => {
        tab.addEventListener('click', (event) => {
            const href = tab.getAttribute('href');
            if (!href) return;
            event.preventDefault();
            loadTab(href);
        });
    });

    window.addEventListener('popstate', (event) => {
        const targetPath = (event.state && event.state.artistsPath) || normalizeHref(location.href);
        const targetTab = tabs.find((tab) => normalizeHref(tab.getAttribute('href')) === targetPath);
        if (!targetTab) {
            window.location.reload();
            return;
        }
        loadTab(targetTab.getAttribute('href'), { pushState: false });
    });
}

// URL: programme.html – Barre de recherche par jour
function initProgrammeSearch() {
    if (!document.body.classList.contains('page--programme')) return;

    const searchForm = document.querySelector('.site-search');
    const searchInput = searchForm ? searchForm.querySelector('.site-search__input') : null;
    const tabsNav = document.querySelector('[data-programme-tabs]');
    const tabs = tabsNav ? Array.from(tabsNav.querySelectorAll('.artists-tabs__tab')) : [];
    const dayRadios = Array.from(document.querySelectorAll('.programme-filters input[name="programme-day"]'));
    if (!searchForm || !searchInput) return;

    const searchBtn = ensureSearchButton(searchForm);
    if (!searchBtn) return;

    const eventCards = Array.from(document.querySelectorAll('.event-card'));
    if (!eventCards.length) return;

    const daySections = Array.from(document.querySelectorAll('.programme-day'));
    const separator = document.querySelector('.programme__separator');

    const status = document.createElement('div');
    status.className = 'sr-only site-search__status';
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    searchForm.appendChild(status);

    const getActiveDay = () => {
        if (tabs.length) {
            const activeTab = tabs.find((tab) => tab.getAttribute('aria-selected') === 'true') || tabs[0];
            return activeTab ? activeTab.dataset.day || 'all' : 'all';
        }

        if (dayRadios.length) {
            const checked = dayRadios.find((radio) => radio.checked);
            if (checked) return checked.value;
        }

        return 'all';
    };

    const setActiveDay = (day) => {
        if (tabs.length) {
            tabs.forEach((tab) => {
                const isActive = (tab.dataset.day || 'all') === day;
                tab.setAttribute('aria-selected', isActive ? 'true' : 'false');
            });
        }

        if (dayRadios.length) {
            dayRadios.forEach((radio) => {
                radio.checked = radio.value === day;
            });
        }
    };

    const updateStatus = (visibleCount, query, day) => {
        if (!query && day === 'all') {
            status.textContent = 'Tous les événements sont affichés.';
            return;
        }
        if (!visibleCount) {
            status.textContent = 'Aucun événement trouvé.';
            return;
        }

        const dayLabel = day === 'all' ? 'tous les jours' : `${day} juin`;
        status.textContent = `${visibleCount} événement${visibleCount > 1 ? 's' : ''} pour ${dayLabel}${query ? ` correspondant à "${query}"` : ''}.`;
    };

    const refreshDaySections = () => {
        const visibleSections = [];

        daySections.forEach((section) => {
            const items = Array.from(section.querySelectorAll('.programme-day__item'));
            const hasVisible = items.some((item) => item.style.display !== 'none');
            section.style.display = hasVisible ? '' : 'none';
            if (hasVisible) visibleSections.push(section);
        });

        if (separator) {
            separator.style.display = visibleSections.length > 1 ? '' : 'none';
        }
    };

    const applyFilter = (value) => {
        const query = value.trim().toLowerCase();
        const day = getActiveDay();
        let visibleCount = 0;

        eventCards.forEach((card) => {
            const container = card.closest('li') || card;
            const cardDay = card.dataset.day || (card.closest('[data-day]') ? card.closest('[data-day]').dataset.day : '');
            const matchesDay = day === 'all' || cardDay === day;
            const text = card.textContent.toLowerCase();
            const matchesQuery = !query || text.includes(query);
            const match = matchesDay && matchesQuery;
            container.style.display = match ? '' : 'none';
            if (match) visibleCount += 1;
        });

        refreshDaySections();
        updateStatus(visibleCount, query, day);
    };

    const toggleSearch = () => {
        const isHidden = searchForm.hasAttribute('hidden');
        if (isHidden) {
            searchForm.removeAttribute('hidden');
            searchBtn.setAttribute('aria-expanded', 'true');
            searchInput.focus();
        } else {
            searchForm.setAttribute('hidden', '');
            searchBtn.setAttribute('aria-expanded', 'false');
        }
    };

    searchBtn.addEventListener('click', toggleSearch);
    searchBtn.setAttribute('aria-expanded', searchForm.hasAttribute('hidden') ? 'false' : 'true');

    searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
    });

    searchInput.addEventListener('input', (e) => {
        applyFilter(e.target.value);
    });

    tabs.forEach((tab) => {
        tab.addEventListener('click', (event) => {
            event.preventDefault();
            const targetDay = tab.dataset.day || 'all';
            setActiveDay(targetDay);
            applyFilter(searchInput.value);
        });
    });

    dayRadios.forEach((radio) => {
        radio.addEventListener('change', () => {
            setActiveDay(radio.value);
            applyFilter(searchInput.value);
        });
    });

    setActiveDay(getActiveDay());
    applyFilter('');
}

// Fil d'ariane simple sur toutes les pages sauf home et erreur
function initBreadcrumbs() {
    const body = document.body;
    if (body.classList.contains('page--home') || body.classList.contains('page--error')) return;

    const main = document.querySelector('main');
    const heading = main ? main.querySelector('h1') : null;
    if (!heading) return;

    const existingBreadcrumb = heading.nextElementSibling && heading.nextElementSibling.classList.contains('breadcrumb');
    if (existingBreadcrumb) return;

    const crumbs = [{ label: 'Accueil', href: 'index.html' }];

    if (body.classList.contains('page--artist-detail')) {
        crumbs.push({ label: 'Artistes', href: 'artistes.html' });
    } else if (body.classList.contains('page--scene-detail')) {
        crumbs.push({ label: 'Scènes', href: 'scenes.html' });
    }

    const currentLabel = heading.textContent.trim();
    if (currentLabel) {
        crumbs.push({ label: currentLabel, current: true });
    }

    const nav = document.createElement('nav');
    nav.className = 'breadcrumb';
    nav.setAttribute('aria-label', "Fil d'ariane");

    const list = document.createElement('ol');
    list.className = 'breadcrumb__list';

    crumbs.forEach((crumb, index) => {
        const item = document.createElement('li');
        item.className = 'breadcrumb__item';

        if (!crumb.current && crumb.href) {
            const link = document.createElement('a');
            link.className = 'breadcrumb__link';
            link.href = crumb.href;
            link.textContent = crumb.label;
            item.appendChild(link);
        } else {
            const span = document.createElement('span');
            span.className = 'breadcrumb__current';
            span.setAttribute('aria-current', 'page');
            span.textContent = crumb.label;
            item.appendChild(span);
        }

        if (index < crumbs.length - 1) {
            const sep = document.createElement('span');
            sep.className = 'breadcrumb__separator';
            sep.setAttribute('aria-hidden', 'true');
            sep.textContent = '›';
            item.appendChild(sep);
        }

        list.appendChild(item);
    });

    nav.appendChild(list);
    heading.insertAdjacentElement('afterend', nav);
}

// URL: index.html – Scroll fluide + retour en haut + FAQ accordéon + header scrolled
function initExtraInteractions() {
    // Scroll fluide sur les ancres internes
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach((link) => {
        if (link.closest('[data-programme-tabs], [data-artists-tabs]')) return;
        const href = link.getAttribute('href');
        if (!href || href === '#' || href === '#0') return;
        link.addEventListener('click', (e) => {
            const target = document.querySelector(href);
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        });
    });

    // Bouton retour en haut
    const backToTopId = 'back-to-top';
    let backBtn = document.getElementById(backToTopId);
    if (!backBtn) {
        backBtn = document.createElement('button');
        backBtn.id = backToTopId;
        backBtn.type = 'button';
        backBtn.className = 'back-to-top';
        backBtn.setAttribute('aria-label', 'Revenir en haut de la page');
        backBtn.textContent = '↑';
        document.body.appendChild(backBtn);
    }

    const toggleBackBtn = () => {
        const shouldShow = window.scrollY > 300;
        backBtn.classList.toggle('is-visible', shouldShow);
    };

    backBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', () => {
        toggleBackBtn();
    });
    toggleBackBtn();



    // Accordéon FAQ
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach((item) => {
        const button = item.querySelector('.faq-item__button');
        const answer = item.querySelector('.faq-item__answer');
        if (!button || !answer) return;

        answer.style.overflow = 'hidden';
        answer.style.height = '0px';
        answer.hidden = true;

        const animateHeight = (element, from, to, callback) => {
            const duration = 220;
            const start = performance.now();

            function step(now) {
                const progress = Math.min((now - start) / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                element.style.height = from + (to - from) * eased + 'px';
                if (progress < 1) {
                    requestAnimationFrame(step);
                } else {
                    element.style.height = to === 0 ? '0px' : 'auto';
                    if (callback) callback();
                }
            }

            requestAnimationFrame(step);
        };

        button.addEventListener('click', () => {
            const isOpen = item.classList.contains('faq-item--open');
            if (isOpen) {
                animateHeight(answer, answer.scrollHeight, 0, () => {
                    item.classList.remove('faq-item--open');
                    answer.hidden = true;
                });
            } else {
                answer.hidden = false;
                const targetHeight = answer.scrollHeight;
                animateHeight(answer, 0, targetHeight, () => {
                    item.classList.add('faq-item--open');
                });
            }
        });
    });
}

// Applique le lazy-loading sur les images hors zone critique (header/hero)
function initLazyMedia() {
    const images = document.querySelectorAll('img');
    images.forEach((img) => {
        const isCritical = img.closest('.hero') || img.closest('.header');
        if (isCritical) return;
        if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
        if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initMenuBurger();
    initCarousel();
    initSiteSearch();
    initArtistsTabsSwitcher();
    initProgrammeSearch();
    initBreadcrumbs();
    initExtraInteractions();
    initLazyMedia();
});
