// --- CONFIGURACIÓN ---
const mapaRegalos = {
    "5655": "t1", "9947": "t1", "17490": "t1", "6968": "t1", "11583": "t1",
    "5269": "t2", "8913": "t2", "5879": "t2", "6427": "t2", "7168": "t2"
};
const valoresRegalos = {
    "5655": 1, "9947": 10, "17490": 30, "6968": 100, "11583": 500,
    "5269": 1, "8913": 10, "5879": 30, "6427": 100, "7168": 500
};

// --- VARIABLES GLOBALES ---
window.puntosL = 0;
window.puntosR = 0;
window.timerInterval = null;

// --- LÓGICA DEL BOTÓN Y RELOJ ---
document.addEventListener('DOMContentLoaded', () => {
    const btnStart = document.getElementById('btn-start-clock');
    if (btnStart) {
        btnStart.addEventListener('click', function() {
            console.log("Botón iniciado"); // Si ves esto en F12, ya funciona el clic
            clearInterval(window.timerInterval);
            
            let tiempoRestante = parseInt(document.getElementById('select-duration').value);
            
            // Reiniciar HUD
            window.puntosL = 0; window.puntosR = 0;
            document.getElementById('score-val-l').innerText = "0";
            document.getElementById('score-val-r').innerText = "0";

           // ... dentro de tu script.js, en la lógica del botón iniciar ...
window.timerInterval = setInterval(() => {
    tiempoRestante--;
    let min = Math.floor(tiempoRestante / 60).toString().padStart(2, '0');
    let sec = (tiempoRestante % 60).toString().padStart(2, '0');
    document.getElementById('timer-string').innerText = `${min}:${sec}`;

    if (tiempoRestante <= 0) {
        clearInterval(window.timerInterval);
        alert("¡Tiempo terminado! Calculando ganador...");
        
        // AQUÍ ESTÁ EL CAMBIO: Llamamos a la función que ya tienes en index.html
        if (typeof window.parent.avanzarGanadorAutomatico === 'function') {
            window.parent.avanzarGanadorAutomatico();
        } else {
            // Si la función está en el mismo archivo, simplemente llámala:
            avanzarGanadorAutomatico();
        }
    }
}, 1000);
        });
    }
});

// --- LÓGICA DE REGALOS ---
window.sumarPuntosManual = function(lado, puntos) {
    const scoreL = document.getElementById('score-val-l');
    const scoreR = document.getElementById('score-val-r');
    const barra = document.getElementById('energy-bar');

    if (lado === 1) {
        window.puntosL += puntos;
        scoreL.innerText = window.puntosL;
    } else {
        window.puntosR += puntos;
        scoreR.innerText = window.puntosR;
    }

    let total = window.puntosL + window.puntosR;
    if (barra) barra.style.width = total === 0 ? '50%' : (window.puntosL / total * 100) + '%';
};

// --- WEBSOCKET ---
const socket = new WebSocket('ws://localhost:21213/');
socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    if (data.event === "gift") {
        const id = data.data.giftId.toString();
        if (mapaRegalos.hasOwnProperty(id)) {
            window.sumarPuntosManual(mapaRegalos[id] === "t1" ? 1 : 2, valoresRegalos[id]);
        }
    }
};