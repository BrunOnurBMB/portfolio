import * as THREE from 'three';

let scene, camera, renderer;
let pegs = [], disks = [], selectedDisk = null;
const canvas = document.getElementById('scene');
const mouse = new THREE.Vector2();

let hoveredDisk = null;
let zenAtivo = true;

init();
activateSection('#sobre');
animate();

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
});

const wrapper = document.getElementById('sceneWrapper');
const btn = document.getElementById('playButton');
let hoverTimeout;

wrapper.addEventListener('mouseenter', () => {
    if (zenAtivo) {
        clearTimeout(hoverTimeout);
        btn.classList.remove('opacity-0', 'pointer-events-none');
        btn.classList.add('opacity-100', 'pointer-events-auto');
    }
});

wrapper.addEventListener('mouseleave', () => {
    if (zenAtivo) {
        hoverTimeout = setTimeout(() => {
            btn.classList.remove('opacity-100', 'pointer-events-auto');
            btn.classList.add('opacity-0', 'pointer-events-none');
        }, 300); // atraso opcional pra suavizar
    }
});

document.getElementById('playButton').addEventListener('click', () => {
    zenAtivo = false;
    document.getElementById('playButton').style.display = 'none';
    resetarTorre(); // função que limpa e recria tudo
});

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);

    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(5, 8, 5);
    scene.add(light);

    // Base
    const base = new THREE.Mesh(
        new THREE.BoxGeometry(8, 0.2, 3),
        new THREE.MeshStandardMaterial({ color: 0x222222 })
    );
    base.position.y = -0.1;
    scene.add(base);

    // Estacas (3)
    for (let i = 0; i < 3; i++) {
        const peg = new THREE.Mesh(
            new THREE.CylinderGeometry(0.1, 0.1, 2, 32),
            new THREE.MeshStandardMaterial({ color: 0x888888, emissive: 0x000000, emissiveIntensity: 1 })
        );
        peg.position.set(-3 + i * 3, 1, 0);
        scene.add(peg);
        pegs.push({ obj: peg, stack: [] });
    }

    // Discos (3) empilhados na primeira estaca
    const colors = [0xf54242, 0xf5a142, 0x42f554];
    for (let i = 0; i < 3; i++) {
        const geo = new THREE.CylinderGeometry(1.2 - i * 0.3, 1.2 - i * 0.3, 0.3, 32);
        const mat = new THREE.MeshStandardMaterial({ color: colors[i], emissive: 0x000000, emissiveIntensity: 1 });
        const disk = new THREE.Mesh(geo, mat);
        disk.userData = { size: 3 - i, pegIndex: 0 };
        disk.position.set(pegs[0].obj.position.x, 0.15 + i * 0.32, 0);
        disks.push(disk);
        pegs[0].stack.push(disk);
        scene.add(disk);
    }

    // Clique
    window.addEventListener('mousedown', onMouseDown);
}

function onMouseDown(event) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    const ray = new THREE.Raycaster();
    ray.setFromCamera(mouse, camera);
    const intersects = ray.intersectObjects(disks);

    if (intersects.length > 0) {
        const clickedDisk = intersects[0].object;

        // Só permite mover o topo da estaca
        const currentPeg = pegs[clickedDisk.userData.pegIndex];
        const topDisk = currentPeg.stack[currentPeg.stack.length - 1];

        if (clickedDisk === topDisk) {
            selectedDisk = clickedDisk;
            selectedDisk.material.emissive.set(0xffff66);
            selectedDisk.material.emissiveIntensity = 2.5;
            selectedDisk.scale.set(1.1, 1, 1.1);
        }
    } else if (selectedDisk) {
        // Verifica onde soltar
        const intersectsPegs = ray.intersectObjects(pegs.map(p => p.obj));
        if (intersectsPegs.length > 0) {
            const targetIndex = pegs.findIndex(p => p.obj === intersectsPegs[0].object);
            const targetPeg = pegs[targetIndex];
            const targetTop = targetPeg.stack[targetPeg.stack.length - 1];

            const size = selectedDisk.userData.size;
            if (!targetTop || size < targetTop.userData.size) {
                // Remove da estaca antiga
                const oldPeg = pegs[selectedDisk.userData.pegIndex];
                oldPeg.stack.pop();

                // Atualiza posição
                const height = targetPeg.stack.length * 0.32;
                selectedDisk.position.set(pegs[targetIndex].obj.position.x, 0.15 + height, 0);
                selectedDisk.userData.pegIndex = targetIndex;
                targetPeg.stack.push(selectedDisk);
            }
        }

        selectedDisk.material.emissive.set(0x000000);
        selectedDisk.material.emissiveIntensity = 1;
        selectedDisk.scale.set(1, 1, 1);
        selectedDisk = null;
    }
}

function zenMode() {
    const totalDiscos = pegs[0].stack.length;
    resolverHanoi(totalDiscos, 0, 2, 1); // origem: 0, destino: 2, auxiliar: 1
}

function activateSection(seletor) {
    const alvo = document.querySelector(seletor);
    if (!alvo) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && zenAtivo) {
                setTimeout(() => {
                    if (zenAtivo) zenMode();
                }, 1000); // Delay de 1 segundo após entrar na seção

                observer.unobserve(alvo); // ativa apenas uma vez
            }
        });
    }, { threshold: 0.5 });

    observer.observe(alvo);
}

function resolverHanoi(n, origem, destino, auxiliar, delay = 500, tempo = { t: 0 }) {
    if (!zenAtivo) return;

    if (n === 1) {
        setTimeout(() => {
            if (!zenAtivo) return;

            moverDiscoZen(origem, destino);
        }, tempo.t);
        tempo.t += delay;
    } else {
        resolverHanoi(n - 1, origem, auxiliar, destino, delay, tempo);
        resolverHanoi(1, origem, destino, auxiliar, delay, tempo);
        resolverHanoi(n - 1, auxiliar, destino, origem, delay, tempo);
    }
}

function moverDiscoZen(origem, destino) {
    const pegOrigem = pegs[origem];
    const pegDestino = pegs[destino];

    const disco = pegOrigem.stack.pop();
    const altura = pegDestino.stack.length * 0.32;

    disco.position.set(pegs[destino].obj.position.x, 0.15 + altura, 0);
    disco.userData.pegIndex = destino;
    pegDestino.stack.push(disco);
}

function resetarTorre() {
    // Remove todos os discos da cena
    for (const disk of disks) {
        scene.remove(disk);
    }

    // Limpa as estacas e discos
    for (const peg of pegs) {
        peg.stack = [];
    }
    disks = [];

    // Recria os discos manualmente
    const colors = [0xf54242, 0xf5a142, 0x42f554];
    for (let i = 0; i < 3; i++) {
        const geo = new THREE.CylinderGeometry(1.2 - i * 0.3, 1.2 - i * 0.3, 0.3, 32);
        const mat = new THREE.MeshStandardMaterial({
            color: colors[i],
            emissive: 0x000000,
            emissiveIntensity: 1,
        });
        const disk = new THREE.Mesh(geo, mat);
        disk.userData = { size: 3 - i, pegIndex: 0 };
        disk.position.set(pegs[0].obj.position.x, 0.15 + i * 0.32, 0);
        disks.push(disk);
        pegs[0].stack.push(disk);
        scene.add(disk);
    }
}

function animate() {
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    // Discos
    const intersects = raycaster.intersectObjects(disks);

    // Estacas
    const pegIntersects = raycaster.intersectObjects(pegs.map(p => p.obj));

    // Limpa todos os realces de estacas
    for (const peg of pegs) {
        peg.obj.material.emissive?.set(0x000000);
        peg.obj.scale.set(1, 1, 1);
    }

    // Hover da estaca (somente se nenhum disco estiver selecionado)
    if (pegIntersects.length > 0) {
        const pegHover = pegIntersects[0].object;
        const targetIndex = pegs.findIndex(p => p.obj === pegHover);
        const topDisk = pegs[targetIndex].stack.slice(-1)[0];

        let dropDisc = true;

        if (selectedDisk && topDisk) {
            const sizeSelecionado = selectedDisk.userData.size;
            const sizeTopo = topDisk.userData.size;
            dropDisc = sizeSelecionado < sizeTopo;
        }

        if (!selectedDisk || dropDisc) {
            pegHover.material.emissive?.set(0x6666ff);
            pegHover.scale.set(1.1, 1.1, 1.1);
        }
    }

    // Limpa destaque de disco anterior
    if (hoveredDisk) {
        hoveredDisk.material.emissive.set(0x000000);
        hoveredDisk.scale.set(1, 1, 1);
        hoveredDisk = null;
    }

    // Hover do disco no topo da estaca
    if (intersects.length > 0) {
        const hovered = intersects[0].object;
        const peg = pegs[hovered.userData.pegIndex];
        const top = peg.stack[peg.stack.length - 1];

        if (hovered === top) {
            hovered.material.emissive.set(0xffcc33);
            hovered.material.emissiveIntensity = 2;
            hovered.scale.set(1.1, 1, 1.1);
            hoveredDisk = hovered;
        }
    }

    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

