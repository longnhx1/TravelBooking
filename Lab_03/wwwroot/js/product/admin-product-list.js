/**
 * admin-product-list.js – Travel Booking Edition
 * - Tìm kiếm tour theo tên (debounced)
 * - Xác nhận xóa tour
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', init);

    function init() {
        initSearch();
        initDeleteConfirm();
    }

    /* ---------------------------------------------------------------
       SEARCH FILTERING
    --------------------------------------------------------------- */
    function initSearch() {
        var searchInput = document.getElementById('searchInput');
        var productTable = document.getElementById('productTable');

        if (!searchInput || !productTable) return;

        var rows = productTable.querySelectorAll('.product-row');
        var debounceTimer;

        searchInput.addEventListener('input', function () {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(function () {
                var query = searchInput.value.toLowerCase().trim();
                filterRows(rows, query);
            }, 200);
        });

        // Clear on Escape
        searchInput.addEventListener('keydown', function (e) {
            if (e.key === 'Escape') {
                searchInput.value = '';
                filterRows(rows, '');
                searchInput.blur();
            }
        });
    }

    function filterRows(rows, query) {
        var visibleCount = 0;

        rows.forEach(function (row) {
            var tourName = row.dataset.productName || '';
            var isMatch = query === '' || tourName.includes(query);

            if (isMatch) {
                row.classList.remove('hidden');
                visibleCount++;
            } else {
                row.classList.add('hidden');
            }
        });

        // Hiện/ẩn thông báo "Không tìm thấy"
        var tbody = rows[0] && rows[0].parentElement;
        var emptyRow = tbody && tbody.querySelector('.empty-search-row');

        if (visibleCount === 0 && query !== '' && rows.length > 0) {
            if (!emptyRow) {
                emptyRow = document.createElement('tr');
                emptyRow.className = 'empty-search-row';
                emptyRow.innerHTML =
                    '<td colspan="7" style="text-align:center;padding:3rem;color:#6e6e73;">' +
                    '<i class="fa-solid fa-magnifying-glass" style="font-size:2rem;opacity:0.4;display:block;margin-bottom:1rem;"></i>' +
                    'Không tìm thấy tour nào phù hợp với "<strong>' + escapeHtml(query) + '</strong>"' +
                    '</td>';
                tbody.appendChild(emptyRow);
            }
        } else if (emptyRow) {
            emptyRow.remove();
        }
    }

    /* ---------------------------------------------------------------
       DELETE CONFIRMATION
    --------------------------------------------------------------- */
    function initDeleteConfirm() {
        var deleteButtons = document.querySelectorAll('.action-btn--delete');

        deleteButtons.forEach(function (btn) {
            btn.addEventListener('click', function (e) {
                var tourName = btn.dataset.productName || 'tour này';
                var confirmed = confirm(
                    'Bạn có chắc chắn muốn xóa tour:\n"' + tourName + '"?\n\nThao tác này không thể hoàn tác.'
                );

                if (!confirmed) {
                    e.preventDefault();
                }
            });
        });
    }

    /* ---------------------------------------------------------------
       HELPER
    --------------------------------------------------------------- */
    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }

})();
