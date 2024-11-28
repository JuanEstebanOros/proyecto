const canvas = document.getElementById("carCrashCanvas");
const ctx = canvas.getContext("2d");
const timeDisplay = document.getElementById("crashTime");

// Cargar imágenes de los autos
const car1Image = new Image();
const car2Image = new Image();
car1Image.src = "https://static.vecteezy.com/system/resources/previews/025/306/056/non_2x/white-sport-car-on-transparent-background-3d-rendering-illustration-free-png.png";
car2Image.src = "https://th.bing.com/th/id/R.bcaf9b435d7f30d76806ca67665d49be?rik=1cC9uTZ3DKI57A&pid=ImgRaw&r=0";

// Inicializar propiedades de los autos
let car1 = { x: 100, y: canvas.height / 2 - 15, width: 130, height: 80, speed: 0 };
let car2 = { x: canvas.width - 150, y: canvas.height / 2 - 15, width: 100, height: 80, speed: 0 };
let startTime;
let animationId;

function startCarCrash() {
    // Solo iniciar la simulación si las imágenes están completamente cargadas
    if (!car1Image.complete || !car2Image.complete) {
        alert("Espera a que las imágenes de los autos se carguen.");
        return;
    }

    // Configurar las velocidades iniciales y el tiempo de inicio
    const speed1 = parseFloat(document.getElementById("speed1").value);
    const speed2 = parseFloat(document.getElementById("speed2").value);
    car1.speed = speed1;
    car2.speed = -speed2;
    startTime = Date.now();

    // Iniciar la animación
    updateCars();
}

function updateCars() {
    // Limpiar el lienzo antes de redibujar los autos
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar ambos autos en sus nuevas posiciones
    drawCar(car1, car1Image);
    drawCar(car2, car2Image);

    // Actualizar la posición de los carros
    car1.x += car1.speed;
    car2.x += car2.speed;

    // Verificar si hay colisión
    if (car1.x + car1.width >= car2.x) {
        cancelAnimationFrame(animationId); // Detener la animación en colisión
    } else {
        // Calcular el tiempo transcurrido
        const currentTime = Date.now();
        const elapsedTime = (currentTime - startTime) / 1000; // Convertir a segundos
        timeDisplay.textContent = `${elapsedTime.toFixed(2)}`;

        // Continuar la animación
        animationId = requestAnimationFrame(updateCars);
    }
}

function drawCar(car, carImage) {
    ctx.drawImage(carImage, car.x, car.y, car.width, car.height);
}

function resetSimulation() {
    // Reiniciar posición de los autos, tiempo y detener animación
    car1.x = 100;
    car2.x = canvas.width - 150;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    cancelAnimationFrame(animationId);

    // Reiniciar el tiempo en pantalla y setear el tiempo de inicio
    timeDisplay.textContent = "0.00";
    startTime = Date.now();
}

// Esperar a que ambas imágenes se carguen antes de permitir iniciar la simulación
car1Image.onload = car2Image.onload = function() {
    console.log("Imágenes de los autos cargadas y listas para la simulación.");
};

