const canvas = document.getElementById("pendulumCanvas");
const ctx = canvas.getContext("2d");
const timeDisplay = document.getElementById("pendulumTime");

let angle;
let angleVelocity = 0.0;
let angleAcceleration = 0.0;
let gravity = 9.8;
let length = 200; // Longitud inicial en píxeles
let startTime;
let pendulumStopped = false;
let animationId;

function startPendulum() {
    const mass = parseFloat(document.getElementById("mass").value);
    angle = parseFloat(document.getElementById("angle").value) * (Math.PI / 180);
    gravity = parseFloat(document.getElementById("gravity").value);
    length = parseFloat(document.getElementById("length").value) * 100; // Convertir metros a píxeles
    angleVelocity = 0.0;
    pendulumStopped = false;
    startTime = Date.now(); // Reiniciar el momento de inicio de la simulación
    animatePendulum();
}

function animatePendulum() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const originX = canvas.width / 2;
    const originY = 50;
    const ballX = originX + length * Math.sin(angle);
    const ballY = originY + length * Math.cos(angle);

    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(ballX, ballY);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(ballX, ballY, 20, 0, Math.PI * 2);
    ctx.fillStyle = "#ffd700";
    ctx.fill();
    ctx.stroke();

    if (!pendulumStopped) {
        angleAcceleration = (-gravity / length) * Math.sin(angle);
        angleVelocity += angleAcceleration;
        angleVelocity *= 0.99; // Atenuar la velocidad para estabilizarse
        angle += angleVelocity;

        // Detener el péndulo cuando esté cerca de la posición vertical
        if (Math.abs(angle) < 0.01 && Math.abs(angleVelocity) < 0.01) {
            angleVelocity = 0;
            angle = 0;
            pendulumStopped = true; // Marcar el péndulo como detenido
        }

        // Calcular el tiempo transcurrido desde el inicio
        const currentTime = Date.now();
        const elapsedTime = (currentTime - startTime) / 1000; // Convertir a segundos
        timeDisplay.textContent = ` ${elapsedTime.toFixed(2)} `;
    }

    // Almacenar el id de la animación para poder cancelarla
    animationId = requestAnimationFrame(animatePendulum);
}

function resetSimulation() {
    // Detener la animación actual
    cancelAnimationFrame(animationId);

    // Restablecer ángulo, velocidad y tiempo
    angle = parseFloat(document.getElementById("angle").value) * (Math.PI / 180);
    angleVelocity = 0.0;
    angleAcceleration = 0.0;
    pendulumStopped = false;
    
    // Reiniciar el tiempo de inicio y mostrar 0 en pantalla
    startTime = Date.now();
    timeDisplay.textContent = " 0 ";

    // Limpiar el lienzo y volver a iniciar la animación
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}
