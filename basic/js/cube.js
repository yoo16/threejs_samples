import * as THREE from 'three';
import { Light } from './Light.js';

// グローバル変数として立方体
let cube;
const speed = 0.01;
const wireColor = 0xff0000
const backgroundColor = 0xffffff;

// コンテナを取得
const canvasContainer = document.getElementById('canvas-container');
const wireframeValue = document.getElementById('wireframeValue');

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

// コンテナにレンダラーを追加
canvasContainer.appendChild(renderer.domElement);

/**
 * 立方体を生成してシーンに追加する関数
 * @param {object} params { width, height, depth, widthSegments, heightSegments, depthSegments, color }
 */
function addBox(params = {}) {
    const width = params.width !== undefined ? params.width : 1;
    const height = params.height !== undefined ? params.height : 1;
    const depth = params.depth !== undefined ? params.depth : 1;
    const widthSegments = params.widthSegments !== undefined ? params.widthSegments : 1;
    const heightSegments = params.heightSegments !== undefined ? params.heightSegments : 1;
    const depthSegments = params.depthSegments !== undefined ? params.depthSegments : 1;
    const color = params.color || 0xff0000;
    const position = params.position || { x: 0, y: 0, z: 0 };

    // Geometry作成
    const geometry = new THREE.BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments);
    // Material作成
    const material = new THREE.MeshStandardMaterial({ color: color, wireframe: false });
    // Mesh作成
    cube = new THREE.Mesh(geometry, material);
    cube.position.set(position.x, position.y, position.z);
    // シーンに追加
    scene.add(cube);
    // ワイヤーフレーム追加
    addWireframe(cube, geometry);
}

// 初回立方体生成（デフォルトは全て1）
addBox();

// スライダーの値に応じて立方体のジオメトリを更新する関数
function updateGeometry() {
    const width = parseFloat(document.getElementById('widthSlider').value);
    const height = parseFloat(document.getElementById('heightSlider').value);
    const depth = parseFloat(document.getElementById('depthSlider').value);
    const widthSeg = parseInt(document.getElementById('widthSegSlider').value);
    const heightSeg = parseInt(document.getElementById('heightSegSlider').value);
    const depthSeg = parseInt(document.getElementById('depthSegSlider').value);

    // スライダーの表示値更新
    document.getElementById('widthValue').innerText = width;
    document.getElementById('heightValue').innerText = height;
    document.getElementById('depthValue').innerText = depth;
    document.getElementById('widthSegValue').innerText = widthSeg;
    document.getElementById('heightSegValue').innerText = heightSeg;
    document.getElementById('depthSegValue').innerText = depthSeg;

    // ジオメトリを破棄
    cube.geometry.dispose();

    // 新しいジオメトリを作成
    const newGeometry = new THREE.BoxGeometry(width, height, depth, widthSeg, heightSeg, depthSeg);
    cube.geometry = newGeometry;

    // ワイヤーフレームの再作成
    updateWireframe(cube, newGeometry);
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

// トグルボタンでワイヤーフレーム切替
const wireframeToggle = document.getElementById('wireframeToggle');
wireframeToggle.addEventListener('click', () => {
    // 現在の状態を取得
    const enabled = cube.material.wireframe;
    // 切り替え：マテリアルの wireframe プロパティ
    cube.material.wireframe = !enabled;
    // また、子オブジェクト（ワイヤーフレームオブジェクト）の表示も切り替え
    cube.children.forEach(child => {
        child.visible = !enabled;
    });
    // 表示テキストの更新
    wireframeValue.innerText = !enabled ? 'ON' : 'OFF';
});

// アニメーションループ
function animate(mesh) {
    requestAnimationFrame(animate.bind(null, mesh));

    mesh.rotation.x += speed;
    mesh.rotation.y += speed;

    renderer.render(scene, camera);
}

// スライダーにイベントリスナーを追加
document.getElementById('widthSlider').addEventListener('input', updateGeometry);
document.getElementById('heightSlider').addEventListener('input', updateGeometry);
document.getElementById('depthSlider').addEventListener('input', updateGeometry);
document.getElementById('widthSegSlider').addEventListener('input', updateGeometry);
document.getElementById('heightSegSlider').addEventListener('input', updateGeometry);
document.getElementById('depthSegSlider').addEventListener('input', updateGeometry);

animate(cube);