// --- CONFIGURACIÓN ---
const mapaRegalos = {
    "5655": "t1", "9947": "t1", "17490": "t1", "6968": "t1", "11583": "t1",
    "5269": "t2", "8913": "t2", "5879": "t2", "6427": "t2", "7168": "t2"
};
const valoresRegalos = {
    "5655": 1, "9947": 10, "17490": 30, "6968": 100, "11583": 500,
    "5269": 1, "8913": 10, "5879": 30, "6427": 100, "7168": 500
};

// Al inicio de tu script.js
window.puntosL = 0;
window.puntosR = 0;

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
    // ... dentro de tu setInterval en script.js ...
if (tiempoRestante <= 0) {
    clearInterval(window.timerInterval);
    alert("¡Tiempo terminado! Calculando ganador...");

    // Usamos 'window' para acceder a la función que está en index.html
    if (typeof window.avanzarGanadorAutomatico === 'function') {
        window.avanzarGanadorAutomatico();
    } else {
        console.error("No se encuentra la función avanzarGanadorAutomatico");
    }
}
        });
    }
});

// --- LÓGICA DE REGALOS ---
window.sumarPuntosManual = function(lado, puntos) {
    if (lado === "t1") {
        window.puntosL = (window.puntosL || 0) + puntos;
        document.getElementById('score-val-l').innerText = window.puntosL;
    } else {
        window.puntosR = (window.puntosR || 0) + puntos;
        document.getElementById('score-val-r').innerText = window.puntosR;
    }
    // ... resto del código de la barra ...
};
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