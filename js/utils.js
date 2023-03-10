function rectangularCollision({rectangle1,rectangle2}){
    return (rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width && 
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y && 
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    );
}

function determineWinner({player, enemy, timerID}) {
    clearTimeout(timerID);
    if (player.health === enemy.health) {
        document.querySelector('#displayText').innerHTML = 'Tie';
    } else if (player.health > enemy.health){
        document.querySelector('#displayText').innerHTML = 'You Win';
    } else if (player.health < enemy.health){
        document.querySelector('#displayText').innerHTML = 'You Lose';
        document.querySelector('#displayText').style.color = 'red';
    }
    
    document.querySelector('#displayText').style.display = 'flex';
}

let timer = 60;
let timerID;
function decreaseTimer(){
    if (timer>0) {
        timerID = setTimeout(decreaseTimer, 1000);
        timer--;
        document.querySelector('#gameTimer').innerHTML = timer;
    }

    if (timer === 0){
        determineWinner({player, enemy, timerID});
    }
}