<template>
    <div id="container">
       
    </div>
</template>
<style scoped>
#container {
    width: 100vw;
    height: 100vh;
}
</style>
<script>
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import agency from '../lib/agency';
import { loadFile,loadTexture } from '../lib/loadFile'
import { materialInfo, materialinit } from '../lib/material';

const $ = s => document.querySelector(s);
//展示模型
let showModel = null;
//摄像头
let camera = null;
//场景
let scene = null;
//动画
let animationMixers = [];
let clock = new THREE.Clock();
//动画文件路径
const animationPath = 'static/model/Naria@idie.FBX';
//灯光
let light = null;
let lightWorldPos = new THREE.Vector4(0.0, 0.0, 0.0);
//渲染器
let render = null;
//用户交互插件
let controls = null;
//模型路径
const modelPath = 'static/model/Naria.FBX';
//模型材质
let bodyMat = null;//身体材质
let headerMat = null;//头部材质
//贴图资源路径
const texturePath = "static/texture/Naria/";
//shader路径
const shaderPath = 'static/shader/ChacterBodyShader';
const hairShader = 'static/shader/ChacterHairShader';
//shader
let fragShaderStr = null;
let vertexShaderStr = null;
let fragHairShaderStr = null;
let vertexHairShaderStr = null;

export default {
    name: 'threeJsShow',
    props:[
        'lightPosition'
        ,'mainColor'
        ,'speculaColor'
        ,'specularPow'
        ,'roughnessAdj'
        ,'metalAdj'
        ,'shadowInit'
        ,'sssVOffset'
        ,'sssUOffset'
        ,'skinLightValue'
        ,'skinSpecValue'
        ,'Expose'
    ],
    data() {
        return {
            
        };
    },
    watch:{
        Expose:function(newVal,oldVal)
        {
            console.log(newVal);
        }
    },
    methods: {
        //读取贴图
        loadTexture() {
            return new Promise((resolve) => {
                console.log("加载中");
                let isLoading = true;
                const mainTexture = loadTexture(`${texturePath}Naria_D_3.tga`,false, (texture) => {
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    texture.repeat.set(4, 4);
                });
                //"static/texture/Naria/Naria_MCS.tga"
                const compMaskTex = loadTexture(`${texturePath}Naria_MCS.tga`);
                const normalTex = loadTexture(`${texturePath}Naria_N.tga`);
                const sssTex = loadTexture(`${texturePath}preintegrated_falloff_2D.png`);           
                const hairSpecMap = loadTexture(`${texturePath}_ShiftTexture01.tga`);
                const path = 'static/texture/Naria/pisa/';
                const format = '.png';
                const urls = [
                    path + 'px' + format, path + 'nx' + format,
                    path + 'py' + format, path + 'ny' + format,
                    path + 'pz' + format, path + 'nz' + format
                ];
                let cubeTex = loadTexture(urls,true);
                while (isLoading) {
                    if (mainTexture != null && compMaskTex != null && normalTex != null && sssTex != null && cubeTex != null) {
                        isLoading = false;
                    }
                }
                console.log("加载结束");
                resolve({ mainTexture, compMaskTex, normalTex, sssTex, cubeTex, hairSpecMap });
            });
        },
        //材质初始化
        async initMat() {
            fragShaderStr = loadFile(shaderPath + `.frag`);
            vertexShaderStr = loadFile(shaderPath + `.vert`);
            fragHairShaderStr = loadFile(hairShader + `.frag`);
            vertexHairShaderStr = loadFile(hairShader + `.vert`);
            bodyMat = materialinit(materialInfo.bodyMatInfo, true, true, vertexShaderStr, fragShaderStr, true);
            headerMat = materialinit(materialInfo.headMatInfo, true, true, vertexHairShaderStr, fragHairShaderStr, true);
            // bodyMat = new THREE.MeshLambertMaterial();
            let textures = await this.loadTexture();

            
            bodyMat.uniforms._MainTex.value = textures.mainTexture;
            bodyMat.uniforms._CompMaskTex.value = textures.compMaskTex;
            bodyMat.uniforms._NormalTex.value = textures.normalTex;
            bodyMat.uniforms._sssTexture.value = textures.sssTex;
            bodyMat.uniforms._cubeMap.value = textures.cubeTex;
            
            headerMat.uniforms._AnsionMap.value = textures.hairSpecMap;
            headerMat.uniforms._cubeMap.value = textures.cubeTex;
        },
        UpdateMat()
        {
           console.log("环境光强度为"+Expose);
        },
        //场景初始化
        initScene() {
            scene = new THREE.Scene();
            scene.background = new THREE.Color(0xa0a0a0);
        },
        //初始化摄像头
        initCamera() {
            camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
            // -7.951022465039643, y: 50.66599857875026, z: 84.02389415272548
            camera.position.set(-7.951022465039643, 50.66599857875026, 84.02389415272548);
            console.log(camera);
            camera.lookAt(new THREE.Vector3(0, 0, 0));
        },
        //初始化灯光
        initLight() {
            scene.add(new THREE.AmbientLight(0x444444));
            light = new THREE.SpotLight(0xffffff);
            // light.position.set(0, 1.25, 1.25);
            // light.position.set(0, -110, 20);
            light.matrixWorldAutoUpdate = true;
            light.position.set(200, 130, 250);
            lightWorldPos = light.position;

            console.log(lightWorldPos);
            //告诉点光需要开启阴影投射
            light.castShadow = true;
            light.shadow.bias = -0.000005;
            light.shadow.mapSize.width = 2048; //阴影贴图宽度设置为1024像素
            light.shadow.mapSize.height = 2048; //阴影贴图高度设置为1024像素
            let ligntCameraHelper = new THREE.SpotLightHelper(light, 20);
            ligntCameraHelper.visible = true;
            // let Ambient = new THREE.AmbientLight(0x404040, 2);
            scene.add(ligntCameraHelper);
            scene.add(light);
            let shadowCameraHelper = new THREE.CameraHelper(light.shadow.camera);
            shadowCameraHelper.visible = false;
            // let Ambient = new THREE.AmbientLight(0x404040, 2);
            scene.add(shadowCameraHelper);
        },
        initPlane() {
            console.log("绘制平面");
            let planeGeo = new THREE.PlaneGeometry(100, 100, 10, 10);//创建平面
            let planeMat = new THREE.MeshLambertMaterial({  //创建材料
                color: 0xFFFFFF,
                wireframe: false
            });
            let planeMesh = new THREE.Mesh(planeGeo, planeMat);//创建网格模型
            planeMesh.position.set(0, -30, 0);//设置平面的坐标
            planeMesh.rotation.x = -0.5 * Math.PI;//将平面绕X轴逆时针旋转90度
            planeMesh.receiveShadow = true;//允许接收阴影
            scene.add(planeMesh);//将平面添加到场景中
        },

        initModelFbx() {
            console.log('模型加载');
            let loader = new FBXLoader();
            loader.load(modelPath, function (object) {
                //模型身体材质
                let bodymat = bodyMat;
                //模型头发材质
                let headermat = headerMat;
                console.log(object);
                showModel = object;
                showModel.position.set(0, -30, 0);
                // geometry.center(); //居中显示
                showModel.children[1].material[0] = bodymat;
                showModel.children[1].material[1] = headermat;
                // showModel.children[1].material=mat;
                //开启阴影
                showModel.traverse(function (child) {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                    }

                });
                //添加骨骼辅助
                // let meshHelper = new THREE.SkeletonHelper(showModel);
                // scene.add(meshHelper);
                scene.add(showModel);
                console.log(showModel);
                console.log(showModel.children[1]);
            });

        },
        //渲染器初始化
        initRender() {
            render = new THREE.WebGLRenderer({ antialias: true });
            render.setSize(window.innerWidth, window.innerHeight);
            //修改渲染器输出格式
            render.outputEncoding = THREE.sRGBEncoding;
            render.shadowMap.enabled = true;
            render.shadowMap.type = THREE.PCFSoftShadowMap;
           
            //告诉渲染器需要阴影效果 
            render.setClearColor('#1F2025', 1.0);
            $('#container').appendChild(render.domElement);
        },
        //用户插件初始化
        initControls() {
            controls = new OrbitControls(camera, render.domElement);
            // 使动画循环使用时阻尼或自转 意思是否有惯性
            controls.enableDamping = true;
            //动态阻尼系数 就是鼠标拖拽旋转灵敏度
            //controls.dampingFactor = 0.25;
            //是否可以缩放
            controls.enableZoom = true;
            //是否自动旋转
            controls.autoRotate = true;
            controls.autoRotateSpeed = 0.5;
            //设置相机距离原点的最远距离
            controls.minDistance = 1;
            //设置相机距离原点的最远距离
            controls.maxDistance = 500;
            //是否开启右键拖拽
            controls.enablePan = true;
        },
        //载入模型动画
        initModelAnim() {
            console.log('动画加载');

            let loader = new FBXLoader();

            loader.load(animationPath, function (object) {
                //创建动画混合器，并指定模型，混合器会自动根据指定模型寻找骨骼，并绑定
                let mixer = new THREE.AnimationMixer(showModel);
                //添加至动画混合器数组
                animationMixers.push(mixer);
                //挂载动画
                showModel.animations.push(object.animations[0]);
                //获取动画片
                let action = mixer.clipAction(showModel.animations[0]);
                //播放动画片
                action.play();
            });
        },

        render() {
            render.render(scene, camera);
        },

        //窗口变动触发的函数
        onWindowResize() {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            this.render();
            render.setSize(window.innerWidth, window.innerHeight);
        },

        animate() {
            //更新
            requestAnimationFrame(this.animate);
            if (animationMixers.length > 0) {
                //遍历并更新所有动画混合器
                animationMixers[0].update(clock.getDelta());
            }
            this.render();
        },
        //绘制
        draw() {
            this.initScene();
            this.initMat();
            this.initCamera();
            this.initRender();
            this.initLight();
            this.initPlane();
            this.initModelFbx();
            this.initControls();
            this.initModelAnim();
            this.animate();
            window.onresize = this.onWindowResize;
        }

    },
    mounted() {
        this.draw();
    },
    created(){
        agency.$on('updateMat',this.UpdateMat);
    }
}
</script>