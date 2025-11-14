import { Canvas, useLoader, useFrame } from "@react-three/fiber"; //uses react-three-fiber
//npm install three @react-three/fiber
//npm install three
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
// import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import * as THREE from "three";
import React, { useRef, useLayoutEffect, useState, useEffect } from "react";

function CowHeadWithMtl({ position }) {
  const mtl = useLoader(MTLLoader, "/assets/cow/head.mtl");
  mtl.preload();
  const obj = useLoader(OBJLoader, "/assets/cow/head.obj", (loader) => {
    loader.setMaterials(mtl);
  });
  obj.rotation.y = 0;
  return <primitive object={obj} position={position} />;
}

function CowHeadWithoutMtl({ position }) {
  const obj = useLoader(OBJLoader, "/assets/cow/head.obj");
  const texture = useLoader(THREE.TextureLoader, "/assets/cow/cowhead.png");
  obj.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshStandardMaterial({ map: texture });
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  obj.rotation.y = Math.PI;
  return <primitive object={obj} position={position} />;
}

function CowHead({ position }) {
  const [hasMtl, setHasMtl] = useState(null);

  useEffect(() => {
    fetch("/assets/cow/head.mtl")
      .then((res) => setHasMtl(res.ok))
      .catch(() => setHasMtl(false));
  }, []);

  if (hasMtl === null) return null;

  return hasMtl ? (
    <CowHeadWithMtl position={position} />
  ) : (
    <CowHeadWithoutMtl position={position} />
  );
}

function CameraController({ sizeRef, isReady }) {
  //const cameraRef = useRef();

  useFrame(({ camera }) => {
    if (isReady) {
      const distance = 11; ///////////////////////////////////////////////////////////////////////////// manual camera distance
      camera.position.set(0, 0, distance);
      camera.lookAt(0, -1, 0);
    }
  });

  return null;
}

function CowModel({ onCenterCalculated, mousePosition }) {
  const groupRef = useRef();
  const headRef = useRef();
  const bodyMtl = useLoader(MTLLoader, "/assets/cow/body.mtl");
  bodyMtl.preload();
  const bodyObj = useLoader(OBJLoader, "/assets/cow/body.obj", (loader) => {
    loader.setMaterials(bodyMtl);
  });

  const bodyPos = new THREE.Vector3(0, -1.62499, -0.2);
  const headPos = new THREE.Vector3(0, -0.75, -0.008517);
  const relativeHeadPos = headPos.sub(bodyPos);

  const center = new THREE.Vector3(0, 0, 0);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = 50 + Math.PI;
    }
  }, []);

  useFrame(() => {
    if (groupRef.current && mousePosition.current) {
      const targetRotationY = 50 + Math.PI + mousePosition.current.x * 0.15; ///////////////////////////////////////////////////////////////////////////// body rotation follow mouse strength
      const targetRotationX = mousePosition.current.y * -0.1;

      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        targetRotationY,
        0.1
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotationX,
        0.1
      );

      if (headRef.current) {
        const headTargetY = mousePosition.current.x * 0.3; ///////////////////////////////////////////////////////////////////////////// head follow mouse rotation strength
        const headTargetX = mousePosition.current.y * 0.4;

        headRef.current.rotation.y = THREE.MathUtils.lerp(
          headRef.current.rotation.y,
          headTargetY,
          0.15
        );
        headRef.current.rotation.x = THREE.MathUtils.lerp(
          headRef.current.rotation.x,
          headTargetX,
          0.15
        );
      }
    }
  });

  const bodyOffset = new THREE.Vector3().copy(center).negate();
  const headOffset = relativeHeadPos.clone().sub(center);

  return (
    ///////////////////////////////////////////////////////////////////////////// initial scale
    <group ref={groupRef} scale={[2, 2, 2]}>
      <primitive object={bodyObj} position={bodyOffset} />
      <group ref={headRef} position={headOffset}>
        <CowHead position={[0, 0, 0]} />
      </group>
    </group>
  );
}
export default function ThreeD() {
  const sizeRef = useRef(new THREE.Vector3());
  const mousePosition = useRef({ x: 0, y: 0 });
  const [isReady, setIsReady] = useState(false);

  function handleCenter(size) {
    sizeRef.current = size;
  }

  useEffect(() => {
    const initializeCow = () => {
      setTimeout(() => {
        setIsReady(true);
      }, 0);///////////////////////////////////////////////////////////////////// initial load delay
    };

    if (document.visibilityState === 'visible') {
      initializeCow();
    } else {
      const handleVisibilityChange = () => {
        if (document.visibilityState === 'visible') {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
          initializeCow();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);
      return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }
  }, []);

  useLayoutEffect(() => {
    if (!isReady) return;
    const timer = setTimeout(() => {}, 1000);
    return () => clearTimeout(timer);
  }, [isReady]);

  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      mousePosition.current = { x, y };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  if (!isReady) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        right: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
      }}
    >
      <Canvas shadows>
        <perspectiveCamera makeDefault fov={40} />
        <CameraController sizeRef={sizeRef} isReady={isReady} />
        <ambientLight intensity={0.4} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
        <directionalLight
          position={[-5, 0, -5]}
          intensity={1}
          color="#ffdd45"
        />
        <CowModel
          onCenterCalculated={handleCenter}
          mousePosition={mousePosition}
        />
      </Canvas>
    </div>
  );
}