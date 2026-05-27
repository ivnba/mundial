// --- CONFIGURACIÓN DE REGALOS AUTOMÁTICA ---
const mapaRegalos = {
    "5655": "assets/regalos/regalo_1_t1.png",
    "9947": "assets/regalos/regalo_10_t1.png",
    "17490": "assets/regalos/regalo_30_t1.png",
    "6968": "assets/regalos/regalo_100_t1.png",
    "11583": "assets/regalos/regalo_500_t1.png", // Nueva línea agregada
    "5269": "assets/regalos/regalo_1_t2.png",
    "8913": "assets/regalos/regalo_10_t2.png",
    "5879": "assets/regalos/regalo_30_ t2.png",
    "6427": "assets/regalos/regalo_100_ t2.png",
    "7168": "assets/regalos/regalo_500_t2.png"
};
const valoresRegalos = {
    "5655": 1, "9947": 10, "17490": 30, "6968": 100, "11583": 500, // Team 1
    "5269": 1, "8913": 10, "5879": 30, "6427": 100, "7168": 500    // Team 2
};

// Función conceptual de cómo TikFinity actualiza
// Necesitas adaptarla a tu escucha de eventos
function actualizarRegalo(nombreRecibido, equipo) {
    const sufijoEquipo = equipo === 'Team1' ? 't1' : 't2';
    const idElemento = `gif-primary-${sufijoEquipo}`;
    const imgElement = document.getElementById(idElemento);
    
    // Obtiene la ruta correcta del mapa
    const rutaImagen = mapaRegalos[nombreRecibido];
    
    if (rutaImagen) {
        // Actualiza la imagen principal
        imgElement.src = rutaImagen;
        
        // (Opcional) Si necesitas la versión t2 para el otro equipo
        if (equipo === 'Team2') {
            imgElement.src = rutaImagen.replace('_t1', '_t2');
        }
    }
}
function actualizarNombresEquipos() {
    // Buscamos el partido que tiene la clase 'active'
    const partidoActivo = document.querySelector('.match-card.active');
    
    // Si no hay partido activo, no hacemos nada
    if (!partidoActivo) return;
    
    // Obtenemos los dos slots de equipos dentro de ese partido
    const slots = partidoActivo.querySelectorAll('.team-slot');
    
    if(slots.length >= 2) {
        // Obtenemos el texto de los slots (el nombre del país)
        // Usamos .innerText para obtener solo el texto y .replace para limpiar espacios extra
        const nombreIzq = slots[0].innerText.trim();
        const nombreDer = slots[1].innerText.trim();
        
        // Actualizamos los títulos de tus botones manuales
        // Asegúrate de que el ID en tu HTML sea 'titulo-izq' y 'titulo-der'
        const elIzq = document.getElementById('titulo-izq');
        const elDer = document.getElementById('titulo-der');
        
        if(elIzq) elIzq.innerText = nombreIzq;
        if(elDer) elDer.innerText = nombreDer;
    }
}
document.addEventListener('click', function(e) {
    // Si haces clic en un elemento que sea un partido o tenga la clase 'match-card'
    if (e.target.closest('.match-card')) {
        setTimeout(actualizarNombresEquipos, 100); // Espera un milisegundo para que el sistema procese el clic
    }
});

function actualizarNombresEquipos() {
    const partidoActivo = document.querySelector('.match-card.active');
    if (!partidoActivo) return;
    
    const slots = partidoActivo.querySelectorAll('.team-slot');
    if(slots.length >= 2) {
        // Obtenemos los nombres y quitamos cualquier bandera que pueda haber ahí
        const nombreIzq = slots[0].innerText.replace('undefined', '').trim();
        const nombreDer = slots[1].innerText.replace('undefined', '').trim();
        
        const elIzq = document.getElementById('titulo-izq');
        const elDer = document.getElementById('titulo-der');
        
        if(elIzq) elIzq.innerText = nombreIzq;
        if(elDer) elDer.innerText = nombreDer;
    }
}
// Conexión única y limpia a TikFinity
const socket = new WebSocket('ws://localhost:21213/');

socket.onopen = () => {
    console.log("¡Conexión establecida con éxito!");
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    // 1. Mostramos todo lo que llega para que siempre puedas ver qué está pasando
    console.log("Evento recibido:", data);

// 2. Lógica para procesar regalos
        if (data.event === "gift") {
            const idRegalo = data.data.giftId.toString();
            console.log("ID recibido:", idRegalo);

            // 1. Verificamos si existe en el mapa
            if (mapaRegalos.hasOwnProperty(idRegalo)) {
                const rutaImagen = mapaRegalos[idRegalo];
                
                // 2. Detección automática de equipo
                const equipo = rutaImagen.includes('_t1') ? 'Team1' : 'Team2';
                
                console.log("Equipo detectado para el regalo:", equipo);

                // 3. Acciones
                actualizarRegalo(idRegalo, equipo);
                sumarPuntos(idRegalo, equipo);
            } else {
                console.warn("El ID de regalo recibido NO está en mapaRegalos:", idRegalo);
            }
        }

    function sumarPuntos(idRegalo, equipo) {
    const puntos = valoresRegalos[idRegalo] || 0;
    const lado = equipo === 'Team1' ? 'l' : 'r';
    
    // Vamos a buscar el elemento de una forma más abierta
    // Buscamos cualquier elemento que tenga 'score-val-' y 'l' o 'r' en su ID
    const selector = `[id*="score-val-${lado}"]`;
    const marcador = document.querySelector(selector);
    
    if (marcador) {
        // Obtenemos el texto y limpiamos todo lo que no sea número
        let texto = marcador.innerText;
        let puntosActuales = parseInt(texto.replace(/[^0-9]/g, '')) || 0;
        
        let nuevoTotal = puntosActuales + puntos;
        marcador.innerText = nuevoTotal;
        
        console.log(`✅ ÉXITO: Sumados ${puntos} al ${lado}. Total: ${nuevoTotal}`);
    } else {
        console.error(`❌ ERROR: No se encontró ningún elemento con ID que contenga 'score-val-${lado}'`);
        // Debug extra: mostramos todos los IDs que existen en la página
        const todosLosIds = Array.from(document.querySelectorAll('[id]')).map(el => el.id);
        console.log("IDs disponibles en tu HTML:", todosLosIds);
    }
}