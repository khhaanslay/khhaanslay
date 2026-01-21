// --- DANH SÁCH NHẠC ---
window.musicList = [
    { name: "cta va sau nay", src: "music/ctavasaunay.mp3", cover: "imgs/music-icon1.jpg" },
    { name: "Phep Mau", src: "music/phepmau.mp3", cover: "imgs/music-icon2.jpg" },
    { name: "We dont talk anymore", src: "music/wedonttalkanymore(instrumental).mp3", cover: "imgs/music-icon3.jpg" },
    { name: "Trả Cho Anh Remix", src: "music/trachoanh.mp3", cover: "imgs/music-icon4.jpg" },
    { name: "Chờ đợi đâu đáng sợ", src: "music/chodoidaudangso.mp3", cover: "imgs/music-icon5.jpg" }
];

window.currentTrackIndex = Math.floor(Math.random() * window.musicList.length);

document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('genshin-loader');
    const enterScreen = document.getElementById('enter-screen');
    const mainAudio = document.getElementById("main-audio");
    const isMobile = window.innerWidth <= 768;

    // --- KHỞI TẠO NHẠC ---
    if (window.loadAndPlay) {
        const track = window.musicList[window.currentTrackIndex];
        mainAudio.src = track.src;
        document.getElementById("song-name").innerText = track.name;
        document.getElementById("music-disk").src = track.cover;
        mainAudio.load();
    }

    // --- QUẢN LÝ MÀN HÌNH CHỜ ---
    if (enterScreen) {
        enterScreen.classList.add('active');
        document.body.style.overflow = 'hidden'; 
        document.documentElement.style.overflow = 'hidden';

        enterScreen.addEventListener('click', () => {
            // Phát nhạc
            if (window.loadAndPlay) {
                window.loadAndPlay(window.currentTrackIndex)
            }
            // Mở khóa web
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
            enterScreen.style.opacity = '0';
            setTimeout(() => {enterScreen.remove();
                document.body.style.overflow ='auto';
            }, 1000);
            
        });
    }
    window.loadAndPlay(window.currentTrackIndex);

    // --- LOGIC GENSHIN LOADER (NẾU LÀ PC) ---
    if (isMobile) {
        if (loader) loader.remove();
    } else if (loader) {
        const loaderConfigs = [
            { bg: 'imgs/random-evernight.jpeg', pos: { top: 'auto', bottom: '40px', left: '40px', right: 'auto' } },
            { bg: 'imgs/random-furina.jpeg', pos: { top: '40px', bottom: 'auto', left: 'auto', right: '40px' } },
            { bg: 'imgs/random-yeshunguang.jpeg', pos: { top: 'auto', bottom: '40px', left: 'auto', right: '40px' } }
        ];
        const elementImages = ['imgs/anemo.png', 'imgs/pyro.png', 'imgs/hydro.png', 'imgs/cryo.png', 'imgs/electro.png', 'imgs/geo.png', 'imgs/dendro.png'];
        
        const loaderBg = document.getElementById('loader-bg');
        const elDisplay = document.getElementById('element-display');
        const elContainer = document.querySelector('.element-fixed-container');

        const config = loaderConfigs[Math.floor(Math.random() * loaderConfigs.length)];
        if (loaderBg) loaderBg.style.backgroundImage = `url('${config.bg}')`;
        if (elContainer) Object.assign(elContainer.style, config.pos);

        let idx = 0;
        const rotate = () => {
            if (!elDisplay) return;
            elDisplay.classList.remove('active');
            setTimeout(() => {
                elDisplay.style.backgroundImage = `url('${elementImages[idx]}')`;
                elDisplay.classList.add('active');
                idx = (idx + 1) % elementImages.length;
            }, 500);
        };
        rotate();
        const loop = setInterval(rotate, 1000);

        // Đảm bảo LOADER PHẢI BIẾN MẤT sau 4s
        setTimeout(() => {
            clearInterval(loop);
            loader.style.opacity = '0';
            setTimeout(() => loader.remove(), 1000);
        }, 4000);
    }

    // CƠ CHẾ BẢO VỆ: Nếu sau 6s vẫn đen, tự động xóa sạch các lớp phủ
    setTimeout(() => {
        if (document.getElementById('genshin-loader')) document.getElementById('genshin-loader').remove();
        if (document.body.style.overflow === 'hidden') {
            document.body.style.overflow = '';
            document.documentElement.style.overflow = '';
        }
    }, 6000);
});