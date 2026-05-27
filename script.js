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
    // ... dentro de tu setInterval en script.js
if (tiempoRestante <= 0) {
    clearInterval(window.timerInterval);
    
    // AQUÍ ESTÁ EL CAMBIO:
    // Asegúrate de que window.matchActivo exista. 
    // Si no está definido, el código no sabrá qué partido terminó.
    if (window.matchActivo) {
        window.avanzarGanadorAutomatico(); 
    } else {
        console.warn("No se ha definido qué partido terminó (matchActivo es nulo)");
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
// --- FUNCIÓN PARA AVANZAR AL GANADOR ---
window.avanzarGanadorAutomatico = function() {
    // 1. Obtenemos el ID del partido que se jugó
    const idPartidoActual = window.matchActivo; // Asegúrate de definir esta variable al iniciar
    const partidoActual = document.getElementById(idPartidoActual);
    
    if (!partidoActual) {
        console.error("No se encontró el partido activo.");
        return;
    }

    const slots = partidoActual.querySelectorAll('.team-slot');
    
    // 2. Determinamos quién ganó comparando los puntos globales que ya tienes en el script
    const ganadorIdx = (window.puntosL > window.puntosR) ? 0 : 1;
    const ganadorCode = slots[ganadorIdx].getAttribute('data-code');
    const ganadorHTML = slots[ganadorIdx].innerHTML;

    // 3. Leemos el 'data-next' del HTML (el destino del ganador)
    const siguienteId = partidoActual.getAttribute('data-next');
    
    if (siguienteId) {
        const sigPartido = document.getElementById(siguienteId);
        const sigSlots = sigPartido.querySelectorAll('.team-slot');
        
        // Buscamos el primer lugar vacío en el siguiente partido
        for (let slot of sigSlots) {
            if (!slot.getAttribute('data-code')) {
                slot.setAttribute('data-code', ganadorCode);
                slot.innerHTML = ganadorHTML;
                break;
            }
        }
        console.log("Ganador avanzado a " + siguienteId + ": " + ganadorCode);
    } else {
        console.log("Este partido no tiene un 'data-next' definido.");
    }
    
    // 4. Resetear marcadores
    window.puntosL = 0;
    window.puntosR = 0;
    document.getElementById('score-val-l').innerText = "0";
    document.getElementById('score-val-r').innerText = "0";
};