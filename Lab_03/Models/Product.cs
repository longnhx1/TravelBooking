using System.ComponentModel.DataAnnotations;

namespace Lab_03.Models
{
    // Ngầm hiểu Class này bây giờ đại diện cho 1 Tour Du Lịch
    public class Product
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Vui lòng nhập tên Tour")]
        [StringLength(200)]
        [Display(Name = "Tên Tour")]
        public string Name { get; set; }

        // Đã tăng Range để phù hợp với giá tiền VND (ví dụ: 5.000.000 VNĐ)
        [Range(0.01, 1000000000.00, ErrorMessage = "Giá Tour không hợp lệ")]
        [Display(Name = "Giá Tour / Người")]
        public decimal Price { get; set; }

        [Display(Name = "Lịch trình chi tiết & Mô tả")]
        public string Description { get; set; }

        [Display(Name = "Ảnh đại diện")]
        public string? ImageUrl { get; set; }

        public List<ProductImage>? Images { get; set; }

        [Display(Name = "Điểm đến (Danh mục)")]
        public int CategoryId { get; set; }
        public Category? Category { get; set; }


        // ==========================================
        // CÁC TRƯỜNG THÊM MỚI CHUYÊN BIỆT CHO DU LỊCH
        // ==========================================

        [Display(Name = "Nơi khởi hành")]
        [StringLength(100)]
        public string? DepartureLocation { get; set; } // Ví dụ: TP. Hồ Chí Minh, Hà Nội

        [Display(Name = "Thời gian")]
        [StringLength(50)]
        public string? Duration { get; set; } // Ví dụ: 3 Ngày 2 Đêm

        [Display(Name = "Ngày khởi hành")]
        [DataType(DataType.DateTime)]
        public DateTime? DepartureDate { get; set; } // Lưu trữ ngày giờ đi

        [Display(Name = "Số chỗ trống")]
        [Range(0, 500, ErrorMessage = "Số chỗ không hợp lệ")]
        public int? AvailableSeats { get; set; } // Quan trọng để quản lý việc đặt Tour
    }
}