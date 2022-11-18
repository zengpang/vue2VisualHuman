#include <common>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <morphtarget_pars_vertex>
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 objectPos;
varying vec4 worldPosition;
void main() {
	#include <morphcolor_vertex>
	
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <skinning_vertex>
	#include <shadowmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
    vNormal=normal;
    vUv = uv;
    objectPos= position;
}