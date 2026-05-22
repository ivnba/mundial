// --- CONFIGURACIÓN DE REGALOS AUTOMÁTICA ---
const mapaRegalos = {
    "Rosa": "img/regalo_1_t1.png", // Asegúrate de que el nombre coincida con lo que envía TikFinity
    "Capibara": "img/regalo_10_t1.png",
    "Hat": "img/regalo_30_t1.png",
    "Perfume": "img/regalo_100_t1.png",
    "AnimalMascot": "img/regalo_500_t1.png",
    "MoneyBag": "img/regalo_1000_t1.png",
    "MoneyBagLarge": "img/regalo_5000_t1.png"
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
// Función para incrementar contadores
function actualizarContadorRegalo(nombreRegalo, equipo) {
    const sufijo = equipo === 'Team1' ? 't1' : 't2';
    
    // Identificamos el ID según el regalo (ejemplo: 'rose' o 'capy')
    let idElemento = "";
    if (nombreRegalo === "Rosa") idElemento = `rose-text-${sufijo}`;
    else if (nombreRegalo === "Capibara") idElemento = `capy-text-${sufijo}`;

    if (idElemento) {
        const elementoTexto = document.getElementById(idElemento);
        let actual = parseInt(elementoTexto.innerText);
        elementoTexto.innerText = actual + 1;
        
        // Efecto visual de flash al recibir regalo
        elementoTexto.parentElement.classList.add('flash');
        setTimeout(() => elementoTexto.parentElement.classList.remove('flash'), 200);
    }
}
// Asegúrate de que esta función sea llamada dentro de tu socket.onmessage
function procesarRegalo(data) {
    if (data.event === 'gift') {
        const nombre = data.giftName;
        const equipo = data.team; // Asegúrate de que TikFinity te pase 'Team1' o 'Team2'
        
        // Aquí actualizas los contadores
        actualizarContadorRegalo(nombre, equipo);
    }
}

// Esta es la función que te di antes, asegúrate de que esté cerrada correctamente
function actualizarContadorRegalo(nombreRegalo, equipo) {
    const sufijo = equipo === 'Team1' ? 't1' : 't2';
    const idElemento = `rose-text-${sufijo}`; 
    
    const elemento = document.getElementById(idElemento);
    if (elemento) {
        let actual = parseInt(elemento.innerText || 0);
        elemento.innerText = actual + 1;
    }
}
// VARIABLES GLOBALES (Al principio del archivo)
let timerInterval; 
let puntosL = 0;
let puntosR = 0;

// ... el resto de tus funciones ...