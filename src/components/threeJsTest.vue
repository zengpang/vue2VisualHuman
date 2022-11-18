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
import { TGALoader } from "three/examples/jsm/loaders/TGALoader";
import { mergeUniforms } from 'three/src/renderers/shaders/UniformsUtils.js'
import { UniformsLib } from 'three/src/renderers/shaders/UniformsLib.js'

const $ = s => document.querySelector(s);
//展示模型
let showModel = null;
let showModelBone = null;
//摄像头
let camera = null;
//场景
let scene = null;
//动画
let animationMixers = [];
let clock = new THREE.Clock();
//动画文件路径
let animationPath = 'static/model/Naria@idie.FBX';
//灯光
let light = null;
//渲染器
let render = null;
//用户交互插件
let controls = null;
//模型路径
let modelPath = 'static/model/Naria.FBX';
//模型材质
let modelMat = null;
//shader路径
let shaderPath = 'static/shader/ChacterBodyShader';
//shader
let fragShaderStr = null;
let vertexShaderStr = null;

export default {
    name: 'threeJsTest',
    data() {
        return {

        };
    },
    methods: {
        //本地文件读取
        load(name) {
            let xhr = new XMLHttpRequest(),
                okStatus = document.location.protocol === "file:" ? 0 : 200;
            xhr.open('GET', name, false);
            xhr.overrideMimeType("text/html;charset=utf-8");//默认为utf-8
            xhr.send(null);
            return xhr.status === okStatus ? xhr.responseText : null;
        },
        loadTexture() {
            return new Promise(() => {
                console.log("加载中");
                var isLoading = true;
                var mainTexture = new TGALoader().load("static/texture/Naria/Naria_D_3.tga",(texture)=>{
                    texture.wrapS=THREE.RepeatWrapping;
                    texture.wrapT=THREE.RepeatWrapping;
                    texture.repeat.set( 4, 4 );
                   
                });
               
                var compMaskTex = new TGALoader().load("static/texture/Naria/Naria_MCS.tga");
                var normalTex = new TGALoader().load("static/texture/Naria/Naria_N.tga");
                const path = 'static/texture/Naria/pisa/';
                const format = '.png';
                const urls = [
                    path + 'px' + format, path + 'nx' + format,
                    path + 'py' + format, path + 'ny' + format,
                    path + 'pz' + format, path + 'nz' + format
                ];
                while (isLoading) {
                    if (mainTexture != null && compMaskTex != null && normalTex != null) {
                    
                        
                        isLoading = false;
                        modelMat = new THREE.ShaderMaterial({
                            uniforms:
                            //  mergeUniforms([
                            //     UniformsLib.lights,
                            //     // UniformsLib.fog, 
                                {
                                    _mainColor: { value: new THREE.Vector3(1.0, 1.0, 1.0) },
                                    lightPosition: { value: new THREE.Vector3(-50, 60, 15) },
                                    tilling: { value: new THREE.Vector2(1, 1) },
                                    _MainTex: { value: mainTexture },
                                    _CompMaskTex: { value: compMaskTex },
                                    _NormalTex: { value: normalTex },
                                    _sssTexture: { value: new THREE.TextureLoader().load("static/texture/Naria/preintegrated_falloff_2D.png") },
                                    _speculaColor: { value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0) },
                                    _specularPow: { value: 83 },
                                    _roughnessAdj: { value: -0.126 },
                                    _metalAdj: { value: 0.241 },
                                    _shadowInit: { value: 0.2 },
                                    _sssVOffset: { value: 0.703 },
                                    _sssUOffset: { value: 0.646 },
                                    _skinLightValue: { value: 0.831 },
                                    _skinSpecValue: { value: 0.2 },
                                     _Expose:{value:1.8},
                                     _cubeMap:{value:new THREE.CubeTextureLoader().load(urls)}

                                },
                            // ]),

                            //236,65,65
                            vertexShader: vertexShaderStr,
                            fragmentShader: fragShaderStr,
                            // lights: true,
                            // dithering: true,

                        });
                    }
                }
                console.log("加载结束");
            });
        },
        //材质初始化
        async initMat() {
            //获取原生shader代码
            let fragStr = THREE.ShaderLib["shadow"].fragmentShader;
            let VertStr = THREE.ShaderLib["shadow"].vertexShader;
            console.log(fragStr);
            console.log(VertStr);
            // console.log(THREE.ShaderLib["shadow"].uniforms);
            fragShaderStr = this.load(shaderPath + `.frag`);
            vertexShaderStr = this.load(shaderPath + `.vert`);
 
            modelMat = new THREE.MeshLambertMaterial();
            await this.loadTexture();
            //  mainTexture = new TGALoader().load("static/texture/Naria/Naria_D_3.tga", function (mainTexture) {
            //     modelMat = new THREE.ShaderMaterial({
            //         uniforms: mergeUniforms([
            //             UniformsLib.lights,
            //             // UniformsLib.fog, 
            //             {
            //                 _mainColor: { value: new THREE.Vector3(1.0, 1.0, 1.0) },
            //                 lightPosition: { value: new THREE.Vector3(-50, 60, 15) },
            //                 tilling: { value: new THREE.Vector2(1, 1) },
            //                 _MainTex: { value: mainTexture },
            //                 // _CompMaskTex: {value: new TGALoader().load("static/texture/Naria/Naria_MCS.tga")},
            //                 _NormalTex: { value: new TGALoader().load("static/texture/Naria/Naria_N.tga") },
            //                 //_sssTexture:{value: new THREE.TextureLoader().load("static/texture/Naria/preintegrated_falloff_2D.png")},
            //                 _speculaColor:{value:new THREE.Vector4(1.0,1.0,1.0,1.0)},
            //                 _specularPow:{value:35},
            //                 _roughnessAdj: { value: 0.263 },
            //                 _metalAdj: { value: -0.1},
            //                 _shadowInit: { value: 0.2 },
            //                 _sssVOffset: { value: 0.5 },
            //                 _sssUOffset: { value: 0.4 },
            //                 _skinLightValue: { value: 1 },
            //                 _skinSpecValue: { value: 0.1 },


            //             }
            //         ]),

            //         //236,65,65
            //         vertexShader: vertexShaderStr,
            //         fragmentShader: fragShaderStr,
            //         lights: true,
            //         dithering: true,

            //     });
            // });


            // while(isLoading)
            // {

            // }

            // modelMat = new THREE.ShaderMaterial({

            //     uniforms: {

            //         _mainColor: { value: new THREE.Vector3(1.0, 1.0, 1.0) },
            //         lightPosition: { value: new THREE.Vector3(0, -10, 0) },
            //         tilling: { value: new THREE.Vector2(1, 1) },
            //         _MainTex:{value: mainTexture},
            //         _NormalTex: { value: new TGALoader().load("static/texture/Naria/Naria_N.tga") },
            //         _roughness: { value: 1.0 },
            //         _roughnessContrast: { value: 1.06 },
            //         _roughnessInit: { value: 1.92 },
            //         _roughnessMin: { value: 0.0 },
            //         _roughnessMax: { value: 0.7 }
            //     },
            //     //236,65,65
            //           vertexShader: vertexShaderStr,
            //           fragmentShader: fragShaderStr,
            //         //   lights: true,
            // //     dithering: true,


            // });
            // modelMat = new THREE.ShaderMaterial({
            //     uniforms: mergeUniforms([
            //         UniformsLib.lights,
            //         // UniformsLib.fog, 
            //         {
            //         _mainColor: { value: new THREE.Vector3(1.0, 1.0, 1.0) },
            //         lightPosition: { value: new THREE.Vector3(0, -10, 0) },
            //         tilling: { value: new THREE.Vector2(1, 1) },
            //         _MainTex:{value: new TGALoader().load("static/texture/Naria/Naria_D_3.tga")},
            //         _NormalTex: { value: new TGALoader().load("static/texture/Naria/Naria_N.tga") },
            //         _roughness: { value: 1.0 },
            //         _roughnessContrast: { value: 1.06 },
            //         _roughnessInit: { value: 1.92 },
            //         _roughnessMin: { value: 0.0 },
            //         _roughnessMax: { value: 0.7 }
            //         }
            //     ]),

            //     //236,65,65
            //     vertexShader: vertexShaderStr,
            //     fragmentShader: fragShaderStr,
            //     lights: true,
            //     dithering: true,



            // });

            // // 阴影shader
            // modelMat = new THREE.ShaderMaterial({
            //     uniforms: mergeUniforms([
            //         UniformsLib.lights,
            //         UniformsLib.fog,
            //     ]),
            //     vertexShader: vertexShaderStr,
            //     fragmentShader: fragShaderStr,
            //     lights: true,
            //     dithering: true,

            //     //     wireframe: false
            // });
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
            // scene.add(new THREE.AmbientLight(0x444444));
            light = new THREE.SpotLight(0xffffff);
            // light.position.set(0, 1.25, 1.25);
            // light.position.set(0, -110, 20);
            light.position.set(-50, 60, 15);

            //告诉点光需要开启阴影投射
            light.castShadow = true;
            light.shadow.bias = -0.000005;
            light.shadow.mapSize.width = 2048; //阴影贴图宽度设置为1024像素
            light.shadow.mapSize.height = 2048; //阴影贴图高度设置为1024像素
            scene.add(light);
            //             var shadowCameraHelper = new THREE.CameraHelper(light.shadow.camera);
            // shadowCameraHelper.visible = true;
            // let Ambient = new THREE.AmbientLight(0x404040, 2);
            // scene.add(Ambient);
        },
        initPlane() {
            var planeGeo = new THREE.PlaneGeometry(100, 100, 10, 10);//创建平面
            var planeMat = new THREE.MeshLambertMaterial({  //创建材料
                color: 0xFFFFFF,
                wireframe: false
            });
            var planeMesh = new THREE.Mesh(planeGeo, planeMat);//创建网格模型
            planeMesh.position.set(0, -30, 0);//设置平面的坐标
            planeMesh.rotation.x = -0.5 * Math.PI;//将平面绕X轴逆时针旋转90度
            planeMesh.receiveShadow = true;//允许接收阴影
            scene.add(planeMesh);//将平面添加到场景中
        },

        initModelFbx() {
            console.log('模型加载');

            let loader = new FBXLoader();

            loader.load(modelPath, function (object) {
                //创建纹理
                var mat = modelMat;
                //     var mat=new THREE.MeshLambertMaterial({  //创建材料
                //     color: 0xFFFFFF,
                //     wireframe: false
                // });
                var headerMat=new THREE.MeshBasicMaterial({
                    color:0xFFFFFF
                });
                console.log(object);
                showModel = object;
                showModel.position.set(0, -30, 0);
                // geometry.center(); //居中显示
                showModel.children[1].material[0] = mat;

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
            //渲染器添加toneMapping效果
            // render.toneMapping = THREE.ACESFilmicToneMapping;
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
    }
}
</script>
