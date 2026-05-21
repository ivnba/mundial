<script>
        // ... (mantén las variables globales y funciones previas de setup igual) ...

        // LÓGICA DE CLIC DERECHO E IZQUIERDO EN EL TABLERO
        document.querySelector('.canvas-blueprint-bg').addEventListener('contextmenu', function(e) {
            e.preventDefault(); // Bloquear menú contextual
            const slot = e.target.closest('.team-slot');
            const matchBox = e.target.closest('.match-box-node');
            if (!slot || !matchBox || slot.classList.contains('empty')) return;

            // Lógica: Avanzar ganador (Clic Derecho)
            const nextMatchId = matchBox.getAttribute('data-next');
            if (nextMatchId && nextMatchId !== "podium") {
                const targetSlotIndex = parseInt(matchBox.getAttribute('data-slot')) - 1;
                const nextBox = document.getElementById(nextMatchId);
                const nextSlots = nextBox.querySelectorAll('.team-slot');
                
                const codeG = slot.getAttribute('data-code');
                const textG = slot.innerText;

                nextSlots[targetSlotIndex].classList.remove('empty');
                nextSlots[targetSlotIndex].setAttribute('data-code', codeG);
                nextSlots[targetSlotIndex].innerHTML = `<img class="mini-flag-icon" src="https://flagcdn.com/w20/${codeG}.png"> ${textG}`;
                
                // Efecto visual rápido
                matchBox.style.opacity = "0.5";
                setTimeout(() => matchBox.style.opacity = "1", 200);
            }
        });

        document.querySelector('.canvas-blueprint-bg').addEventListener('click', function(e) {
            const slot = e.target.closest('.team-slot');
            const matchBox = e.target.closest('.match-box-node');
            
            if (!slot || !matchBox) return;

            // Lógica: Retroceder/Limpiar (Clic Izquierdo)
            // Solo permitimos borrar si NO es un partido de Octavos (los originales)
            if (!matchBox.id.startsWith('match-o')) {
                slot.classList.add('empty');
                slot.removeAttribute('data-code');
                slot.innerText = "...";
            } else {
                // Si es un octavo, solo seleccionamos el partido para jugar (funcionalidad anterior)
                setActiveMatch(matchBox.id);
            }
        });

        // --- MANTÉN EL RESTO DE TUS FUNCIONES (reset, setupModal, etc.) ---
        
        function setActiveMatch(id) {
            document.querySelectorAll('.match-box-node').forEach(el => el.classList.remove('active-match'));
            const box = document.getElementById(id);
            box.classList.add('active-match');
            activeMatchId = id;

            const slots = box.querySelectorAll('.team-slot');
            const codeL = slots[0].getAttribute('data-code');
            const codeR = slots[1].getAttribute('data-code');
            
            document.getElementById('img-hud-l').src = codeL ? `https://flagcdn.com/w160/${codeL}.png` : '';
            document.getElementById('img-hud-r').src = codeR ? `https://flagcdn.com/w160/${codeR}.png` : '';
            
            puntosL = 0; puntosR = 0;
            document.getElementById('score-val-l').innerText = 0;
            document.getElementById('score-val-r').innerText = 0;
        }

        // ... (resto de funciones)
    </script>