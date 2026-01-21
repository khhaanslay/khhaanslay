const text = "khhaanslay";
let index = 0;
let isDeleting = false;

const typingSpeed = 800;   // tốc độ gõ
const deletingSpeed = 800; // tốc độ xoá
const holdAfterType = 800; // dừng sau khi gõ xong
const holdAfterDelete = 0; // dừng sau khi xoá xong

function typeEffect() {
    if (!isDeleting) {
        // Gõ chữ
        document.title = text.slice(0, index + 1);
        index++;

        if (index === text.length) {
            setTimeout(() => isDeleting = true, holdAfterType);
        }
    } else {
        // Xoá chữ
        document.title = text.slice(0, index - 1);
        index--;

        if (index === 1) {
            setTimeout(() => isDeleting = false, holdAfterDelete);
        }
    }

    const speed = isDeleting ? deletingSpeed : typingSpeed;
    setTimeout(typeEffect, speed);
}


document.title = " ";
typeEffect();
