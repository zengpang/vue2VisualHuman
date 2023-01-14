import * as THREE from 'three';
//材质信息
let materialInfo={
    //身体材质信息
    bodyMatInfo:{
        _mainColor: { value: new THREE.Vector3(1.0, 1.0, 1.0) },
        lightPosition: { value: new THREE.Vector3(200, 130, 250) },
        tilling: { value: new THREE.Vector2(1, 1) },
        _MainTex: { value: null },
        _CompMaskTex: { value: null },
        _NormalTex: { value: null },
        _sssTexture: { value: null },
        _speculaColor: { value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0) },
        _specularPow: { value: 83 },
        _roughnessAdj: { value: -0.126 },
        _metalAdj: { value: 0.241 },
        _shadowInit: { value: 0.2 },
        _sssVOffset: { value: 0.703 },
        _sssUOffset: { value: 0.646 },
        _skinLightValue: { value: 0.831 },
        _skinSpecValue: { value: 0.15 },
        _Expose: { value: 1.5 },
        _cubeMap: { value: null }
    },
    //头部材质信息
    headMatInfo:{
        lightPosition: { value: new THREE.Vector3(200, 130, 250) },
        tilling: { value: new THREE.Vector2(1, 1) },
        _MainTex: { value: null },
        _NormalTex: { value: null },
        _specularPow: { value: 3 },
        _roughnessAdj: { value: 0.23 },
        _metalAdj: { value: -0.033 },
        
        _HairColor: { value: new THREE.Vector3(0.0, 0.0,0.0,1.0) },
        _AnsionMap:{value:null},
        _AnsionMap_ST:{value:new THREE.Vector4(1.0, 1.0, 0.0, 0.0)},

        _speculaColor1: { value: new THREE.Vector4(0.01568628, 0.01568628, 0.01568628, 1.0) },
        _specShininess1:{value:0.2},
        _specNoise1:{value:1},
        _specOffset1:{value:0},
        
        _speculaColor2: { value: new THREE.Vector4(0.01568628, 0.01568628, 0.01568628, 1.0) },
        _specShininess2:{value:0.071},
        _specNoise2:{value:0.5},
        _specOffset2:{value:0},                                     
        _shadowInit: { value: 0.2 },
        _Expose: { value: 0.3 },
        _cubeMap: { value: null }
    }
}

export {materialInfo}