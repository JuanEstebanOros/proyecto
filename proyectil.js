const canvas = document.getElementById("projectileCanvas");
const ctx = canvas.getContext("2d");
const timeDisplay = document.getElementById("projectileTime");
const landingPointDisplay = document.getElementById("landingPoint");

let x = 50;
let y;
let angle;
let velocity;
let mass;
let gravity = 9.8;
let time = 0;
let elapsedTime = 0;
let animationId;
let trajectoryPoints = [];

function startProjectile() {
    // Validar ángulo de lanzamiento
    angle = parseFloat(document.getElementById("launchAngle").value);
    if (angle < 0 || angle > 90) {
        alert("El ángulo debe estar entre 0 y 90 grados.");
        return;
    }
    angle = angle * (Math.PI / 180); // Convertir a radianes

    // Inicializar variables de la simulación
    velocity = parseFloat(document.getElementById("launchSpeed").value);
    mass = parseFloat(document.getElementById("mass").value);
    y = canvas.height - 100;
    x = 50;
    time = 0;
    elapsedTime = 0;
    trajectoryPoints = []; // Reiniciar los puntos de trayectoria
    landingPointDisplay.textContent = "Punto de Caída: -";

    // Limpiar el lienzo y comenzar una nueva trayectoria
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar la cuadrícula y los ejes
    drawGrid();
    drawAxes();

    function drawProjectile() {
        // Calcular la nueva posición del proyectil
        x = 1 + velocity * Math.cos(angle) * time;
        y = canvas.height - (12 + velocity * Math.sin(angle) * time - 0.5 * gravity * time * time);

        // Agregar el nuevo punto a la trayectoria
        trajectoryPoints.push({ x, y, time: elapsedTime });

        // Borrar el lienzo y redibujar la cuadrícula, la trayectoria y los ejes
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGrid();
        drawAxes();

        // Dibujar toda la trayectoria como una parábola
        ctx.beginPath();
        ctx.moveTo(trajectoryPoints[0].x, trajectoryPoints[0].y);
        for (let point of trajectoryPoints) {
            ctx.lineTo(point.x, point.y);
        }
        ctx.strokeStyle = "black"; // Color de la trayectoria
        ctx.lineWidth = 2; // Hacer la línea más gruesa
        ctx.stroke();

        // Dibujar el proyectil como un círculo en la nueva posición
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, Math.PI * 2); // Proyectil con radio de 5
        ctx.fillStyle = "yellow";
        ctx.fill();

        // Detener la animación si el proyectil toca el suelo y mostrar el punto de impacto
        if (y >= canvas.height - 10) {
            cancelAnimationFrame(animationId);
            const impactX = ((trajectoryPoints[trajectoryPoints.length - 1].x - 50) / 10).toFixed(2);
            const impactTime = Math.round(elapsedTime);
            landingPointDisplay.textContent = `Punto de Caída: ${impactX} m, ${impactTime} s`;
            return;
        } else {
            elapsedTime += 0.016; // Aproximadamente 60 FPS
            time += 0.1;
        }

        timeDisplay.textContent = elapsedTime.toFixed(2);

        // Continuar la animación
        animationId = requestAnimationFrame(drawProjectile);
    }

    // Iniciar la animación
    drawProjectile();
}

function drawGrid() {
    const gridSize = 20;
    ctx.strokeStyle = "#e0e0e0";
    ctx.lineWidth = 0.5;
    ctx.font = "10px Arial";
    ctx.fillStyle = "#FFFFFF"; // Cambiar a blanco
    for (let x = gridSize; x < canvas.width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
        if (x % 50 === 0) { // Añadir números cada 100px
            ctx.fillText((x - 50) / 10 + " m", x, canvas.height - 5);
        }
    }
    for (let y = gridSize; y < canvas.height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
        if (y % 100 === 0) { // Añadir números cada 100px
            ctx.fillText((canvas.height - y - 50) / 10 + " s", 5, y); // Cambiar a segundos
        }
    }
}

function drawAxes() {
    // Dibujar eje Y (línea vertical) en x = 50
    ctx.beginPath();
    ctx.moveTo(1, 0);
    ctx.lineTo(1, canvas.height);
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 2;
    ctx.stroke();

    // Dibujar eje X (línea horizontal) en y = canvas.height - 50
    ctx.beginPath();
    ctx.moveTo(1, canvas.height - 4);
    ctx.lineTo(canvas.width, canvas.height - 4);
    ctx.strokeStyle = "#cccccc";
    ctx.lineWidth = 2;
    ctx.stroke();
}

function resetSimulation() {
    // Detener la animación actual
    cancelAnimationFrame(animationId);

    // Reiniciar las variables de tiempo, posición y trayectoria
    x = 50;
    y = canvas.height - 100;
    time = 0;
    elapsedTime = 0;
    trajectoryPoints = []; // Limpiar los puntos de trayectoria
    landingPointDisplay.textContent = "Punto de Caída: -";

    // Limpiar el lienzo, el tiempo en pantalla y redibujar la cuadrícula y los ejes
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    timeDisplay.textContent = "0.00";
    drawGrid();
    drawAxes();
}
