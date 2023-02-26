const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/background.png'
});

const lamp = new Sprite({
    position: {
        x: 95,
        y: 348
    },
    imageSrc: './assets/lamp.png',
    scale: 2.3
});

const shop = new Sprite({
    position: {
        x: 650,
        y: 160
    },
    imageSrc: './assets/shop.png',
    scale: 2.5,
    framesMax: 6
});

const player = new fighter({
    position : {
        x: 0,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    offset: {
        x: 0,
        y: 0
    },
    imageSrc: './assets/Mack/Idle.png',
    framesMax: 8,
    scale: 2.5,
    offset: {
        x: 215,
        y: 157
    },
    sprites: {
        idle: {
            imageSrc: './assets/Mack/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc : './assets/Mack/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc : './assets/Mack/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc : './assets/Mack/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc : './assets/Mack/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc : './assets/Mack/Take Hit.png',
            framesMax: 4
        },
        death: {
            imageSrc : './assets/Mack/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 145,
        height: 50
    }
});

//console.log(player);
//player.draw();

const enemy = new fighter({
    position : {
        x: 400,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    color:'blue',
    offset: {
        x: -50,
        y: 0
    },
    imageSrc: './assets/kenji/Idle.png',
    framesMax: 4,
    scale: 2.5,
    offset: {
        x: 215,
        y: 167
    },
    sprites: {
        idle: {
            imageSrc: './assets/kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc : './assets/kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc : './assets/kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc : './assets/kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc : './assets/kenji/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc : './assets/kenji/Take hit.png',
            framesMax: 3
        },
        death: {
            imageSrc : './assets/kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -165,
            y: 50
        },
        width: 165,
        height: 50
    }
});

//enemy.draw()

// making animate function that calls itself
//for running the program in loop

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight:{
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

decreaseTimer();

function animate(){
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    lamp.update();
    shop.update();

    c.fillStyle = 'rgba(255, 255, 255, 0.15)'
    c.fillRect(0, 0, canvas.width, canvas.height);

    player.update();
    enemy.update();

    //player movement
    player.velocity.x = 0;
    
    if (keys.a.pressed && player.lastKey === 'a'){
        player.velocity.x = -5;
        player.switchSprite('run');
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 5;
        player.switchSprite('run');
    } else {
        player.switchSprite('idle');
    }

    //jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump');
    } else if (player.velocity.y > 0){
        player.switchSprite('fall');
    }

    //enemy movement
    enemy.velocity.x = 0;
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5;
        enemy.switchSprite('run');
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 5;
        enemy.switchSprite('run');
    } else {
        enemy.switchSprite('idle');
    }

    //enemy jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump');
    } else if (enemy.velocity.y > 0){
        enemy.switchSprite('fall');
    }

    //detection of collision
    if(
        rectangularCollision({
            rectangle1: player,
            rectangle2: enemy
        }) && 
        player.isAttacking && player.frameCurrent === 4){
            enemy.takeHit();
            player.isAttacking = false;
    
            gsap.to('#enemyHealth',{
                width: enemy.health + '%'
            });
        }
    
    // if player misses
    if (player.isAttacking && player.frameCurrent === 4){
        player.isAttacking = false;
    }
    
    if(
        rectangularCollision({
            rectangle1: enemy,
            rectangle2: player
        }) && 
        enemy.isAttacking && enemy.frameCurrent === 2){
            player.takeHit();
            enemy.isAttacking = false;
            
            gsap.to('#playerHealth',{
                width: player.health + '%'
            });        
    }

    // if enemy misses
    if (enemy.isAttacking && enemy.frameCurrent === 2){
        enemy.isAttacking = false;
    }

    //if health becomes zero
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({player, enemy,timerID});
    }
}

animate();

window.addEventListener('keydown', (event)=> {
    if (!player.dead){
    
    switch (event.key){
        //player keys
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd';
            break;
        case 'a':
            keys.a.pressed = true;
            player.lastKey = 'a';
            break;
        case 'w':
            if(player.position.y + player.height + player.velocity.y >= canvas.height - 95){
                player.velocity.y = -20;
            }
            break;
        case ' ':
            player.attack();
            break;
    }
    }

    if (!enemy.dead){
    switch (event.key){
        //enemy keys
        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight';
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft';
            break;
        case 'ArrowUp':
            if(enemy.position.y + enemy.height + enemy.velocity.y >= canvas.height - 95){
                enemy.velocity.y = -20;
            }
            break;
        case 'ArrowDown':
            enemy.attack();
            break;
    }
    }
});

window.addEventListener('keyup', (event)=> {

    //player keys
    switch (event.key){
        case 'd':
            keys.d.pressed = false;
            break;
        case 'a':
            keys.a.pressed = false;
            break;

        //enemy keys
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
            break;
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
            break;
    }
});