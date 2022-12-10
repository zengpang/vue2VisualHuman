  varying vec3 vViewPosition;
  varying vec3 vNormal;

  void main() {
    vViewPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
    vNormal = normalMatrix * normal;

    vec4 worldPosition = (modelMatrix * vec4(position, 1.));
    gl_Position = projectionMatrix * viewMatrix * vec4(worldPosition.xyz, 1.);
  }