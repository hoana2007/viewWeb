# Web-Hay Directory

Một trang web tổng hợp các liên kết hữu ích theo chủ đề, giúp bạn lưu trữ, tìm kiếm và chia sẻ tài nguyên web một cách nhanh chóng và dễ quản lý.

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Status](https://img.shields.io/badge/status-active-success)](https://github.com/)

## Giới thiệu

Web-Hay Directory là một ứng dụng web đơn giản nhưng hiệu quả, giúp bạn:

- lưu trữ danh sách website hữu ích
- tìm kiếm theo từ khóa
- lọc theo danh mục
- sao chép hoặc mở liên kết nhanh chóng
- cập nhật dữ liệu từ Google Sheet mà không cần chỉnh sửa mã nguồn mỗi lần

Dự án này rất phù hợp cho việc tạo kho tài nguyên cá nhân, nhóm học tập, cộng đồng kỹ thuật, hoặc danh sách link công việc.

## Tính năng nổi bật

- Tìm kiếm liên kết theo tên, mô tả hoặc phân loại
- Lọc theo chủ đề / category
- Giao diện tối giản, hiện đại và responsive
- Chuyển đổi giao diện sáng/tối
- Sao chép link bằng một cú nhấn
- Mở link trong tab mới
- Đếm lượt click và đồng bộ dữ liệu lên Google Sheet

## Demo

Bạn có thể chạy trực tiếp trên trình duyệt hoặc thông qua máy chủ local.

## Cấu trúc dự án

```text
viewWeb/
├── index.html
├── style.css
├── script.js
├── README.md
└── .git/
```

## Công nghệ sử dụng

- HTML5
- CSS3
- JavaScript
- Google Apps Script
- Google Sheet
- Font Awesome
- Google Fonts

## Cài đặt và chạy

### 1. Clone repository

```bash
git clone https://github.com/hoana2007/viewWeb.git <#Tên mới (nếu có)>
cd viewWeb
```

### 2. Chạy local server

Nếu bạn muốn chạy ở localhost, hãy thực hiện:

```bash
python -m http.server 8000
```

Sau đó mở trong trình duyệt:

```text
http://localhost:8000
```

### 3. Mở file trực tiếp

Bạn cũng có thể mở trực tiếp file `index.html` trong trình duyệt, nhưng cách chạy local server sẽ ổn định hơn.

## Cấu hình dữ liệu

Trang web lấy dữ liệu từ Google Apps Script qua biến `SCRIPT_URL` trong file `script.js`:

```javascript
const SCRIPT_URL = "https://script.google.com/macros/s/.../exec";
```

Nếu bạn muốn dùng dữ liệu riêng, hãy thay đổi URL này thành Web App của bạn.

Dữ liệu mong đợi có dạng:

```json
{
  "stt": 1,
  "link": "https://example.com",
  "kind": "Development",
  "description": "Mô tả về website",
  "clicked": 0
}
```

## Hướng dẫn sử dụng

- Nhập từ khóa vào ô tìm kiếm để lọc liên kết
- Nhấn phím `/` để tập trung vào thanh tìm kiếm nhanh
- Chọn category để lọc danh sách theo nhóm
- Nhấn nút Sao chép để copy URL
- Nhấn nút Mở để truy cập trang web trong tab mới

## Lợi ích của dự án

- Dễ triển khai
- Dễ cập nhật nội dung
- Tối ưu cho việc quản lý link nhóm
- Không cần backend phức tạp
- Phù hợp để mở source và chia sẻ

## Mở rộng trong tương lai

- thêm chức năng lưu bookmark cá nhân
- thêm phân trang cho danh sách lớn
- cho phép chỉnh sửa/xóa link trực tiếp trên giao diện
- thống kê click theo từng category
- hỗ trợ import/export dữ liệu theo CSV hoặc JSON

## Đóng góp

Mọi đóng góp đều được chào đón. Nếu bạn muốn cải thiện giao diện, thêm tính năng hoặc tối ưu hiệu suất, hãy mở pull request hoặc gửi đề xuất.

## Tác giả

- hoana2007
- 2026

## Giấy phép

Dự án này sử dụng giấy phép MIT. Nếu bạn muốn công khai trên GitHub, hãy bổ sung file LICENSE để phù hợp với cấp phép này.

```bash
# Ví dụ nội dung LICENSE
MIT License

Copyright (c) 2026 hoana2007

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

## Liên hệ

Nếu bạn muốn hợp tác hoặc góp ý, hãy liên hệ qua GitHub hoặc email tương ứng của bạn.
