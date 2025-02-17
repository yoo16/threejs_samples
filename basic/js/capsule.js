import * as THREE from 'three';
import { Light } from './Light.js';

let capsule;
const speed = 0.01;
const geometryColor = 0xff0000;
const wireColor = 0xff0000
const backgroundColor = 0xffffff;

const canvasContainer = document.getElementById('canvas-container');
const wireframeToggle = document.getElementById('wireframeToggle');
const wireframeValue = document.getElementById('wireframeValue');

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
 * @param {object} params { radius, length, capSegments, radialSegments, color, position }
 */
function addCapsule(params = {}) {
    const radius = params.radius !== undefined ? params.radius : 1;
    const length = params.length !== undefined ? params.length : 2;
    const capSegments = params.capSegments !== undefined ? params.capSegments : 8;
    const radialSegments = params.radialSegments !== undefined ? params.radialSegments : 8;
    const color = params.color || geometryColor;
    const position = params.position || { x: 0, y: 0, z: 0 };

    // Geometry作成
    const geometry = new THREE.CapsuleGeometry(radius, length, capSegments, radialSegments);
    // Material作成
    const material = new THREE.MeshStandardMaterial({ color: color, wireframe: false });
    // Mesh作成
    capsule = new THREE.Mesh(geometry, material);
    capsule.position.set(position.x, position.y, position.z);
    scene.add(capsule);
    // ワイヤーフレーム追加
    addWireframe(capsule, geometry);
}

addCapsule({
    radius: 1,
    length: 2,
    capSegments: 8,
    radialSegments: 8,
    position: { x: 0, y: 0, z: 0 }
});

function init() {

}

// Capsule のジオメトリ更新
function updateGeometry() {
    const radius = parseFloat(document.getElementById('radiusSlider').value);
    const length = parseFloat(document.getElementById('lengthSlider').value);
    const capSeg = parseInt(document.getElementById('capSegSlider').value);
    const radialSeg = parseInt(document.getElementById('radialSegSlider').value);

    document.getElementById('radiusValue').innerText = radius;
    document.getElementById('lengthValue').innerText = length;
    document.getElementById('capsuleSegValue').innerText = capSeg;
    document.getElementById('radialSegValue').innerText = radialSeg;

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
// アニメーションループ
function animate(mesh) {
    requestAnimationFrame(animate.bind(null, mesh));

    mesh.rotation.x += speed;
    mesh.rotation.y += speed;

    renderer.render(scene, camera);
}

// スライダーイベント
document.getElementById('radiusSlider').addEventListener('input', updateGeometry);
document.getElementById('lengthSlider').addEventListener('input', updateGeometry);
document.getElementById('capSegSlider').addEventListener('input', updateGeometry);
document.getElementById('radialSegSlider').addEventListener('input', updateGeometry);

// トグルボタンでワイヤーフレーム切替
wireframeToggle.addEventListener('click', () => {
    const enabled = capsule.material.wireframe;
    capsule.material.wireframe = !enabled;
    capsule.children.forEach(child => {
        child.visible = !enabled;
    });
    wireframeValue.innerText = !enabled ? 'ON' : 'OFF';
});

animate(capsule);