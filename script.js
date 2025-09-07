window.addEventListener('load', function() {
    const btnFlyer1 = document.getElementById('btn-flyer1');
    const btnFlyer2 = document.getElementById('btn-flyer2');
    const btnFlyer3 = document.getElementById('btn-flyer3');
    const contentFlyer1 = document.getElementById('flyer1-content');
    const contentFlyer2 = document.getElementById('flyer2-content');
    const contentFlyer3 = document.getElementById('flyer3-content');
    const downloadButton = document.getElementById('download-btn');
    
    let activeFlyer = 1;

    function showFlyer(flyerNumber) {
        [contentFlyer1, contentFlyer2, contentFlyer3].forEach(el => el.classList.add('hidden'));
        [btnFlyer1, btnFlyer2, btnFlyer3].forEach(el => el.classList.remove('active'));
        if (flyerNumber === 1) { contentFlyer1.classList.remove('hidden'); btnFlyer1.classList.add('active'); } 
        else if (flyerNumber === 2) { contentFlyer2.classList.remove('hidden'); btnFlyer2.classList.add('active'); } 
        else if (flyerNumber === 3) { contentFlyer3.classList.remove('hidden'); btnFlyer3.classList.add('active'); }
        activeFlyer = flyerNumber;
    }

    btnFlyer1.addEventListener('click', () => showFlyer(1));
    btnFlyer2.addEventListener('click', () => showFlyer(2));
    btnFlyer3.addEventListener('click', () => showFlyer(3));

    // --- LÓGICA DE DESCARGA GIF 100% CORREGIDA ---
    downloadButton.addEventListener('click', function() {
        if (typeof html2canvas === 'undefined' || typeof GIF === 'undefined') {
            alert('Error: No se pudieron cargar las librerías de captura.');
            return;
        }

        const captureArea = document.getElementById('capture-area');
        downloadButton.disabled = true;

        const gif = new GIF({
            workers: 2,
            quality: 10,
            width: captureArea.offsetWidth * 1.5,
            height: captureArea.offsetHeight * 1.5,
            workerScript: 'gif.worker.js' // Usando el worker local y corregido
        });

        const framesToCapture = 30;
        const frameDelay = 100; // 3 segundos de animación
        let capturedFrames = 0;

        const captureFrame = () => {
            downloadButton.textContent = `Capturando... (${Math.round((capturedFrames / framesToCapture) * 100)}%)`;
            
            // ¡OPTIMIZACIÓN APLICADA! Añadimos willReadFrequently
            html2canvas(captureArea, { 
                useCORS: true, 
                scale: 1.5, 
                logging: false,
                canvas: document.createElement('canvas'),
                contextOptions: {
                    willReadFrequently: true 
                }
            }).then(canvas => {
                gif.addFrame(canvas, { delay: frameDelay });
                capturedFrames++;

                if (capturedFrames < framesToCapture) {
                    // Esperamos un momento antes de la siguiente captura
                    setTimeout(captureFrame, 10);
                } else {
                    downloadButton.textContent = 'Procesando GIF...';
                    gif.render();
                }
            }).catch(error => {
                alert("Error al capturar. La operación ha sido cancelada.");
                console.error(error);
                downloadButton.textContent = 'Descargar Flyer (GIF)';
                downloadButton.disabled = false;
            });
        };
        
        captureFrame();

        gif.on('finished', function(blob) {
            let fileName = 'flyer-animado.gif';
            if (activeFlyer === 1) fileName = 'flyer-combos.gif';
            if (activeFlyer === 2) fileName = 'flyer-sorteo.gif';
            if (activeFlyer === 3) fileName = 'flyer-servicios.gif';

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            downloadButton.textContent = '¡Descargado!';
            setTimeout(() => {
                downloadButton.textContent = 'Descargar Flyer (GIF)';
                downloadButton.disabled = false;
            }, 2000);
        });
    });
});