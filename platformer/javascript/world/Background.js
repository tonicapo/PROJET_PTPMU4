function Background(color, image){
    var gameWrapper = document.getElementById(platformer.id);

    this.init = function(){
        gameWrapper.style.backgroundColor = color;

        if(image != null){
            gameWrapper.style.backgroundImage = 'url(' + image.src + ')';
            gameWrapper.style.backgroundPosition = 'center bottom';
            gameWrapper.style.backgroundRepeat = 'repeat-x'
            gameWrapper.style.backgroundSize = 'auto 100%';
        }
        else{
            gameWrapper.style.backgroundImage = 'none';
        }
    }
}
