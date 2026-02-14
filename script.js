const CONFIG = {
    FLOATING_HEARTS: 10,
    HEART_DELAY: 100,
    HEART_DURATION: 3000,
    BUTTON_MOVEMENT_RANGE: 200,
    BUTTON_MOVEMENT_OFFSET: 100
};

const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const proposal = document.getElementById('proposal');
const successMessage = document.getElementById('successMessage');

function moveButton() {
    const randomX = Math.random() * CONFIG.BUTTON_MOVEMENT_RANGE - CONFIG.BUTTON_MOVEMENT_OFFSET;
    const randomY = Math.random() * CONFIG.BUTTON_MOVEMENT_RANGE - CONFIG.BUTTON_MOVEMENT_OFFSET;
    noBtn.style.transform = `translate(${randomX}px, ${randomY}px)`;
}

['mouseover', 'touchstart', 'click'].forEach(event => {
    noBtn.addEventListener(event, moveButton);
});

yesBtn.addEventListener('click', function() {
    proposal.style.display = 'none';
    successMessage.style.display = 'block';
    
    for (let i = 0; i < CONFIG.FLOATING_HEARTS; i++) {
        setTimeout(createFloatingHeart, i * CONFIG.HEART_DELAY);
    }
});

function createFloatingHeart() {
    const heart = document.createElement('div');
    heart.textContent = '❤️';
    heart.className = 'floating-heart';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.top = '-50px';
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), CONFIG.HEART_DURATION);
}

document.addEventListener('touchmove', function(e) {
    if (e.target === noBtn) {
        e.preventDefault();
    }
});
