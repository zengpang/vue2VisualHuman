
#include <common>
#include <packing>

#include <lights_pars_begin>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
   #include <dithering_pars_fragment>
uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;//从模型空间转世界空间坐标系
uniform mat3 normalMatrix;
uniform vec3 color;
uniform vec3 lightPosition;
uniform vec3 _mainColor;
//贴图
uniform sampler2D _MainTex;
uniform sampler2D _NormalTex;
uniform sampler2D _CompMaskTex;
uniform sampler2D _sssTexture;
uniform samplerCube _cubeMap;

//高光
uniform float _specularPow;
//高光颜色
uniform vec4 _speculaColor;
uniform vec4 _LightColor0;

//球谐因子计算
uniform vec4 customSHAr;
uniform vec4 customSHAg;
uniform vec4 customSHAb;
uniform vec4 customSHBr;
uniform vec4 customSHBg;
uniform vec4 customSHBb;
uniform vec4 customSHC;

//环境贴图
uniform vec4 _cubeMap_HDR;
uniform float _Expose;

//粗糙度
uniform float _roughnessAdj;
uniform float _metalAdj;
//阴影强度
uniform float _shadowInit;

//SSS皮肤效果
//SSS V轴偏转值
uniform float _sssVOffset;
//SSS U轴偏转值
uniform float _sssUOffset;
//皮肤光照值
uniform float _skinLightValue;
//皮肤高度值
uniform float _skinSpecValue;
//贴图tilling值(贴图重复度)
uniform vec2 tilling;

varying vec3 objectPos;
varying vec3 vNormal;
varying vec2 vUv;

vec3 customSH(vec3 normalDir)
{
    vec4 customSHAr=vec4(-.1838,.6302,-.2304,.6344);
    vec4 customSHAg=vec4(-.1837,.6300,-.2303,.6352);
    vec4 customSHAb=vec4(-.1837,.6299,-.2300,.6377);
    vec4 customSHBr=vec4(-.2174,-.2547,-.1851,.1640);
    vec4 customSHBg=vec4(-.2173,-.2546,-.1850,.1639);
    vec4 customSHBb=vec4(-.2171,-.2543,-.1847,.1637);
    vec4 customSHC=vec4(-.1901,-.1900,-.1897,1.);
    vec4 normalForSH=vec4(normalDir,1.);
    vec3 x;
    x.r=dot(customSHAr,normalForSH);
    x.g=dot(customSHAg,normalForSH);
    x.b=dot(customSHAb,normalForSH);
    
    vec3 x1,x2;
    vec4 vB=normalForSH.xyzz*normalForSH.yzzx;
    x1.r=dot(customSHBr,vB);
    x1.g=dot(customSHBg,vB);
    x1.b=dot(customSHBb,vB);
    
    float vC=normalForSH.x*normalForSH.x-normalForSH.y*normalForSH.y;
    x2=customSHC.rgb*vC;
    
    vec3 sh=max(vec3(0.,0.,0.),(x+x1+x2));
    sh=pow(sh,vec3(1./2.2,1./2.2,1./2.2));
    return sh;
}
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
//
vec3 lerp(vec3 a,vec3 b,float w)
{
    return a+w*(b-a);
    
}
vec3 lerp(vec3 a,float b,float w)
{
    return a+vec3(w,w,w)*(vec3(b-a.x,b-a.y,b-a.z));
    
}
mat3 cotangent_frame(vec3 N,vec3 p,vec2 uv)
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
    return mat3(T*invmax,B*invmax,N);
}
//法线计算
vec3 ComputeNormal(vec3 nornal,vec3 viewDir,vec2 uv,sampler2D normalMap)
{
 
    vec3 map=texture2D(normalMap,uv).xyz;
    
    map=map*255./127.-128./127.;
    
    mat3 TBN=cotangent_frame(nornal,-viewDir,uv);
    return normalize(TBN*map);
   // return(texture2D(normalMap,vUv).rgb-.5)*2.;
}
void main(){
    
     //vec3 worldNormal=normalize(vec3(modelMatrix*vec4(vNormal,0.)));
    vec3 worldNormal=normalize(normalMatrix*vNormal);//视图空间下的法线坐标
    vec3 worldPosition=(viewMatrix*modelMatrix*vec4(objectPos,1.)).xyz;//获取视图空间下的物体坐标
    
    vec3 vDir=normalize(vec3(-7.951022465039643, 50.66599857875026, 84.02389415272548)-worldPosition);
    //vec3 vDir=normalize(cameraPosition*normalMatrix-worldPosition);
    vec3 nDir=ComputeNormal(worldNormal,vDir,vUv*tilling,_NormalTex);
    //nDir=worldNormal;
    //光线向量=光的位置减去模型世界坐标
    vec3 lDir=normalize(lightPosition-worldPosition);
    //半角向量
    vec3 hDir=normalize(lDir+vDir);
    //光线反射向量
    vec3 rLDir=normalize(reflect(-lDir,nDir));
    //视角反射向量
    vec3 rvDir=normalize(reflect(-vDir,nDir));
    //视角向量与法线向量点乘
    float NdotV=dot(nDir,vDir);
    //视角向量与光照向量点乘
    float NdotL=dot(nDir,lDir);
    //光线反射向量与视角向量点乘
    float rLdotv=dot(rLDir,vDir);
    //法线向量与半角向量点乘
    float NdotH=dot(nDir,hDir);
    //基础贴图采样
    vec3 mainTex=texture2D(_MainTex,vUv).xyz;
    //组合贴图
    vec4 compMaskTex=texture2D(_CompMaskTex,vUv);
    /*基础颜色*/
    vec3 albedoColor=pow(mainTex,vec3(2.2,2.2,2.2));
    //金属度获取
    float metal=saturate(compMaskTex.g+_metalAdj);
    //
    vec3 baseColor= albedoColor.xyz*(1.0-metal);
    /*阴影*/
    vec3 shadowColorFactor=vec3(1.0,1.0,1.0);
    vec3 shadowColor=vec3(0.0,0.0,0.0);
    float shadowPower=_shadowInit;
    float atten=mix(shadowColorFactor,shadowColor,(1.0-getShadowMask())*shadowPower).x;
    //atten=1.0;
    /*直接光漫反射*/
    float diffuseColor=1.0;
    float lambert=max(0.0,NdotL);
    diffuseColor=(lambert+1.0)*0.5;
    vec3 diffuseCommon=diffuseColor*baseColor*vec3(atten,atten,atten);
    /*SSS*/
    float skinarea=1.0-compMaskTex.a;
    vec2 uvlut=vec2(lambert+_sssUOffset,_sssVOffset);
    vec3 lutcolorGamma=texture2D(_sssTexture,uvlut).xyz;
    vec3 lutcolor=pow(lutcolorGamma,vec3(2.2,2.2,2.2));
    vec3 sssDiffuse=lutcolor*baseColor*atten;
    vec3 directDiffuse=lerp(diffuseCommon,sssDiffuse,skinarea);
    directDiffuse=saturate(directDiffuse);
    /*高光*/
    float roughness=saturate(compMaskTex.r+_roughnessAdj);
    vec3 specterm=vec3(1.,1.,1.);
    vec3 specularColor=lerp(.04,albedoColor.rgb,metal);
    float smoothness=1.-roughness;
    float shininess=lerp(1.,_specularPow,smoothness);
    float specularPow=shininess*smoothness;
    //phone高光公式=光照反射向量
    vec3 phone=vec3(pow(max(0.,rLdotv),specularPow),pow(max(0.,rLdotv),specularPow),pow(max(0.,rLdotv),specularPow));
    specterm=phone;
    vec3 skinspecColor=lerp(specularColor,_skinSpecValue,skinarea);
    vec3 specfinalColor=specterm*skinspecColor*vec3(atten,atten,atten)*_speculaColor.xyz;
    specfinalColor=saturate(specfinalColor);
    /*环境色*/
    vec3 envDiffuse=customSH(nDir)*directDiffuse;
    envDiffuse=lerp(envDiffuse*vec3(0.5,0.5,0.5),envDiffuse*vec3(1,1,1),skinarea);
    envDiffuse=saturate(envDiffuse);
    /*间接光镜面反射*/
    roughness=roughness*(1.7-.7*roughness);
    float mip_level=roughness*6.;
    vec4 cubeMapColor=textureCube(_cubeMap,rvDir,mip_level);
    vec3 envColor=cubeMapColor.xyz;
    vec3 envspecular=envColor*specularColor*diffuseColor*_Expose;
    envspecular=saturate(envspecular);

    //最终颜色=直接光漫反射+高光+IBL+间接光镜面反射
    vec3 finalColor=directDiffuse+specfinalColor+envDiffuse*_skinLightValue+envspecular;
    finalColor=finalColor*_mainColor;
    finalColor=ACETompping(finalColor);
    //vec4 finalShadow=vec4(vec3(0.0, 0.0, 0.0), 1.0 * (1.0-  getShadowMask() ) );
    vec3 finalColor_gamma=pow(finalColor,vec3(1./2.2,1./2.2,1./2.2));
    finalColor_gamma=saturate(finalColor_gamma);
    gl_FragColor=vec4(finalColor_gamma,1.);
    #include <dithering_fragment>
	
}