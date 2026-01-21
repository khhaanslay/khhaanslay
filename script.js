// ==========================================
// PHẦN 1: DISCORD STATUS & PROFILE (LANYARD)
// ==========================================

const DISCORD_ID = "1057942252535693322";
const STATUS_MAP = {
    online: "Online",
    idle: "Idle",
    dnd: "Do Not Disturb",
    offline: "Offline"
};

async function updateDiscordStatus() {
    try {
        const res = await fetch(`https://api.lanyard.rest/v1/users/${DISCORD_ID}`);
        const json = await res.json();
        if (!json.success) return;

        const user = json.data;
        const discordUser = user.discord_user;

        const avatarUrl = `https://cdn.discordapp.com/avatars/${DISCORD_ID}/${discordUser.avatar}.png?size=256`;
        const displayName = discordUser.global_name || discordUser.username;
        const deco = discordUser.avatar_decoration_data;

        updateHeaderCard(user, avatarUrl, displayName, deco);
        updateProfileCard(avatarUrl, displayName, deco);
        updateCustomStatus(user);
        updateLanyardStatus(user);
    } catch (err) {
        console.error("Lanyard Error:", err);
    }
}
function updateLanyardStatus(user) {
    const el = document.getElementById("lanyard-status-text");
    if (!el) return;

    const statusText = STATUS_MAP[user.discord_status] || "Offline";
    el.innerText = statusText;

    el.classList.remove("online", "idle", "dnd", "offline");
    el.classList.add(user.discord_status);
}

/* ---------- HEADER CARD ---------- */
function updateHeaderCard(user, avatarUrl, name, deco) {
    setSrc("discord-avatar", avatarUrl);
    setText("discord-name", name);

    const decoEl = document.getElementById("discord-decoration");
    if (decoEl) toggleDecoration(decoEl, deco);

    const statusDot = document.getElementById("discord-status-dot");
    if (statusDot) statusDot.className = `status-dot ${user.discord_status}`;
}

/* ---------- PROFILE CARD ---------- */
function updateProfileCard(avatarUrl, name, deco) {
    setSrc("profile-discord-avatar", avatarUrl);
    setText("profile-discord-name", name);

    const decoEl = document.getElementById("profile-discord-deco");
    if (decoEl) toggleDecoration(decoEl, deco);
}

/* ---------- CUSTOM STATUS ---------- */
function updateCustomStatus(user) {
    const el = document.getElementById("discord-status-text");
    if (!el) return;

    const custom = user.activities.find(a => a.type === 4);
    if (!custom) {
        el.innerText = STATUS_MAP[user.discord_status] || "Offline";
        return;
    }

    const emoji = custom.emoji?.id
        ? `<img src="https://cdn.discordapp.com/emojis/${custom.emoji.id}.png" style="width:20px;vertical-align:middle;"> `
        : "";

    el.innerHTML = `${emoji}${custom.state || ""}`;
}

/* ---------- HELPERS ---------- */
function toggleDecoration(el, deco) {
    if (!deco) {
        el.style.display = "none";
        return;
    }
    el.src = `https://cdn.discordapp.com/avatar-decoration-presets/${deco.asset}`;
    el.style.display = "block";
}

function setSrc(id, value) {
    const el = document.getElementById(id);
    if (el) el.src = value;
}

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.innerText = value;
}

// ==========================================
// PHẦN 2: QUOTE TYPING · SCROLL REVEAL · ABOUT
// ==========================================

/* ---------- ABOUT CARD EXPAND ---------- */
function expandCard(card) {
    const isExpanded = card.classList.contains("expanded");

    document
        .querySelectorAll(".about-card")
        .forEach(c => c.classList.remove("expanded"));

    if (!isExpanded) card.classList.add("expanded");
}

/* ---------- SCROLL REVEAL ---------- */
const revealObserver = new IntersectionObserver(
    entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
            }
        });
    },
    { threshold: 0.2 }
);

document
    .querySelectorAll(".scroll-reveal")
    .forEach(el => revealObserver.observe(el));

/* ---------- QUOTE TYPEWRITER ---------- */
document.addEventListener("DOMContentLoaded", () => {
    const quoteEl = document.querySelector(".quote-text");
    if (!quoteEl) return;

    const text = quoteEl.textContent.trim();
    quoteEl.textContent = "";

    const observer = new IntersectionObserver(
        entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startTypewriter(quoteEl, text);
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.2 }
    );

    observer.observe(quoteEl);
});

function startTypewriter(el, text) {
    let i = 0;
    el.classList.add("typing");

    (function type() {
        if (i < text.length) {
            el.textContent += text.charAt(i++);
            setTimeout(type, 40);
        } else {
            setTimeout(() => el.classList.remove("typing"), 1500);
        }
    })();
}

// ==========================================
// PHẦN 3: CLOCK · VIEW COUNT · STATUS LOCAL
// ==========================================

/* ---------- MID CLOCK ---------- */
function updateMidClock() {
    const now = new Date();

    setText(
        "digital-clock",
        now.toLocaleTimeString("vi-VN", { hour12: false })
    );

    setText(
        "current-date",
        now.toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric"
        })
    );
}

/* ---------- VIEW COUNT ---------- */
function updateViewCount() {
    let views = parseInt(localStorage.getItem("view_count") || "1540", 10) + 1;
    localStorage.setItem("view_count", views);

    const el = document.getElementById("view-count");
    if (el) el.innerText = views.toLocaleString();
}

/* ---------- EDITABLE STATUS ---------- */
function initEditableStatus() {
    const statusEl = document.getElementById("editable-status");
    if (!statusEl) return;

    const saved = localStorage.getItem("userStatus");
    if (saved) statusEl.innerHTML = saved;

    statusEl.addEventListener("input", () =>
        localStorage.setItem("userStatus", statusEl.innerHTML)
    );
}

/* ---------- GLOBAL INIT ---------- */
document.addEventListener("DOMContentLoaded", () => {
    // Discord
    updateDiscordStatus();
    setInterval(updateDiscordStatus, 30000);

    // Clock
    updateMidClock();
    setInterval(updateMidClock, 1000);

    // View count + Status
    updateViewCount();
    initEditableStatus();
});

// ==========================================
// PHẦN 4: MUSIC PLAYER CHÍNH
// ==========================================

const mainAudio = document.getElementById("main-audio");
const songName = document.getElementById("song-name");
const musicDisk = document.getElementById("music-disk");
const mainIcon = document.getElementById("mainIcon");

const progressArea = document.getElementById("progress-area");
const progressBar = document.getElementById("music-progress");
const currentTimeEl = document.getElementById("current-time");
const totalTimeEl = document.getElementById("total-time");

/* ---------- TIME FORMAT ---------- */
function formatTime(seconds) {
    if (isNaN(seconds)) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? "0" + s : s}`;
}

/* ---------- ICON STATE ---------- */
function updateIconState() {
    if (!mainIcon) return;
    mainIcon.textContent = mainAudio.paused
        ? "play_circle_filled"
        : "pause_circle_filled";
}

mainAudio.addEventListener("play", updateIconState);
mainAudio.addEventListener("pause", updateIconState);

/* ---------- LOAD & PLAY (GLOBAL) ---------- */
window.loadAndPlay = function (index) {
    const track = window.musicList?.[index];
    if (!track) return;

    window.currentTrackIndex = index;

    mainAudio.src = track.src;
    songName.innerText = track.name;
    musicDisk.src = track.cover;

    mainAudio.load();

    mainAudio.onloadedmetadata = () => {
        totalTimeEl.innerText = formatTime(mainAudio.duration);
    };

    mainAudio
        .play()
        .then(updateIconState)
        .catch(() => console.log("Yêu cầu tương tác người dùng"));
};

/* ---------- AUTO NEXT ---------- */
mainAudio.onended = () => {
    const next =
        (window.currentTrackIndex + 1) % window.musicList.length;
    window.loadAndPlay(next);
};

/* ---------- PLAY / PAUSE BUTTON ---------- */
document.getElementById("play-pause-btn")?.addEventListener("click", e => {
    e.preventDefault();
    mainAudio.paused ? mainAudio.play() : mainAudio.pause();
});

/* ---------- NEXT / PREV ---------- */
document.getElementById("next-btn")?.addEventListener("click", () => {
    const next =
        (window.currentTrackIndex + 1) % window.musicList.length;
    window.loadAndPlay(next);
});

document.getElementById("prev-btn")?.addEventListener("click", () => {
    const prev =
        (window.currentTrackIndex - 1 + window.musicList.length) %
        window.musicList.length;
    window.loadAndPlay(prev);
});

/* ---------- PROGRESS UPDATE ---------- */
mainAudio.addEventListener("timeupdate", () => {
    if (!mainAudio.duration) return;

    currentTimeEl.innerText = formatTime(mainAudio.currentTime);
    progressBar.style.width =
        (mainAudio.currentTime / mainAudio.duration) * 100 + "%";
});

/* ---------- SEEK ---------- */
progressArea?.addEventListener("click", e => {
    const width = progressArea.clientWidth;
    mainAudio.currentTime =
        (e.offsetX / width) * mainAudio.duration;
});

// ==========================================
// PHẦN 5: FLOATING PLAYER · VOLUME · INIT
// ==========================================

/* ---------- FLOATING PLAYER ELEMENTS ---------- */
const floatingCover = document.getElementById("floating-cover");
const largeCover = document.getElementById("popup-cover-large");
const floatingTitle = document.getElementById("floating-title");

const popupPlay = document.getElementById("popup-play");
const popupNext = document.getElementById("popup-next");
const popupPrev = document.getElementById("popup-prev");

const popupProgress = document.getElementById("popup-progress");
const miniCurrent = document.getElementById("mini-current");
const miniDuration = document.getElementById("mini-duration");
const miniProgressArea = document.getElementById("mini-progress-area");

const volumeSlider = document.getElementById("volume-slider");

/* ---------- SYNC MINI PLAYER ---------- */
function syncMiniPlayer() {
    const track = window.musicList?.[window.currentTrackIndex];
    if (!track) return;

    floatingCover.src = track.cover;
    largeCover.src = track.cover;
    floatingTitle.textContent = track.name;
}

mainAudio.addEventListener("loadeddata", syncMiniPlayer);

/* ---------- MINI PLAY / PAUSE ---------- */
popupPlay?.addEventListener("click", () => {
    mainAudio.paused ? mainAudio.play() : mainAudio.pause();
});

mainAudio.addEventListener("play", () => {
    if (popupPlay) popupPlay.textContent = "pause_circle_filled";
});
mainAudio.addEventListener("pause", () => {
    if (popupPlay) popupPlay.textContent = "play_circle_filled";
});

/* ---------- MINI NEXT / PREV ---------- */
popupNext?.addEventListener("click", () => {
    const i = (window.currentTrackIndex + 1) % window.musicList.length;
    window.loadAndPlay(i);
});

popupPrev?.addEventListener("click", () => {
    const i =
        (window.currentTrackIndex - 1 + window.musicList.length) %
        window.musicList.length;
    window.loadAndPlay(i);
});

/* ---------- MINI PROGRESS ---------- */
mainAudio.addEventListener("timeupdate", () => {
    if (!mainAudio.duration) return;

    popupProgress.style.width =
        (mainAudio.currentTime / mainAudio.duration) * 100 + "%";
    miniCurrent.textContent = formatTime(mainAudio.currentTime);
});

mainAudio.addEventListener("loadedmetadata", () => {
    miniDuration.textContent = formatTime(mainAudio.duration);
});

/* ---------- MINI SEEK ---------- */
miniProgressArea?.addEventListener("click", e => {
    const rect = miniProgressArea.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    mainAudio.currentTime = percent * mainAudio.duration;
});

/* ---------- VOLUME ---------- */
if (volumeSlider) {
    mainAudio.volume = 0.3;
    volumeSlider.value = 0.3;

    volumeSlider.addEventListener("input", e => {
        mainAudio.volume = e.target.value;

        const icon = document.querySelector(".volume-area i");
        if (!icon) return;

        if (e.target.value == 0) icon.textContent = "volume_off";
        else if (e.target.value < 0.5) icon.textContent = "volume_down";
        else icon.textContent = "volume_up";
    });
}

/* ---------- INIT FROM PRELOADER ---------- */
document.addEventListener("DOMContentLoaded", () => {
    if (!window.musicList?.length) return;

    const index = window.currentTrackIndex || 0;
    const track = window.musicList[index];

    mainAudio.src = track.src;
    songName.innerText = track.name;
    musicDisk.src = track.cover;

    syncMiniPlayer();
    mainAudio.load();
});

/* ---------- PRELOADER ENTRY ---------- */
window.startEverything = function () {
    if (typeof initAudioVisualizer === "function") {
        initAudioVisualizer();
    }

    mainAudio
        .play()
        .then(updateIconState)
        .catch(() => console.log("Yêu cầu tương tác để phát nhạc"));
};

function updateCoupleTimer() {
    // 1. Cấu hình ngày bắt đầu (Năm, Tháng-1, Ngày)
    // Lưu ý: Tháng trong JS chạy từ 0-11 (Tháng 10 là số 9)
    const startDate = new Date(2025, 9, 6); 
    const now = new Date();

    // 2. Tính số ngày đã yêu
    const diffTime = Math.abs(now - startDate);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // 3. Hiển thị lên màn hình
    const countElement = document.getElementById("count-number");
    if(countElement) countElement.innerText = diffDays;

    // 4. Cập nhật ngày hiện tại (định dạng DD/MM/YYYY)
    const todayStr = now.getDate().toString().padStart(2, '0') + '/' + 
                     (now.getMonth() + 1).toString().padStart(2, '0') + '/' + 
                     now.getFullYear();
    
    const todayElement = document.getElementById("today-date");
    if(todayElement) todayElement.innerText = todayStr;
}

// Chạy hàm khi trang web tải xong
document.addEventListener("DOMContentLoaded", updateCoupleTimer);