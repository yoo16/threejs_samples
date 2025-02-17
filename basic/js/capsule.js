import * as THREE from 'three';
import { Light } from './Light.js';

// 変数&定数
let capsule;
let radius = 1;
let length = 2;
let capSeg = 8;
let radialSeg = 8;

const speed = 0.01;
const geometryColor = 0xff0000;
const wireColor = 0xff0000
const backgroundColor = 0xffffff;

// DOM取得
const canvasContainer = document.getElementById('canvas-container');
const wireframeToggle = document.getElementById('wireframeToggle');
const wireframeValue = document.getElementById('wireframeValue');
const radiusSlider = document.getElementById('radiusSlider');
const lengthSlider = document.getElementById('lengthSlider');
const capSegSlider = document.getElementById('capSegSlider');
const radialSegSlider = document.getElementById('radialSegSlider');

// シーン作成
const scene = new THREE.Scene();
// ライトの追加
const light = new Light();
light.add(scene);

// カメラ作成（コンテナサイズに合わせる）
const camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
camera.position.z = 5;

// レンダラー作成
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
renderer.setClearColor(backgroundColor, 1);
canvasContainer.appendChild(renderer.domElement);

/**
 * Capsule を生成してシーンに追加する関数
 * @param {object} params { color, position }
 */
function addCapsule(params = {}) {
    const color = params.color || geometryColor;
    const position = params.position || { x: 0, y: 0, z: 0 };

    // Geometry作成
    const geometry = new THREE.CapsuleGeometry(radius, length, capSeg, radialSeg);
    // Material作成
    const material = new THREE.MeshStandardMaterial({ color: color, wireframe: false });
    // Mesh作成
    capsule = new THREE.Mesh(geometry, material);
    capsule.position.set(position.x, position.y, position.z);
    scene.add(capsule);
    // ワイヤーフレーム追加
    addWireframe(capsule, geometry);
}

/**
 * スライダーの値に応じてCapsuleのジオメトリを更新する関数
 * @param {number} radius - Capsuleの半径
 * @param {number} length - Capsuleの長さ
 * @param {number} capSeg - Capsuleのcapの分割数
 * @param {number} radialSeg - Capsuleのradialの分割数
 */
function updateGeometry() {
    document.getElementById('radiusValue').innerText = radius = parseFloat(radiusSlider.value);
    document.getElementById('lengthValue').innerText = length = parseFloat(lengthSlider.value);
    document.getElementById('capsuleSegValue').innerText = capSeg = parseInt(capSegSlider.value);
    document.getElementById('radialSegValue').innerText = radialSeg = parseInt(radialSegSlider.value);

    // ジオメトリを破棄
    capsule.geometry.dispose();

    // 新しいジオメトリを作成
    const newGeometry = new THREE.CapsuleGeometry(radius, length, capSeg, radialSeg);
    capsule.geometry = newGeometry;

    updateWireframe(capsule, newGeometry)
}

/**
 * メッシュにワイヤーフレームを追加する
 * @param {THREE.Mesh} mesh - ワイヤーフレームを追加するメッシュ
 * @param {THREE.Geometry} geometry - ワイヤーフレームのジオメトリ
 */
function addWireframe(mesh, geometry) {
    const wireframe = new THREE.WireframeGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: wireColor });
    const wireframeMesh = new THREE.LineSegments(wireframe, lineMaterial);
    mesh.add(wireframeMesh);
}

/**
 * メッシュのワイヤーフレームを更新する
 * @param {THREE.Mesh} mesh - ワイヤーフレームを更新するメッシュ
 * @param {THREE.Geometry} geometory - ワイヤーフレームのジオメトリ
 */
function updateWireframe(mesh, geometory) {
    while (mesh.children.length > 0) {
        mesh.remove(mesh.children[0]);
    }
    const wireframe = new THREE.WireframeGeometry(geometory);
    const lineMaterial = new THREE.LineBasicMaterial({ color: wireColor});
    const wireframeMesh = new THREE.LineSegments(wireframe, lineMaterial);
    mesh.add(wireframeMesh);
}

/**
 * メッシュのアニメーションループ
 * @param {THREE.Mesh} mesh - アニメーションするメッシュ
 */
function animate(mesh) {
    requestAnimationFrame(animate.bind(null, mesh));

    mesh.rotation.x += speed;
    mesh.rotation.y += speed;

    renderer.render(scene, camera);
}

// スライダーイベント
radiusSlider.addEventListener('input', updateGeometry);
lengthSlider.addEventListener('input', updateGeometry);
capSegSlider.addEventListener('input', updateGeometry);
radialSegSlider.addEventListener('input', updateGeometry);

// トグルボタンでワイヤーフレーム切替
wireframeToggle.addEventListener('click', () => {
    const enabled = capsule.material.wireframe;
    capsule.material.wireframe = !enabled;
    wireframeValue.innerText = !enabled ? 'ON' : 'OFF';
});

addCapsule();
animate(capsule);