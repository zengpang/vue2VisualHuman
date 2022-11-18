 #include <common>
    #include <packing>
  
    #include <lights_pars_begin>
    #include <shadowmap_pars_fragment>
    #include <shadowmask_pars_fragment>
    #include <dithering_pars_fragment>
uniform mat4 modelMatrix;
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
uniform float _shadowInit;

//SSS皮肤效果
uniform float _sssVOffset;
uniform float _sssUOffset;
uniform float _skinLightValue;
uniform float _skinSpecValue;
uniform vec2 tilling;

varying vec3 objectPos;
varying vec3 vNormal;
varying vec2 vUv;

vec3 customSH(vec3 normalDir)
{
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
vec3 lerp(vec3 a,vec3 b,float w)
{
  return a+w*(b-a);
  
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
vec3 ComputeNormal(vec3 nornal,vec3 viewDir,vec2 uv,sampler2D normalMap)
{
  
  vec3 map=texture2D(normalMap,uv).xyz;
  
  map=map*255./127.-128./127.;
  
  mat3 TBN=cotangent_frame(nornal,-viewDir,uv);
  return normalize(TBN*map);
  return(texture2D(normalMap,vUv).rgb-.5)*2.;
}
void main(){
  
  vec3 worldNormal=normalize(vec3(modelMatrix*vec4(vNormal,0.)));
  vec3 worldPosition=(modelMatrix*vec4(objectPos,1.)).xyz;//获取世界坐标
  
  vec3 vDir=normalize(cameraPosition-worldPosition);
  vec3 nDir=ComputeNormal(worldNormal,vDir,vUv*tilling,_NormalTex);
  vec3 lDir=normalize(lightPosition-worldPosition);
  //向量操作
  vec3 hDir=normalize(lDir+vDir);
  vec3 rvDir=reflect(-vDir,nDir);
  float NdotV=dot(nDir,vDir);
  float NdotL=dot(nDir,lDir);
  //贴图操作
  vec3 mainTex=texture2D(_MainTex,vUv).xyz;
  vec4 compMaskTex=texture2D(_CompMaskTex,vUv);
  /*基础颜色*/
  vec3 albedoColor=pow(mainTex,vec3(2.2,2.2,2.2));
  float metal=saturate(compMaskTex.g+_metalAdj);
  vec3 baseColor= albedoColor.xyz*(1.0-metal);
  /*直接光漫反射*/
  float diffuseColor=1.0;
  float lambert=max(0.0,NdotL);
  diffuseColor=(lambert+1.0)*0.5;
  vec3 diffuseCommon=diffuseColor*baseColor;
  /*SSS*/
  float skinarea=1.0-compMaskTex.a;
  vec2 uvlut=vec2(lambert+_sssUOffset,_sssVOffset);
  vec3 lutcolorGamma=texture2D(_sssTexture,uvlut).xyz;
  vec3 lutcolor=pow(lutcolorGamma,vec3(2.2,2.2,2.2));
  vec3 sssDiffuse=lutcolor*baseColor;
  vec3 directDiffuse=lerp(diffuseCommon,sssDiffuse,skinarea);
  /*高光*/
  float roughness=saturate(compMaskTex.r+_roughnessAdj);
  vec3 specterm=vec3(1.,1.,1.);
  vec3 specularColor=lerp(.04,albedoColor.rgb,metal);
  float smoothness=1.-roughness;
  float shininess=lerp(1.,_specularPow,smoothness);
  float specularPow=shininess*smoothness;
  
  //IBL
  //custom_SHAr: (-0.1838, 0.6302, -0.2304, 0.6344)
  //custom_SHAg: (-0.1837, 0.6300, -0.2303, 0.6352)
  //custom_SHAb: (-0.1837, 0.6299, -0.2300, 0.6377)
  //custom_SHBr: (-0.2174, -0.2547, -0.1851, 0.1640)
  //custom_SHBg: (-0.2173, -0.2546, -0.1850, 0.1639)
  //custom_SHBb: (-0.2171, -0.2543, -0.1847, 0.1637)
  //custom_SHC: (-0.1901, -0.1900, -0.1897, 1.0000)
  
  //最终颜色
  vec3 finalColor=vec3(1.0,1.0,1.0);
  vec3 shadowColor=vec3(0,0,0);
  float shadowPower=.5;
  // ------------------------------
  finalColor=mix(finalColor,shadowColor,(1.-getShadowMask())*.2);
  // it just mixes the shadow color with the frag color
  gl_FragColor=vec4(finalColor.x*lambert,finalColor.x*lambert,finalColor.x*lambert,1.);
      
      #include <dithering_fragment>
	
}