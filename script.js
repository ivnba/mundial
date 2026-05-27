// 1. Definición de objetos de configuración
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

// 2. Función global para sumar puntos
// Esta debe estar fuera de cualquier otro bloque para que el HTML la vea
window.sumarPuntosManual = function(lado, puntos) {
    console.log("Sumando " + puntos + " al lado " + lado);
    
    // AQUÍ VA TU LÓGICA DE MARCADOR
    // Si usas IDs, asegúrate de que existan en tu HTML
    // Ejemplo:
    // const elemento = document.getElementById(lado === 1 ? 'puntos-izq' : 'puntos-der');
    // elemento.innerText = parseInt(elemento.innerText) + puntos;
};

// 3. Conexión WebSocket
const socket = new WebSocket('ws://localhost:21213/');

socket.onopen = function() {
    console.log("✅ Conexión establecida con TikFinity.");
};

socket.onmessage = function(event) {
    try {
        const data = JSON.parse(event.data);
        console.log("Evento recibido:", data);

        if (data.event === "gift") {
            const idRegalo = data.data.giftId.toString();
            
            if (mapaRegalos.hasOwnProperty(idRegalo)) {
                // Determinamos si es t1 (izq) o t2 (der) basándonos en tu mapa
                const esT1 = mapaRegalos[idRegalo].includes('_t1');
                const equipo = esT1 ? 1 : 2; // 1 para izquierdo, 2 para derecho
                const puntos = valoresRegalos[idRegalo] || 0;
                
                // Ejecutamos la función global
                window.sumarPuntosManual(equipo, puntos);
            }
        }
    } catch (e) {
        console.error("Error al procesar mensaje:", e);
    }
};

socket.onclose = function() {
    console.warn("⚠️ Conexión cerrada. Reintentando...");
    setTimeout(() => { location.reload(); }, 5000); // Recarga para reconectar
};