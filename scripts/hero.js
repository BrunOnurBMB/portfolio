import * as THREE from "three";

const canvas = document.getElementById('bg-canvas');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
camera.position.z = 6;

function isMobile() {
    return window.innerWidth <= 900;
}

const pixelRatio = isMobile() ? 1 : window.devicePixelRatio;
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(pixelRatio);

const particleCount = isMobile() ? 1000 : 3000;
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
const corAleatoria = ['#aed4c8', '#5eb8ac', '#6e999c', '#ffffff'];
const baseX = new Float32Array(particleCount);
const baseY = new Float32Array(particleCount);
const phases = new Float32Array(particleCount);
const aspect = canvas.clientWidth / canvas.clientHeight;

function createCircleTexture() {
    const size = 64;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext('2d');
    const center = size / 2;

    ctx.beginPath();
    ctx.arc(center, center, center, 0, Math.PI * 2);
    ctx.fillStyle = '#FFF0F5';
    ctx.fill();
    return new THREE.CanvasTexture(canvas);
}

for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * aspect * 12;
    const y = (Math.random() - 0.5) * 2;
    const z = Math.random() * 2 - 1;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const corHex = corAleatoria[Math.floor(Math.random() * corAleatoria.length)];
    const cor = new THREE.Color(corHex);
    colors[i * 3] = cor.r;
    colors[i * 3 + 1] = cor.g;
    colors[i * 3 + 2] = cor.b;

    baseX[i] = x;
    baseY[i] = y;
    phases[i] = Math.random() * Math.PI * 2;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
    size: isMobile() ? 0.08 : 0.15,
    map: createCircleTexture(),
    transparent: true,
    opacity: 0.7,
    alphaTest: 0.5,
    depthWrite: false,
    vertexColors: true
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

const mouse3D = new THREE.Vector3();
mouse3D.set(10000, 10000, 0); // posição fora do campo de visão

function onMouseMove(event) {
    const ndcX = (event.clientX / canvas.clientWidth) * 2 - 1;
    const ndcY = -(event.clientY / canvas.clientHeight) * 2 + 1;
    mouse3D.set(ndcX, ndcY, 0);
    mouse3D.unproject(camera);
    const dir = mouse3D.clone().sub(camera.position).normalize();
    const distance = (0 - camera.position.z) / dir.z;
    mouse3D.copy(camera.position).add(dir.multiplyScalar(distance));
}

if (!isMobile()) {
    document.addEventListener('mousemove', onMouseMove);
}

let time = 0;
function animate() {
    requestAnimationFrame(animate);
    const pos = geometry.attributes.position.array;

    if (isMobile()) {
        for (let i = 0; i < particleCount; i++) {
            const idx = i * 3;
            baseX[i] += 0.01;
            if (baseX[i] > aspect * 6) baseX[i] = -aspect * 6;

            pos[idx] = baseX[i];
            pos[idx + 1] = baseY[i];
        }
    } else {
        let nearbyCount = 0;
        for (let i = 0; i < particleCount; i++) {
            const idx = i * 3;

            baseX[i] += 0.01;
            if (baseX[i] > aspect * 6) baseX[i] = -aspect * 6;

            const x = baseX[i];
            const y = baseY[i];

            const dx = baseX[i] - mouse3D.x;
            const dy = baseY[i] - mouse3D.y;
            const dist = Math.sqrt(dx * dx + dy * dy) + 0.001;

            const spreadX = 1 + Math.abs(mouse3D.x) * 0.9;
            const spreadY = 1 + Math.abs(mouse3D.y) * 0.9;
            const adjustedDist = dist / ((spreadX + spreadY) / 1.5);
            const force = (1 / (adjustedDist * adjustedDist + 0.85)) * 1;

            const offsetX = (dx / dist) * force;
            const offsetY = (dy / dist) * force;

            pos[idx] = x + offsetX;
            const waveOffset = pos[idx] * 2;
            pos[idx + 1] = y + Math.sin(time + waveOffset) * 0.3 + offsetY;

            if (dist < 2.5) nearbyCount++;
        }

        const slowdown = 1 + nearbyCount * 0.004;
        time += 0.03 / slowdown;
    }

    geometry.attributes.position.needsUpdate = true;

    try {
        renderer.render(scene, camera);
    } catch (e) {
        console.warn("Erro ao renderizar cena:", e);
    }
}

animate();

window.addEventListener('resize', () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
});