window.addEventListener('load', function () {
    initAOS()
    initBaffle()
    initThreeJS()
    initModals()
    initLiquidEffect()
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
    animate();
}

function initModals() {
    
    Array.prototype.slice.call(document.querySelectorAll('.open-modal')).map(function(btn, index) {
        btn.addEventListener('click', function(e) {
            e.preventDefault()

            let modal = e.currentTarget.nextElementSibling.cloneNode(true)

            document.querySelector('.bg-modal').classList.add('active')

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

                    document.querySelector('.bg-modal').classList.remove('active')
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

function initLiquidEffect() {
    new LiquidEffect({
        appendTo: "#photo-liquid",
        image: 'assets/img/my_happy_face.png',
        displacementImage: "assets/img/displacement_map.jpg",
        displacementScale: .5,
        speed: 1,
        intensityX: 1,
        intensityY: 1,
    });
}