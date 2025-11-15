// App.jsx
import { useEffect, useRef } from "react";
import * as THREE from "three";

// --- Imported Textures (required for GitHub Pages) --- //
import starsImg from "./assets/stars.png";
import marsImg from "./assets/Mars.jpg";
import jupiterImg from "./assets/Jupiter.jpg";
import saturnImg from "./assets/Saturn.jpg";
import neptuneImg from "./assets/Neptune.jpg";
import earthImg from "./assets/The_Earth_seen_from_Apollo.jpg";
import ufoImg from "./assets/ufo.png";

export default function App() {
  const mountRef = useRef(null);

  useEffect(() => {
    // ----- SCENE SETUP -----
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      2000
    );
    camera.position.z = 300;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    // ----- TEXTURE LOADER -----
    const textureLoader = new THREE.TextureLoader();

    const starsTexture = textureLoader.load(starsImg);

    // ----- STAR BACKGROUND -----
    const starGeo = new THREE.SphereGeometry(900, 64, 64);
    const starMat = new THREE.MeshBasicMaterial({
      map: starsTexture,
      side: THREE.BackSide,
    });
    const starField = new THREE.Mesh(starGeo, starMat);
    scene.add(starField);

    // ----- PLANET DATA -----
    const planets = [
      { id: "earth", map: earthImg, size: 40, orbit: 160 },
      { id: "mars", map: marsImg, size: 28, orbit: 220 },
      { id: "jupiter", map: jupiterImg, size: 65, orbit: 300 },
      { id: "saturn", map: saturnImg, size: 55, orbit: 380 },
      { id: "neptune", map: neptuneImg, size: 40, orbit: 450 },
    ];

    // ----- PLANET MESH GENERATION -----
    const planetMeshes = [];

    planets.forEach((planet, i) => {
      const geo = new THREE.SphereGeometry(planet.size, 32, 32);
      const mat = new THREE.MeshStandardMaterial({
        map: textureLoader.load(planet.map),
      });

      const mesh = new THREE.Mesh(geo, mat);

      mesh.position.x = planet.orbit;
      mesh.orbit = planet.orbit;
      mesh.angle = Math.random() * Math.PI * 2;

      scene.add(mesh);
      planetMeshes.push(mesh);
    });

    // ----- LIGHT -----
    const light = new THREE.PointLight(0xffffff, 2);
    light.position.set(0, 0, 0);
    scene.add(light);

    // ----- UFO -----
    const ufoTexture = textureLoader.load(ufoImg);
    const ufoGeo = new THREE.PlaneGeometry(50, 50);
    const ufoMat = new THREE.MeshBasicMaterial({
      map: ufoTexture,
      transparent: true,
    });
    const ufo = new THREE.Mesh(ufoGeo, ufoMat);
    ufo.position.set(-100, 100, 0);
    scene.add(ufo);

    // ----- ANIMATION LOOP -----
    const animate = () => {
      requestAnimationFrame(animate);

      starField.rotation.y += 0.0008;

      planetMeshes.forEach((p) => {
        p.angle += 0.002;
        p.position.x = Math.cos(p.angle) * p.orbit;
        p.position.z = Math.sin(p.angle) * p.orbit;
        p.rotation.y += 0.01;
      });

      ufo.position.x += 0.3;
      if (ufo.position.x > 400) ufo.position.x = -400;

      renderer.render(scene, camera);
    };

    animate();

    // ----- CLEANUP -----
    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} id="canvas-container"></div>;
}
