// ==== CONFIGURACIÓN GENERAL ====
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
canvas.width = 700;
canvas.height = 775;
document.body.appendChild(canvas);

// ==== CARGA DE IMÁGENES ====
const fondo = new Image();
fondo.src = 'Img/fondo_amor.jpg';

const jugadorImg = new Image();
jugadorImg.src = 'Img/Juan.png';

const enemigoImg = new Image();
enemigoImg.src = 'Img/Maribel.png';

const balaImg = new Image();
balaImg.src = 'Img/otro.png';

// ==== VARIABLES ====
let jugador = { x: canvas.width / 2 - 30, y: canvas.height  - 100, width: 60, height: 60, velocidad: 5 };
let balas = [];
let enemigos = [];
let puntuacion = 0;
let juegoActivo = false;
let pausa = false;
let gameOver = false;
let teclas = {
  izquierda: false,
  derecha: false
};

// ==== EVENTOS ====
document.addEventListener("keydown", (e) => {
  if (e.code === "ArrowLeft") teclas.izquierda = true;
  if (e.code === "ArrowRight") teclas.derecha = true;

  if (e.code === "Space") {
    if (!juegoActivo && !gameOver) {
      juegoActivo = true;
      document.getElementById("menu").style.display = "none";
      canvas.style.display = "block";
    } else if (!gameOver) {
      balas.push({ x: jugador.x + jugador.width / 2 - 5, y: jugador.y });
    }
  }

  if (e.code === "KeyP") pausa = !pausa;
  if (e.code === "KeyR" && gameOver) reiniciarJuego();
});

document.addEventListener("keyup", (e) => {
  if (e.code === "ArrowLeft") teclas.izquierda = false;
  if (e.code === "ArrowRight") teclas.derecha = false;
});

// ==== FUNCIONES ====
function crearEnemigo() {
    enemigos.push({
        x: Math.random() * (canvas.width - 60),
        y: -60,
        width: 60,
        height: 60,
        velocidad: 2 + Math.random() * 2
    });
}

function detectarColision(a, b) {
    return a.x < b.x + b.width &&
           a.x + a.width > b.x &&
           a.y < b.y + b.height &&
           a.y + a.height > b.y;
}

function actualizar() {
  if (!juegoActivo || pausa || gameOver) return;

  if (teclas.izquierda) jugador.x -= jugador.velocidad;
  if (teclas.derecha) jugador.x += jugador.velocidad;

  // Limitar movimiento del jugador dentro del canvas
  if (jugador.x < 0) jugador.x = 0;
  if (jugador.x + jugador.width > canvas.width) jugador.x = canvas.width - jugador.width;

  balas.forEach(b => b.y -= 10);
  enemigos.forEach(e => e.y += e.velocidad);

  // Colisiones
  enemigos.forEach((enemigo, i) => {
      balas.forEach((bala, j) => {
          if (detectarColision(enemigo, { ...bala, width: 50, height: 50 })) {
              enemigos.splice(i, 1);
              balas.splice(j, 1);
              puntuacion++;
          }
      });

      if (enemigo.y + enemigo.height >= jugador.y && detectarColision(enemigo, jugador)) {
          juegoActivo = false;
          gameOver = true;
      }
  });

  enemigos = enemigos.filter(e => e.y < canvas.height);
  balas = balas.filter(b => b.y > -50);

  if (Math.random() < 0.02) crearEnemigo();
}

function dibujar() {
    ctx.drawImage(fondo, 0, 0, canvas.width, canvas.height);
    ctx.drawImage(jugadorImg, jugador.x, jugador.y, jugador.width, jugador.height);
    balas.forEach(b => ctx.drawImage(balaImg, b.x, b.y, 50, 50));
    enemigos.forEach(e => ctx.drawImage(enemigoImg, e.x, e.y, e.width, e.height));
    ctx.fillStyle = 'black';
    ctx.font = '24px Arial';
    ctx.fillText('Puntos: ' + puntuacion, 10, 30);

    if (!juegoActivo && !gameOver) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#e91e63';
        ctx.font = 'bold 40px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Hola, Maribel', canvas.width / 2, 250);
        ctx.font = '20px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('Presiona ESPACIO para comenzar', canvas.width / 2, 320);
        ctx.fillText('Usa ← y → para moverte', canvas.width / 2, 360);
        ctx.fillText('Presiona P para pausar el juego', canvas.width / 2, 400);
    }

    if (gameOver) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#e91e63';
        ctx.font = 'bold 50px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('¡Perdiste!', canvas.width / 2, 250);

        ctx.font = '24px Arial';
        ctx.fillStyle = 'black';
        ctx.fillText('Enemigos eliminados: ' + puntuacion, canvas.width / 2, 320);
        ctx.fillText('Presiona R para reiniciar el juego', canvas.width / 2, 360);
    }
}

function reiniciarJuego() {
    jugador = { x: canvas.width / 2 - 30, y: canvas.height - 100, width: 60, height: 60, velocidad: 5 };
    balas = [];
    enemigos = [];
    puntuacion = 0;
    juegoActivo = false;
    gameOver = false;
}

function bucleJuego() {
    actualizar();
    dibujar();
    requestAnimationFrame(bucleJuego);
}

bucleJuego();
