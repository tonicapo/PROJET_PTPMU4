function AI_Entity(level, position, width, height){
    Entity.call(this, level, position, width, height);

    var self = this;

    var playerInRange = false;
    var playerInSight = false;
    var hasFocusPlayer = false;

    var idle = false;
    var hostile = false;

    this.property.reactionTime = 350;
    this.property.attackCooldown = 500;
    this.property.viewDistance = 250;


    this.init = function(){
        this.setAlive();
        this.initAnimations();
    }

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
        if(!self.isDead()){
            movementLogic();
            combatLogic();
        }
    }

    /**
    * MOUVEMENTS
    */

    function movementLogic(){
        var direction = self.getDirection();
        var moveLeft = canMoveLeft();
        var moveRight = canMoveRight();
        var player = level.getPlayer();

        if(!idle){
            // le comportement classique de l'entité est altéré par le joueur
            if(hasFocusPlayer){
                var playerPosition = player.getCenter();
                var aiPosition = self.getCenter();
                var currentDirection = direction;

                if(currentDirection == 0 && playerPosition.x > aiPosition.x){
                    direction = 1;
                    self.left = false;
                    self.right = true;
                }
                else if(currentDirection == 1 && playerPosition.x < aiPosition.x){
                    direction = 0;

                    self.left = true;
                    self.right = false;
                }



                self.setDirection(direction);
            }



            if(!hostile || (hostile && !playerInRange) || (hostile && level.getPlayer().isDead())){
                // L'entité suit la direction courante
                if(direction == 0){
                    self.left = moveLeft;
                    self.right = false;
                    if(!moveLeft && moveRight){
                        self.setDirection(1);
                    }
                }
                else if(direction == 1){
                    self.right = moveRight;
                    self.left = false;
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

    function isSolidAt(x, y){
        var tile = self.getTileAt(x, y);

        if(typeof tile !== 'undefined' && tile.tiletype.solid){
            return true;
        }
        return false;
    }

    this.isSolidLeft = function(){
        return isSolidAt(this.x - 1, this.y + this.height + 1);
    }

    this.isSolidRight = function(){
        return isSolidAt(this.x + this.width + 1, this.y + this.height + 1);
    }

    this.isBlockedByBreakable = function(){
        var direction = this.getDirection();
        var tile;
        var rangeBox = this.getRangeBox();

        tile = this.getTileAt(rangeBox.x + rangeBox.width / 2, rangeBox.y + rangeBox.height / 2);
        return (typeof tile !== 'undefined' && tile.isBreakable());
    }

    /**
    * COMBAT
    */

    function combatLogic(){
        var selectedItem = self.getSelectedItem();
        var player = level.getPlayer();

        if(!player.isDead() && hostile){
            var direction = self.getDirection();
            var lookDirection = (player.getDirection() == 0) ? 1 : 0;

            playerInSight = (!player.isDead() && player.intersects(self.getViewBox()));
            playerInRange = (!player.isDead() && player.intersects(self.getRangeBox()));

            // on accélère le mouvement de l'IA si elle voit le player
            if(hasFocusPlayer && !selectedItem.property.projectile){
                self.setBonus('speed', 2.5, 5000);
            }
            else{
                self.setBonus('speed', 1, -1);
            }

            // on perd le joueur de vue
            if(!playerInSight && hasFocusPlayer){
                // si l'entité perd le player de vue pendant trop longtemps elle perd le focus
                level.getTimers().addTimer(function(){
                    if(!playerInSight) hasFocusPlayer = false;
                }, 750);
            }

            if(playerInSight){
                if(self.isBlockedByBreakable()){
                    self.attack([ ]);
                }
            }


            if(playerInSight && !hasFocusPlayer){
                // si le player reste trop longtemps dans le champ de vision d'une entité elle le focus
                level.getTimers().addTimer(function(){
                    if(playerInSight) hasFocusPlayer = true;
                }, 500);
            }

            if(self.isAttacked()){
                hasFocusPlayer = true;
            }

            // le joueur est suffisamment près pour l'attaque
            if(playerInRange){
                // l'AI va focus le player et suivre ses mouvements
                hasFocusPlayer = true;
                self.attackPlayer();
            }

        }
        else{
            hasFocusPlayer = false;
            playerInRange = false;
            playerInSight = false;
            self.setBonus('speed', 1, -1);
        }
    }

    this.attackPlayer = function(){
        var player = level.getPlayer();
        // on tente une attaque
        level.getTimers().addTimer(function(){
            if(!player.isDead() && playerInRange){
                self.attack([ player ]);
            }
        }, self.property.reactionTime);
    }


    this.getViewBox = function(){
        var offset = (this.getDirection() == 0) ? -this.property.viewDistance : this.width;
        return new Rectangle(this.x + offset, this.y, this.property.viewDistance, this.height * 2/5);
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