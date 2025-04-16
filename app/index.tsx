import { PerspectiveCamera } from "@react-three/drei";
import React, { useRef } from "react";
import { Canvas as THREECanvas } from "@react-three/fiber";
import Canvas from "react-native-canvas";
import Particles from "./Particles";

export default function Index() {
  const htmlCanvas = useRef();

  return (
    <>
      <Canvas
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: 128,
          height: 128,
          zIndex: 100,
        }}
        ref={htmlCanvas}
      />
      <THREECanvas
        //   gl={{ physicallyCorrectLights: true }}
        camera={{ position: [0, 0, 18], fov: 35 }}
        onCreated={(state) => {
          state.gl.setClearColor("#181818");
          const _gl = state.gl.getContext();
          const pixelStorei = _gl.pixelStorei.bind(_gl);
          _gl.pixelStorei = function (...args) {
            const [parameter] = args;
            switch (parameter) {
              case _gl.UNPACK_FLIP_Y_WEBGL:
                return pixelStorei(...args);
            }
          };
        }}
      >
        <ambientLight />
        <PerspectiveCamera makeDefault position={[0, 0, 18]} />
        <Particles htmlCanvas={htmlCanvas} />
      </THREECanvas>
    </>
  );
}
