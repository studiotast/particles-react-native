import { useTexture } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber/native";
import React, { useEffect, useRef } from "react";
import { Dimensions } from "react-native";
import * as THREE from "three";
import { Image as CanvasImage } from "react-native-canvas";
import { particleVertexShader } from "./vertex";
import { particleFragmentShader } from "./fragment";

const glow =
  "data:image/png;base64,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";

export default function Particles({
  htmlCanvas,
}: {
  htmlCanvas: React.RefObject<HTMLCanvasElement>;
}) {
  const particlesGeometry = useRef();
  const interactivePlane = useRef();
  const { size, raycaster, camera } = useThree();
  const pixelRatio = Math.min(Dimensions.get("screen").scale, 2);

  // Fixed texture dimensions
  const TEXTURE_WIDTH = 128;
  const TEXTURE_HEIGHT = 128;

  // Initialize displacement with fixed dimensions
  const displacement = useRef({
    data: new Float32Array(TEXTURE_WIDTH * TEXTURE_HEIGHT * 4),
    texture: null as THREE.DataTexture | null,
    glowImage: null,
    canvasCursor: new THREE.Vector2(9999, 9999),
    canvasCursorPrevious: new THREE.Vector2(9999, 9999),
  });

  useEffect(() => {
    console.log(htmlCanvas);
    htmlCanvas.current.width = 128;
    htmlCanvas.current.height = 128;
    const ctx = htmlCanvas.current.getContext("2d");
    ctx.fillRect(0, 0, 128, 128);

    // Context
    displacement.current.context = htmlCanvas.current.getContext("2d");
    displacement.current.context.fillRect(
      0,
      0,
      htmlCanvas.current.width,
      htmlCanvas.current.height
    );

    // Glow image
    displacement.current.glowImage = new CanvasImage(htmlCanvas.current);
    displacement.current.glowImage.src = glow;

    // Particles
    const intensitiesArray = new Float32Array(
      particlesGeometry.current.attributes.position.count
    );
    const anglesArray = new Float32Array(
      particlesGeometry.current.attributes.position.count
    );

    for (
      let i = 0;
      i < particlesGeometry.current.attributes.position.count;
      i++
    ) {
      intensitiesArray[i] = Math.random();
      anglesArray[i] = Math.random() * Math.PI * 2;
    }
    particlesGeometry.current.setAttribute(
      "aIntensity",
      new THREE.BufferAttribute(intensitiesArray, 1)
    );
    particlesGeometry.current.setAttribute(
      "aAngle",
      new THREE.BufferAttribute(anglesArray, 1)
    );

    // Performance improvement
    particlesGeometry.current.setIndex(null);
    particlesGeometry.current.deleteAttribute("normal");
  }, []);

  // Gebruik useLoader om de afbeelding te laden als texture
  const pictureTexture = useTexture(require("./assets/picture-1.png"));
  // displacement.current.texture = new THREE.CanvasTexture(htmlCanvas.current);

  // Animation frame updates with error handling
  useFrame(() => {
    /**
     * Raycaster
     */
    // const intersections = raycaster.intersectObject(interactivePlane.current);

    // if (intersections.length) {
    //   // console.log(intersections, "intersections");
    //   const uv = intersections[0].uv;
    //   displacement.current.canvasCursor.x = uv.x * htmlCanvas.current.width;
    //   displacement.current.canvasCursor.y =
    //     (1 - uv.y) * htmlCanvas.current.height;
    // }
    /**
     * Displacement
     */
    // Fade out
    displacement.current.context.globalCompositeOperation = "source-over";
    displacement.current.context.globalAlpha = 0.02;
    displacement.current.context.fillRect(
      0,
      0,
      htmlCanvas.current.width,
      htmlCanvas.current.height
    );

    // Speed alpha
    const cursorDistance = displacement.current.canvasCursorPrevious.distanceTo(
      displacement.current.canvasCursor
    );
    displacement.current.canvasCursorPrevious.copy(
      displacement.current.canvasCursor
    );
    const alpha = Math.min(cursorDistance * 0.1, 1);

    // Draw glow
    const glowSize = htmlCanvas.current.width * 0.25;
    displacement.current.context.globalCompositeOperation = "lighten";
    displacement.current.context.globalAlpha = alpha;
    displacement.current.context.drawImage(
      displacement.current.glowImage,
      displacement.current.canvasCursor.x - glowSize * 0.5,
      displacement.current.canvasCursor.y - glowSize * 0.5,
      glowSize,
      glowSize
    );

    // Texture
    // displacement.current.texture.needsUpdate = true;
  });

  return (
    <>
      <points>
        <planeGeometry ref={particlesGeometry} args={[10, 10, 128, 128]} />
        <shaderMaterial
          vertexShader={particleVertexShader}
          fragmentShader={particleFragmentShader}
          uniforms={{
            uResolution: {
              value: new THREE.Vector2(
                size.height * pixelRatio,
                size.width * pixelRatio
              ),
            },
            uPictureTexture: { value: pictureTexture },
            uDisplacementTexture: { value: displacement.current.texture },
          }}
        />
      </points>
      <mesh ref={interactivePlane} visible={false}>
        <planeGeometry args={[10, 10]} />
        <meshBasicMaterial />
      </mesh>
    </>
  );
}
