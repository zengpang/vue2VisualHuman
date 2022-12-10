  uniform vec3 lightPos;

  varying vec3 vNormal;
  varying vec3 vViewPosition;

  void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDir = normalize(vec3(165.8, 35.6, 80.6) - vViewPosition);
    float lambertian = max(dot(normal, lightDir), 0.0);
    gl_FragColor = vec4(vec3(1.0) * lambertian, 1.0);
  }