/**
 * admin-product-form.js – Travel Booking Edition
 * - Image upload preview + drag & drop
 * - Form reset
 * - Validate ngày khởi hành (client-side hint)
 */

(function () {
    'use strict';

    document.addEventListener('DOMContentLoaded', function () {
        initImageUpload();
        initFormReset();
        initDepartureDateHint();
    });

    /* ---------------------------------------------------------------
       IMAGE UPLOAD PREVIEW + DRAG & DROP
    --------------------------------------------------------------- */
    function initImageUpload() {
        var imageInput          = document.getElementById('imageInput');
        var imageUpload         = document.getElementById('imageUpload') || document.getElementById('imageUploadArea');
        var uploadPlaceholder   = document.getElementById('uploadPlaceholder');
        var previewContainer    = document.getElementById('imagePreviewContainer') || document.getElementById('imagePreview');
        var previewImage        = document.getElementById('imagePreview') || document.getElementById('previewImage');
        var removeBtn           = document.getElementById('removeImage') || document.getElementById('removeImageBtn');

        // Fallback: find <img> inside preview container when IDs differ between Add/Update
        if (previewContainer && previewContainer.tagName === 'IMG') {
            // Update.cshtml uses imagePreview for the container div, previewImage for the img
            previewImage    = document.getElementById('previewImage');
            previewContainer = previewImage ? previewImage.closest('.image-upload__preview') : null;
        }

        if (!imageInput || !imageUpload) return;

        // File input change
        imageInput.addEventListener('change', function (e) {
            handleFileSelect(e.target.files[0]);
        });

        // Drag & drop
        imageUpload.addEventListener('dragover', function (e) {
            e.preventDefault();
            e.stopPropagation();
            imageUpload.classList.add('dragover');
        });

        imageUpload.addEventListener('dragleave', function (e) {
            e.preventDefault();
            e.stopPropagation();
            imageUpload.classList.remove('dragover');
        });

        imageUpload.addEventListener('drop', function (e) {
            e.preventDefault();
            e.stopPropagation();
            imageUpload.classList.remove('dragover');

            var files = e.dataTransfer.files;
            if (files.length > 0 && files[0].type.startsWith('image/')) {
                // Assign to input so form submits it
                try {
                    var dt = new DataTransfer();
                    dt.items.add(files[0]);
                    imageInput.files = dt.files;
                } catch (err) { /* Safari fallback – just preview */ }
                handleFileSelect(files[0]);
            }
        });

        // Remove button
        if (removeBtn) {
            removeBtn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                resetImageUpload();
            });
        }

        /* ---- Helpers ---- */

        function handleFileSelect(file) {
            if (!file) { resetImageUpload(); return; }

            if (!file.type.startsWith('image/')) {
                alert('Vui lòng chọn file hình ảnh (PNG, JPG, WEBP)');
                resetImageUpload();
                return;
            }

            var maxSize = 5 * 1024 * 1024; // 5 MB
            if (file.size > maxSize) {
                alert('File quá lớn. Vui lòng chọn file nhỏ hơn 5MB');
                resetImageUpload();
                return;
            }

            var reader = new FileReader();
            reader.onload = function (e) {
                var imgEl = document.getElementById('previewImage') || document.getElementById('imagePreview');
                if (imgEl && imgEl.tagName === 'IMG') {
                    imgEl.src = e.target.result;
                }

                // Show preview, hide placeholder
                if (uploadPlaceholder) uploadPlaceholder.classList.add('d-none');
                if (previewContainer)  previewContainer.classList.remove('d-none');
            };
            reader.readAsDataURL(file);
        }

        function resetImageUpload() {
            imageInput.value = '';

            var imgEl = document.getElementById('previewImage') || document.getElementById('imagePreview');
            if (imgEl && imgEl.tagName === 'IMG') imgEl.src = '#';

            if (uploadPlaceholder) uploadPlaceholder.classList.remove('d-none');
            if (previewContainer)  previewContainer.classList.add('d-none');
        }

        // Expose globally for form reset
        window.resetImageUpload = resetImageUpload;
    }

    /* ---------------------------------------------------------------
       FORM RESET (Add page only)
    --------------------------------------------------------------- */
    function initFormReset() {
        var resetBtn = document.getElementById('btnReset');
        var form     = document.getElementById('productForm');

        if (!resetBtn || !form) return;

        resetBtn.addEventListener('click', function () {
            form.reset();

            if (typeof window.resetImageUpload === 'function') {
                window.resetImageUpload();
            }

            // Clear validation error messages
            form.querySelectorAll('.form-error').forEach(function (el) {
                el.textContent = '';
            });

            // Remove Bootstrap validation classes
            form.querySelectorAll('.form-input, .form-select, .form-textarea').forEach(function (el) {
                el.classList.remove('input-validation-error');
            });

            // Focus first input
            var firstInput = form.querySelector('.form-input');
            if (firstInput) firstInput.focus();
        });
    }

    /* ---------------------------------------------------------------
       DEPARTURE DATE – client-side hint (không thay thế server validation)
    --------------------------------------------------------------- */
    function initDepartureDateHint() {
        var dateInput = document.querySelector('input[name="DepartureDate"]');
        if (!dateInput) return;

        // Set min = now (browser native enforcement)
        var now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset()); // local time
        dateInput.min = now.toISOString().slice(0, 16);

        dateInput.addEventListener('change', function () {
            var selected = new Date(dateInput.value);
            var today    = new Date();
            today.setHours(0, 0, 0, 0);

            var hint = dateInput.parentElement.querySelector('.form-error');
            if (hint && selected < today) {
                hint.textContent = 'Ngày khởi hành phải từ hôm nay trở đi.';
            } else if (hint) {
                hint.textContent = '';
            }
        });
    }

})();
