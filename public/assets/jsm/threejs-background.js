import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';

(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 0.1, 1000 );

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.domElement.id = 'threejs'
    document.body.appendChild( renderer.domElement );

    const geometry = new THREE.TorusGeometry( 6, 3.3, 20, 40 );

    scene.fog = new THREE.Fog( 0x000000, 10, 40 );
    const material = new THREE.MeshMatcapMaterial({ color: 0xffffff, fog: true, flatShading: false });

    const torus = new THREE.Mesh( geometry, material );
    scene.add( torus );

    camera.position.z = 15;

    const composer = new EffectComposer( renderer );
    
    const renderPass = new RenderPass( scene, camera );
    composer.addPass( renderPass );

    const toneMappingShader = new ShaderPass({
        uniforms: {
            'tDiffuse': { value: null },
            'brightness': { value: 0 },
            'contrast': { value: 1 },
        },
        vertexShader: GLSL_vertexShader,
        fragmentShader: GLSL_toneMapping
    });
    composer.addPass( toneMappingShader );

    const asciiShader = new ShaderPass({
        uniforms: {
            'resolution': { type: 'v2', value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            'tDiffuse': { value: null },
            'tAscii': new THREE.Uniform( new THREE.TextureLoader().load( "assets/img/8x16_ascii_font_minimal.gif" )),    
        },
        vertexShader: GLSL_vertexShader,
        fragmentShader: GLSL_asciiShader
    });
    composer.addPass( asciiShader );

    var clock = new THREE.Clock();
    var speedX = 0.5
    var speedY = 0.5
    var delta = 0;
    var deltaValue = 0;
    let interval = 1 / 17;
    let time = 0;

    function animate() {
        requestAnimationFrame( animate );	
        

        deltaValue = clock.getDelta();
        delta += deltaValue;

        if (delta  > interval) {
            composer.render();

            delta = delta % interval;
        }
        time = Date.now() * 0.001;

        torus.rotation.x += speedX * deltaValue;
        torus.rotation.y += speedY * deltaValue;
        
        // Pulsating
        //torus.position.z = .7 * ( 1 +  Math.sin( time  ) );
    }

    window.addEventListener( 'resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        asciiShader.uniforms['resolution'].value = new THREE.Vector2(window.innerWidth, window.innerHeight) 
        renderer.setSize( window.innerWidth, window.innerHeight );
    }, false );

    animate();
})();