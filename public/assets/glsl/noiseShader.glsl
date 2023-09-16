#pragma glslify: snoise3 = require('glsl-noise/simplex/3d')

uniform vec2 u_mouse;
uniform vec2 u_res;
uniform sampler2D u_image;
uniform sampler2D u_imagehover;
uniform float u_time;
uniform bool u_show_goey;
uniform float u_goey_size;

varying vec2 v_uv;

float circle(in vec2 _st, in float _radius, in float blurriness){
	vec2 dist = _st;
	return 1.-smoothstep(_radius-(_radius*blurriness), _radius+(_radius*blurriness), dot(dist,dist)*4.0);
}

void main() {

	// We manage the device ratio by passing PR constant
	vec2 res = u_res * PR;
	vec2 st = gl_FragCoord.xy / res.xy - vec2(0.5);
	// tip: use the following formula to keep the good ratio of your coordinates
	st.y *= u_res.y / u_res.x;

	//st.x -= mod(st.x, 1.0 / 50.0);
	//st.y -= mod(st.y, 1.0 / 50.0);

	// We readjust the mouse coordinates
	vec2 mouse = u_mouse * -0.75;
	// tip2: do the same for your mouse
	mouse.y *= u_res.y / u_res.x;
	mouse *= -1.;

  	vec2 pixelUv = v_uv.xy;

	pixelUv.x -= mod(pixelUv.x, 1.0 / 100.0);
	pixelUv.y -= mod(pixelUv.y, 1.0 / 100.0);

	vec4 image = texture2D(u_image, v_uv);

	if (u_show_goey) {

		vec4 hover = texture2D(u_imagehover, v_uv);

		vec2 circlePos = st + mouse;
		float c = circle(circlePos, u_goey_size, 2.3);

		float offx = pixelUv.x + sin(pixelUv.y + u_time * .1);
		float offy = pixelUv.y - u_time * 0.1 - cos(u_time * .001) * .01;

		float n = snoise3(vec3(offx, offy, u_time * .1) * 4.) * .5;

		float stepMask = step(.5, n + c);
		
		//float finalMask = smoothstep(0.45, 0.55, stepMask);

		stepMask -= mod(stepMask, 1.0 / 200.);

		vec4 finalImage = mix(image, hover, stepMask);

		//gl_FragColor = vec4(vec3(n), 1.);

		gl_FragColor = vec4(vec3(finalImage), 1.0);
	} else {
		gl_FragColor = image;
	}

}