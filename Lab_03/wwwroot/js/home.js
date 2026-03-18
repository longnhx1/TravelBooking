/**
 * home.js – PhoneStore
 * - Navbar sticky shadow on scroll
 * - Hamburger mobile menu toggle
 * - Search input interaction (expand / clear on Escape)
 * - Add-to-cart demo interaction (badge counter + toast)
 */

(function () {
    'use strict';

    /* ---------------------------------------------------------------
       1. NAVBAR STICKY SHADOW
    --------------------------------------------------------------- */
    const navbar = document.getElementById('mainNavbar');

    function handleScroll() {
        if (!navbar) return;
        if (window.scrollY > 8) {
            navbar.classList.add('navbar--scrolled');
        } else {
            navbar.classList.remove('navbar--scrolled');
        }
    }

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Run once on load in case page is pre-scrolled


    /* ---------------------------------------------------------------
       2. HAMBURGER / MOBILE MENU TOGGLE
    --------------------------------------------------------------- */
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const mobileMenu = document.getElementById('mobileMenu');

    if (hamburgerBtn && mobileMenu) {
        hamburgerBtn.addEventListener('click', function () {
            const isOpen = mobileMenu.classList.toggle('is-open');
            hamburgerBtn.setAttribute('aria-expanded', isOpen.toString());
            mobileMenu.setAttribute('aria-hidden', (!isOpen).toString());
        });

        // Close mobile menu when a link inside it is clicked
        mobileMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                mobileMenu.classList.remove('is-open');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
            });
        });

        // Close on outside click
        document.addEventListener('click', function (e) {
            if (
                mobileMenu.classList.contains('is-open') &&
                !navbar.contains(e.target)
            ) {
                mobileMenu.classList.remove('is-open');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
            }
        });
    }


    /* ---------------------------------------------------------------
       3. SEARCH INPUT INTERACTION
    --------------------------------------------------------------- */
    const searchInput = document.getElementById('searchInput');

    if (searchInput) {
        // Clear input on Escape key
        searchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                searchInput.value = '';
                searchInput.blur();
            }
        });

        // Submit on Enter (demo: log query or redirect)
        searchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query.length > 0) {
                    // In a real app: window.location.href = '/products?q=' + encodeURIComponent(query);
                    console.log('[PhoneStore] Search query:', query);
                    showToast('Đang tìm kiếm: "' + query + '"');
                }
            }
        });
    }


    /* ---------------------------------------------------------------
       4. ADD-TO-CART DEMO INTERACTION
    --------------------------------------------------------------- */
    let cartCount = 0;
    const cartBadge = document.getElementById('cartBadge');
    const cartToast = document.getElementById('cartToast');
    const cartToastMsg = document.getElementById('cartToastMsg');
    let toastTimer = null;

    /**
     * Show a toast message.
     * @param {string} message
     */
    function showToast(message) {
        if (!cartToast) return;
        if (cartToastMsg) cartToastMsg.textContent = message;

        cartToast.classList.add('show');

        // Clear any existing timer
        if (toastTimer) clearTimeout(toastTimer);

        toastTimer = setTimeout(function () {
            cartToast.classList.remove('show');
        }, 3000);
    }

    /**
     * Update the cart badge count.
     */
    function updateCartBadge() {
        if (!cartBadge) return;
        cartBadge.textContent = cartCount;
        cartBadge.style.display = cartCount > 0 ? 'flex' : 'none';

        // Animate the badge
        cartBadge.classList.remove('bump');
        // Force reflow to restart animation
        void cartBadge.offsetWidth;
        cartBadge.classList.add('bump');
    }

    // Delegate click event for all "add to cart" buttons
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('.btn--cart');
        if (!btn) return;

        const productId = btn.dataset.productId || 'unknown';

        // Optimistic UI: increment cart
        cartCount += 1;
        updateCartBadge();

        // Visual feedback on button
        const originalHTML = btn.innerHTML;
        btn.classList.add('added');
        btn.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> Đã thêm';
        btn.disabled = true;

        setTimeout(function () {
            btn.classList.remove('added');
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }, 1800);

        // Show toast
        showToast('Đã thêm sản phẩm vào giỏ hàng!');

        // In a real app, you'd send a POST to /api/cart
        console.log('[PhoneStore] Added product ID', productId, 'to cart. Total:', cartCount);
    });

    // Initialise badge visibility
    updateCartBadge();


    /* ---------------------------------------------------------------
       5. SMOOTH REVEAL ON SCROLL (Intersection Observer)
    --------------------------------------------------------------- */
    const revealEls = document.querySelectorAll(
        '.product-card, .category-card, .bestseller-card, .hero__content, .hero__visual'
    );

    if ('IntersectionObserver' in window && revealEls.length > 0) {
        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        revealEls.forEach(function (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.45s ease, transform 0.45s ease';
            observer.observe(el);
        });
    }

})();
