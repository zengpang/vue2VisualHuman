
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
uniform samplerCube _cubeMap;

//高光
uniform vec4 _LightColor0;
uniform float _shadowInit;

//头发高光1
uniform vec4 _HairColor;
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

//球谐因子计算
uniform vec4 customSHAr;
uniform vec4 customSHAg;
uniform vec4 customSHAb;
uniform vec4 customSHBr;
uniform vec4 customSHBg;
uniform vec4 customSHBb;
uniform vec4 customSHC;
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
    vec3 rLDir=normalize(reflect(-lDir,nDir));
    vec3 rvDir=reflect(-vDir,nDir);
    float NdotV=dot(nDir,vDir);
    float NdotL=dot(nDir,lDir);
    float rLdotv=dot(rLDir,nDir);
    //贴图操作
    vec3 mainTex=texture2D(_MainTex,vUv).xyz;
    vec4 compMaskTex=texture2D(_CompMaskTex,vUv);
    /*基础颜色*/
    vec3 albedoColor=pow(mainTex,vec3(2.2,2.2,2.2));
    float metal=saturate(compMaskTex.g+_metalAdj);
    vec3 baseColor= albedoColor.xyz*(1.0-metal);
    /*阴影*/
    vec3 shadowColorFactor=vec3(1.0,1.0,1.0);
    vec3 shadowColor=vec3(0.0,0.0,0.0);
    float shadowPower=.2;
    float atten=mix(shadowColorFactor,shadowColor,(1.0-getShadowMask())*shadowPower).x;
    
    /*直接光漫反射*/
    float diffuseColor=1.0;
    float lambert=max(0.0,NdotL);
    diffuseColor=(lambert+1.0)*0.5;
    vec3 diffuseCommon=diffuseColor*baseColor*vec3(atten,atten,atten);
    
    /*高光*/
    float roughness=saturate(compMaskTex.r+_roughnessAdj);
    vec3 specterm=vec3(1.,1.,1.);
    vec3 specularColor=lerp(.04,albedoColor.rgb,metal);
    float smoothness=1.-roughness;
    float shininess=lerp(1.,_specularPow,smoothness);
    float specularPow=shininess*smoothness;
    vec3 phone=vec3(pow(max(0.,rLdotv),specularPow),pow(max(0.,rLdotv),specularPow),pow(max(0.,rLdotv),specularPow));
    specterm=phone;
    vec3 skinspecColor=lerp(specularColor,_skinSpecValue,skinarea);
    vec3 specfinalColor=specterm*skinspecColor*vec3(atten,atten,atten)*_speculaColor.xyz;
    specfinalColor=saturate(specfinalColor);
    /*环境色*/
    vec3 envDiffuse=customSH(nDir)*directDiffuse;
    envDiffuse=lerp(envDiffuse*vec3(.5,.5,.5),envDiffuse*vec3(1,1,1),skinarea);
    //直接光镜面反射
    vec2 anisonUV=i.uv*_AnsionMap_ST.xy+_AnsionMap_ST.zw;
    float anisoNoise=tex2D(_AnsionMap,anisonUV).r-.5;
    float anisonAtten=saturate(sqrt(max(0.,halfLambert/ndotV)))*atten;
    //头发高光1
    vec3 specColor1=_speculaColor1.rgb+baseColor;
    vec3 anisoOffset1=nDir*(anisoNoise*_specNoise1+_specOffset1);
    vec3 btDir1=normalize(btDir+anisoOffset1);
    float bdotH1=dot(hDir,btDir1)/_specShininess1;
    vec3 specTerm1=exp(-(tdotH*tdotH+bdotH1*bdotH1)/(1.+ndotH));
    vec3 finalSpec1=specTerm1*anisonAtten*specColor1*_LightColor0.xyz;
    
    //头发高光2
    vec3 specColor2=_speculaColor2.rgb+baseColor;
    vec3 anisoOffset2=nDir*(anisoNoise*_specNoise2+_specOffset2);
    vec3 btDir2=normalize(btDir+anisoOffset2);
    float bdotH2=dot(hDir,btDir2)/_specShininess2;
    vec3 specTerm2=exp(-(tdotH*tdotH+bdotH2*bdotH2)/(1.+ndotH));
    vec3 finalSpec2=specTerm2*anisonAtten*specColor2*_LightColor0.xyz;
    vec3 finalSpec=finalSpec1+finalSpec2;
   
    //最终颜色
    vec3 finalColor=(diffuseCommon*_mainColor);
    finalColor=ACETompping(finalColor);
    //vec4 finalShadow=vec4(vec3(0.0, 0.0, 0.0), 1.0 * (1.0-  getShadowMask() ) );
    vec3 finalColor_gamma=pow(finalColor,vec3(1./2.2,1./2.2,1./2.2));
    gl_FragColor=vec4(finalColor_gamma,1.0);
    #include <dithering_fragment>
	
}