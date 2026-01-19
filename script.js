const DISCORD_ID = "1057942252535693322";

async function updateDiscordStatus() {
    try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const data = await response.json();
        if (!data.success) return;

        const user = data.data;

        // --- BIẾN DÙNG CHUNG ---
        const avatarUrl = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${user.discord_user.avatar}.png?size=256`;
        const displayName = user.discord_user.global_name || user.discord_user.username;
        const statusMap = {'online': 'Online', 'idle': 'Idle', 'dnd': 'Do Not Disturb', 'offline': 'Offline'};

        // --- 1. CẬP NHẬT CARD CŨ (HEADER) ---
        const oldAvt = document.getElementById('discord-avatar');
        if (oldAvt) oldAvt.src = avatarUrl;
        
        const oldName = document.getElementById('discord-name');
        if (oldName) oldName.innerText = displayName;

        const oldDeco = document.getElementById('discord-decoration');
        if (oldDeco) {
            if (user.discord_user.avatar_decoration_data) {
                oldDeco.src = `https://cdn.discordapp.com/avatar-decoration-presets/${user.discord_user.avatar_decoration_data.asset}`;
                oldDeco.style.display = "block";
            } else {
                oldDeco.style.display = "none";
            }
        }

        // Chấm trạng thái (Online/Offline)
        const statusDot = document.getElementById('discord-status-dot');
        if (statusDot) statusDot.className = `status-dot ${user.discord_status}`;

        // Ghi chú trạng thái (Tự động thay đổi theo Discord)
        const customStatus = user.activities.find(a => a.type === 4);
        const statusDisplay = document.getElementById('discord-status-text');
        if (statusDisplay) {
            if (customStatus) {
                const emojiHtml = customStatus.emoji ? `<img src="https://cdn.discordapp.com/emojis/${customStatus.emoji.id}.png" style="width:20px; vertical-align:middle;"> ` : "";
                statusDisplay.innerHTML = `${emojiHtml}${customStatus.state || ""}`;
            } else {
                statusDisplay.innerText = statusMap[user.discord_status] || "Offline";
            }
        }

        // --- 2. CẬP NHẬT CARD MỚI (PROFILE SECTION) ---
        const profileAvt = document.getElementById('profile-discord-avatar');
        if (profileAvt) profileAvt.src = avatarUrl;

        const profileName = document.getElementById('profile-discord-name');
        if (profileName) profileName.innerText = displayName;

        const profileDeco = document.getElementById('profile-discord-deco');
        if (profileDeco) {
            if (user.discord_user.avatar_decoration_data) {
                profileDeco.src = `https://cdn.discordapp.com/avatar-decoration-presets/${user.discord_user.avatar_decoration_data.asset}`;
                profileDeco.style.display = "block";
            } else {
                profileDeco.style.display = "none";
            }
        }

        // --- CẤU HÌNH NHẠC NỘI BỘ ---
const musicList = [
    { name: "Bài hát 1", artist: "Ca sĩ 1", src: "music/song1.mp3", img: "imgs/cover1.jpg" },
    { name: "Bài hát 2", artist: "Ca sĩ 2", src: "music/song2.mp3", img: "imgs/cover2.jpg" }
];

let musicIndex = 0;
const mainAudio = document.getElementById("main-audio");
const playPauseBtn = document.getElementById("play-pause-btn");
const playImg = document.getElementById("play-img");
const musicDisk = document.getElementById("music-disk");
const progressBar = document.getElementById("music-progress");
const progressArea = document.getElementById("progress-area");

// Hàm tải nhạc
function loadMusic(index) {
    document.getElementById("song-name").innerText = musicList[index].name;
    document.getElementById("artist-name").innerText = musicList[index].artist;
    mainAudio.src = musicList[index].src;
    // Nếu bạn có ảnh bìa riêng cho mỗi bài:
    // musicDisk.src = musicList[index].img; 
}

// Xử lý Play/Pause
playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = playPauseBtn.classList.contains("paused");
    isMusicPaused ? pauseMusic() : playMusic();
});

function playMusic() {
    playPauseBtn.classList.add("paused");
    playImg.src = "imgs/pause.png"; // Đổi sang icon pause khi đang chạy
    musicDisk.style.animationPlayState = "running";
    mainAudio.play();
}

function pauseMusic() {
    playPauseBtn.classList.remove("paused");
    playImg.src = "imgs/play.png";
    musicDisk.style.animationPlayState = "paused";
    mainAudio.pause();
}

// Cập nhật thanh tiến trình và thời gian
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime;
    const duration = e.target.duration;
    let progressWidth = (currentTime / duration) * 100;
    progressBar.style.width = `${progressWidth}%`;

    // Cập nhật thời gian hiển thị
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if(currentSec < 10) currentSec = `0${currentSec}`;
    document.getElementById("current-time").innerText = `${currentMin}:${currentSec}`;

    mainAudio.onloadeddata = () => {
        let totalMin = Math.floor(mainAudio.duration / 60);
        let totalSec = Math.floor(mainAudio.duration % 60);
        if(totalSec < 10) totalSec = `0${totalSec}`;
        document.getElementById("total-time").innerText = `${totalMin}:${totalSec}`;
    };
});

// Tua nhạc khi click vào thanh progress
progressArea.addEventListener("click", (e) => {
    let progressWidthVal = progressArea.clientWidth;
    let clickedOffSetX = e.offsetX;
    let songDuration = mainAudio.duration;
    mainAudio.currentTime = (clickedOffSetX / progressWidthVal) * songDuration;
    playMusic();
});

// Next/Prev
document.getElementById("next-btn").addEventListener("click", () => {
    musicIndex = (musicIndex + 1) % musicList.length;
    loadMusic(musicIndex);
    playMusic();
});

document.getElementById("prev-btn").addEventListener("click", () => {
    musicIndex = (musicIndex - 1 + musicList.length) % musicList.length;
    loadMusic(musicIndex);
    playMusic();
});

// Khởi tạo bài đầu tiên
window.addEventListener("load", () => {
    loadMusic(musicIndex);
});

    } catch (error) {
        console.error("Lanyard Error:", error);
    }
}

// Hàm hỗ trợ mở rộng các ô About (Giữ nguyên logic cũ của bạn)
function expandCard(card) {
    const isExpanded = card.classList.contains('expanded');
    document.querySelectorAll('.about-card').forEach(c => c.classList.remove('expanded'));
    if (!isExpanded) card.classList.add('expanded');
}

// Khởi chạy khi trang web tải xong
document.addEventListener("DOMContentLoaded", function() {
    // 1. Cập nhật Discord ngay lập tức và lặp lại mỗi 5 giây
    updateDiscordStatus();
    setInterval(updateDiscordStatus, 5000);

    // 2. Tăng số lượt xem (View Count)
    let views = localStorage.getItem('view_count') || 1540;
    views = parseInt(views) + 1;
    localStorage.setItem('view_count', views);
    const viewEl = document.getElementById('view-count');
    if (viewEl) viewEl.innerText = views.toLocaleString();

    // 3. Hiệu ứng gõ chữ cho Quote
    const quoteElement = document.querySelector(".quote-text");
    if (quoteElement) {
        const textToType = quoteElement.textContent.trim();
        quoteElement.textContent = "";
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let i = 0;
                    quoteElement.classList.add("typing");
                    function type() {
                        if (i < textToType.length) {
                            quoteElement.textContent += textToType.charAt(i);
                            i++;
                            setTimeout(type, 80);
                        }
                    }
                    type();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        observer.observe(quoteElement);
    }
});
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

function expandCard(card) {
    const isExpanded = card.classList.contains('expanded');
    
    // Đóng tất cả các ô khác
    document.querySelectorAll('.about-card').forEach(c => {
        c.classList.remove('expanded');
    });

    if (!isExpanded) {
        card.classList.add('expanded');
    }
}

// Giữ nguyên Observer cũ của bạn bên dưới
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.2 });

document.querySelectorAll('.scroll-reveal').forEach(el => revealObserver.observe(el));

function expandCard(card) {
    const isExpanded = card.classList.contains('expanded');
    
    // Đóng tất cả các ô khác để chữ của chúng biến mất
    document.querySelectorAll('.about-card').forEach(c => {
        c.classList.remove('expanded');
    });

    // Nếu chưa mở thì mở, nếu mở rồi thì đóng lại
    if (!isExpanded) {
        card.classList.add('expanded');
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const quoteElement = document.querySelector(".quote-text");
    if (!quoteElement) return;

    // Lấy nội dung chữ có sẵn trong HTML làm mẫu để gõ
    const textToType = quoteElement.textContent.trim(); 
    quoteElement.textContent = ""; // Xóa chữ ban đầu

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Khi cuộn tới phần Quote (vùng nhìn thấy > 20%)
            if (entry.isIntersecting) {
                startTypewriter(quoteElement, textToType);
                observer.unobserve(entry.target); // Chỉ chạy hiệu ứng 1 lần
            }
        });
    }, { threshold: 0.2 });

    observer.observe(quoteElement);

    function startTypewriter(element, text) {
        let i = 0;
        element.classList.add("typing"); // Hiện con trỏ nhấp nháy

        function type() {
            if (i < text.length) {
                element.textContent += text.charAt(i);
                i++;
                setTimeout(type, 40); // Tốc độ gõ: 80ms/chữ
            } else {
                // Gõ xong thì bỏ con trỏ sau 1.5 giây
                setTimeout(() => {
                    element.classList.remove("typing");
                }, 1500);
            }
        }
        type();
    }
});

