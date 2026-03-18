/**
 * Admin Dashboard JavaScript
 * Handles animations, counters, and interactivity
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        initCounterAnimations();
        initTimeUpdater();
        initActivityRefresh();
    });

    // ===== Animated Counter for Stats =====
    function initCounterAnimations() {
        var counters = document.querySelectorAll('[data-counter]');

        counters.forEach(function (counter) {
            var target = parseInt(counter.getAttribute('data-counter'), 10);
            var duration = 1200; // ms
            var start = 0;
            var startTime = null;

            function easeOutQuart(t) {
                return 1 - Math.pow(1 - t, 4);
            }

            function animate(currentTime) {
                if (!startTime) startTime = currentTime;
                var elapsed = currentTime - startTime;
                var progress = Math.min(elapsed / duration, 1);
                var easedProgress = easeOutQuart(progress);
                var currentValue = Math.floor(start + (target - start) * easedProgress);

                counter.textContent = formatNumber(currentValue);

                if (progress < 1) {
                    requestAnimationFrame(animate);
                } else {
                    counter.textContent = formatNumber(target);
                }
            }

            // Intersection Observer - only animate when visible
            var observer = new IntersectionObserver(function (entries) {
                entries.forEach(function (entry) {
                    if (entry.isIntersecting) {
                        requestAnimationFrame(animate);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            observer.observe(counter);
        });
    }

    // ===== Format number with locale =====
    function formatNumber(num) {
        return num.toLocaleString('vi-VN');
    }

    // ===== Live Time Updater =====
    function initTimeUpdater() {
        var timeElement = document.getElementById('currentTime');
        if (!timeElement) return;

        function updateTime() {
            var now = new Date();
            var options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            };
            timeElement.textContent = now.toLocaleDateString('vi-VN', options);
        }

        updateTime();
        setInterval(updateTime, 60000); // Update every minute
    }

    // ===== Activity List Refresh Indicator =====
    function initActivityRefresh() {
        var refreshBtn = document.getElementById('refreshActivity');
        var activityList = document.querySelector('.activity-list');

        if (!refreshBtn || !activityList) return;

        refreshBtn.addEventListener('click', function () {
            // Add loading state
            refreshBtn.classList.add('is-loading');
            refreshBtn.disabled = true;

            // Simulate refresh (in real app, this would be an AJAX call)
            setTimeout(function () {
                // Add fade animation to items
                var items = activityList.querySelectorAll('.activity-item');
                items.forEach(function (item, index) {
                    item.style.animation = 'none';
                    item.offsetHeight; // Trigger reflow
                    item.style.animation = 'fadeInUp 0.4s ease backwards';
                    item.style.animationDelay = (index * 0.05) + 's';
                });

                refreshBtn.classList.remove('is-loading');
                refreshBtn.disabled = false;
            }, 800);
        });
    }

    // ===== Card Hover Effects (optional enhancement) =====
    document.querySelectorAll('.stat-card, .quick-action').forEach(function (card) {
        card.addEventListener('mouseenter', function () {
            this.style.willChange = 'transform, box-shadow';
        });

        card.addEventListener('mouseleave', function () {
            this.style.willChange = 'auto';
        });
    });

})();
