function Rectangle(x, y, width, height){
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;

    /**
    * Permet de savoir si un objet de la carte entre en collision avec l'objet courant
    * rect - Un autre rectangle
    */
    this.intersects = function(rect){
        return (this.x + this.width > rect.x && this.x < rect.x + rect.width && this.y + this.height > rect.y && this.y < rect.y + rect.height);
    }

    /**
    * Permet de dupliquer le rectangle
    */
    this.clone = function(){
        return new Rectangle(this.x, this.y, this.width, this.height);
    }

    this.getCenter = function(){
        return new Position(this.x + this.width / 2, this.y + this.height / 2);
    }
}
