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