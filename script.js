// --- VARIABLES GLOBALES ---
let timerInterval; 
let puntosL = 0;
let puntosR = 0;

// --- CONFIGURACIÓN DE REGALOS ---
const mapaRegalos = {
    "Rosa": "img/regalo_1_t1.png",
    "Capibara": "img/regalo_10_t1.png",
    "Hat": "img/regalo_30_t1.png",
    "Perfume": "img/regalo_100_t1.png",
    "AnimalMascot": "img/regalo_500_t1.png",
    "MoneyBag": "img/regalo_1000_t1.png",
    "MoneyBagLarge": "img/regalo_5000_t1.png"
};

// --- LÓGICA DE REGALOS ---
function actualizarContadorRegalo(nombreRegalo, equipo) {
    const sufijo = equipo === 'Team1' ? 't1' : 't2';
    // Asegúrate de que los IDs en tu HTML sean 'rose-text-t1' y 'rose-text-t2'
    const idElemento = `rose-text-${sufijo}`; 
    
    const elemento = document.getElementById(idElemento);
    if (elemento) {
        let actual = parseInt(elemento.innerText || 0);
        elemento.innerText = actual + 1;
        
        // Efecto visual
        elemento.parentElement.classList.add('flash');
        setTimeout(() => elemento.parentElement.classList.remove('flash'), 200);
    }
}

// --- CONEXIÓN A TIKFINITY ---
// Asegúrate de que este bloque de conexión esté tal cual aquí
const socket = new WebSocket('ws://localhost:8080');

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    
    // Si es un regalo, actualizamos el contador
    if (data.event === 'gift') {
        actualizarContadorRegalo(data.giftName, data.team);
    }
    
    // --- AQUÍ VA TU LÓGICA EXISTENTE DE PARTIDOS Y RELOJ ---
    // (Asegúrate de que tus funciones antiguas como setActiveMatch o startTimer 
    // sigan debajo de esta línea, dentro del archivo)
};

// --- TUS FUNCIONES ANTIGUAS (Pégalas justo aquí abajo) ---
// function setActiveMatch(id) { ... }
// function startTimer() { ... }
// function resetTableroCompleto() { ... }