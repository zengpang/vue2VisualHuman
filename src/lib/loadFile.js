import * as THREE from 'three';
import { TGALoader } from "three/examples/jsm/loaders/TGALoader";
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
export function loadTexture(path)
{
   
}
export function loadTextures()
{
    return new Promise((resolve) => {
       
    })
}
