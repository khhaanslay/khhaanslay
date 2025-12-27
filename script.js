const DISCORD_ID = "1057942252535693322";

async function updateDiscordStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const data = await response.json();
        if (!data.success) return;

        const user = data.data;

        // 1. Cập nhật Avatar & Decoration (Khung)
        const decoImg = document.getElementById('discord-decoration');
        document.getElementById('discord-avatar').src = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${user.discord_user.avatar}.png?size=256`;
        if (user.discord_user.avatar_decoration_data) {
            decoImg.src = `https://cdn.discordapp.com/avatar-decoration-presets/${user.discord_user.avatar_decoration_data.asset}`;
            decoImg.style.display = "block";
        } else {
            decoImg.style.display = "none";
        }

        // 2. Cập nhật Banner
        const bannerImg = document.getElementById('discord-banner');
        if (user.discord_user.banner) {
            const ext = user.discord_user.banner.startsWith("a_") ? "gif" : "png";
            bannerImg.src = `https://cdn.discordapp.com/banners/${DISCORD_ID}/${user.discord_user.banner}.${ext}?size=1024`;
        }

        // 3. Cập nhật Tên & Chấm trạng thái
        document.getElementById('discord-name').innerText = user.discord_user.username;
        const statusDot = document.getElementById('discord-status-dot');
        statusDot.className = `status-dot ${user.discord_status}`;

        // 4. Cập nhật Trạng thái tùy chỉnh (mê e ấy)
        const customStatus = user.activities.find(a => a.type === 4);
        const statusDisplay = document.getElementById('discord-status-text');
        if (customStatus) {
            const emojiHtml = customStatus.emoji ? `<img src="https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.png" style="width:20px; vertical-align:middle;"> ` : "";
            statusDisplay.innerHTML = `${emojiHtml}${customStatus.state || ""}`;
        }

        // 5. Cập nhật Hoạt động (Game / Spotify)
        const activityBox = document.getElementById('discord-activity');
        const playingGame = user.activities.find(a => a.type === 0);

        if (playingGame) {
            // Xử lý logic lấy ảnh từ Discord Assets
            const largeImgId = playingGame.assets?.large_image;
            const smallImgId = playingGame.assets?.small_image;
            
            const largeImgUrl = largeImgId ? (largeImgId.startsWith("mp:external") 
                ? largeImgId.replace(/mp:external\/.*\/https\//, "https://") 
                : `https://cdn.discordapp.com/app-assets/${playingGame.application_id}/${largeImgId}.png`) : "imgs/default-game.png";

            activityBox.innerHTML = `
                <div class="activity-container">
                    <p class="activity-title">ĐANG CHƠI MỘT TRÒ CHƠI</p>
                    <div class="activity-content">
                        <div class="activity-image-wrapper">
                            <img src="${largeImgUrl}" class="activity-large-img">
                            ${smallImgId ? `<img src="https://cdn.discordapp.com/app-assets/${playingGame.application_id}/${smallImgId}.png" class="activity-small-img">` : ""}
                        </div>
                        <div class="activity-details">
                            <strong class="game-name">${playingGame.name}</strong>
                            <span class="game-detail">${playingGame.details || ""}</span>
                            <span class="game-state">${playingGame.state || ""}</span>
                        </div>
                    </div>
                </div>`;
        } else if (user.listening_to_spotify) {
            activityBox.innerHTML = `
                <div class="activity-container">
                    <p class="activity-title">ĐANG NGHE SPOTIFY</p>
                    <div class="activity-content">
                        <div class="activity-image-wrapper">
                            <img src="${user.spotify.album_art_url}" class="activity-large-img spotify-art">
                        </div>
                        <div class="activity-details">
                            <strong class="game-name">${user.spotify.track}</strong>
                            <span class="game-detail">bởi ${user.spotify.artist}</span>
                            <span class="game-state">trên ${user.spotify.album}</span>
                        </div>
                    </div>
                </div>`;
        } else {
            activityBox.innerHTML = `
                <div class="no-activity">
                    <p>Hiện không có hoạt động nào</p>
                </div>`;
        }

        // 6. Cập nhật Thanh Status giữa (Mid-Info Bar)
        const midStatusText = document.getElementById('lanyard-status-text');
        if (midStatusText) {
            const statusMap = {'online': 'Online', 'idle': 'Idle', 'dnd': 'Do Not Disturb', 'offline': 'Offline'};
            midStatusText.innerText = statusMap[user.discord_status] || 'Offline';
            midStatusText.classList.remove('active');
            midStatusText.style.color = "";
            if (user.discord_status === 'online') midStatusText.classList.add('active');
            else midStatusText.style.color = (user.discord_status === 'dnd') ? '#f23f43' : (user.discord_status === 'idle') ? '#f0b232' : '#80848e';
        }

    } catch (error) {
        console.error("Lanyard Error:", error);
    }
}

// Hàm cập nhật đồng hồ
function updateMidClock() {
    const now = new Date();
    document.getElementById('digital-clock').innerText = now.toLocaleTimeString('vi-VN', { hour12: false });
    document.getElementById('current-date').innerText = now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

// Khởi chạy khi tải trang
document.addEventListener('DOMContentLoaded', () => {
    updateDiscordStatus();
    setInterval(updateDiscordStatus, 30000);
    updateMidClock();
    setInterval(updateMidClock, 1000);

    // Xử lý Status có thể sửa (LocalStorage)
    const statusArea = document.getElementById('editable-status');
    const saved = localStorage.getItem('userStatus');
    if (saved) statusArea.innerHTML = saved;
    statusArea.addEventListener('input', () => localStorage.setItem('userStatus', statusArea.innerHTML));
});