import * as THREE from 'three';
import { Light } from './Light.js'; // 外部の Light.js を利用する場合

// DOM取得
const canvasContainer = document.getElementById('canvas-container');
const tetraWireframeToggle = document.getElementById('wireframeToggle');

const tetraRadiusSlider = document.getElementById('tetraRadiusSlider');
const tetraDetailSlider = document.getElementById('tetraDetailSlider');

const tetraRadiusValue = document.getElementById('tetraRadiusValue');
const tetraDetailValue = document.getElementById('tetraDetailValue');

// 定数
const wireColor = 0xff0000;
const geometryColor = 0xff0000;
const backgroundColor = 0xffffff;
const speed = 0.01;

// シーン作成
const scene = new THREE.Scene();

// カメラ作成（コンテナサイズに合わせる）
const camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
camera.position.z = 5;

// レンダラー作成
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
renderer.setClearColor(backgroundColor, 1);
canvasContainer.appendChild(renderer.domElement);

// Light の追加（外部 Light.js を利用）
const light = new Light();
light.add(scene);

// グローバル変数として Tetrahedron オブジェクト
let tetrahedron;

/**
 * TetrahedronGeometry を生成してシーンに追加する関数
 * @param {object} params { radius, detail, color, position }
 */
function addTetrahedron(params = {}) {
    const radius = params.radius !== undefined ? params.radius : 1;
    const detail = params.detail !== undefined ? params.detail : 0;
    const color = params.color || geometryColor;
    const position = params.position || { x: 0, y: 0, z: 0 };

    // TetrahedronGeometry(radius, detail)
    const geometry = new THREE.TetrahedronGeometry(radius, detail);
    const material = new THREE.MeshStandardMaterial({ color: color, wireframe: false });
    tetrahedron = new THREE.Mesh(geometry, material);
    tetrahedron.position.set(position.x, position.y, position.z);
    scene.add(tetrahedron);

    // ワイヤーフレームを追加
    addWireframe(tetrahedron, geometry);
}
addTetrahedron({
    radius: 1,
    detail: 0,
    color: geometryColor,
    position: { x: 0, y: 0, z: 0 }
});

/**
 * ワイヤーフレームをメッシュに追加する関数
 * @param {THREE.Mesh} mesh - ワイヤーフレームを追加するメッシュ
 * @param {THREE.Geometry} geometry - ワイヤーフレーム用ジオメトリ
 */
function addWireframe(mesh, geometry) {
    const wireframe = new THREE.WireframeGeometry(geometry);
    const lineMaterial = new THREE.LineBasicMaterial({ color: wireColor });
    const wireframeMesh = new THREE.LineSegments(wireframe, lineMaterial);
    mesh.add(wireframeMesh);
}

/**
 * Tetrahedron のジオメトリ更新
 */
function updateTetrahedronGeometry() {
    const radius = parseFloat(tetraRadiusSlider.value);
    const detail = parseInt(tetraDetailSlider.value);

    tetraRadiusValue.innerText = radius;
    tetraDetailValue.innerText = detail;

    const newGeometry = new THREE.TetrahedronGeometry(radius, detail);
    tetrahedron.geometry.dispose();
    tetrahedron.geometry = newGeometry;

    // ワイヤーフレームの再作成
    while (tetrahedron.children.length > 0) {
        tetrahedron.remove(tetrahedron.children[0]);
    }
    addWireframe(tetrahedron, newGeometry);
}

// アニメーションループ
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

// スライダーにイベントリスナー追加
tetraRadiusSlider.addEventListener('input', updateTetrahedronGeometry);
tetraDetailSlider.addEventListener('input', updateTetrahedronGeometry);

// トグルボタンでワイヤーフレーム切替
tetraWireframeToggle.addEventListener('click', () => {
    const enabled = tetrahedron.material.wireframe;
    tetrahedron.material.wireframe = !enabled;
    tetraWireframeToggle.innerText = !enabled ? 'ON' : 'OFF';
});

animate(tetrahedron);