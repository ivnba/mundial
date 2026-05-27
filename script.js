// script.js
const mapaRegalos = {
    "5655": "t1", "9947": "t1", "17490": "t1", "6968": "t1", "11583": "t1",
    "5269": "t2", "8913": "t2", "5879": "t2", "6427": "t2", "7168": "t2"
};

const valoresRegalos = {
    "5655": 1, "9947": 10, "17490": 30, "6968": 100, "11583": 500,
    "5269": 1, "8913": 10, "5879": 30, "6427": 100, "7168": 500
};

// WebSocket
const socket = new WebSocket('ws://localhost:21213/');

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    
    // Filtramos solo eventos de regalos
    if (data.event === "gift") {
        const giftId = data.data.giftId.toString();
        
        if (mapaRegalos.hasOwnProperty(giftId)) {
            const lado = mapaRegalos[giftId]; // "t1" o "t2"
            const puntos = valoresRegalos[giftId];
            actualizarMarcador(lado, puntos);
        }
    }
};

function actualizarMarcador(lado, puntos) {
    // Obtenemos los elementos del DOM de index.html
    const scoreElement = document.getElementById(lado === "t1" ? 'score-val-l' : 'score-val-r');
    
    // Actualizamos variables globales (asegúrate que existan en el scope global del index)
    if (lado === "t1") {
        window.puntosL += puntos;
        scoreElement.innerText = window.puntosL;
    } else {
        window.puntosR += puntos;
        scoreElement.innerText = window.puntosR;
    }
    
    // Actualizar barra de energía
    const total = window.puntosL + window.puntosR;
    const barra = document.getElementById('energy-bar');
    barra.style.width = (window.puntosL / total * 100) + '%';
}