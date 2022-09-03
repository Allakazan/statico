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