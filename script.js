// --- CONFIGURACIÓN ---
const mapaRegalos = {
    "5655": "t1", "9947": "t1", "17490": "t1", "6968": "t1", "11583": "t1",
    "5269": "t2", "8913": "t2", "5879": "t2", "6427": "t2", "7168": "t2"
};
const valoresRegalos = {
    "5655": 1, "9947": 10, "17490": 30, "6968": 100, "11583": 500,
    "5269": 1, "8913": 10, "5879": 30, "6427": 100, "7168": 500
};

window.puntosL = 0;
window.puntosR = 0;
window.matchActivo = 'match-o1'; 

// 1. DECLARA ESTA VARIABLE FUERA DEL EVENTO
let tiempoRestante = 0; 

document.addEventListener('DOMContentLoaded', () => {
    const btnStart = document.getElementById('btn-start-clock');

    if (btnStart) {
        btnStart.addEventListener('click', function() {
            console.log("Botón iniciado");
            clearInterval(window.timerInterval);

            // 2. ASIGNA EL VALOR A LA VARIABLE GLOBAL
            tiempoRestante = parseInt(document.getElementById('select-duration').value);

            window.puntosL = 0; 
            window.puntosR = 0;
            document.getElementById('score-val-l').innerText = "0";
            document.getElementById('score-val-r').innerText = "0";

            // 3. INICIA EL INTERVALO
            window.timerInterval = setInterval(() => {
                // ... dentro de tu setInterval ...
tiempoRestante--;

// CALCULA MINUTOS Y SEGUNDOS
let mins = Math.floor(tiempoRestante / 60);
let secs = tiempoRestante % 60;

// AQUÍ ESTÁ LA CORRECCIÓN: usamos 'timer-string' en lugar de 'timer-display'
// Y le hemos quitado los // para que se ejecute
document.getElementById('timer-string').innerText = `${mins}:${secs.toString().padStart(2, '0')}`;

console.log("Tiempo restante:", tiempoRestante);
                // -----------------------------------------------------

                if (tiempoRestante <= 0) {
                    clearInterval(window.timerInterval);
                    if (window.matchActivo) {
                        let ganador = (window.puntosL > window.puntosR) ? "EQUIPO L" : "EQUIPO R";
                        avanzarGanador(window.matchActivo, ganador);
                    } else {
                        console.warn("No se ha definido qué partido terminó");
                    }
                }
            }, 1000);
        });
    }
});

    // --- LÓGICA DE REGALOS ---
    window.sumarPuntosManual = function(lado, puntos) {
        if (lado === 1) {
            window.puntosL += puntos;
            document.getElementById('score-val-l').innerText = window.puntosL;
        } else {
            window.puntosR += puntos;
            document.getElementById('score-val-r').innerText = window.puntosR;
        }
    };

    // --- WEBSOCKET ---
    const socket = new WebSocket('ws://localhost:21213/');
    socket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        if (data.event === "gift") {
            const id = data.data.giftId.toString();
            if (mapaRegalos.hasOwnProperty(id)) {
                const lado = (mapaRegalos[id] === "t1" ? 1 : 2);
                window.sumarPuntosManual(lado, valoresRegalos[id]);
            }
        }
    };
}); // Cierra el DOMContentLoaded correctamente

// --- FUNCIÓN DE AVANCE (Fuera del evento para ser global) ---
function avanzarGanador(matchActualID, equipoGanador) {
    const matchActual = document.getElementById(matchActualID);
    if (!matchActual) return;
    
    const siguienteMatchID = matchActual.getAttribute('data-next');
    
    if (siguienteMatchID && siguienteMatchID !== 'final') {
        const siguienteMatch = document.getElementById(siguienteMatchID);
        const slotsVacios = siguienteMatch.querySelectorAll('.team-slot.empty');
        
        if (slotsVacios.length > 0) {
            slotsVacios[0].innerText = equipoGanador;
            slotsVacios[0].classList.remove('empty');
            console.log("Ganador avanzado a:", siguienteMatchID);
        }
    }
}