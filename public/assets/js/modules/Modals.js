function initModals() {
    
    Array.prototype.slice.call(document.querySelectorAll('.open-modal')).map(function(btn, index) {
        btn.addEventListener('click', function(e) {
            e.preventDefault()

            let modal = e.currentTarget.nextElementSibling.cloneNode(true)

            document.querySelector('body').style.overflow = 'hidden';
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

                    document.querySelector('body').style.overflow = 'auto';
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