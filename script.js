const CONFIG = {
    FLOATING_HEARTS: 10,
    HEART_DELAY: 100,
    HEART_DURATION: 3000,
    BUTTON_MOVEMENT_RANGE: 200,
    BUTTON_MOVEMENT_OFFSET: 100,
    CONFETTI_COUNT: 50,
    CONFETTI_DURATION: 3000,
    SOUND_ENABLED: true
};

// Audio context for sound synthesis
const audioContext = new (window.AudioContext || window.webkitAudioContext)();

function playSuccessSound() {
    if (!CONFIG.SOUND_ENABLED) return;
    
    try {
        const now = audioContext.currentTime;
        const osc1 = audioContext.createOscillator();
        const osc2 = audioContext.createOscillator();
        const gain = audioContext.createGain();
        
        osc1.frequency.setValueAtTime(523.25, now); // C5
        osc1.frequency.setValueAtTime(659.25, now + 0.15); // E5
        osc2.frequency.setValueAtTime(783.99, now + 0.3); // G5
        
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(audioContext.destination);
        
        osc1.start(now);
        osc1.stop(now + 0.15);
        osc2.start(now + 0.3);
        osc2.stop(now + 0.6);
    } catch (e) {
        console.log('Audio playback not supported');
    }
}

function createConfetti() {
    const canvas = document.createElement('canvas');
    canvas.id = 'confetti-canvas';
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.appendChild(canvas);
    
    const ctx = canvas.getContext('2d');
    const confetti = [];
    const colors = ['#ff6b9d', '#c44569', '#ff69b4', '#ff1493', '#ff6b6b'];
    
    function createConfettiPiece() {
        return {
            x: Math.random() * canvas.width,
            y: -10,
            vx: (Math.random() - 0.5) * 8,
            vy: Math.random() * 5 + 3,
            rotation: Math.random() * 360,
            color: colors[Math.floor(Math.random() * colors.length)],
            size: Math.random() * 6 + 4
        };
    }
    
    for (let i = 0; i < CONFIG.CONFETTI_COUNT; i++) {
        confetti.push(createConfettiPiece());
    }
    
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        confetti.forEach((piece, index) => {
            piece.y += piece.vy;
            piece.x += piece.vx;
            piece.vy += 0.1; // gravity
            piece.rotation += 5;
            piece.opacity = 1 - (piece.y / canvas.height);
            
            ctx.save();
            ctx.globalAlpha = piece.opacity;
            ctx.fillStyle = piece.color;
            ctx.translate(piece.x, piece.y);
            ctx.rotate((piece.rotation * Math.PI) / 180);
            ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size);
            ctx.restore();
            
            if (piece.y > canvas.height) {
                confetti.splice(index, 1);
            }
        });
        
        if (confetti.length > 0) {
            requestAnimationFrame(animate);
        } else {
            canvas.remove();
        }
    }
    
    animate();
}

const noBtn = document.getElementById('noBtn');
const yesBtn = document.getElementById('yesBtn');
const soundBtn = document.getElementById('soundBtn');
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

soundBtn.addEventListener('click', function() {
    CONFIG.SOUND_ENABLED = !CONFIG.SOUND_ENABLED;
    soundBtn.classList.toggle('muted');
    soundBtn.textContent = CONFIG.SOUND_ENABLED ? '🔊' : '🔇';
});

yesBtn.addEventListener('click', function() {
    proposal.style.display = 'none';
    successMessage.style.display = 'block';
    
    playSuccessSound();
    createConfetti();
    
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
