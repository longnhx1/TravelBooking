/**
 * admin-product-display.js – Travel Booking Edition
 * - Image lightbox (zoom in/out)
 * - Copy link to clipboard
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initLightbox();
        initCopyLink();
    }

    /* ---------------------------------------------------------------
       IMAGE LIGHTBOX
    --------------------------------------------------------------- */
    function initLightbox() {
        var zoomBtn  = document.getElementById('zoomImageBtn');
        var lightbox = document.getElementById('imageLightbox');
        var closeBtn = document.getElementById('closeLightbox');

        if (!lightbox) return;

        if (zoomBtn) {
            zoomBtn.addEventListener('click', openLightbox);
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', closeLightbox);
        }

        // Close on background click
        lightbox.addEventListener('click', function (e) {
            if (e.target === lightbox) closeLightbox();
        });

        // Close on Escape key
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && lightbox.classList.contains('active')) {
                closeLightbox();
            }
        });

        function openLightbox() {
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    /* ---------------------------------------------------------------
       COPY LINK
    --------------------------------------------------------------- */
    function initCopyLink() {
        var copyBtn = document.getElementById('copyLinkBtn');
        if (!copyBtn) return;

        copyBtn.addEventListener('click', function () {
            var url = window.location.origin + copyBtn.dataset.url;

            if (navigator.clipboard && navigator.clipboard.writeText) {
                navigator.clipboard.writeText(url)
                    .then(function () { showToast('Đã sao chép liên kết!'); })
                    .catch(function ()  { fallbackCopy(url); });
            } else {
                fallbackCopy(url);
            }
        });

        function fallbackCopy(text) {
            var textarea = document.createElement('textarea');
            textarea.value = text;
            textarea.style.cssText = 'position:fixed;opacity:0;pointer-events:none;';
            document.body.appendChild(textarea);
            textarea.select();
            try {
                document.execCommand('copy');
                showToast('Đã sao chép liên kết!');
            } catch (err) {
                showToast('Không thể sao chép!');
            }
            document.body.removeChild(textarea);
        }
    }

    /* ---------------------------------------------------------------
       TOAST HELPER
    --------------------------------------------------------------- */
    function showToast(message) {
        // Remove existing toast if any
        var existing = document.querySelector('.copy-toast');
        if (existing) existing.remove();

        var toast = document.createElement('div');
        toast.className = 'copy-toast';
        toast.innerHTML = '<i class="fa-solid fa-check"></i> ' + message;
        toast.style.cssText = [
            'position:fixed',
            'bottom:2rem',
            'left:50%',
            'transform:translateX(-50%) translateY(20px)',
            'background:#1d1d1f',
            'color:#ffffff',
            'padding:0.75rem 1.5rem',
            'border-radius:50px',
            'font-size:0.9375rem',
            'font-weight:500',
            'z-index:10000',
            'opacity:0',
            'transition:all 0.3s ease',
            'display:flex',
            'align-items:center',
            'gap:0.5rem',
            'white-space:nowrap',
            'box-shadow:0 8px 24px rgba(0,0,0,.2)'
        ].join(';');

        document.body.appendChild(toast);

        requestAnimationFrame(function () {
            toast.style.opacity = '1';
            toast.style.transform = 'translateX(-50%) translateY(0)';
        });

        setTimeout(function () {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(-50%) translateY(20px)';
            setTimeout(function () { toast.remove(); }, 300);
        }, 2500);
    }

})();
