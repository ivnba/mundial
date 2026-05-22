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
    const idElemento = `rose-text-${sufijo}`; 
    const elemento = document.getElementById(idElemento);
    if (elemento) {
        let actual = parseInt(elemento.innerText || 0);
        elemento.innerText = actual + 1;
        elemento.parentElement.classList.add('flash');
        setTimeout(() => elemento.parentElement.classList.remove('flash'), 200);
    }
}

// --- CONEXIÓN A TIKFINITY ---
const socket = new WebSocket('ws://localhost:8080');

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    
    // 1. Regalos
    if (data.event === 'gift') {
        actualizarContadorRegalo(data.giftName, data.team);
    }
    
    // 2. Aquí irían otros eventos de tu lógica anterior
};

// --- TUS FUNCIONES ANTIGUAS (Copiadas de tu archivo original) ---
function setActiveMatch(id) {
    console.log("Activando partido:", id);
    // ... aquí va tu lógica original de selección ...
}

function resetTableroCompleto(limpiarTodo = true) {
    puntosL = 0; puntosR = 0;
    clearInterval(timerInterval);
    document.getElementById('timer-string').innerText = "00:00";
    console.log("Tablero reseteado");
}

// Asegúrate de cerrar la última llave del archivo:
console.log("Script cargado correctamente.");
// script.js
function iniciarPartido() {
    // 1. Aquí va lo que quieres que pase
    console.log("¡El partido ha comenzado!");
    
    // 2. Por ejemplo, activar el reloj
    startTimer(); 
    
    // 3. Cambiar el texto del botón si quieres
    document.getElementById('btn-iniciar').innerText = "PARTIDO EN CURSO...";
}