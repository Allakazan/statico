import * as THREE from 'three';

(() => {
    
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

    const geometry = new THREE.PlaneGeometry(1, 1, 1, 1)

    const uniforms = {
        u_image: { type: 't', value: texture },
        u_imagehover: { type: 't', value: hoverTexture },
        u_mouse: { value: mouseWindow },
        u_time: { value: 0 },
        u_res: { value: sizes },
        u_show_goey: { value: false },
        u_goey_size: { value: 0.3 }
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

    const isMobile = mobileAndTabletCheck();

    if (!isMobile) {
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
    } else {
        if (window.DeviceOrientationEvent) {
            window.addEventListener("deviceorientation", function (e) {

                const correctRotation = {
                    x: (e.beta - 55) / 60,
                    y: e.gamma / 60
                }

                rotationValue = {
                    x:  clamp(correctRotation.x, -0.7, 0.7),
                    y:  clamp(correctRotation.y, -0.7, 0.7)
                }

                const mouseWindowFixed = new THREE.Vector2(
                    scale(correctRotation.y, -0.8, 0.8, 0.2, 0.8) - .13,
                    scale(correctRotation.x, -0.99, 0.99, 0.2, 0.8) - .13
                )

                uniforms.u_mouse.value = mouseWindowFixed;
                uniforms.u_show_goey.value = true;

            }, true);
        }
    }

    function lerp (value1, value2, amount) {
        amount = amount < 0 ? 0 : amount;
        amount = amount > 1 ? 1 : amount;
        return value1 + (value2 - value1) * amount;
    }

    function scale (number, inMin, inMax, outMin, outMax) {
        return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }

    const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

    function animate() {
        requestAnimationFrame( animate );	
        renderer.render( scene, camera );

        if (isMobile) {
            mesh.rotation.order = 'YXZ'
            uniforms.u_goey_size.value = 0.05
        }
        
        mesh.rotation.set(
            lerp(mesh.rotation.x, rotationValue.x, .07), 
            lerp(mesh.rotation.y, rotationValue.y, .07), 0
        );

        uniforms.u_time.value += 0.01
    }

    function mobileAndTabletCheck() {
        let check = false;
        (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
        return check;
    };

    animate();
})();