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

// --- FUNCIONES DE REGALOS ---
function actualizarContadorRegalo(nombreRegalo, equipo) {
    const sufijo = equipo === 'Team1' ? 't1' : 't2';
    
    // Identificamos el ID dinámicamente o por nombre
    let idElemento = `rose-text-${sufijo}`; // Ajusta esto según tus IDs en el HTML
    
    const elemento = document.getElementById(idElemento);
    if (elemento) {
        let actual = parseInt(elemento.innerText || 0);
        elemento.innerText = actual + 1;
        
        // Efecto visual
        elemento.parentElement.classList.add('flash');
        setTimeout(() => elemento.parentElement.classList.remove('flash'), 200);
    }
}

function procesarRegalo(data) {
    if (data.event === 'gift') {
        actualizarContadorRegalo(data.giftName, data.team);
    }
}

// --- AQUÍ VA EL RESTO DE TU LÓGICA ---
// (Asegúrate de que aquí abajo estén tus funciones de timer, setActiveMatch, etc.)
// Ejemplo:
// function setActiveMatch(id) { ... }
// function startTimer() { ... }

// --- ASEGÚRATE DE QUE TU SOCKET.ONMESSAGE ESTÉ AQUÍ ---
/*
socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    procesarRegalo(data); 
    // ... el resto de tu lógica de otros eventos
};
*/