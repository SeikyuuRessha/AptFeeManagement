# Quản lý thu phí chung cư

## Điều kiện tiên quyết

Bạn hãy cài đặt tất cả những app dưới đây:

- [Visual Studio Code](https://code.visualstudio.com/download)
- [Node.js](https://nodejs.org/) (includes npm)
- [IntelliJ IDEA](https://www.jetbrains.com/idea/)
- [Docker](https://www.docker.com/)
- [Postman](https://www.postman.com/)
- [Postman Workspace](https://karakurenai.postman.co/)

### Description

Ứng dụng này được xây dựng nhằm hỗ trợ việc quản lý thu phí trong các chung cư. Các chức năng chính bao gồm:
- **Quản lý người dùng**: Lưu trữ thông tin người dùng, bao gồm họ tên, số điện thoại, email.
- **Quản lý căn hộ:** Lưu trữ thông tin về các căn hộ, bao gồm mã căn hộ, chủ sở hữu, diện tích, số người ở, và tình trạng thanh toán.
- **Quản lý phí dịch vụ:** Bao gồm các loại phí hàng tháng như phí bảo vệ, phí vệ sinh, phí bảo trì, và các khoản phí khác.
- **Quản lý thu chi:** Ghi nhận các khoản phí đã thu từ từng căn hộ, đồng thời theo dõi các khoản nợ, các khoản thu trong tương lai.
- **Tạo và xuất hóa đơn:** Tạo hóa đơn hàng tháng cho từng căn hộ, xuất hóa đơn dưới dạng PDF để gửi cho cư dân.

Ứng dụng giúp các quản lý chung cư có thể dễ dàng theo dõi, kiểm soát các khoản thu phí, nợ xấu và báo cáo tình hình thu chi chính xác.

## Cài đặt

### 1. Clone the repository

Clone repo này bằng câu lệnh dưới đây:

```bash
git clone https://github.com/hieudo2808/AptFeeManagement.git
```

### 2. Điều hướng tới folder dự án

Sử dụng câu lệnh sau:

```bash
cd AptFeeManagement
```

### 3. Cài đặt các modules cho Electron

Sử dụng câu lệnh này để cài đặt modules cần thiết cho ElectronJS:

```bash
npm install
```

### 4. Cài đặt các modules cho ReactJS

Sử dụng 2 câu lệnh này để điều hướng đến phần chứa react và cài đặt modules cần thiết cho ReactJS:

```bash
cd react-integration
npm install
```

### 5. Về Framework Application

Trong dự án này, chúng ta sử dụng [IntelliJ IDEA](https://www.jetbrains.com/idea/) để lập trình phần back-end. 
Mở IntelliJ, mở folder frameworkapplication trong folder dự án và để IntelliJ tự động cài tất cả dependencies cần thiết.
Chọn Run để kiểm tra xem app có hoạt động hay không. Nếu có, hãy sử dụng Postman để kiểm tra API.

### 6. Chạy chương trình

#### Bước 1: Khởi động cơ sở dữ liệu bằng Docker.
#### Bước 2: Mở IntelliJ IDEA, khởi động back-end.
#### Bước 3: Quay trở về folder chính và khởi động chương trình bằng 2 lệnh sau:

```bash
cd ..
npm start
```
