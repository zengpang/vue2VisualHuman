
#include <common>
#include <packing>

#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
   #include <dithering_pars_fragment>
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;//从模型空间转世界空间坐标系
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform vec3 color;
uniform vec3 lightPosition;
uniform vec3 _mainColor;
//贴图
// uniform sampler2D _MainTex;
uniform sampler2D _NormalTex;
uniform samplerCube _cubeMap;

//高光
uniform vec4 _LightColor0;
uniform float _shadowInit;

//头发高光1
uniform vec3 _HairColor;
uniform sampler2D _AnsionMap;
uniform vec4 _AnsionMap_ST;
uniform vec4 _speculaColor1;
uniform float _specShininess1;
uniform float _specNoise1;
uniform float _specOffset1;

//头发高光2
uniform vec4 _speculaColor2;
uniform float _specShininess2;
uniform float _specNoise2;
uniform float _specOffset2;
uniform float _specularPow;

//粗糙度
uniform float _roughnessAdj;
uniform float _metalAdj;

//环境贴图
uniform vec4 _cubeMap_HDR;
uniform float _Expose;



uniform vec2 tilling;
varying vec3 objectPos;
varying vec3 vNormal;
varying vec3 worldPos;


varying vec2 vUv;

vec3 ACETompping(vec3 x)
{
    float a=2.51;
    float b=.03;
    float c=2.43;
    float d=.59;
    float e=.14;
    return saturate((x*(a*x+b))/(x*(c*x+d)+e));
}
vec4 lerp(vec4 a,vec4 b,vec4 w)
{
    return a+w*(b-a);
    
}
vec3 lerp(float a,vec3 b,float w)
{
    return vec3(a,a,a)+vec3(w,w,w)*vec3(b.x-a,b.y-a,b.z-a);
}
float lerp(float a,float b,float w)
{
    return a+w*(b-a);
    
}
vec3 lerp(vec3 a,vec3 b,float w)
{
    return a+w*(b-a);
    
}
vec3 lerp(vec3 a,float b,float w)
{
    return a+vec3(w,w,w)*(vec3(b-a.x,b-a.y,b-a.z));
    
}

// vec3 getbitTangent(vec3 N,vec3 p,vec2 uv)
// {
//      vec3 dp1=dFdx(p);
//     vec3 dp2=dFdy(p);
//     vec2 duv1=dFdx(uv);
//     vec2 duv2=dFdy(uv);
    
    
//     vec3 dp2perp=cross(dp2,N);
//     vec3 dp1perp=cross(N,dp1);
//     vec3 T=dp2perp*duv1.x+dp1perp*duv2.x;
//     vec3 B=dp2perp*duv1.y+dp1perp*duv2.y;
//     float invmax=inversesqrt(max(dot(T,T),dot(B,B)));
    
// }
mat3 cotangent_frame(vec3 N,vec3 p,vec2 uv,out vec3 btDir,out vec3 tDir)
{
   
    vec3 dp1=dFdx(p);
    vec3 dp2=dFdy(p);
    vec2 duv1=dFdx(uv);
    vec2 duv2=dFdy(uv);
    
    
    vec3 dp2perp=cross(dp2,N);
    vec3 dp1perp=cross(N,dp1);
    vec3 T=dp2perp*duv1.x+dp1perp*duv2.x;
    vec3 B=dp2perp*duv1.y+dp1perp*duv2.y;
    
    
    float invmax=inversesqrt(max(dot(T,T),dot(B,B)));
    btDir=normalize(B*invmax);
    tDir=normalize(T*invmax);
    return mat3(T*invmax,B*invmax,N);
}
vec3 ComputeNormal(vec3 nornal,vec3 viewDir,vec2 uv,sampler2D normalMap,out vec3 btDir,out vec3 tDir)
{
 
    vec3 map=texture2D(normalMap,uv).xyz;
    
    map=map*255./127.-128./127.;
    
    mat3 TBN=cotangent_frame(nornal,-viewDir,uv,btDir,tDir);
    return normalize(TBN*map);
    // return(texture2D(normalMap,vUv).rgb-.5)*2.;
}
void main(){
     // vec3 worldNormal=normalize(vec3(modelViewMatrix*vec4(vNormal,0.)));
    
    vec3 worldNormal=normalize(normalMatrix*vNormal);
    vec3 worldPosition=(viewMatrix*modelMatrix*vec4(objectPos,1.)).xyz;
  
  
    //vec3(-7.951022465039643, 50.66599857875026, 84.02389415272548)
    vec3 vDir=normalize(vec3(-7.951022465039643, 50.66599857875026, 84.02389415272548)-worldPosition);
    vec3 btDir=vec3(1.0,1.0,1.0);
    vec3 tDir=vec3(1.0,1.0,1.0);
    vec3 nDir=ComputeNormal(worldNormal,vDir,vUv*tilling,_NormalTex,btDir,tDir);
    nDir=worldNormal;
    nDir=normalize(nDir);
    vec3 lDir=normalize(lightPosition-worldPosition);
    //向量操作
    //半角向量为光线线路与视角线路的和
    vec3 hDir=normalize(lDir+vDir);
    vec3 rLDir=normalize(reflect(-lDir,nDir));
    vec3 rvDir=reflect(-vDir,nDir);

    float NdotV=dot(nDir,vDir);
    float NdotL=dot(nDir,lDir);
    float rLdotv=dot(rLDir,vDir);
    float TdotH=dot(tDir,hDir);
    float NdotH= dot(nDir,hDir);
   
    //贴图操作
    // vec3 mainTex=texture2D(_MainTex,vUv).xyz;
   
    /*基础颜色*/
    vec3 albedoColor=pow(_HairColor,vec3(2.2,2.2,2.2));
    vec3 baseColor= albedoColor.xyz;
    vec3 directDiffuse=baseColor;
    /*阴影*/
    vec3 shadowColorFactor=vec3(1.0,1.0,1.0);
    vec3 shadowColor=vec3(0.0,0.0,0.0);
    float shadowPower=_shadowInit;
    float atten=mix(shadowColorFactor,shadowColor,(1.0-getShadowMask())*shadowPower).x;
    //漫反射
    float lambert=max(0.0,NdotL);//兰伯特漫反射模型
    float halfLambert=(lambert+1.0)*0.5;//这里的halfLambert非正确半兰伯特，而是经验漫反射模型
    /*直接光漫反射*/
    float diffuseColor=1.0;
    
    diffuseColor=halfLambert;
    vec3 diffuseCommon=diffuseColor*baseColor*vec3(atten,atten,atten);
    
   
    
    //直接光镜面反射
    vec2 anisonUV=vUv*_AnsionMap_ST.xy+_AnsionMap_ST.zw;
    float anisoNoise=texture2D(_AnsionMap,anisonUV).r-.5;
    float anisonAtten=saturate(sqrt(max(0.,halfLambert/NdotV)));
   
    //头发高光1
    vec3 specColor1=_speculaColor1.rgb+baseColor;
    vec3 anisoOffset1=nDir*(anisoNoise*_specNoise1+_specOffset1);
    vec3 btDir1=normalize(btDir+anisoOffset1);
    float bdotH1=dot(hDir,btDir1)/_specShininess1;
    //ward各向异性高光简易版=切线向量与半角向量
    float specTerm1_float=exp(-(TdotH*TdotH+bdotH1*bdotH1)/(1.+NdotH));
    vec3 specTerm1=vec3(specTerm1_float,specTerm1_float,specTerm1_float);
    vec3 finalSpec1=specTerm1*anisonAtten*specColor1;
    
    //头发高光2
    vec3 specColor2=_speculaColor2.rgb+baseColor;
    vec3 anisoOffset2=nDir*(anisoNoise*_specNoise2+_specOffset2);
    vec3 btDir2=normalize(btDir+anisoOffset2);
    float bdotH2=dot(hDir,btDir2)/_specShininess2;
    float specTerm2_float=exp(-(TdotH*TdotH+bdotH2*bdotH2)/(1.+NdotH));
    vec3 specTerm2=vec3(specTerm2_float,specTerm2_float,specTerm2_float);
    vec3 finalSpec2=specTerm2*anisonAtten*specColor2;

    vec3 finalSpec=finalSpec1+finalSpec2;
    
    float metal=saturate(_metalAdj);
    float roughness=_roughnessAdj;
    vec3 specularColor=lerp(.04,baseColor.rgb,metal);
    roughness=roughness*(1.7-.7*roughness);
    float mip_level=roughness*6.;
    vec4 cubeMapColor=textureCube(_cubeMap,rvDir,mip_level);
    vec3 envColor=cubeMapColor.xyz;
    //envColor=vec3(0.1686, 0.149, 0.149);
    vec3 envspecular=envColor*halfLambert*anisoNoise*_Expose;
    //最终颜色
    vec3 finalColor=diffuseCommon+finalSpec+envspecular;
    //finalColor=worldPosition;
    finalColor=ACETompping(finalColor);
    //vec4 finalShadow=vec4(vec3(0.0, 0.0, 0.0), 1.0 * (1.0-  getShadowMask() ) );
    vec3 finalColor_gamma=pow(finalColor,vec3(1./2.2,1./2.2,1./2.2));

    gl_FragColor=vec4(finalColor_gamma,1.0);
    #include <dithering_fragment>
	
}