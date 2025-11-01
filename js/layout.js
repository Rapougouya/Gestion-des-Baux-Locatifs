(function() {
    const baseCandidates = ["", "./", "../", "../../", "../../../", "../../../../"];

    document.addEventListener("DOMContentLoaded", function() {
        loadPartial("site-header", "shared/header.html", initializeHeader);
        loadPartial("site-footer", "shared/footer.html", adjustLinks);
    });

    async function loadPartial(containerId, partialPath, afterLoad) {
        const container = document.getElementById(containerId);
        if (!container) {
            return;
        }

        for (const candidate of baseCandidates) {
            try {
                const response = await fetch(resolvePath(candidate, partialPath));
                if (response.ok) {
                    const html = await response.text();
                    container.innerHTML = html;
                    const basePath = normalizeBase(candidate);
                    if (typeof afterLoad === "function") {
                        afterLoad(container, basePath);
                    }
                    return;
                }
            } catch (_) {
                continue;
            }
        }

        console.warn(`Impossible de charger le contenu: ${partialPath}`);
    }

    function initializeHeader(container, basePath) {
        adjustLinks(container, basePath);
        const header = container.querySelector(".site-header");
        if (!header) {
            return;
        }

        const burger = header.querySelector(".site-burger");
        if (burger) {
            burger.addEventListener("click", function() {
                header.classList.toggle("is-open");
            });
        }

        header.querySelectorAll(".site-nav__link, .site-actions .btn").forEach(function(link) {
            link.addEventListener("click", function() {
                header.classList.remove("is-open");
            });
        });

        markActiveLinks(header);
        updateHeaderOnScroll(header);
    }

    function adjustLinks(container, basePath) {
        container.querySelectorAll("[data-page]").forEach(function(link) {
            const target = link.getAttribute("data-page");
            if (!target) {
                return;
            }

            const finalHref = buildHref(target, basePath);
            link.setAttribute("href", finalHref);
        });
    }

    function buildHref(target, basePath) {
        if (target.startsWith("#")) {
            return `${basePath}index.htm${target}`;
        }
        return `${basePath}${target}`;
    }

    function markActiveLinks(scope) {
        const currentPath = window.location.pathname;
        scope.querySelectorAll(".site-nav__link").forEach(function(link) {
            const linkPath = new URL(link.getAttribute("href"), window.location.href).pathname;
            if (linkPath === currentPath || normalizeIndexPath(linkPath) === normalizeIndexPath(currentPath)) {
                link.classList.add("is-active");
            }
        });
    }

    function normalizeIndexPath(pathname) {
        if (!pathname) {
            return "/index.htm";
        }
        if (pathname.endsWith("/")) {
            return `${pathname}index.htm`;
        }
        if (pathname.endsWith("index.html")) {
            return pathname.replace("index.html", "index.htm");
        }
        return pathname;
    }

    function updateHeaderOnScroll(header) {
        toggleHeaderShadow(header);
        window.addEventListener("scroll", function() {
            toggleHeaderShadow(header);
        });
    }

    function toggleHeaderShadow(header) {
        if (window.scrollY > 12) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }
    }

    function resolvePath(base, relative) {
        if (!base) {
            return relative;
        }
        if (base === "./") {
            return relative;
        }
        return `${base}${relative}`;
    }

    function normalizeBase(base) {
        if (!base || base === "./") {
            return "";
        }
        return base;
    }
})();
