document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('genshin-loader');
    const bar = document.getElementById('load-bar');
    const percentText = document.getElementById('percent');
    const elements = document.querySelectorAll('.element');
    
    let progress = 0;

    const startLoading = () => {
        const interval = setInterval(() => {
            // Tăng tiến độ
            progress += Math.floor(Math.random() * 3) + 1; 

            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                // Kích hoạt tất cả icon còn lại chắc chắn sáng
                elements.forEach(el => el.classList.add('active'));

                setTimeout(() => {
                    loader.classList.add('fade-out');
                    setTimeout(() => loader.remove(), 800);
                }, 800);
            }

            // Cập nhật thanh trượt và phần trăm
            bar.style.width = progress + '%';
            percentText.innerText = progress;

            // Kiểm tra vị trí thanh trượt để làm sáng icon
            // Chia 100% cho số lượng icon để biết khi nào cần bật icon tiếp theo
            const threshold = 100 / elements.length;
            elements.forEach((el, index) => {
                if (progress >= (index + 1) * threshold - 5) {
                    el.classList.add('active');
                }
            });

        }, 50); // Tốc độ tải
    };

    startLoading();
});