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
}
function actualizarNombresEquipos() {
    // Buscamos el partido activo (el que tiene la clase 'active' o el que tengas seleccionado)
    // Ajusta '.team-slot' según tu estructura real
    const partidoActivo = document.querySelector('.match-card.active') || document.getElementById('match-o1');
    const slots = partidoActivo.querySelectorAll('.team-slot');
    
    if(slots.length >= 2) {
        // Obtenemos los nombres (ejemplo: quitando el formato HTML de la bandera)
        const nombreIzq = slots[0].innerText;
        const nombreDer = slots[1].innerText;
        
        // Actualizamos los títulos de tus botones
        document.getElementById('titulo-izq').innerText = nombreIzq;
        document.getElementById('titulo-der').innerText = nombreDer;
    }
}