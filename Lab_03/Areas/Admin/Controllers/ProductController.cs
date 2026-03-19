using Lab_03.Models;
using Lab_03.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Lab_03.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Authorize(Roles = SD.Role_Admin)]
    public class ProductController : Controller
    {
        private readonly IProductRepository _productRepository;
        private readonly ICategoryRepository _categoryRepository;

        public ProductController(
            IProductRepository productRepository,
            ICategoryRepository categoryRepository)
        {
            _productRepository = productRepository;
            _categoryRepository = categoryRepository;
        }

        // ---------------------------------------------------------------
        // Hiển thị danh sách Tour
        // ---------------------------------------------------------------
        public async Task<IActionResult> Index()
        {
            var tours = await _productRepository.GetAllAsync();
            return View(tours);
        }

        // ---------------------------------------------------------------
        // Hiển thị form thêm Tour mới
        // ---------------------------------------------------------------
        public async Task<IActionResult> Add()
        {
            await PopulateCategoriesAsync();
            return View();
        }

        // ---------------------------------------------------------------
        // Xử lý thêm Tour mới
        // ---------------------------------------------------------------
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Add(Product tour, IFormFile? ImageUrl)
        {
            // Validate ngày khởi hành không được ở quá khứ
            if (tour.DepartureDate.HasValue && tour.DepartureDate.Value < DateTime.Today)
            {
                ModelState.AddModelError(
                    nameof(tour.DepartureDate),
                    "Ngày khởi hành phải từ hôm nay trở đi."
                );
            }

            if (ModelState.IsValid)
            {
                if (ImageUrl != null)
                {
                    tour.ImageUrl = await SaveImageAsync(ImageUrl);
                }

                await _productRepository.AddAsync(tour);
                TempData["SuccessMessage"] = $"Tour \"{tour.Name}\" đã được thêm thành công!";
                return RedirectToAction(nameof(Index));
            }

            await PopulateCategoriesAsync(tour.CategoryId);
            return View(tour);
        }

        // ---------------------------------------------------------------
        // Hiển thị thông tin chi tiết Tour
        // ---------------------------------------------------------------
        public async Task<IActionResult> Display(int id)
        {
            var tour = await _productRepository.GetByIdAsync(id);

            if (tour == null)
            {
                return NotFound();
            }

            return View(tour);
        }

        // ---------------------------------------------------------------
        // Hiển thị form cập nhật Tour
        // ---------------------------------------------------------------
        public async Task<IActionResult> Update(int id)
        {
            var tour = await _productRepository.GetByIdAsync(id);

            if (tour == null)
            {
                return NotFound();
            }

            await PopulateCategoriesAsync(tour.CategoryId);
            return View(tour);
        }

        // ---------------------------------------------------------------
        // Xử lý cập nhật Tour
        // ---------------------------------------------------------------
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Update(int id, Product tour, IFormFile? ImageUrl)
        {
            if (id != tour.Id)
            {
                return NotFound();
            }

            // ImageUrl là string optional — bỏ qua validation mặc định của nó
            ModelState.Remove(nameof(tour.ImageUrl));

            // Validate ngày khởi hành không được ở quá khứ
            if (tour.DepartureDate.HasValue && tour.DepartureDate.Value < DateTime.Today)
            {
                ModelState.AddModelError(
                    nameof(tour.DepartureDate),
                    "Ngày khởi hành phải từ hôm nay trở đi."
                );
            }

            if (ModelState.IsValid)
            {
                var existingTour = await _productRepository.GetByIdAsync(id);

                if (existingTour == null)
                {
                    return NotFound();
                }

                // Nếu không upload ảnh mới thì giữ nguyên ảnh cũ
                existingTour.ImageUrl = ImageUrl != null
                    ? await SaveImageAsync(ImageUrl)
                    : existingTour.ImageUrl;

                // Cập nhật các field cơ bản
                existingTour.Name = tour.Name;
                existingTour.Price = tour.Price;
                existingTour.Description = tour.Description;
                existingTour.CategoryId = tour.CategoryId;

                // Cập nhật các field chuyên biệt cho Tour Du Lịch
                existingTour.DepartureLocation = tour.DepartureLocation;
                existingTour.Duration = tour.Duration;
                existingTour.DepartureDate = tour.DepartureDate;
                existingTour.AvailableSeats = tour.AvailableSeats;

                await _productRepository.UpdateAsync(existingTour);

                TempData["SuccessMessage"] = $"Tour \"{existingTour.Name}\" đã được cập nhật thành công!";
                return RedirectToAction(nameof(Index));
            }

            await PopulateCategoriesAsync(tour.CategoryId);
            return View(tour);
        }

        // ---------------------------------------------------------------
        // Hiển thị form xác nhận xóa Tour
        // ---------------------------------------------------------------
        public async Task<IActionResult> Delete(int id)
        {
            var tour = await _productRepository.GetByIdAsync(id);

            if (tour == null)
            {
                return NotFound();
            }

            return View(tour);
        }

        // ---------------------------------------------------------------
        // Xử lý xóa Tour
        // ---------------------------------------------------------------
        [HttpPost, ActionName("DeleteConfirmed")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var tour = await _productRepository.GetByIdAsync(id);

            if (tour == null)
            {
                return NotFound();
            }

            await _productRepository.DeleteAsync(id);

            TempData["SuccessMessage"] = $"Tour \"{tour.Name}\" đã được xóa thành công!";
            return RedirectToAction(nameof(Index));
        }

        // ===============================================================
        // PRIVATE HELPERS
        // ===============================================================

        /// <summary>
        /// Lưu file ảnh vào wwwroot/images và trả về đường dẫn tương đối.
        /// Tên file được tạo duy nhất bằng GUID để tránh trùng lặp.
        /// </summary>
        private async Task<string> SaveImageAsync(IFormFile image)
        {
            var folderPath = Path.Combine(
                Directory.GetCurrentDirectory(), "wwwroot", "images"
            );

            if (!Directory.Exists(folderPath))
            {
                Directory.CreateDirectory(folderPath);
            }

            // Dùng GUID + extension gốc để tránh file trùng tên
            var extension = Path.GetExtension(image.FileName);
            var uniqueFileName = $"{Guid.NewGuid()}{extension}";
            var filePath = Path.Combine(folderPath, uniqueFileName);

            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await image.CopyToAsync(fileStream);
            }

            return "/images/" + uniqueFileName;
        }

        /// <summary>
        /// Populate ViewBag.Categories cho dropdown danh mục (Điểm đến).
        /// selectedId dùng để pre-select khi edit.
        /// </summary>
        private async Task PopulateCategoriesAsync(int? selectedId = null)
        {
            var categories = await _categoryRepository.GetAllAsync();
            ViewBag.Categories = new SelectList(
                categories, "Id", "Name", selectedId
            );
        }
    }
}