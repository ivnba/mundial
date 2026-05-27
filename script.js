// --- CONFIGURACIÓN DE REGALOS ---
const mapaRegalos = {
    "5655": "assets/regalos/regalo_1_t1.png",
    "9947": "assets/regalos/regalo_10_t1.png",
    "17490": "assets/regalos/regalo_30_t1.png",
    "6968": "assets/regalos/regalo_100_t1.png",
    "11583": "assets/regalos/regalo_500_t1.png",
    "5269": "assets/regalos/regalo_1_t2.png",
    "8913": "assets/regalos/regalo_10_t2.png",
    "5879": "assets/regalos/regalo_30_t2.png",
    "6427": "assets/regalos/regalo_100_t2.png",
    "7168": "assets/regalos/regalo_500_t2.png"
};

const valoresRegalos = {
    "5655": 1, "9947": 10, "17490": 30, "6968": 100, "11583": 500,
    "5269": 1, "8913": 10, "5879": 30, "6427": 100, "7168": 500
};

// --- CONEXIÓN A TIKFINITY ---
document.addEventListener("DOMContentLoaded", function() {
    const socket = new WebSocket('ws://localhost:21213/');

    socket.onopen = function() {
        console.log("✅ Conexión establecida.");
    };

    socket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        if (data.event === "gift") {
            const idRegalo = data.data.giftId.toString();
            if (mapaRegalos.hasOwnProperty(idRegalo)) {
                const equipo = mapaRegalos[idRegalo].includes('_t1') ? 'Team1' : 'Team2';
                setTimeout(() => sumarPuntos(idRegalo, equipo), 100);
            }
        }
    };

    socket.onerror = function(e) { console.error("Error en WebSocket:", e); };
});

// --- LÓGICA DE SUMA ---
function sumarPuntos(idRegalo, equipo) {
    const puntos = valoresRegalos[idRegalo] || 0;
    const lado = equipo === 'Team1' ? 1 : 2;
    
    if (typeof window.sumarPuntosManual !== 'undefined') {
        sumarPuntosManual(lado, puntos);
    } else {
        console.warn("La función sumarPuntosManual aún no está disponible.");
    }
}