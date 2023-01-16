
import { CubeTextureLoader,TextureLoader } from "three";
import { TGALoader } from "three/examples/jsm/loaders/TGALoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
//本地文件读取
export function loadFile(path)
{
    let xhr = new XMLHttpRequest(),
    okStatus = document.location.protocol === "file:" ? 0 : 200;
    xhr.open('GET', path, false);
    xhr.overrideMimeType("text/html;charset=utf-8");//默认为utf-8
    xhr.send(null);
    return xhr.status === okStatus ? xhr.responseText : null;
}
//图片类型
const textureType={
   
   "png":1,
   "tga":2,
   "hdr":3
}
//读取单张图片
export function loadTexture(path,isCube=false,loadSuccess,loadFail)
{
   let resultTexture=null;
   if(isCube)
   {
      resultTexture=new CubeTextureLoader().load(path);
      return resultTexture;
   }
   const type=path.split(".").slice(-1);
 
   
   switch(textureType[type])
   {
     case textureType.png:{
        resultTexture= new TextureLoader().load(path,loadSuccess,loadFail);
     };break;
     case textureType.tga:{
        resultTexture= new TGALoader().load(path,loadSuccess,loadFail);
     };break;
   }
   return resultTexture;
}
export function loadModel(modelPath,bodyMat,headerMat,pos)
{
   return new Promise(resolve => {
      let loader = new FBXLoader();
      loader.load(modelPath,object=>{
         let showModel = object;
         showModel.position.set(pos[0], pos[1], pos[2]);
         // geometry.center(); //居中显示
         showModel.children[1].material[0] = bodyMat;
         showModel.children[1].material[1] = headerMat;
         showModel.traverse(function(child){
            if (child.isMesh) {
               child.castShadow = true;
               child.receiveShadow = true;
             }
         })
         
         resolve(showModel);
      })
   })
}


