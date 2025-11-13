import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
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

  const tempGroup = new THREE.Group();
  tempGroup.add(bodyObj.clone());
  const box = new THREE.Box3().setFromObject(tempGroup);
  const center = box.getCenter(new THREE.Vector3());
  
  const size = React.useMemo(() => {
    const s = new THREE.Vector3();
    box.getSize(s);
    return s;
  }, [box]);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.PI;
    }
    onCenterCalculated(size);
  }, [onCenterCalculated, size]);

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
      const headTargetY = mousePosition.current.x * 0.3;///////////////////////////////////////////////////////////////////////////// head follow mouse rotation strength
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
    <group ref={groupRef} scale={[0.8, 0.8, 0.8]}>
      <primitive object={bodyObj} position={bodyOffset} />
      <group ref={headRef} position={headOffset}>
        <CowHead position={[0, 0, 0]} />
      </group>
    </group>
  );
}

export default function ThreeD() {
  const sizeRef = useRef(new THREE.Vector3());
  const cameraRef = useRef();
  const mousePosition = useRef({ x: 0, y: 0 });
  const containerRef = useRef();

  function handleCenter(size) {
    sizeRef.current = size;
  }

  useLayoutEffect(() => {
    if (!cameraRef.current) return;
    const s = sizeRef.current;
    const maxDim = Math.max(s.x, s.y, s.z);
    const dist = maxDim * 4;
    cameraRef.current.position.set(0, 0, dist);
    cameraRef.current.lookAt(0, 0, 0);
  });

  useEffect(() => {
    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      mousePosition.current = { x, y };
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        position: "fixed",
        bottom: "0vw",
        right: "0vw",
        width: "60vw",
        height: "60vw",
        maxWidth: "800px",
        maxHeight: "800px",
        zIndex: 9999,
        pointerEvents: "none",
      }}
    >
      <Canvas>
        <perspectiveCamera ref={cameraRef} makeDefault fov={40} />
        <ambientLight intensity={0.8} />
        <directionalLight position={[3, 3, 3]} intensity={1.2} />
        <CowModel onCenterCalculated={handleCenter} mousePosition={mousePosition} />
      </Canvas>
    </div>
  );
}