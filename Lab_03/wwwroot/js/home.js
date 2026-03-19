/**
 * home.js – Travel Booking
 * - Navbar sticky shadow on scroll
 * - Hamburger mobile menu toggle
 * - Search input interaction (expand / clear on Escape)
 * - Add-to-cart / booking interaction (badge counter + toast)
 * - Hero search tabs
 * - Smooth reveal on scroll (IntersectionObserver)
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
    handleScroll();


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

        mobileMenu.querySelectorAll('a').forEach(function (link) {
            link.addEventListener('click', function () {
                mobileMenu.classList.remove('is-open');
                hamburgerBtn.setAttribute('aria-expanded', 'false');
                mobileMenu.setAttribute('aria-hidden', 'true');
            });
        });

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
       3. NAVBAR SEARCH INPUT INTERACTION
    --------------------------------------------------------------- */
    const searchInput = document.getElementById('searchInput');

    if (searchInput) {
        searchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                searchInput.value = '';
                searchInput.blur();
            }
            if (e.key === 'Enter') {
                const query = searchInput.value.trim();
                if (query.length > 0) {
                    showToast('Đang tìm kiếm: "' + query + '"');
                    // Real app: window.location.href = '/Home/Booking?q=' + encodeURIComponent(query);
                    console.log('[TravelBooking] Search query:', query);
                }
            }
        });
    }


    /* ---------------------------------------------------------------
       4. HERO SEARCH TABS
    --------------------------------------------------------------- */
    const heroTabs = document.querySelectorAll('.hero__search-tab');

    if (heroTabs.length > 0) {
        heroTabs.forEach(function (tab) {
            tab.addEventListener('click', function () {
                heroTabs.forEach(function (t) { t.classList.remove('is-active'); });
                tab.classList.add('is-active');

                // Update destination placeholder based on tab
                const heroDestInput = document.getElementById('heroDestination');
                if (!heroDestInput) return;

                const type = tab.dataset.tab;
                if (type === 'tour') heroDestInput.placeholder = 'Điểm đến (VD: Đà Nẵng, Sapa...)';
                if (type === 'hotel') heroDestInput.placeholder = 'Nhập thành phố / khách sạn...';
                if (type === 'flight') heroDestInput.placeholder = 'Bay đến đâu? (VD: Hà Nội, Phú Quốc...)';
            });
        });
    }


    /* ---------------------------------------------------------------
       5. HERO SEARCH – SET DEFAULT DATE
    --------------------------------------------------------------- */
    const heroCheckIn = document.getElementById('heroCheckIn');
    if (heroCheckIn && !heroCheckIn.value) {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        heroCheckIn.value = tomorrow.toISOString().split('T')[0];
        heroCheckIn.min = tomorrow.toISOString().split('T')[0];
    }


    /* ---------------------------------------------------------------
       6. ADD-TO-CART / BOOKING INTERACTION
    --------------------------------------------------------------- */
    let cartCount = 0;
    const cartBadge = document.getElementById('bookingBadge');
    const cartToast = document.getElementById('cartToast');
    const cartToastMsg = document.getElementById('cartToastMsg');
    let toastTimer = null;

    function showToast(message) {
        if (!cartToast) return;
        if (cartToastMsg) cartToastMsg.textContent = message;

        cartToast.classList.add('show');

        if (toastTimer) clearTimeout(toastTimer);
        toastTimer = setTimeout(function () {
            cartToast.classList.remove('show');
        }, 3000);
    }

    function updateCartBadge() {
        if (!cartBadge) return;
        cartBadge.textContent = cartCount;
        cartBadge.style.display = cartCount > 0 ? 'flex' : 'none';

        cartBadge.classList.remove('bump');
        void cartBadge.offsetWidth; // force reflow
        cartBadge.classList.add('bump');
    }

    // Delegate click for all .btn--cart buttons
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('.btn--cart');
        if (!btn) return;

        const productId = btn.dataset.productId || 'unknown';

        cartCount += 1;
        updateCartBadge();

        // Visual feedback
        const originalHTML = btn.innerHTML;
        btn.classList.add('added');
        btn.innerHTML = '<i class="fa-solid fa-check" aria-hidden="true"></i> Đã thêm';
        btn.disabled = true;

        setTimeout(function () {
            btn.classList.remove('added');
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }, 1800);

        showToast('Đã thêm chuyến đi vào danh sách đặt chỗ!');

        try {
            localStorage.setItem('bookingCount', cartCount.toString());
        } catch (err) { /* ignore */ }

        console.log('[TravelBooking] Added item ID', productId, '– Total:', cartCount);
    });

    // Restore count from localStorage
    try {
        const raw = localStorage.getItem('bookingCount');
        const saved = raw ? parseInt(raw, 10) : 0;
        cartCount = Number.isFinite(saved) ? saved : 0;
    } catch (err) { /* ignore */ }

    updateCartBadge();


    /* ---------------------------------------------------------------
       7. SMOOTH REVEAL ON SCROLL (IntersectionObserver)
    --------------------------------------------------------------- */
    const revealSelectors = [
        '.product-card',
        '.category-card',
        '.bestseller-card',
        '.why-us__card',
        '.testimonial-card',
        '.hero__content',
        '.hero__visual'
    ].join(', ');

    const revealEls = document.querySelectorAll(revealSelectors);

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

        revealEls.forEach(function (el, i) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            // Stagger delay for grid children
            el.style.transition = 'opacity 0.45s ease ' + (i * 0.05) + 's, transform 0.45s ease ' + (i * 0.05) + 's';
            observer.observe(el);
        });
    }

})();
