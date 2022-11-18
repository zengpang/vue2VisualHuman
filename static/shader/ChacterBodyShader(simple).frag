#include <common>
    #include <packing>
 
 
    #include <lights_pars_begin>
    #include <shadowmap_pars_fragment>
    #include <shadowmask_pars_fragment>

varying vec3 objectPos;
varying vec3 vNormal;
varying vec2 vUv;
void main(){
  // CHANGE THAT TO YOUR NEEDS
  // ------------------------------
  vec3 finalColor=vec3(0,.75,0);
  vec3 shadowColor=vec3(0,0,0);
  float shadowPower=.1;
  
  // ------------阴影去去渐变------------------
  // vec4 finalColorEnd=vec4(vec3(0.0, 0.0, 0.0), smoothstep(0.1,0.2,1.0 * (1.0-  getShadowMask() )) )  ;
  // it just mixes the shadow color with the frag color
  vec4 finalShadow=vec4(vec3(0.,0.,0.),1.*(1.-getShadowMask()));
  gl_FragColor=finalShadow;
  //gl_FragColor = vec4( mix(finalColor, shadowColor, (1.0 - getShadowMask() ) * shadowPower), 1.0);
  //   #include <fog_fragment>
  //   #include <dithering_fragment>
}