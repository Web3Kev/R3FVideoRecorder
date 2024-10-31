import React, { useMemo } from 'react';
import { Float,OrbitControls } from '@react-three/drei';
import { Bloom, DepthOfField, EffectComposer, Noise, Vignette } from '@react-three/postprocessing'

const RandomObj = ({ isCube }) => {
  
    const objects = useMemo(() => {
      return Array.from({ length: 20 }).map((_, index) => {
        const positionX = Math.random() * 4 - 2;
        const positionY = Math.random() * 4 - 2;
        const positionZ = Math.random() * 4 - 2;
        const scale = Math.random() * 0.2 + 0.3;
  
        return (
          <Float>
            <mesh
              key={index}
              position={[positionX, positionY, positionZ]}
              scale={[scale, scale, scale]}
            >
              {isCube ? (
                <boxGeometry args={[1, 1, 1]} />
              ) : (
                <sphereGeometry args={[0.5, 32, 32]} />
              )}
              <meshStandardMaterial color={"white"} />
            </mesh>
          </Float>
        );
      });
    }, [isCube]);
  
    return <>{objects}</>;
  };


export default function Experience() {

    return (
    <>
        
        <ambientLight color={"#363638"} intensity={2} />
        <pointLight
            position={[0, 4, 0]}
            intensity={5}
            color={"white"}
            distance={5} 
            decay={1}  
        />
        <pointLight
            position={[0, 0, 0]}
            intensity={8}
            color={"hotpink"}
            distance={20} 
            decay={1}  
        />
        <pointLight
            position={[4, 0, 0]}
            intensity={10}
            color={"yellow"}
            distance={20} 
            decay={0.5}  
        />
        <pointLight
            position={[-4, 0, 0]}
            intensity={15}
            color={"red"}
            distance={10} 
            decay={1}  
        />
        <pointLight
            position={[0, 0, -4]}
            intensity={5}
            color={"orange"}
            distance={10} 
            decay={.5}  
        />
        <pointLight
            position={[0, 0, 4]}
            intensity={15}
            color={"purple"}
            distance={5} 
            decay={1}  
        />


        <RandomObj isCube={true}/>
        <RandomObj isCube={false}/>

        <EffectComposer>
            {/* <DepthOfField focusDistance={0} focalLength={0.02} bokehScale={2} height={480} /> */}
            <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={400} />
            {/* <Vignette eskil={false} offset={0.1} darkness={1.1} /> */}
        </EffectComposer>

        <OrbitControls
          target={[0, 0, 0]}
          enableDamping={true} 
          dampingFactor={0.05} 
          rotateSpeed={0.5} 
          autoRotate={true}
          autoRotateSpeed={1.2}
        />
    </>
    )
};