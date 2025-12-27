const ADMIN_KEY = '0901973er'; 
const statusArea = document.getElementById('editable-status');

// Kiểm tra quyền Admin
function checkAdmin() {
    const userKey = localStorage.getItem('admin_access_key');
    if (userKey === ADMIN_KEY) {
        statusArea.contentEditable = "true";
        statusArea.style.cursor = "text";
        // Thêm một class để nhận biết đang trong chế độ Admin (tùy chọn CSS)
        statusArea.classList.add('admin-mode');
    } else {
        statusArea.contentEditable = "false";
        statusArea.style.cursor = "default";
    }
}

// Khởi tạo khi trang web tải xong
document.addEventListener('DOMContentLoaded', () => {
    // Load nội dung trạng thái
    const savedStatus = localStorage.getItem('userStatus');
    if (savedStatus && statusArea) {
        statusArea.innerHTML = savedStatus;
    }
    checkAdmin();
});

// Lưu nội dung khi gõ
statusArea.addEventListener('input', () => {
    if (statusArea.contentEditable === "true") {
        localStorage.setItem('userStatus', statusArea.innerHTML);
    }
});

// Tổ hợp phím mở khóa Ctrl + Shift + L
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'L') {
        const password = prompt("Nhập mã Admin để quyền chỉnh sửa:");
        if (password === ADMIN_KEY) {
            localStorage.setItem('admin_access_key', password);
            alert("Đã mở khóa quyền Admin!");
            location.reload();
        } else if (password !== null) {
            alert("Sai mật khẩu!");
        }
    }
    
    // Mẹo thêm: Nhấn Ctrl + Shift + X để Đăng xuất (Khóa lại)
    if (e.ctrlKey && e.shiftKey && e.key === 'X') {
        localStorage.removeItem('admin_access_key');
        alert("Đã khóa quyền chỉnh sửa.");
        location.reload();
    }
});