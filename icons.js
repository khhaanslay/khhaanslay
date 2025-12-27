// Thư viện các icon của bạn
const iconLibrary = {
    'furina': 'https://link-anh-furina.png',
    'love': 'https://link-anh-tim.png',
    'paimon': 'https://link-anh-paimon.png'
};

function replaceIcons() {
    let content = statusArea.innerHTML;
    let hasChanged = false;

    // Quét qua thư viện và thay thế "!tên" bằng thẻ img
    for (let key in iconLibrary) {
        // Đổi "id " thành "!"
        const placeholder = `!${key}`; 
        
        if (content.includes(placeholder)) {
            const iconHtml = `<img src="${iconLibrary[key]}" class="icon-mini" alt="${key}">`;
            
            // Thay thế tất cả các cụm !tên_icon thành thẻ ảnh
            const regex = new RegExp(placeholder, 'g');
            content = content.replace(regex, iconHtml);
            hasChanged = true;
        }
    }

    if (hasChanged) {
        statusArea.innerHTML = content;
        
        // Đưa con trỏ chuột về cuối để tiếp tục gõ mượt mà
        const range = document.createRange();
        const sel = window.getSelection();
        range.selectNodeContents(statusArea);
        range.collapse(false);
        sel.removeAllRanges();
        sel.addRange(range);
    }
}