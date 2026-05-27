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

// Variable global fuera de todo
let tiempoRestante = 0; 

// Espera a que el HTML esté completamente cargado antes de buscar los IDs
document.addEventListener('DOMContentLoaded', () => {
    
    const btnIniciar = document.getElementById('btn-start-clock');
    const display = document.getElementById('timer-string');
    const select = document.getElementById('select-duration');

    // Verificación de seguridad: si alguno no existe, avisa en consola
    if (!btnIniciar) console.error("No encontré el botón 'btn-start-clock'");
    if (!display) console.error("No encontré el ID 'timer-string'");

    btnIniciar.addEventListener('click', () => {
        console.log("Iniciando cronómetro...");

        // 1. Limpia cualquier intervalo anterior para evitar que se aceleren
        if (window.miIntervalo) clearInterval(window.miIntervalo);

        // 2. Obtiene el valor
        let tiempoRestante = parseInt(select.value);

        // 3. Ejecuta el conteo
        window.miIntervalo = setInterval(() => {
            if (tiempoRestante <= 0) {
                clearInterval(window.miIntervalo);
                display.innerText = "00:00";
                alert("¡Tiempo terminado!");
            } else {
                tiempoRestante--;
                let m = Math.floor(tiempoRestante / 60);
                let s = tiempoRestante % 60;
                
                // Actualiza el ID que me indicaste
                display.innerText = `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
            }
        }, 1000);
    });
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