uniform float brightness;
uniform float contrast;
uniform sampler2D tDiffuse;
varying vec2 v_uv;

void main() {
    vec3 mainScreen = texture2D( tDiffuse, v_uv ).rgb;
    vec3 colorContrasted = (mainScreen) * contrast;
    vec3 bright = colorContrasted + vec3(brightness,brightness,brightness);
    
    gl_FragColor = vec4(bright, 1.0);
}