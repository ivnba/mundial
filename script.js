const mapaRegalos = {
    "5655": "t1", "9947": "t1", "17490": "t1", "6968": "t1", "11583": "t1",
    "5269": "t2", "8913": "t2", "5879": "t2", "6427": "t2", "7168": "t2"
};

const valoresRegalos = {
    "5655": 1, "9947": 10, "17490": 30, "6968": 100, "11583": 500,
    "5269": 1, "8913": 10, "5879": 30, "6427": 100, "7168": 500
};

// Función para sumar puntos y actualizar el HUD
window.sumarPuntosManual = function(lado, puntos) {
    const scoreL = document.getElementById('score-val-l');
    const scoreR = document.getElementById('score-val-r');
    const barra = document.getElementById('energy-bar');

    if (lado === 1) {
        puntosL += puntos;
        scoreL.innerText = puntosL;
    } else {
        puntosR += puntos;
        scoreR.innerText = puntosR;
    }

    let total = puntosL + puntosR;
    barra.style.width = total === 0 ? '50%' : (puntosL / total * 100) + '%';
};

// WebSocket
const socket = new WebSocket('ws://localhost:21213/');
socket.onmessage = function(event) {
    try {
        const data = JSON.parse(event.data);
        if (data.event === "gift") {
            const idRegalo = data.data.giftId.toString();
            if (mapaRegalos.hasOwnProperty(idRegalo)) {
                const equipo = mapaRegalos[idRegalo] === "t1" ? 1 : 2;
                window.sumarPuntosManual(equipo, valoresRegalos[idRegalo]);
            }
        }
    } catch (e) { console.error(e); }
};