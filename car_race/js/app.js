import * as THREE from 'https://unpkg.com/three@0.155.0/build/three.module.js';
import { Car } from './car.js';
import { loadTrack, outerPolygon, innerPolygon, isPointInPolygon } from './track.js';

const canvas = document.getElementById('race-canvas');
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const scene = new THREE.Scene();
// scene.background = new THREE.Color('#fff');
scene.background = new THREE.Color('lightgreen');

const width = window.innerWidth;
const height = window.innerHeight;
const camera = new THREE.OrthographicCamera(
    width / -2, width / 2, height / 2, height / -2, 1, 1000
);
camera.position.set(0, 0, 500);
camera.lookAt(0, 0, 0);

const loader = new THREE.TextureLoader();
const car = new Car(loader);
scene.add(car.mesh);

// キー操作
document.addEventListener('keydown', (e) => {
    switch (e.code) {
        case 'ArrowLeft':  car.left = true; break;
        case 'ArrowRight': car.right = true; break;
        case 'Space':      car.forward = true; break;
        case 'ArrowDown':  car.backward = true; break;
    }
});
document.addEventListener('keyup', (e) => {
    switch (e.code) {
        case 'ArrowLeft':  car.left = false; break;
        case 'ArrowRight': car.right = false; break;
        case 'Space':      car.forward = false; break;  // ✅ speedはリセットしない
        case 'ArrowDown':  car.backward = false; break; // ✅ 同上
    }
});

function checkCollision() {
    const front = car.getFrontPosition();
    const inOuter = isPointInPolygon(front, outerPolygon);
    const inInner = isPointInPolygon(front, innerPolygon);
    if (!(inOuter && !inInner)) {
        car.speed = 0;
        console.log("💥 衝突！");
    }
}

// アニメーション
function animate() {
    requestAnimationFrame(animate);
    car.update();
    checkCollision();
    renderer.render(scene, camera);
}

// 実行
loadTrack(scene).then(() => animate());