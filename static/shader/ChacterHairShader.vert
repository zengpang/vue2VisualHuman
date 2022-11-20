#include <common>

#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>

#include <shadowmap_pars_vertex>
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 objectPos;
varying vec3 worldPos;
void main() {
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	
	vNormal=normal;
    vUv = uv;
    objectPos= position;
	
}