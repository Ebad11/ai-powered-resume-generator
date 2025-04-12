import React, { forwardRef } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';

const Robo1 = forwardRef((props, ref) => {
  const group = React.useRef();
  const { nodes, materials, animations } = useGLTF('/Robo1.gltf');
  const { actions } = useAnimations(animations, group);

  React.useImperativeHandle(ref, () => group.current);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Sketchfab_Scene">
        <group name="Sketchfab_model" rotation={[-Math.PI / 2, 0, 0]} scale={0.017}>
          <group name="8cfcbf279e5145b29fef01b31cc1d658fbx" rotation={[Math.PI / 2, 0, 0]}>
            <group name="Object_2">
              <group name="RootNode">
                <group name="sphere_body" rotation={[-Math.PI / 2, 0, 0]} scale={100}>
                  <mesh name="sphere_body_glossy_paint_white_0" geometry={nodes.sphere_body_glossy_paint_white_0.geometry} material={materials.glossy_paint_white} />
                  <mesh name="sphere_body_black_matte_0" geometry={nodes.sphere_body_black_matte_0.geometry} material={materials.black_matte} />
                  <mesh name="sphere_body_metal_0" geometry={nodes.sphere_body_metal_0.geometry} material={materials.metal} />
                  <mesh name="sphere_body_eyes_light_0" geometry={nodes.sphere_body_eyes_light_0.geometry} material={materials.eyes_light} />
                  <mesh name="sphere_body_dark_glass_0" geometry={nodes.sphere_body_dark_glass_0.geometry} material={materials.dark_glass} />
                  <mesh name="sphere_body_black_matter_blender_0" geometry={nodes.sphere_body_black_matter_blender_0.geometry} material={materials.black_matter_blender} />
                  <mesh name="sphere_body_thruster_light_0" geometry={nodes.sphere_body_thruster_light_0.geometry} material={materials.thruster_light} />
                  <mesh name="sphere_body_blender_glass_0" geometry={nodes.sphere_body_blender_glass_0.geometry} material={materials.blender_glass} />
                </group>
              </group>
            </group>
          </group>
        </group>
      </group>
    </group>
  );
});

useGLTF.preload('/Robo1.gltf');

export default Robo1;