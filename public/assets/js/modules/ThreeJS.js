function initThreeJS() {
    let screenSize = {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
    }
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera( 45, screenSize.width / screenSize.height, 0.1, 1000 );

    let renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize( screenSize.width, screenSize.height );
    renderer.domElement.id = 'threejs'
    document.body.appendChild( renderer.domElement );

    const geometry = new THREE.IcosahedronGeometry();
    //let geometry = new THREE.BoxGeometry( 1, 1, 1 );
    let material = new THREE.MeshBasicMaterial( { color: 0xffffff, wireframe: true } );
    let geo = new THREE.Mesh( geometry, material );
    geo.position.z = -5;
    scene.add( geo );

    let effect = new THREE.AnaglyphEffect( renderer );
    effect.setSize( screenSize.width, screenSize.height );
    
    var clock = new THREE.Clock();
    var speed = 0.5
    var delta = 0;

    function animate() {
        requestAnimationFrame( animate );	
        effect.render( scene, camera );
    
        delta = clock.getDelta();

        geo.rotation.x += speed * delta;
        geo.rotation.y += speed * delta;
    }
    
    window.addEventListener( 'resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }, false );

    animate();

}