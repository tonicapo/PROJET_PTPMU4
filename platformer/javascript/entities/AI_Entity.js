function AI_Entity(level, position, width, height){
    Entity.call(this, level, position, width, height);

    var self = this;

    var playerInRange = false;
    var playerInSight = false;
    var hasFocusPlayer = false;

    var idle = false;
    var hostile = false;

    this.property.reactionTime = 350;
    this.property.viewDistance = 250;


    this.update = function(){
        this.updateLogic();
        this.updateMovement();
        this.updateInteraction();
        this.updateObject();
    }


    /**
    * Met à jour le comportement de l'IA
    **/
    this.updateLogic = function(){
        movementLogic();
        combatLogic();
    }


    /**
    * MOUVEMENTS
    */

    function movementLogic(){
        if(!self.isDead()){
            var direction = self.getDirection();
            var moveLeft = canMoveLeft();
            var moveRight = canMoveRight();

            if(!idle){
                if(!hostile || (hostile && !playerInRange)){
                    // L'entité suit la direction courante
                    if(direction == 0){
                        self.left = moveLeft;
                        if(!moveLeft && moveRight){
                            self.setDirection(1);
                        }
                    }
                    else if(direction == 1){
                        self.right = moveRight;
                        if(moveLeft && !moveRight){
                            self.setDirection(0);
                        }
                    }
                }
                else{
                    self.left = false;
                    self.right = false;
                }
            }
            else{
                self.left = false;
                self.right = false;

                // L'entité modifie son comportement de base suite à une action du player ou son environnement
                if(playerInRange && hostile){
                    idle = false;
                }
            }
        }
        else{
            self.left = false;
            self.right = false;
        }
    }

    function canMoveLeft(){
        if(!self.isBlockedLeft() && self.isSolidLeft()){
            return true;
        }
        return false;
    }

    function canMoveRight(){
        if(!self.isBlockedRight() && self.isSolidRight()){
            return true;
        }
        return false;
    }



    this.isSolidLeft = function(){
        var tile = this.getTileAt(this.x - 1, this.y + this.height + 1);

        if(typeof tile !== 'undefined' && tile.tiletype.solid){
            return true;
        }
        return false;
    }

    this.isSolidRight = function(){
        var tile = this.getTileAt(this.x + this.width + 1, this.y + this.height + 1);

        if(typeof tile !== 'undefined' && tile.tiletype.solid){
            return true;
        }
        return false;
    }



    /**
    * COMBAT
    */

    function combatLogic(){
        var player = level.getPlayer();
        var direction = self.getDirection();

        playerInSight = player.intersects(self.getViewBox());
        playerInRange = player.intersects(self.getRangeBox());

        if(hostile){
            // le joueur est suffisamment près pour l'attaque
            if(playerInRange){
                // l'AI va focus le player et suivre ses mouvements
                hasFocusPlayer = true;

                // on tente une attaque
                level.getTimers().addTimer(function(){
                    if(!player.isDead()) self.attack([ player ]);
                }, self.property.reactionTime);
            }
            // on perd le joueur de vue
            if(!playerInSight){
                hasFocusPlayer = false;
            }

            if(hasFocusPlayer){
                console.log('test');
                var playerPosition = player.getCenter();
                var aiPosition = self.getCenter();

                if(direction == 0 && playerPosition.x > aiPosition.x){
                    self.setDirection(1);
                    console.log('se retourner');
                }
                else if(direction == 1 && playerPosition.x < aiPosition.x){
                    self.setDirection(0);
                    console.log('se retourner');
                }
            }
        }
    }




    this.getViewBox = function(){
        var offset = (this.getDirection() == 0) ? -this.property.viewDistance : this.width;
        return new Rectangle(this.x + offset, this.y, this.property.viewDistance, this.height);
    }

    this.setIdle = function(b){
        idle = b;
    }
    this.setHostile = function(b){
        hostile = b;
    }

    this.isIdle = function(){ return idle; }
    this.getHostile = function(){ return hostile; }
}
