// シーン、カメラ、レンダラーのセットアップ（正射影カメラで 2D 表現）
const scene = new THREE.Scene();
const aspect = window.innerWidth / window.innerHeight;
const cameraSize = 10;
const camera = new THREE.OrthographicCamera(
    -cameraSize * aspect, cameraSize * aspect,
    cameraSize, -cameraSize,
    0.1, 100
);
camera.position.set(0, 0, 10);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// --- Body の形状 ---
// THREE.Shape を使って、TikZ の体のパスを近似
const bodyShape = new THREE.Shape();
bodyShape.moveTo(1.2, -5);
bodyShape.bezierCurveTo(0.8, -6.5, 0.4, -7.5, 0, -7.7);
bodyShape.lineTo(-2.3, -6.7);
bodyShape.bezierCurveTo(-2.7, -6.7, -3.1, -6.6, -3.8, -6.45);
bodyShape.lineTo(-4.2, -4);
bodyShape.bezierCurveTo(-4.0, -4, -3.8, -4, -3.6, -4);
bodyShape.bezierCurveTo(-3.53, -3.6, -3.4, -2.9, -3.2, -2.2);
bodyShape.lineTo(2, -4);
bodyShape.lineTo(1.2, -5); // 閉じる

const bodyGeometry = new THREE.ShapeGeometry(bodyShape);
const bodyMaterial = new THREE.MeshBasicMaterial({
    color: 0x0000ff,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide
});
const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
scene.add(bodyMesh);

// --- Belly（お腹） ---
// THREE.Shape の absellipse を利用して楕円を作成
const bellyShape = new THREE.Shape();
bellyShape.absellipse(-0.1, -4.8, 2, 1.4, 0, Math.PI * 2, false, 0);
const bellyGeometry = new THREE.ShapeGeometry(bellyShape);
const bellyMaterial = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    side: THREE.DoubleSide
});
const bellyMesh = new THREE.Mesh(bellyGeometry, bellyMaterial);
// TikZ ではお腹が -20° 回転しているので、回転を適用
bellyMesh.rotation.z = -20 * Math.PI / 180;
scene.add(bellyMesh);

// ※ その他のパーツ（ポケット、腕、顔、目など）も同様に THREE.Shape や
// THREE.EllipseCurve などを用いて再現できます。

// アニメーションループ
function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}
animate();

// リサイズ対応
window.addEventListener('resize', () => {
    const aspect = window.innerWidth / window.innerHeight;
    camera.left = -cameraSize * aspect;
    camera.right = cameraSize * aspect;
    camera.top = cameraSize;
    camera.bottom = -cameraSize;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});