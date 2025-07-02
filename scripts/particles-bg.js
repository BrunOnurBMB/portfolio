/*import * as THREE from "three";

const canvas = document.getElementById("bg-canvasMain");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
camera.position.z = 6;

renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const particleCount = 250;
const positions = new Float32Array(particleCount * 3);
const colors = new Float32Array(particleCount * 3);
const speeds = new Float32Array(particleCount);
const corAleatoria = ['#aed4c8', '#5eb8ac', '#6e999c', '#ffffff'];
const aspect = canvas.clientWidth / canvas.clientHeight;

function isMobile() {
    return window.innerWidth <= 900;
}

function createCircleTexture() {
    const size = 44; // tamanho do círculo
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    const center = size / 2;

    ctx.beginPath();
    ctx.arc(center, center, center, 0, Math.PI * 2);
    ctx.fillStyle = "#FFF0F5";
    ctx.fill();

    return new THREE.CanvasTexture(canvas);
}

for (let i = 0; i < particleCount; i++) {
    const x = (Math.random() - 0.5) * aspect * 12;
    const y = (Math.random() - 0.5) * 10;
    const z = Math.random() * 2 - 1;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const corHex = corAleatoria[Math.floor(Math.random() * corAleatoria.length)];
    const cor = new THREE.Color(corHex);
    colors[i * 3] = cor.r;
    colors[i * 3 + 1] = cor.g;
    colors[i * 3 + 2] = cor.b;

    speeds[i] = Math.random() * 0.01 + 0.005; // velocidade suave e variável
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

const material = new THREE.PointsMaterial({
    size: isMobile() ? 0.25 : 0.5, // menor no mobile
    map: createCircleTexture(),
    transparent: true,
    opacity: 0.5,
    alphaTest: 0.5,
    depthWrite: false,
    vertexColors: true,
});

const particles = new THREE.Points(geometry, material);
scene.add(particles);

function animate() {
    requestAnimationFrame(animate);
    const pos = geometry.attributes.position.array;

    for (let i = 0; i < particleCount; i++) {
        const idx = i * 3;
        pos[idx + 1] += speeds[i]; // sobe no eixo Y

        if (pos[idx + 1] > 6) {
            pos[idx + 1] = -6;
            pos[idx] = (Math.random() - 0.5) * aspect * 12;
        }
    }

    geometry.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
}

animate();

window.addEventListener("resize", () => {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

});
*/
import * as THREE from "three";

function isMobile() {
    return window.innerWidth <= 900;
}

window.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("bg-canvasMain");

    if (!canvas || isMobile()) {
        if (canvas) canvas.style.display = "none";
        return; // Não executa mais nada no mobile
    }

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.z = 6;

    const aspect = canvas.clientWidth / canvas.clientHeight;
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const particleCount = 250;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount);
    const corAleatoria = ['#aed4c8', '#5eb8ac', '#6e999c', '#ffffff'];

    function createCircleTexture() {
        const size = 44;
        const canvas = document.createElement("canvas");
        canvas.width = canvas.height = size;
        const ctx = canvas.getContext("2d");
        const center = size / 2;

        ctx.beginPath();
        ctx.arc(center, center, center, 0, Math.PI * 2);
        ctx.fillStyle = "#FFF0F5";
        ctx.fill();

        return new THREE.CanvasTexture(canvas);
    }

    for (let i = 0; i < particleCount; i++) {
        const x = (Math.random() - 0.5) * aspect * 12;
        const y = (Math.random() - 0.5) * 10;
        const z = Math.random() * 2 - 1;
        positions[i * 3] = x;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 2] = z;

        const corHex = corAleatoria[Math.floor(Math.random() * corAleatoria.length)];
        const cor = new THREE.Color(corHex);
        colors[i * 3] = cor.r;
        colors[i * 3 + 1] = cor.g;
        colors[i * 3 + 2] = cor.b;

        speeds[i] = Math.random() * 0.01 + 0.005;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.5,
        map: createCircleTexture(),
        transparent: true,
        opacity: 0.5,
        alphaTest: 0.5,
        depthWrite: false,
        vertexColors: true,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    function animate() {
        requestAnimationFrame(animate);
        const pos = geometry.attributes.position.array;

        for (let i = 0; i < particleCount; i++) {
            const idx = i * 3;
            pos[idx + 1] += speeds[i];

            if (pos[idx + 1] > 6) {
                pos[idx + 1] = -6;
                pos[idx] = (Math.random() - 0.5) * aspect * 12;
            }
        }

        geometry.attributes.position.needsUpdate = true;
        renderer.render(scene, camera);
    }

    animate();

    window.addEventListener("resize", () => {
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    });
});