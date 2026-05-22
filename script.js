// --- VARIABLES GLOBALES DE ESTADO ---
let puntosL = 0, puntosR = 0;
let activeMatchId = "match-o1";
let timerInterval = null, tiempoRestante = 60;
let seleccionadosGlobales = [];

// Base de Datos de Países completa con las banderas de tu imagen
const poolPaises = [
    {code:"ar", name:"Argentina"}, {code:"co", name:"Colombia"}, {code:"pe", name:"Perú"},
    {code:"ve", name:"Venezuela"}, {code:"mx", name:"México"}, {code:"es", name:"España"},
    {code:"cl", name:"Chile"}, {code:"ec", name:"Ecuador"}, {code:"br", name:"Brasil"},
    {code:"uy", name:"Uruguay"}, {code:"py", name:"Paraguay"}, {code:"bo", name:"Bolivia"},
    {code:"cr", name:"Costa Rica"}, {code:"pa", name:"Panamá"}, {code:"hn", name:"Honduras"},
    {code:"us", name:"USA"}, {code:"sv", name:"El Salvador"}, {code:"gt", name:"Guatemala"},
    {code:"ni", name:"Nicaragua"}, {code:"do", name:"R. Dominicana"}, {code:"cu", name:"Cuba"},
    {code:"pr", name:"Puerto Rico"}, {code:"gq", name:"Guinea Ecu."}, {code:"it", name:"Italia"},
    {code:"fr", name:"Francia"}, {code:"de", name:"Alemania"}, {code:"jp", name:"Japón"}
];

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