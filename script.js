// --- CONFIGURACIÓN ---
const mapaRegalos = {
    "5655": "t1", "9947": "t1", "17490": "t1", "6968": "t1", "11583": "t1",
    "5269": "t2", "8913": "t2", "5879": "t2", "6427": "t2", "7168": "t2"
};

const valoresRegalos = {
    "5655": 1, "9947": 10, "17490": 30, "6968": 100, "11583": 500,
    "5269": 1, "8913": 10, "5879": 30, "6427": 100, "7168": 500
};

// Variables de estado
window.juegoActivo = false;
window.puntosL = 0;
window.puntosR = 0;
window.timerInterval = null;

// --- LÓGICA DEL BOTÓN INICIAR ---
document.getElementById('btn-start-clock').addEventListener('click', function() {
    window.puntosL = 0;
    window.puntosR = 0;
    document.getElementById('score-val-l').innerText = "0";
    document.getElementById('score-val-r').innerText = "0";
    document.getElementById('energy-bar').style.width = '50%';
    
    window.juegoActivo = true; 
    
    clearInterval(window.timerInterval);
    let tiempoRestante = parseInt(document.getElementById('select-duration').value);
    
    window.timerInterval = setInterval(() => {
        tiempoRestante--;
        let min = Math.floor(tiempoRestante / 60).toString().padStart(2, '0');
        let sec = (tiempoRestante % 60).toString().padStart(2, '0');
        document.getElementById('timer-string').innerText = `${min}:${sec}`;

        if (tiempoRestante <= 0) {
            clearInterval(window.timerInterval);
            window.juegoActivo = false;
            alert("⏰ ¡Tiempo terminado! Ganador: " + (window.puntosL > window.puntosR ? "Izquierda" : "Derecha"));
        }
    }, 1000);
});

// --- RECEPTOR DE REGALOS ---
const socket = new WebSocket('ws://localhost:21213/');

socket.onmessage = function(event) {
    try {
        const data = JSON.parse(event.data);
        if (data.event === "gift" && window.juegoActivo) { // Solo suma si juegoActivo es true
            const giftId = data.data.giftId.toString();
            if (mapaRegalos.hasOwnProperty(giftId)) {
                sumarPuntosManual(mapaRegalos[giftId] === "t1" ? 1 : 2, valoresRegalos[giftId]);
            }
        }
    } catch (e) { console.error("Error:", e); }
};

window.sumarPuntosManual = function(lado, puntos) {
    if (lado === 1) {
        window.puntosL += puntos;
        document.getElementById('score-val-l').innerText = window.puntosL;
    } else {
        window.puntosR += puntos;
        document.getElementById('score-val-r').innerText = window.puntosR;
    }
    const total = window.puntosL + window.puntosR;
    const barra = document.getElementById('energy-bar');
    if (total > 0) barra.style.width = (window.puntosL / total * 100) + '%';
};