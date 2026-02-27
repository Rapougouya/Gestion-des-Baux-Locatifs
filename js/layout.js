// ==========================================================================
// LAYOUT.JS - Gestion du header et footer dynamiques
// ==========================================================================

// Fonction pour charger le header
function loadHeader() {
    const headerHTML = `
        <header class="site-header" id="siteHeader">
            <div class="layout-container">
                <div class="site-header__inner">
                    <a href="index.html" class="site-logo">
                        <span class="site-logo__icon">🏢</span>
                        <span>PNSBIL</span>
                    </a>

                    <nav class="site-nav">
                        <a href="index.html" class="site-nav__link" data-page="accueil">Accueil</a>
                        <a href="#fonctionnalites" class="site-nav__link">Fonctionnalités</a>
                        <a href="#avantages" class="site-nav__link">Avantages</a>
                        <a href="#contact" class="site-nav__link">Contact</a>
                    </nav>

                    <div class="site-actions">
                        <a href="login.html" class="btn btn-outline">Connexion</a>
                        <a href="inscription.html" class="btn btn-primary">Inscription</a>
                    </div>

                    <button class="site-burger" id="mobileBurger" aria-label="Menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>

                <div class="site-nav__mobile" id="mobileMenu">
                    <nav class="site-nav site-nav--mobile">
                        <a href="index.html" class="site-nav__link">Accueil</a>
                        <a href="#fonctionnalites" class="site-nav__link">Fonctionnalités</a>
                        <a href="#avantages" class="site-nav__link">Avantages</a>
                        <a href="#contact" class="site-nav__link">Contact</a>
                    </nav>
                    <div class="site-actions site-actions--mobile">
                        <a href="login.html" class="btn btn-outline">Connexion</a>
                        <a href="inscription.html" class="btn btn-primary">Inscription</a>
                    </div>
                </div>
            </div>
        </header>
    `;

    const headerContainer = document.getElementById('site-header');
    if (headerContainer) {
        headerContainer.innerHTML = headerHTML;
        initHeaderEvents();
    }
}

// Fonction pour charger le footer
function loadFooter() {
    const footerHTML = `
        <footer class="footer-modern">
            <div class="container">
                <div class="footer-content">
                    <div class="footer-brand">
                        <div class="footer-logo">
                            <span>🏢</span>
                            <span>PNSBIL</span>
                        </div>
                        <p class="footer-description">
                            La plateforme nationale qui transforme la gestion immobilière et facilite 
                            la perception des impôts locatifs au Burkina Faso.
                        </p>
                        <div class="footer-social">
                            <a href="#" class="social-link" aria-label="Facebook">
                                <i class="fab fa-facebook-f"></i>
                            </a>
                            <a href="#" class="social-link" aria-label="Twitter">
                                <i class="fab fa-twitter"></i>
                            </a>
                            <a href="#" class="social-link" aria-label="LinkedIn">
                                <i class="fab fa-linkedin-in"></i>
                            </a>
                            <a href="#" class="social-link" aria-label="Instagram">
                                <i class="fab fa-instagram"></i>
                            </a>
                        </div>
                    </div>

                    <div class="footer-links">
                        <h5>Liens rapides</h5>
                        <ul>
                            <li><a href="index.html">Accueil</a></li>
                            <li><a href="#fonctionnalites">Fonctionnalités</a></li>
                            <li><a href="#avantages">Avantages</a></li>
                            <li><a href="#contact">Contact</a></li>
                        </ul>
                    </div>

                    <div class="footer-links">
                        <h5>Services</h5>
                        <ul>
                            <li><a href="login.html">Espace Propriétaire</a></li>
                            <li><a href="login.html">Espace Locataire</a></li>
                            <li><a href="login.html">Espace Agence</a></li>
                            <li><a href="login.html">Espace Administration</a></li>
                        </ul>
                    </div>

                    <div class="footer-contact">
                        <h5>Contact</h5>
                        <ul class="contact-info">
                            <li>
                                <i class="fas fa-phone"></i>
                                <a href="tel:+22670124567">+226 70 12 45 67</a>
                            </li>
                            <li>
                                <i class="fas fa-envelope"></i>
                                <a href="mailto:contact@pnsbil.bf">contact@pnsbil.bf</a>
                            </li>
                            <li>
                                <i class="fas fa-map-marker-alt"></i>
                                <span>Ouagadougou, Burkina Faso<br>Avenue Kouamé Kourma</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div class="footer-bottom">
                    <p>&copy; 2024 PNSBIL. Tous droits réservés.</p>
                    <div class="footer-legal">
                        <a href="#mentions">Mentions légales</a>
                        <a href="#confidentialite">Confidentialité</a>
                        <a href="#cgu">CGU</a>
                    </div>
                </div>
            </div>
        </footer>
    `;

    const footerContainer = document.getElementById('site-footer');
    if (footerContainer) {
        footerContainer.innerHTML = footerHTML;
    }
}

// Initialiser les événements du header
function initHeaderEvents() {
    const header = document.getElementById('siteHeader');
    const burger = document.getElementById('mobileBurger');
    const mobileMenu = document.getElementById('mobileMenu');

    // Gestion du menu mobile
    if (burger && mobileMenu) {
        burger.addEventListener('click', () => {
            header.classList.toggle('is-open');
        });

        // Fermer le menu mobile quand on clique sur un lien
        const mobileLinks = mobileMenu.querySelectorAll('.site-nav__link');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                header.classList.remove('is-open');
            });
        });
    }

    // Effet de scroll sur le header
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        lastScroll = currentScroll;
    });

    // Smooth scroll pour les ancres
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href !== '#' && href !== '#!') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    const offsetTop = target.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Mettre en surbrillance le lien actif
    highlightActiveLink();
}

// Fonction pour mettre en surbrillance le lien actif
function highlightActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.site-nav__link');

    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;

            if (window.pageYOffset >= sectionTop && 
                window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('is-active');
            const href = link.getAttribute('href');
            if (href && href.includes(current)) {
                link.classList.add('is-active');
            }
        });
    });
}

// Charger header et footer quand le DOM est prêt
document.addEventListener('DOMContentLoaded', () => {
    loadHeader();
    loadFooter();
});
