window.addEventListener('load', function () {
    initAOS()
    initBaffle()
    initThreeJS()
    initThreeJSAboutMe()
    initIsotope()
    initModals()
});

function initAOS() {
    AOS.init();
}

function initBaffle() {
    let s = ["█", "▓", "▒", "░", "█", "▓", "▒", "░", "█", "▓", "▒", "░", "<", ">", "/"]
    let originalWordsList = [
        'Web Developer',
        'Game Developer',
        'Mobile Developer',
        '3D Artist',
        'Game Designer',
        'Thinker',
        'Musician',
        'Maker'
    ]	

    let wordsList = [].concat(originalWordsList);

    let b = baffle('.baffle', {
        characters: s
    })

    let changeCallback = function() {

        if (wordsList.length == 0) {
            wordsList = [].concat(originalWordsList);
        }

        let randomIndex = Math.floor(Math.random() * wordsList.length)
        let randomWord = wordsList[randomIndex]

        wordsList.splice(randomIndex, 1)
        
        b.start()
            .text(function(text) { return randomWord })
            .reveal(200, 600);
    }
    
    changeCallback()
    setInterval(changeCallback, 2000)
}

function initThreeJS() {
    let screenSize = {
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
    }
    let scene = new THREE.Scene();
    let camera = new THREE.PerspectiveCamera( 45, screenSize.width / screenSize.height, 0.1, 1000 );

    let renderer = new THREE.WebGLRenderer({ alpha: true });
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
    const padding = 200;

    const sizes = new THREE.Vector2(canvasSize.width - padding, canvasSize.height - padding)
    const offset = new THREE.Vector2(0, 0)

    const geometry = new THREE.PlaneBufferGeometry(1, 1, 1, 1)
    const material = new THREE.MeshBasicMaterial({
        map: texture
    })

    const mesh = new THREE.Mesh(geometry, material)

    mesh.position.set(offset.x, offset.y, 0)
    mesh.scale.set(sizes.x, sizes.y, 1)

    scene.add(mesh)

    window.addEventListener('mousemove', (e) => { 
        const windowPos = {
            x: (e.clientX / window.innerWidth) * 2 - 1,
            y: -(e.clientY  / window.innerHeight) * 2 + 1
        }

        const rotationValue = {
            x: -windowPos.y * 0.3,
            y:  windowPos.x * (Math.PI / 6)
        }

        mesh.rotation.set(rotationValue.x, rotationValue.y, 0);
    })


    function animate() {
        requestAnimationFrame( animate );	
        renderer.render( scene, camera );
    }

    animate();
}

function initIsotope() {
    
    const grid = new Isotope( '.work-container', {
        itemSelector: '.work-container__item',
        percentPosition: true,
        masonry: {
            columnWidth: '.work-container__item'
          }
    });


    const filterButtons = [].slice.call(document.getElementsByClassName("btn--filter"))
    
    filterButtons.map((btn) => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            grid.arrange({ filter: e.currentTarget.dataset.filter })

            filterButtons.map((b) => b.classList.remove('btn__active'))

            e.currentTarget.classList.add('btn__active')
        })
    })
}

function initModals() {
    
    Array.prototype.slice.call(document.querySelectorAll('.open-modal')).map(function(btn, index) {
        btn.addEventListener('click', function(e) {
            e.preventDefault()

            let modal = e.currentTarget.nextElementSibling.cloneNode(true)

            document.querySelector('.modal-background').classList.add('active')

            setTimeout(function() {
                document.querySelector('.modal-wrapper').appendChild(modal)
                document.querySelector('.modal-wrapper').classList.add('active')
                document.querySelector('.modal-wrapper > .modal-content').style.display = 'grid'
                
			    let splideInstance = new Splide('.modal-wrapper > .modal-content .modal-slider > .splide', {
                    type   : 'loop',
                    autoWidth: true,
                    gap: '1em',
	                focus  : 'center',
	                height   : 'calc(100vh - 53px)'
                }).mount();

                let closeModalAction = function() {

                    document.querySelector('.modal-background').classList.remove('active')
                    document.querySelector('.modal-wrapper').classList.remove('active')
            
                    document.querySelector('.modal-wrapper').innerHTML = ''
                }

                let escPressEvent = function(e) {
                    if (e.keyCode == 27) {
                        document.removeEventListener("keydown", escPressEvent);
                        closeModalAction()
                    }
                }

                document.querySelector('.modal-wrapper .modal-close').addEventListener('click', function(e) {
                    e.preventDefault()
                    closeModalAction()
                })

                document.addEventListener("keydown", escPressEvent, false);

                document.querySelector('.modal-wrapper .modal-expand').addEventListener('click', function(e) {
                    e.preventDefault()

                    document.querySelector('.modal-wrapper > .modal-content').classList.add('oneline')
                    document.querySelector('.modal-wrapper > .modal-content > .modal-description').style.display = 'none'

                    splideInstance.refresh()

                    document.querySelector('.modal-wrapper .modal-expand').style.display = 'none'
                    document.querySelector('.modal-wrapper .modal-compress').style.display = 'inline'
                })

                document.querySelector('.modal-wrapper .modal-compress').addEventListener('click', function(e) {
                    e.preventDefault()

                    document.querySelector('.modal-wrapper > .modal-content').classList.remove('oneline')
                    document.querySelector('.modal-wrapper > .modal-content > .modal-description').classList.remove('animate__animated')
                    document.querySelector('.modal-wrapper > .modal-content > .modal-description').style.display = 'block'

                    splideInstance.refresh()

                    document.querySelector('.modal-wrapper .modal-expand').style.display = 'inline'
                    document.querySelector('.modal-wrapper .modal-compress').style.display = 'none'
                })

            }, 450)
        })
    }) 
}
