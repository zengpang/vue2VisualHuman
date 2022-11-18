 #include <common>
    #include <packing>
  
    #include <lights_pars_begin>
    #include <shadowmap_pars_fragment>
    #include <shadowmask_pars_fragment>
    #include <dithering_pars_fragment>
    void main() {
      // CHANGE THAT TO YOUR NEEDS
      // ------------------------------
      vec3 finalColor = vec3(0, 0.75, 0);
      vec3 shadowColor = vec3(0, 0, 0);
      float shadowPower = 0.5;
      // ------------------------------
      
      // it just mixes the shadow color with the frag color
      gl_FragColor = vec4( mix(finalColor, shadowColor, (1.0 - getShadowMask() ) * shadowPower), 1.0);
   
      #include <dithering_fragment>
    }