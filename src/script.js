import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Texture
 */
const textureLoader = new THREE.TextureLoader();
const bakedShadow = textureLoader.load("./textures/bakedShadow.jpg");
bakedShadow.colorSpace = THREE.SRGBColorSpace;

/**
 * Base
 */
// Debug
const gui = new GUI({
  width: 300,
});
const ambientLightTweaks = gui.addFolder("Ambient Light");
ambientLightTweaks.close();
const directionalLightTweaks = gui.addFolder("Directional Light");
directionalLightTweaks.close();
const spotLightTweaks = gui.addFolder("Spot Light");
spotLightTweaks.close();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
ambientLightTweaks
  .add(ambientLight, "intensity")
  .min(0)
  .max(3)
  .step(0.001)
  .name("Ambient Light Intensity");
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(2, 2, -1);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.width = 1024;
directionalLight.shadow.mapSize.height = 1024;
directionalLight.shadow.camera.top = 1;
directionalLight.shadow.camera.right = 1;
directionalLight.shadow.camera.bottom = -1;
directionalLight.shadow.camera.left = -1;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 6;
// directionalLight.shadow.radius = 9; // radius property doesn't work on PCFSoftShadowMap Algorithm

// Directional Light Camera Helper
const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
directionalLightCameraHelper.visible = false;
scene.add(directionalLightCameraHelper);

// Directional Light Tweaks
directionalLightTweaks
  .add(directionalLight, "intensity")
  .min(0)
  .max(3)
  .step(0.001)
  .name("Directional Light Intensity");
directionalLightTweaks
  .add(directionalLight.position, "x")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("Directional Light X");
directionalLightTweaks
  .add(directionalLight.position, "y")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("Directional Light Y");
directionalLightTweaks
  .add(directionalLight.position, "z")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("Directional Light Z");
directionalLightTweaks
  .add(directionalLightCameraHelper, "visible")
  .name("Light Camera Helper");
scene.add(directionalLight); // Add the DirectionalLight to the scene

// Spot Light
const spotLight = new THREE.SpotLight(0xffffff, 3.6, 10, Math.PI * 0.3);
spotLight.castShadow = true;
spotLight.position.set(0, 2, 2);
scene.add(spotLight);
scene.add(spotLight.target);
spotLight.shadow.mapSize.width = 1024;
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.fov = 30;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 6;

// Spot Light Camera helper
const spotLightCameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);
spotLightCameraHelper.visible = false;
scene.add(spotLightCameraHelper);

// Spot Light Tweaks
spotLightTweaks
  .add(spotLight, "intensity")
  .min(0)
  .max(10)
  .step(0.001)
  .name("Spot Light Intensity");
spotLightTweaks
  .add(spotLight.position, "x")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("Spot Light X");
spotLightTweaks
  .add(spotLight.position, "y")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("Spot Light Y");
spotLightTweaks
  .add(spotLight.position, "z")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("Spot Light Z");
spotLightTweaks
  .add(spotLightCameraHelper, "visible")
  .name("Light Camera Helper");

// Point Light
const pointLight = new THREE.PointLight(0xffffff, 2.7);
pointLight.castShadow = true;
pointLight.position.set(-1, 1, 0);
pointLight.shadow.mapSize.width = 1024;
pointLight.shadow.mapSize.height = 1024;
pointLight.shadow.camera.near = 0.1;
pointLight.shadow.camera.far = 5;
scene.add(pointLight);

// Point Light Helper
const pointLightCameraHelper = new THREE.CameraHelper(pointLight.shadow.camera);
pointLightCameraHelper.visible = false;
scene.add(pointLightCameraHelper);

// Point Light Tweaks

/**
 * Materials
 */
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.7;
gui.add(material, "metalness").min(0).max(1).step(0.001);
gui.add(material, "roughness").min(0).max(1).step(0.001);

/**
 * Objects
 */
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.castShadow = true; // Enabling the sphere to cast a shadow

const plane = new THREE.Mesh(
  new THREE.PlaneGeometry(5, 5),
  new THREE.MeshBasicMaterial({ map: bakedShadow })
); // Using bakedShadow
// const plane = new THREE.Mesh(
//   new THREE.PlaneGeometry(5, 5),
//   material
// ); // Using castShadow
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;
plane.receiveShadow = true; // Enabling the plane to recieve a shadow from the sphere

scene.add(sphere, plane);

/**
 * NOTES: Only the following types of lights support shadows
 *  - PointLight
 *  - DirectionalLight
 *  - SpotLight
 */

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = false; // Enabling the shadowMap
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
