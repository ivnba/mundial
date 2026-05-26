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
const socket = new WebSocket('ws://localhost:8080'); 

socket.onmessage = function(event) {
    const data = JSON.parse(event.data);
    console.log("Datos recibidos de TikFinity:", data); // Esto es para ver qué llega

    if (data.type === 'gift') {
        // TikFinity envía el nombre del regalo y el usuario
        const regalo = data.giftName; 
        const puntos = data.diamondCount || 30; // Si no trae puntos, le damos 30 por defecto
        
        // Aquí le decimos que los regalos siempre suman al "Team1" 
        // (luego veremos cómo diferenciar si es izq o der)
        sumarPuntosManual(1, puntos);
        }
        // Intentar conectar al servidor de TikFinity
const socket = new WebSocket('ws://localhost:21213/');

socket.onopen = () => {
    console.log("Conectado a TikFinity con éxito");
};

socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    
    // Aquí es donde recibes los eventos (Regalos, likes, etc.)
    console.log("Evento recibido:", data);

    // Ejemplo: Si el evento es un regalo
    if (data.event === "gift") {
        // Aquí llamas a tu función para sumar puntos o goles
        // Ejemplo: sumarGol(data.data.giftName);
    }
};

socket.onclose = () => {
    console.log("Desconectado de TikFinity. Reintentando en 5 segundos...");
    setTimeout(() => location.reload(), 5000); // Recarga para reintentar
};
console.log("Intentando conectar con TikFinity...");

const socket = new WebSocket('ws://localhost:21213/');

socket.onopen = function(e) {
  console.log("¡Conexión establecida con éxito!");
};

socket.onmessage = function(event) {
  console.log("Datos recibidos:", event.data);
};

socket.onerror = function(error) {
  console.log("Error de conexión:", error);
};