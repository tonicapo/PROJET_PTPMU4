function Rectangle(x, y, width, height){
    this.x = x || 0;
    this.y = y || 0;
    this.width = width || 0;
    this.height = height || 0;

    var renderBoxWidth;
    var renderBoxHeight;

    var fixToBottom = true;

    var color = '#252525';
    var texture;

    var dirty = false;

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


    this.setDirty = function(d){
        dirty = d;
    }
    this.isDirty = function(){ return dirty; }


    /**
    * Render box (zone où on fait le rendu de l'entité)
    */
    this.setRenderBox = function(width, height){
        renderBoxWidth = width;
        renderBoxHeight = height;
    }
    this.getRenderBox = function(){
        var offsetX = this.width / 2 - renderBoxWidth / 2;
        var offsetY = (fixToBottom) ? this.height - renderBoxHeight : this.height / 2 - renderBoxHeight / 2;

        return new Rectangle(this.x + offsetX, this.y + offsetY, renderBoxWidth, renderBoxHeight);
    }

    this.setFixedToBottom = function(b){
        fixToBottom = b;
    }


    /**
    * Rendu
    */
    this.setColor = function(c){
        color = c;
    }

    this.setTexture = function(t){
        texture = t;
    }

    this.getColor = function(){ return color; }
    this.getTexture = function(){ return texture; }
}
