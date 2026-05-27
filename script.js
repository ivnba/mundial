const mapaRegalos = {
    "5655": "t1", "9947": "t1", "17490": "t1", "6968": "t1", "11583": "t1",
    "5269": "t2", "8913": "t2", "5879": "t2", "6427": "t2", "7168": "t2"
};

const valoresRegalos = {
    "5655": 1, "9947": 10, "17490": 30, "6968": 100, "11583": 500,
    "5269": 1, "8913": 10, "5879": 30, "6427": 100, "7168": 500
};

const socket = new WebSocket('ws://localhost:21213/');

socket.onmessage = function(event) {
    try {
        const data = JSON.parse(event.data);
        if (data.event === "gift") {
            const giftId = data.data.giftId.toString();
            if (mapaRegalos.hasOwnProperty(giftId)) {
                actualizarMarcador(mapaRegalos[giftId], valoresRegalos[giftId]);
            }
        }
    } catch (e) { console.error(e); }
};

function actualizarMarcador(lado, puntos) {
    const scoreId = lado === "t1" ? 'score-val-l' : 'score-val-r';
    const scoreElement = document.getElementById(scoreId);
    
    if (lado === "t1") {
        window.puntosL = (window.puntosL || 0) + puntos;
        scoreElement.innerText = window.puntosL;
    } else {
        window.puntosR = (window.puntosR || 0) + puntos;
        scoreElement.innerText = window.puntosR;
    }
    
    const total = (window.puntosL || 0) + (window.puntosR || 0);
    const barra = document.getElementById('energy-bar');
    if (total > 0) barra.style.width = ((window.puntosL || 0) / total * 100) + '%';
}