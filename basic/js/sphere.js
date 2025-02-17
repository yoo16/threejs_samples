import * as THREE from 'three';
import { Light } from './Light.js';

let sphere;
const speed = 0.01;
const sphereColor = 0xff0000;
const wireColor = 0xff0000
const backgroundColor = 0xffffff;

const canvasContainer = document.getElementById('canvas-container');
const wireframeValue = document.getElementById('wireframeValue');
const wireframeToggle = document.getElementById('wireframeToggle');

// シーン作成
const scene = new THREE.Scene();
// ライトの追加
const light = new Light();
light.add(scene);

// カメラ作成 (視野角75°、アスペクト比はコンテナサイズ、近接面0.1～遠方面1000)
const camera = new THREE.PerspectiveCamera(75, canvasContainer.clientWidth / canvasContainer.clientHeight, 0.1, 1000);
camera.position.z = 5;

// レンダラー作成
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(canvasContainer.clientWidth, canvasContainer.clientHeight);
renderer.setClearColor(backgroundColor, 1);
canvasContainer.appendChild(renderer.domElement);

/**
 * Sphere を生成してシーンに追加する関数
 * @param {object} params { radius, widthSegments, heightSegments, color, position }
 */
function addSphere(params = {}) {
    const radius = params.radius !== undefined ? params.radius : 1;
    const widthSegments = params.widthSegments !== undefined ? params.widthSegments : 32;
    const heightSegments = params.heightSegments !== undefined ? params.heightSegments : 32;
    const color = params.color || sphereColor;
    const position = params.position || { x: 0, y: 0, z: 0 };

    // Geometry作成
    const geometry = new THREE.SphereGeometry(radius, widthSegments, heightSegments);
    // Material作成
    const material = new THREE.MeshStandardMaterial({ color: color, wireframe: false });
    // Mesh作成
    sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(position.x, position.y, position.z);
    // シーンに追加
    scene.add(sphere);
    // ワイヤーフレーム追加
    addWireframe(sphere, geometry);
}

// Sphere のジオメトリ更新
function updateGeometry() {
    const radius = parseFloat(document.getElementById('radiusSlider').value);
    const widthSeg = parseInt(document.getElementById('widthSegSlider').value);
    const heightSeg = parseInt(document.getElementById('heightSegSlider').value);

    document.getElementById('radiusValue').innerText = radius;
    document.getElementById('widthSegValue').innerText = widthSeg;
    document.getElementById('heightSegValue').innerText = heightSeg;

    // ジオメトリを破棄
    sphere.geometry.dispose();

    // 新しいジオメトリを作成
    const newGeometry = new THREE.SphereGeometry(radius, widthSeg, heightSeg);
    sphere.geometry = newGeometry;

    // ワイヤーフレームの再作成
    updateWireframe(sphere, newGeometry);
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
    const lineMaterial = new THREE.LineBasicMaterial({ color: wireColor });
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

// スライダーにイベントリスナーを追加 (Sphere)
document.getElementById('radiusSlider').addEventListener('input', updateGeometry);
document.getElementById('widthSegSlider').addEventListener('input', updateGeometry);
document.getElementById('heightSegSlider').addEventListener('input', updateGeometry);

// トグルボタンでワイヤーフレーム切替 (Sphere)
wireframeToggle.addEventListener('click', () => {
    const enabled = sphere.material.wireframe;
    sphere.material.wireframe = !enabled;
    sphere.children.forEach(child => {
        child.visible = !enabled;
    });
    wireframeValue.innerText = !enabled ? 'ON' : 'OFF';
});

addSphere({ radius: 1 });
animate(sphere);