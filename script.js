// --- CONFIGURACIÓN ---
const mapaRegalos = {
    "5655": "t1", "9947": "t1", "17490": "t1", "6968": "t1", "11583": "t1",
    "5269": "t2", "8913": "t2", "5879": "t2", "6427": "t2", "7168": "t2"
};
const valoresRegalos = {
    "5655": 1, "9947": 10, "17490": 30, "6968": 100, "11583": 500,
    "5269": 1, "8913": 10, "5879": 30, "6427": 100, "7168": 500
};

window.puntosL = 0;
window.puntosR = 0;
window.matchActivo = 'match-o1';

// --- SELECCIÓN DE PARTIDO Y ACTUALIZACIÓN DE HUD ---
window.setActiveMatch = function(id) {
    window.matchActivo = id;
    const box = document.getElementById(id);
    
    // 1. Resaltado visual del partido seleccionado
    document.querySelectorAll('.match-box-node').forEach(el => el.classList.remove('active-match'));
    box.classList.add('active-match');

    // 2. Localizar los slots de equipos del partido clicado
    const slots = box.querySelectorAll('.team-slot');
    
    // 3. Obtener las imágenes de los slots (vienen en w20)
    const imgL = slots[0].querySelector('img');
    const imgR = slots[1].querySelector('img');
    
    // --- SOLUCIÓN PARA PIXELEADO ---
    if (imgL && imgR) {
        // Reemplazamos 'w20' por 'w160' en la URL para obtener alta resolución
        const urlAltaResoL = imgL.src.replace('/w20/', '/w160/');
        const urlAltaResoR = imgR.src.replace('/w20/', '/w160/');

        // Asignamos las nuevas URLs de alta resolución a tu HUD (img-hud-l/r)
        document.getElementById('img-hud-l').src = urlAltaResoL;
        document.getElementById('img-hud-r').src = urlAltaResoR;
    }
    // --------------------------------
    
    // 4. Resetear marcadores
    window.puntosL = 0; window.puntosR = 0;
    document.getElementById('score-val-l').innerText = "0";
    document.getElementById('score-val-r').innerText = "0";
    
    console.log("HUD actualizado en ALTA RESOLUCIÓN para: " + id);
};

// --- CLASIFICACIÓN MANUAL (Clic en el equipo) ---
window.clasificarManual = function(partidoId, indice) {
    const box = document.getElementById(partidoId);
    const slots = box.querySelectorAll('.team-slot');
    
    // Si el slot está vacío, no hagas nada
    if (slots[indice].classList.contains('empty')) return;

    const ganadorImg = slots[indice].querySelector('img').src.replace('/w20/', '/w160/');
    const nombreGanador = slots[indice].innerText;

    // --- LÓGICA DE FUEGOS ARTIFICIALES ---
    if (partidoId === 'match-f1') {
        console.log("¡Final detectada! Lanzando confeti...");
        
        // Comprobamos si la función confetti existe
        if (typeof confetti === 'function') {
            confetti({
                particleCount: 200,
                spread: 100,
                origin: { y: 0.6 },
                zIndex: 10000 // Aseguramos que se vea por encima de todo
            });
        } else {
            console.error("La librería confetti no está cargada.");
        }

        const overlay = document.getElementById('winner-overlay');
        document.getElementById('winner-name').innerHTML = `
            <div style="font-size: 0.5em; margin-bottom: 10px;">¡CAMPEÓN DEL TORNEO!</div>
            <img src="${ganadorImg}" style="width: 200px; height: auto; border: 5px solid white; box-shadow: 0 0 20px white;">
            <div style="margin-top: 15px;">${nombreGanador}</div>
        `;
        overlay.style.display = 'flex';
    }

    // --- LÓGICA DE MOVIMIENTO ---
    const nextId = box.getAttribute('data-next');
    const targetSlot = parseInt(box.getAttribute('data-slot'));
    if (nextId && targetSlot) {
        const nextBox = document.getElementById(nextId);
        const nextSlots = nextBox.querySelectorAll('.team-slot');
        nextSlots[targetSlot - 1].innerHTML = slots[indice].innerHTML;
        nextSlots[targetSlot - 1].classList.remove('empty');
    }
};


// --- CRONÓMETRO Y LÓGICA DE WEBSOCKET ---
document.addEventListener('DOMContentLoaded', () => {
    const btnIniciar = document.getElementById('btn-start-clock');
    const display = document.getElementById('timer-string');
    const select = document.getElementById('select-duration');

    btnIniciar.addEventListener('click', () => {
        if (window.miIntervalo) clearInterval(window.miIntervalo);
        let tiempo = parseInt(select.value);

        window.miIntervalo = setInterval(() => {
            if (tiempo <= 0) {
                clearInterval(window.miIntervalo);
                display.innerText = "00:00";
                
                // Al terminar el tiempo, el sistema decide el ganador por puntos
                const box = document.getElementById(window.matchActivo);
                const ganador = (window.puntosL >= window.puntosR) ? 0 : 1;
                window.clasificarManual(window.matchActivo, ganador);
                alert("¡Tiempo terminado! Ganador avanzado.");
            } else {
                tiempo--;
                display.innerText = `${Math.floor(tiempo/60).toString().padStart(2,'0')}:${(tiempo%60).toString().padStart(2,'0')}`;
            }
        }, 1000);
    });

    // Sumar puntos
    window.sumarPuntosManual = (lado, pts) => {
        if (lado === 1) { window.puntosL += pts; document.getElementById('score-val-l').innerText = window.puntosL; }
        else { window.puntosR += pts; document.getElementById('score-val-r').innerText = window.puntosR; }
    };

    // WebSocket
    const socket = new WebSocket('ws://localhost:21213/');
    socket.onmessage = (e) => {
        const d = JSON.parse(e.data);
        if (d.event === "gift" && mapaRegalos[d.data.giftId]) {
            window.sumarPuntosManual(mapaRegalos[d.data.giftId] === "t1" ? 1 : 2, valoresRegalos[d.data.giftId]);
        }
    };
});
function renderizarHistorial() {
    const contenedor = document.getElementById('ranking-container');
    // Limpiamos el contenedor manteniendo solo el título
    contenedor.innerHTML = '<div class="section-title">TOP HISTORICO</div>';
    
    let historial = JSON.parse(localStorage.getItem('torneoHistorial')) || [];
    
    // Si no hay historial, no hacemos nada más
    if (historial.length === 0) return;
    
    // Ordenar y mostrar
    historial.sort((a, b) => b.victorias - a.victorias);
    
    const nodosHTML = historial.map(p => `
        <div class="ranking-node">
            <div class="circle-flag-frame"><img src="${p.bandera}"></div>
            <div class="count-badge">${p.victorias}</div>
        </div>
    `).join('');
    
    // Agregamos los nodos al contenedor
    contenedor.innerHTML += nodosHTML;
}
function registrarVictoria(paisNombre, banderaUrl) {
    let historial = JSON.parse(localStorage.getItem('torneoHistorial')) || [];
    
    let index = historial.findIndex(p => p.nombre === paisNombre);
    
    if (index !== -1) {
        historial[index].victorias += 1;
    } else {
        historial.push({ nombre: paisNombre, bandera: banderaUrl, victorias: 1 });
    }
    
    localStorage.setItem('torneoHistorial', JSON.stringify(historial));
    renderizarHistorial();
}
if (partidoId === 'match-f1') {
    // ... confeti y overlay ...
    
    // Obtenemos el nombre del país (el texto del team-slot sin los espacios)
    const nombreGanador = slots[indice].innerText.trim();
    const banderaGanador = slots[indice].querySelector('img').src;
    
    registrarVictoria(nombreGanador, banderaGanador);
    // ...
}
function borrarHistorico() {
    // 1. Preguntamos al usuario por seguridad
    if (confirm("¿Estás seguro de que quieres borrar todo el historial?")) {
        
        // 2. Eliminamos los datos del navegador
        localStorage.removeItem('torneoHistorial');
        
        // 3. Refrescamos el ranking visualmente
        renderizarHistorial();
        
        console.log("Historial borrado con éxito");
    }
}
// Prueba de botón
window.openSetupModal = function() {
    alert("¡El botón funciona!");
    document.getElementById('setup-modal').style.display = 'flex';
    // ... aquí iría el resto de la lógica que te envié antes
};