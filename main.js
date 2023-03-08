import "./style.css";
import * as THREE from "three";
import * as dat from "lil-gui";

//uiデバックを実装

const gui = new dat.GUI();

// キャンバスの取得
const canvas = document.querySelector(".webgl");

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Scene
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  35,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.z = 6;
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const material = new THREE.MeshPhysicalMaterial({
  color: "#3c94d7",
  metalness: 0.865,
  roughness: 0.373,
  flatShading: true,
});

gui.addColor(material, "color");
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

// Meshes
const mesh1 = new THREE.Mesh(new THREE.TorusGeometry(1, 0.4, 16, 60), material);
const mesh2 = new THREE.Mesh(new THREE.OctahedronGeometry(), material);
const mesh3 = new THREE.Mesh(
  new THREE.TorusKnotGeometry(0.8, 0.35, 100, 16),
  material
);
const mesh4 = new THREE.Mesh(new THREE.IcosahedronGeometry(), material);

mesh1.position.set(2, 0, 0);
mesh2.position.set(-1, 0, 0);
mesh3.position.set(2, 0, -6);
mesh4.position.set(5, 0, 3);

scene.add(mesh1, mesh2, mesh3, mesh4);
const meshes = [mesh1, mesh2, mesh3, mesh4];

//パーティクルを追加
//ジオメトリ
const particlesGeometry = new THREE.BufferGeometry();
const particlesCount = 700;

const positionArray = new Float32Array(particlesCount * 3);//float型の配列を2100個生成

for (let i = 0; i < particlesCount * 3; i++) {
  positionArray[i] = (Math.random() - 0.5) * 10;//ランダム変数で2100個の配列に数値を入れる
}

particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionArray, 3)
);

//マテリアル
const particlesMaterial = new THREE.PointsMaterial({
  size:0.05,
  color:"#ffffff"
})

//メッシュ化
const particles = new THREE.Points(particlesGeometry,particlesMaterial)
scene.add(particles)

//ライトを追加
const directionnalLight = new THREE.DirectionalLight("#ffffff", 4);
directionnalLight.position.set(0.5, 1, 0);
scene.add(directionnalLight);

//リサイズ
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

let speed = 0;
let rotation = 0;
//ホイールを実装してみよう
window.addEventListener("wheel", (e) => {
  speed += e.deltaY * 0.00015;
  // console.log(speed)
});

const rot = () => {
  rotation += speed;
  speed *= 0.93;
  //ジオメトリ全体を回転させる
  //3.8はどれくらいの大きさで回るかを指定した数値
  //Math.PI / 2 = 90°
  //Math.PI= 180°
  //3 * (Math.PI / 2) = 270°

  mesh1.position.x = 2 + 3.8 * Math.cos(rotation); //0°の場所に指定
  mesh1.position.z = -3 + 3.8 * Math.sin(rotation); //0°の場所に指定
  mesh2.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI / 2); //90°の場所に指定
  mesh2.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI / 2); //90°の場所に指定
  mesh3.position.x = 2 + 3.8 * Math.cos(rotation + Math.PI); //180°の場所に指定
  mesh3.position.z = -3 + 3.8 * Math.sin(rotation + Math.PI); //180°の場所に指定
  mesh4.position.x = 2 + 3.8 * Math.cos(rotation + 3 * (Math.PI / 2)); //270°の場所に指定
  mesh4.position.z = -3 + 3.8 * Math.sin(rotation + 3 * (Math.PI / 2)); //270°の場所に指定

  window.requestAnimationFrame(rot);
};

rot();

//カーソルの位置を取得
const cursor = {
  x: 0,
  y: 0,
};
// console.log(cursor);

window.addEventListener("mousemove", (e) => {
  cursor.x = e.clientX / sizes.width - 0.5;
  cursor.y = e.clientY / sizes.height - 0.5;

  // console.log(cursor.x);
  // console.log(e.clientY)
});

//アニメーション

const clock = new THREE.Clock();

const animate = () => {
  renderer.render(scene, camera);

  let getDeltaTime = clock.getDelta();
  // console.log(getDeltaTime)

  for (let x = 0; x < meshes.length; x++) {
    meshes[x].rotation.x += 0.1 * getDeltaTime;
    meshes[x].rotation.y += 0.12 * getDeltaTime;
  }

  //カメラの制御をしよう
  camera.position.x += cursor.x * getDeltaTime * 1.1;
  camera.position.y += -cursor.y * getDeltaTime * 1.1;

  window.requestAnimationFrame(animate);
};

animate();
