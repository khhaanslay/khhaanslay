document.addEventListener('DOMContentLoaded', () => {
    // 1. Cấu hình ảnh nền và vị trí icon tương ứng
    const loaderConfigs = [
        { bg: 'imgs/random-evernight.jpeg', pos: { top: 'auto', bottom: '40px', left: '40px', right: 'auto' } },
        { bg: 'imgs/random-furina.jpeg', pos: { top: '40px', bottom: 'auto', left: 'auto', right: '40px' } },
        { bg: 'imgs/random-yeshunguang.jpeg', pos: { top: 'auto', bottom: '40px', left: 'auto', right: '40px' } }
    ];

    const elementImages = [
        'imgs/anemo.png', 'imgs/pyro.png', 'imgs/hydro.png', 
        'imgs/cryo.png', 'imgs/electro.png', 'imgs/geo.png', 'imgs/dendro.png'
    ];

    const loader = document.getElementById('genshin-loader');
    const loaderBg = document.getElementById('loader-bg');
    const elDisplay = document.getElementById('element-display');
    const elContainer = document.querySelector('.element-fixed-container');

    // 2. Chọn ngẫu nhiên ảnh nền và set vị trí
    const randomConfig = loaderConfigs[Math.floor(Math.random() * loaderConfigs.length)];
    loaderBg.style.backgroundImage = `url('${randomConfig.bg}')`;
    
    // Áp dụng vị trí động
    Object.assign(elContainer.style, randomConfig.pos);

    // 3. Logic vòng lặp icon nguyên tố
    let currentIndex = 0;
    function rotateElement() {
        // Mờ dần
        elDisplay.classList.remove('active');
        
        setTimeout(() => {
            // Thay đổi ảnh icon và hiện lên
            elDisplay.style.backgroundImage = `url('${elementImages[currentIndex]}')`;
            elDisplay.classList.add('active');
            currentIndex = (currentIndex + 1) % elementImages.length;
        }, 500); // Đợi mờ hẳn mới đổi ảnh
    }

    // Khởi chạy vòng lặp
    rotateElement();
    const loopInterval = setInterval(rotateElement, 1000);

    // 4. Kết thúc Preloader sau 4 giây
    setTimeout(() => {
        clearInterval(loopInterval);
        loader.style.opacity = '0';
        setTimeout(() => {
        loader.style.display = 'none'; // Ép nó biến mất hoàn toàn
    }, 800);
}, 500);
}
)