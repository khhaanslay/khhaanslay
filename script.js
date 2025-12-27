const DISCORD_ID = "1057942252535693322";

async function updateDiscordStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const data = await response.json();
        
        if (!data.success) return;
        // Tìm đoạn cập nhật Avatar trong script.js và thay bằng đoạn này:
        const user = data.data;
        const decoImg = document.getElementById('discord-decoration');

        // 1. Lấy Avatar
        document.getElementById('discord-avatar').src = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${user.discord_user.avatar}.png?size=256`;

        // 2. Lấy Trang trí (Khung) - Cập nhật đúng đường dẫn
        if (user.discord_user.avatar_decoration_data) {
            const assetId = user.discord_user.avatar_decoration_data.asset;
            
            // Sử dụng link CDN chuẩn của Discord cho Decoration
            decoImg.src = `https://cdn.discordapp.com/avatar-decoration-presets/${assetId}`;
            decoImg.style.display = "block";
        } else {
            decoImg.style.display = "none";
        }

        // 2. CẬP NHẬT BANNER (Dữ liệu của bạn không có banner Nitro, dùng ảnh dự phòng)
        const bannerImg = document.getElementById('discord-banner');
        if (user.discord_user.banner) {
            const ext = user.discord_user.banner.startsWith("a_") ? "gif" : "png";
            bannerImg.src = `https://cdn.discordapp.com/banners/${DISCORD_ID}/${user.discord_user.banner}.${ext}?size=1024`;
        } else {
            bannerImg.src = "imgs/anhduphong-banner.jpeg"; 
        }

        // 3. CẬP NHẬT TÊN VÀ TRẠNG THÁI CHẤM TRÒN
        document.getElementById('discord-name').innerText = user.discord_user.username;
        const statusDot = document.getElementById('discord-status-dot');
        statusDot.className = `status-dot ${user.discord_status}`;

        // 4. CẬP NHẬT TRẠNG THÁI TÙY CHỈNH (Ví dụ: "mê e ấy")
        const customStatus = user.activities.find(a => a.type === 4);
        const statusText = document.getElementById('discord-status-text');
        if (customStatus) {
            // Hiển thị emoji nếu có + text trạng thái
            const emojiHtml = customStatus.emoji ? `<img src="https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.png" style="width:20px; vertical-align:middle;"> ` : "";
            statusText.innerHTML = `${emojiHtml}${customStatus.state}`;
        } else {
            statusText.innerText = "Chưa thiết lập trạng thái";
        }

        // 5. CẬP NHẬT HOẠT ĐỘNG (Ví dụ: Đang chơi Genshin Impact)
        const activityBox = document.getElementById('discord-activity');
        // Tìm hoạt động không phải là Status (type 0 là Playing)
        const playingGame = user.activities.find(a => a.type === 0);

        if (playingGame) {
            activityBox.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <img src="https://cdn.discordapp.com/app-assets/${playingGame.application_id}/${playingGame.assets.large_image}.png" 
                         style="width: 50px; border-radius: 8px;">
                    <div>
                        <strong style="display:block; color:#fff;">${playingGame.name}</strong>
                        <span style="font-size: 0.85rem; color: #ddd;">${playingGame.details || ""}</span><br>
                        <span style="font-size: 0.85rem; color: #ddd;">${playingGame.state || ""}</span>
                    </div>
                </div>
            `;
        } else if (user.listening_to_spotify) {
            activityBox.innerHTML = `🎵 Đang nghe <strong>${user.spotify.song}</strong>`;
        } else {
            activityBox.innerHTML = "<p>Hiện không hoạt động</p>";
        }
        // --- CẬP NHẬT TRẠNG THÁI Ở THANH MID-INFO-BAR ---
        const midStatusText = document.getElementById('lanyard-status-text');
        if (midStatusText) {
            const statusMap = {
                'online': 'Online',
                'idle': 'Idle',
                'dnd': 'Do Not Disturb',
                'offline': 'Offline'
            };
            
            const currentStatus = user.discord_status;
            midStatusText.innerText = statusMap[currentStatus] || 'Offline';
            
            // Xóa màu cũ và class active cũ
            midStatusText.classList.remove('active');
            midStatusText.style.color = "";

            // Cập nhật màu sắc theo trạng thái thực tế
            if (currentStatus === 'online') {
                midStatusText.classList.add('active'); // Dùng màu xanh lá từ CSS của bạn
            } else if (currentStatus === 'dnd') {
                midStatusText.style.color = '#f23f43'; // Màu đỏ
            } else if (currentStatus === 'idle') {
                midStatusText.style.color = '#f0b232'; // Màu vàng
            } else {
                midStatusText.style.color = '#80848e'; // Màu xám
            }
        }

    } catch (error) {
        console.error("Lỗi cập nhật Lanyard:", error);
    }
}

// Cập nhật mỗi 30 giây để tránh spam API
setInterval(updateDiscordStatus, 30000);
updateDiscordStatus();

function updateMidClock() {
    const now = new Date();
    
    // Cập nhật giờ
    const h = String(now.getHours()).padStart(2, '0');
    const m = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('digital-clock').innerText = `${h}:${m}:${s}`;
    
    // Cập nhật ngày
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    document.getElementById('current-date').innerText = now.toLocaleDateString('en-US', options);
}

// Chạy mỗi giây
setInterval(updateMidClock, 1000);
updateMidClock();

// Hiệu ứng hiện câu thoại khi cuộn trang
const quote = document.querySelector('.quote-text');

window.addEventListener('scroll', () => {
    const position = quote.getBoundingClientRect().top;
    const screenPosition = window.innerHeight / 1.3;

    if (position < screenPosition) {
        quote.style.opacity = '1';
        quote.style.transform = 'translateY(0)';
    }
});

// Bạn cần thêm CSS này vào .quote-text để JS hoạt động:
// opacity: 0; transform: translateY(20px); transition: all 1s ease;

const statusArea = document.getElementById('editable-status');

// 1. Khi load trang: Lấy dữ liệu đã lưu từ LocalStorage
const savedStatus = localStorage.getItem('userStatus');
if (savedStatus) {
    statusArea.innerHTML = savedStatus;
}

// 2. Khi gõ chữ: Lưu trực tiếp vào LocalStorage
statusArea.addEventListener('input', () => {
    localStorage.setItem('userStatus', statusArea.innerHTML);
});

// Giả sử "data" là biến chứa dữ liệu trả về từ Lanyard
const statusText = document.getElementById('lanyard-status-text');
const status = data.discord_status; // Lấy trạng thái: online, idle, dnd, hoặc offline

// 1. Cập nhật nội dung chữ
const statusMap = {
    'online': 'Online',
    'idle': 'Idle',
    'dnd': 'Do Not Disturb',
    'offline': 'Offline'
};
statusText.innerText = statusMap[status] || 'Offline';

