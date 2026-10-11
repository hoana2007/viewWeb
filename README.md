# Web-Hay Directory

Một trang web giúp bạn lưu trữ, tìm kiếm và chia sẻ các liên kết web hữu ích theo chủ đề.

## Giới thiệu

Web-Hay Directory là một giao diện đơn giản để hiển thị danh sách website, tài nguyên và công cụ hữu ích. Người dùng có thể:

- tìm kiếm liên kết nhanh
- lọc theo danh mục
- sao chép link
- mở trang web trong tab mới
- cập nhật dữ liệu từ Google Sheet

## Tính năng

- Tìm kiếm theo từ khóa
- Lọc theo loại liên kết
- Giao diện tối giản, responsive
- Chuyển đổi giao diện sáng/tối (Dark / Light mode)
- Chuyển đổi ngôn ngữ Tiếng Việt / Tiếng Anh linh hoạt, lưu tùy chọn vào localStorage
- Sao chép và mở link nhanh chóng

## Cấu trúc dự án

```text
viewWeb/
├── index.html
├── style.css
├── script.js
├── README.md
```

## Chạy dự án

Mở trực tiếp file `index.html` trong trình duyệt hoặc chạy local server:

```bash
cd viewWeb
python -m http.server 8000
```

Sau đó truy cập:

```text
http://localhost:8000
```

## Công nghệ sử dụng

- HTML
- CSS
- JavaScript
- Google Apps Script
- Google Sheet

## Cấu hình

Dữ liệu được lấy từ Google Apps Script qua biến `SCRIPT_URL` trong file `script.js`:

```javascript
const SCRIPT_URL = "https://script.google.com/.../exec";
```

Bạn có thể thay đổi URL này để dùng dữ liệu riêng của mình.

## Tác giả

Hoana2007

## License

Dự án này có thể được sử dụng và chia sẻ miễn phí. Nếu muốn công khai trên web, bạn nên thêm file `LICENSE` cho rõ ràng.
