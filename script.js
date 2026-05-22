let puntosL = 0, puntosR = 0;
let activeMatchId = "match-o1";
let timerInterval = null;

// --- FUNCIONES DE CONTROL ---

function iniciarPartido() {
    console.log("Iniciando batalla...");
    clearInterval(timerInterval);
    let duracion = parseInt(document.getElementById('select-duration').value);
    
    timerInterval = setInterval(() => {
        duracion--;
        let min = Math.floor(duracion / 60).toString().padStart(2, '0');
        let sec = (duracion % 60).toString().padStart(2, '0');
        document.getElementById('timer-string').innerText = `${min}:${sec}`;

        if (duracion <= 0) {
            clearInterval(timerInterval);
            alert("¡Tiempo terminado!");
        }
    }, 1000);
}

function sumarPuntos(lado, cant) {
    if (lado === 'izq') {
        puntosL += cant;
        document.getElementById('score-val-l').innerText = puntosL;
    } else {
        puntosR += cant;
        document.getElementById('score-val-r').innerText = puntosR;
    }
    
    // Calcular barra
    let total = puntosL + puntosR;
    let porcentaje = total === 0 ? 50 : (puntosL / total * 100);
    document.getElementById('energy-bar').style.width = porcentaje + '%';
}

function setActiveMatch(id) {
    activeMatchId = id;
    document.querySelectorAll('.match-box-node').forEach(el => el.classList.remove('active-match'));
    document.getElementById(id).classList.add('active-match');
}

function openSetupModal() {
    document.getElementById('modal-setup').classList.add('open');
}

function resetTableroCompleto() {
    puntosL = 0; puntosR = 0;
    document.getElementById('score-val-l').innerText = "0";
    document.getElementById('score-val-r').innerText = "0";
    document.getElementById('timer-string').innerText = "00:00";
    clearInterval(timerInterval);
}