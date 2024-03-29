varying vec2 v_uv;
uniform vec2 resolution;
uniform sampler2D tDiffuse;
uniform sampler2D tAscii;
const vec2 fontSize = vec2(12.0,16.0);
const float numChars = 11.0; //128.0;

vec4 lookupASCII(float asciiValue){

    vec2 pos = mod(gl_FragCoord.xy,fontSize.xy);

    pos = pos / vec2(132.0,16.0);
    pos.x += asciiValue;
    return vec4(texture2D(tAscii,pos).rgb,1.0);
    
}

void main(void) {

    vec2 invViewport = vec2(1.0) / resolution;
    vec2 pixelSize = fontSize;
    vec4 sum = vec4(0.0);
    vec2 uvClamped = v_uv-mod(v_uv,pixelSize * invViewport);
    for (float x=0.0;x<fontSize.x;x++){
        for (float y=0.0;y<fontSize.y;y++){
            vec2 offset = vec2(x,y);
            sum += texture2D(tDiffuse,uvClamped+(offset*invViewport));
        }
    }
    vec4 avarage = sum / vec4(fontSize.x*fontSize.y);
    float brightness = (avarage.x+avarage.y+avarage.z)*0.33333;
    vec4 clampedColor = floor(avarage*8.0)/8.0;
    float asciiChar = floor((1.0-brightness)*numChars)/numChars;
    gl_FragColor = lookupASCII(asciiChar);
}