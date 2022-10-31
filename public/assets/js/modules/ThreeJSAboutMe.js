function initThreeJSAboutMe() {
    
    const wrapper = document.getElementById("photo-liquid");
    const canvasSize = {
        width: 1000,
        height: 1000
    }

    let scene = new THREE.Scene();

    const perspective = 1800;
    const fov = (180 * (2 * Math.atan(canvasSize.height / 2 / perspective))) / Math.PI

    let camera = new THREE.PerspectiveCamera( fov, canvasSize.width / canvasSize.height, .1, 3000 );
    camera.position.set(0, 0, perspective)

    let renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize( canvasSize.width, canvasSize.height );
    renderer.domElement.id = 'threejs-liquid'
    wrapper.appendChild( renderer.domElement );

    const ambientlight = new THREE.AmbientLight(0xffffff, 2)
    scene.add(ambientlight)

    const loader = new THREE.TextureLoader();
    const texture = loader.load('assets/img/my_happy_face.png');
    const hoverTexture = loader.load('assets/img/my_normal_face.jpg');
    const padding = 200;
    
    let mouseWindow = new THREE.Vector2(0, 0)

    const sizes = new THREE.Vector2(canvasSize.width - padding, canvasSize.height - padding)
    const offset = new THREE.Vector2(0, 0)

    const geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1)

    const uniforms = {
        u_image: { type: 't', value: texture },
        u_imagehover: { type: 't', value: hoverTexture },
        u_mouse: { value: mouseWindow },
        u_time: { value: 0 },
        u_res: { value: sizes },
        u_show_goey: { value: false }
    }

    const material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: GLSL_vertexShader,
        fragmentShader: GLSL_noiseShader,
        defines: {
             PR: window.devicePixelRatio.toFixed(1)
        }
    })

    const mesh = new THREE.Mesh(geometry, material)

    mesh.position.set(offset.x, offset.y, 0)
    mesh.scale.set(sizes.x, sizes.y, 1)

    scene.add(mesh)

    let rotationValue = {x: 0, y: 0}

    window.addEventListener('mousemove', (e) => { 
        
        mouseWindow = new THREE.Vector2(
            (e.clientX / window.innerWidth) * 2 - 1,
            -(e.clientY  / window.innerHeight) * 2 + 1
        )

        const canvasBound = renderer.domElement.getBoundingClientRect()

        if (
            e.clientX >= canvasBound.left && 
            e.clientX <= canvasBound.right && 
            e.clientY >= canvasBound.top && 
            e.clientY <= canvasBound.bottom
        ) {
            const scaledX = scale(e.clientX, canvasBound.left, canvasBound.right, 0, 1)
            const scaledY = scale(e.clientY, canvasBound.top, canvasBound.bottom, 0, 1)

            const mouseWindowFixed = new THREE.Vector2(
                -scaledX * 2 + 1,
                scaledY * 2 - 1
            )
    
            uniforms.u_mouse.value = mouseWindowFixed;
            uniforms.u_show_goey.value = true;
        } else {
            console.log()
            uniforms.u_show_goey.value = false;
        }

        rotationValue = {
            x: -mouseWindow.y * 0.3,
            y:  mouseWindow.x * (Math.PI / 6)
        }
    })

    function lerp (value1, value2, amount) {
        amount = amount < 0 ? 0 : amount;
        amount = amount > 1 ? 1 : amount;
        return value1 + (value2 - value1) * amount;
    }

    function scale (number, inMin, inMax, outMin, outMax) {
        return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }

    function animate() {
        requestAnimationFrame( animate );	
        renderer.render( scene, camera );

        mesh.rotation.set(
            lerp(mesh.rotation.x, rotationValue.x, .07), 
            lerp(mesh.rotation.y, rotationValue.y, .07), 0
        );

        uniforms.u_time.value += 0.01
    }

    animate();
}