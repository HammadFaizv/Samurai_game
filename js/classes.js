class Sprite {
    //always fired when class is called
    constructor({ position, imageSrc, scale = 1, framesMax = 1,framesHold = 8, offset = {x:0, y:0}}) {
        this.position = position;
        this.height = 150;
        this.width = 50;
        this.image = new Image();
        this.image.src = imageSrc;
        this.scale = scale;
        this.framesMax = framesMax;
        this.frameCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = framesHold;
        this.offset = offset;
    }

    draw() {
        c.drawImage(
            this.image,
            this.frameCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,

            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale, 
            this.image.height * this.scale
        );
    }

    animateFrames(){
    
        this.framesElapsed++;
    
        if(this.framesElapsed % this.framesHold === 0){
            if (this.frameCurrent < this.framesMax - 1) {
            this.frameCurrent++;
            } else {
                this.frameCurrent = 0;
            }
        }
    }

    update(){
        this.draw();
        this.animateFrames();
        
    }
}

class fighter extends Sprite{
    //always fired when class is called
    constructor({
        position,
        velocity,
        color = 'red',
        imageSrc,
        scale = 1,
        framesMax = 1,
        framesHold = 8,
        offset = {x:0, y:0},
        sprites,
        ai,
        attackBox = {offset: {}, width: undefined, height: undefined}
    }) {
        //used for inheritence
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            framesHold,
            offset
        });

        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.lastKey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        },
        this.color = color;
        this.isAttacking;
        this.health = 100;

        this.frameCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = framesHold;
        this.sprites = sprites;
        this.dead = false;
        this.move = false;

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
    }

    update(){
        this.draw();

        // attack boxes
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        //c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
        
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if(this.position.y + this.height + this.velocity.y >= canvas.height - 95){
            this.velocity.y = 0;
            this.position.y = 331;
        }else{
            this.velocity.y += gravity;
        }

        //animate frames
        if(!this.dead){ 
            this.animateFrames();
        }
    }

    attack(){
        this.switchSprite('attack1');
        this.isAttacking = true;
    }

    takeHit(){
        this.health -=10;

        if (this.health <= 0){
            this.switchSprite('death');
        } else {
            this.switchSprite('takeHit');
            if(this.attackBox.offset.x > 0){
                this.position.x -= 50;
            } else {
                this.position.x +=50;
            }
        }
    }

    switchSprite(sprite) {

        //dont move if death
        if (this.image === this.sprites.death.image){
            if (this.frameCurrent === this.sprites.death.framesMax - 1)
                this.dead = true;
            return;
        }

        //overwriting all animations with attack animation or taking hit animation
        if (this.image === this.sprites.attack1.image && 
            this.frameCurrent < this.sprites.attack1.framesMax - 1
            ) 
            return;
        
        if (this.image === this.sprites.takeHit.image && 
            this.frameCurrent < this.sprites.takeHit.framesMax - 1
            )
            return;

        switch (sprite){
            case 'idle':
                if(this.image !== this.sprites.idle.image){
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.frameCurrent = 0;
                }
                break;
            case 'run':
                if(this.image !== this.sprites.run.image){
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax;
                    this.frameCurrent = 0;
                }
                break;
            case 'jump':
                if(this.image !== this.sprites.jump.image){
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax;
                    this.frameCurrent = 0;
                }
                break;
            case 'fall':
                if(this.image !== this.sprites.fall.image){
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax;
                    this.frameCurrent = 0;
                }
                break;
            case 'attack1':
                if(this.image !== this.sprites.attack1.image){
                    this.image = this.sprites.attack1.image;
                    this.framesMax = this.sprites.attack1.framesMax;
                    this.frameCurrent = 0;
                }
                break;
            case 'takeHit':
                if(this.image !== this.sprites.takeHit.image){
                    this.image = this.sprites.takeHit.image;
                    this.framesMax = this.sprites.takeHit.framesMax;
                    this.frameCurrent = 0;
                }
                break;
            case 'death':
                if(this.image !== this.sprites.death.image){
                    this.image = this.sprites.death.image;
                    this.framesMax = this.sprites.death.framesMax;
                    this.frameCurrent = 0;
                }
                break;
        }
    }
}

class enemyFighter extends Sprite{
    //always fired when class is called
    constructor({
        player,
        position,
        velocity,
        color = 'red',
        imageSrc,
        scale = 1,
        framesMax = 1,
        framesHold = 8,
        offset = {x:0, y:0},
        sprites,
        ai,
        attackBox = {offset: {}, width: undefined, height: undefined}
    }) {
        //used for inheritence
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            framesHold,
            offset
        });

        this.player = player;
        this.velocity = velocity;
        this.height = 150;
        this.width = 50;
        this.lastKey;
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        },
        this.color = color;
        this.isAttacking;
        this.health = 100;

        this.frameCurrent = 0;
        this.framesElapsed = 0;
        this.framesHold = framesHold;
        this.sprites = sprites;
        this.dead = false;
        this.ai = ai;
        this.direction = 1;
        this.attackTime = 0;

        for (const sprite in this.sprites) {
            sprites[sprite].image = new Image();
            sprites[sprite].image.src = sprites[sprite].imageSrc;
        }
    }

    attackPattern() {

        const dx = this.player.position.x - this.position.x;
        const dy = this.player.position.y - this.position.y;

        const dist = Math.sqrt(dx * dx + dy * dy);

        // moving back and forth
        if(this.velocity.x === 0){
            this.velocity.x = 5;
        }
        this.switchSprite('run');

        //check for boundary of canvas
        if((this.position.x < 400 && this.velocity.x < 0) || 
        (this.position.x > canvas.width - 100 && this.velocity.x > 0)){
            this.velocity.x = -this.velocity.x;
        }

        if(dist < this.attackBox.width) {
            if(this.attackTime <= 0){
                this.attack();
                this.attackTime = 70;
            }
        }

        //dodging
        if(this.player.isAttacking && 
            Math.abs(dx) < 190 &&
            Math.random() > 0.4){
                this.velocity.x = 5;
                if(this.position.y + this.height + this.velocity.y >= canvas.height - 95){
                    this.velocity.y = -20;
            }
        }

        if(this.position.x > canvas.height - 150 && 
            Math.abs(dx) < 180 && 
            this.attackTime <= 0){
            this.attack();
        }

        //defending at low health
        if(this.health <= 40){
            if(this.player.isAttacking && 
                Math.abs(dx) < 180){
                if(Math.random() > 0.25){
                    this.velocity.x = 5;
                    if(this.position.y + this.height + this.velocity.y >= canvas.height - 95){
                        this.velocity.y = -20;
                    }
                }
            } else if(Math.abs(dx) < 165 && 
            this.attackTime <= 0) {
                this.attack();
                if(this.position.y + this.height + this.velocity.y >= canvas.height - 95){
                    this.velocity.y = -20;
                }
            }
        }

        if(this.attackTime > 0){
            this.attackTime--;
        }

    }

    update(){
        this.draw();

        // attack boxes
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y;

        //c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height);
        
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if(this.position.y + this.height + this.velocity.y >= canvas.height - 95){
            this.velocity.y = 0;
            this.position.y = 331;
        }else{
            this.velocity.y += gravity;
        }

        //animate frames
        if(!this.dead){ 
            this.animateFrames();
        }
        if(!this.dead && player.move && timer > 0){
            this.attackPattern();
        } else if (this.dead) {
            this.velocity.x = 0;
        } else {
            this.switchSprite('idle');
        }
        // this.attackPattern(200);
    }

    attack(){
        this.switchSprite('attack1');
        this.isAttacking = true;
    }

    takeHit(){
        this.health -=10;

        if (this.health <= 0){
            this.switchSprite('death');
        } else {
            this.switchSprite('takeHit');
            if(this.attackBox.offset.x > 0){
                this.position.x -= 50;
            } else {
                this.position.x +=50;
            }
        }
    }



    switchSprite(sprite) {

        //dont move if death
        if (this.image === this.sprites.death.image){
            if (this.frameCurrent === this.sprites.death.framesMax - 1)
                this.dead = true;
            return;
        }

        //overwriting all animations with attack animation or taking hit animation
        if (this.image === this.sprites.attack1.image && 
            this.frameCurrent < this.sprites.attack1.framesMax - 1
            ) 
            return;
        
        if (this.image === this.sprites.takeHit.image && 
            this.frameCurrent < this.sprites.takeHit.framesMax - 1
            )
            return;

        switch (sprite){
            case 'idle':
                if(this.image !== this.sprites.idle.image){
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.frameCurrent = 0;
                }
                break;
            case 'run':
                if(this.image !== this.sprites.run.image){
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax;
                    this.frameCurrent = 0;
                }
                break;
            case 'jump':
                if(this.image !== this.sprites.jump.image){
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax;
                    this.frameCurrent = 0;
                }
                break;
            case 'fall':
                if(this.image !== this.sprites.fall.image){
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax;
                    this.frameCurrent = 0;
                }
                break;
            case 'attack1':
                if(this.image !== this.sprites.attack1.image){
                    this.image = this.sprites.attack1.image;
                    this.framesMax = this.sprites.attack1.framesMax;
                    this.frameCurrent = 0;
                }
                break;
            case 'takeHit':
                if(this.image !== this.sprites.takeHit.image){
                    this.image = this.sprites.takeHit.image;
                    this.framesMax = this.sprites.takeHit.framesMax;
                    this.frameCurrent = 0;
                }
                break;
            case 'death':
                if(this.image !== this.sprites.death.image){
                    this.image = this.sprites.death.image;
                    this.framesMax = this.sprites.death.framesMax;
                    this.frameCurrent = 0;
                }
                break;
        }
    }
}