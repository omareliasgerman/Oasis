const state = {
    current: 0,
    goal: 2000,
    history: [],
    lastDate: ""
};

const petMoods = {
    sad: { icon: "🌵", msg: "¡Me estoy secando!" },
    neutral: { icon: "💧", msg: "Un traguito más, por favor." },
    happy: { icon: "🥤", msg: "¡Qué rico! Me siento genial." },
    super: { icon: "🌊", msg: "¡Soy una ola de energía!" }
};

function init() {
    const saved = JSON.parse(localStorage.getItem('oasis_data'));
    const today = new Date().toDateString();

    if (saved && saved.lastDate === today) {
        Object.assign(state, saved);
    } else {
        state.lastDate = today;
        state.current = 0;
    }
    render();
}

function drink(amount) {
    if (state.current >= state.goal * 1.5) {
        updateBubble("¡Para! ¡Voy a explotar! 😂");
        return;
    }
    
    state.current += amount;
    save();
    animatePet();
    render();
}

function render() {
    const percent = Math.floor((state.current / state.goal) * 100);
    
    // Actualizar Textos
    document.getElementById('percentage').innerText = percent + "%";
    document.getElementById('current').innerText = state.current;
    
    // Actualizar Agua Visual
    const waveContainer = document.getElementById('water-wave').parentElement;
    waveContainer.style.height = Math.min(percent, 100) + "%";

    // Lógica de la mascota
    const avatar = document.getElementById('pet-avatar');
    if (percent < 20) updatePet('sad');
    else if (percent < 70) updatePet('neutral');
    else if (percent < 100) updatePet('happy');
    else updatePet('super');

    // Cambiar color de texto según nivel de agua para contraste
    if (percent > 60) {
        document.querySelector('.stats').style.color = "white";
    } else {
        document.querySelector('.stats').style.color = "black";
    }
}

function updatePet(mood) {
    const avatar = document.getElementById('pet-avatar');
    avatar.innerText = petMoods[mood].icon;
    updateBubble(petMoods[mood].msg);
}

function updateBubble(text) {
    document.getElementById('pet-bubble').innerText = text;
}

function animatePet() {
    const avatar = document.getElementById('pet-avatar');
    avatar.style.transform = "scale(1.3) rotate(10deg)";
    setTimeout(() => avatar.style.transform = "scale(1) rotate(0deg)", 300);
}

function save() {
    localStorage.setItem('oasis_data', JSON.stringify(state));
}

function resetData() {
    if(confirm("¿Quieres reiniciar tu progreso de hoy?")) {
        state.current = 0;
        save();
        render();
    }
}

init();
