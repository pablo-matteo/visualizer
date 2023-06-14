// Configurar el escenario
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// Crear el lienzo de renderizado
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.getElementById('container').appendChild(renderer.domElement);

// Crear geometría y material
const geometry = new THREE.TorusGeometry(1, 0.5, 32, 100);

// Crear múltiples mallas con diferentes colores, posiciones y rotaciones
const numMeshes = 30;
for (let i = 0; i < numMeshes; i++) {
  const material = new THREE.MeshBasicMaterial({ color: getRandomColor() });

  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.set(
    Math.random() * 8 - 4,
    Math.random() * 8 - 4,
    Math.random() * 8 - 4
  );
  mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
  scene.add(mesh);
}

// Función para generar colores aleatorios
function getRandomColor() {
  const hue = Math.random();
  const saturation = 1;
  const luminance = 0.5;
  return new THREE.Color().setHSL(hue, saturation, luminance);
}

// Función para generar una posición aleatoria para la cámara
function getRandomCameraPosition() {
  const x = Math.random() * 10 - 5;
  const y = Math.random() * 10 - 5;
  const z = Math.random() * 10 - 5;
  return new THREE.Vector3(x, y, z);
}

// Variables para controlar el movimiento de la cámara
let targetCameraPosition = getRandomCameraPosition();
const cameraSpeed = 0.002;

// Función para actualizar la posición de la cámara de forma suave
function updateCameraPosition() {
  const currentPosition = camera.position.clone();
  const targetDirection = targetCameraPosition.clone().sub(currentPosition);
  const moveVector = targetDirection.multiplyScalar(cameraSpeed);
  camera.position.add(moveVector);

  // Comprobar si la cámara ha alcanzado la posición objetivo
  if (currentPosition.distanceTo(targetCameraPosition) < 0.2) {
    // Generar una nueva posición aleatoria para la cámara
    targetCameraPosition = getRandomCameraPosition();
  }
}

// Añadir OrbitControls desde un archivo externo
const controlsScript = document.createElement('script');
controlsScript.src = 'https://cdn.jsdelivr.net/npm/three@0.128.0/examples/js/controls/OrbitControls.js';
document.head.appendChild(controlsScript);
controlsScript.onload = init;

function init() {
  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.autoRotate = true; // Hacer que la cámara rote automáticamente
  controls.enableDamping = true; // Habilitar el amortiguamiento para movimientos suaves
  controls.dampingFactor = 0.05; // Ajustar el factor de amortiguamiento
}

// Función para animar la escena
function animate() {
  requestAnimationFrame(animate);

  // Rotar y actualizar las posiciones de las mallas
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      object.rotation.x += 0.01;
      object.rotation.y += 0.01;
    }
  });

  // Actualizar la posición de la cámara de forma suave
  updateCameraPosition();

  // Renderizar la escena con la cámara
  renderer.render(scene, camera);
}

// Ajustar el tamaño del lienzo de renderizado cuando se cambia el tamaño de la ventana
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Iniciar la animación
animate();
