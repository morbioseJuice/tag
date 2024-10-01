var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


document.body.onkeydown = function(e) {
    switch(e.keyCode) {
        case 65: 
            p1.keys[0] = true; break;
        case 68: 
            p1.keys[1] = true; break;
        case 87: 
            p1.keys[2] = true; break;
        case 83: 
            p1.keys[3] = true; break;
        case 37: 
            p2.keys[0] = true; break;
        case 38: 
            p2.keys[2] = true; break;
        case 39: 
            p2.keys[1] = true; break;
        case 40: 
            p2.keys[3] = true; break;
    }
}

document.body.onkeyup = function(e) {
    switch(e.keyCode) {
        case 65: 
            p1.keys[0] = false; break;
        case 68: 
            p1.keys[1] = false; break;
        case 87: 
            p1.keys[2] = false; break;
        case 83: 
            p1.keys[3] = false; break;
        case 37: 
            p2.keys[0] = false; break;
        case 38: 
            p2.keys[2] = false; break;
        case 39: 
            p2.keys[1] = false; break;
        case 40: 
            p2.keys[3] = false; break;
    }
}

var game = {
    mode: 1,
    submode: 1,
    maxTime: 300,
    time: 300,
    players: 1,
    reset(winner) {
        alert("Player " + winner + " won!");
        throw new Error("Fortnite.very.cheesyamongus is undefined!");
    }
}

class player {
    constructor(x, y, w, h, color, id) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.id = id;
        this.color = color;
        this.s = 5;
        this.keys = [false, false, false, false];
        this.points = 0;
        this.time = 0;
        this.cool = 0;
        this.crown = false;
        this.op;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    update() {
        this.s -= .25;
        if (this.s <= 5) {
            this.s = 5;
        }
        if (this.keys[0]) {
            this.x -= this.s;
        }
        if (this.keys[1]) {
            this.x += this.s;
        }
        if (this.keys[2]) {
            this.y -= this.s;
        }
        if (this.keys[3]) {
            this.y += this.s;
        }
        if (game.mode == 1) {
            if (game.submode == 2) {
                if (this.points == 25) {
                    game.reset(this.id);
                }
            }
        }
        if (game.mode == 2) {
            if (this.id == game.crownOwner) {
                this.crown = true;
            } else {
                this.crown = false;
            }
            if (this.crown == true) {
                this.time++;
                if (this.time == 50) {
                    this.time = 0;
                    this.points++
                }
                if (this.points == 10) {
                    game.reset(this.id);
                }
            } else {
                this.time = 0;
            }
            if (RRcollide(this.x, this.op.x, this.y, this.op.y, this.w, this.op.w, this.h, this.op.h)) {
                if (this.cool == 15){
                    this.cool = 0;
                    if (this.crown == true) {
                        game.crownOwner = this.op.id;
                    } else if (this.crown == false) {
                        game.crownOwner = this.id;
                        this.s = 10;
                    } 
                } else {
                    this.cool++;
                }
            }       
        }
        this.x = edgeCollide(this.x, this.y, this.w, this.h, this.s, 1)[0];
        this.y = edgeCollide(this.x, this.y, this.w, this.h, this.s, 1)[1];

        this.draw();
    }
}

class button {
    constructor(x, y, w, h, color) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        this.color = color;
    }
    draw() {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    update() {
        // if (RRcollide(this.x, clientXd, this.y, clientY, this.w, 1, this.h, 1)) {
        //     alert("cheeeez!");
        // }
        //this.draw();
    }
}

class ball {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = 25;
        this.h = 25;
    }
    draw() {
        switch(game.mode) {
            case 1: ctx.fillStyle = "red"; break;
            case 2: ctx.fillStyle = "yellow"; break;
        }
        ctx.fillRect(this.x + this.w/2, this.y + this.h/2, this.w, this.h);
    }
    update(color) {
        if (RRcollide(this.x + this.w/2, p1.x, this.y + this.h/2, p1.y, this.w, p1.w, this.h, p1.h)) {
            p1.points += 1;
            game.maxTime -= 5;
            game.time = game.maxTime;
            this.x = Math.ceil(Math.random() * canvas.width - this.w);
            this.y = Math.ceil(Math.random() * canvas.height - this.h);
        }
        if (RRcollide(this.x + this.w / 2, p2.x, this.y + this.h / 2, p2.y, this.w, p2.w, this.h, p2.h)) {
            p2.points += 1;
            game.maxTime -= 5;
            game.time = game.maxTime;
            this.x = Math.ceil(Math.random() * canvas.width - this.w);
            this.y = Math.ceil(Math.random() * canvas.height - this.h);
        }
        this.draw();
    }
}

var RRcollide = function(x1, x2, y1, y2, w1, w2, h1, h2){
    if (x1 + w1>= x2 && x1<= x2 + w2 && y1 + h1>= y2 && y1<= y2 + h2
    ) {
        return true;
    }
}

var edgeCollide = function(x, y, w, h, s, type) {
    //right
    if (x >= canvas.width - w) { 
        x = s;
    }
    //left
    else if (x <= 0) { 
        x = canvas.width - w - s;
    }
    //down
    else if (y >= canvas.height - h) { 
        y = s;
    }
    //up
    else if (y <= 0) { 
        y = canvas.height - h - s;
    }
    
    return [x, y];

}

var add = function(num1, num2) {
    let num3 = num1 + num2;
    return num3;
}

var update = function() {
    ctx.clearRect(0, 0, screen.width, screen.height);
    if (game.mode == 1 && game.submode == 1) {
        document.getElementById("points").innerHTML = "Points: " + p1.points;
        document.getElementById("time").innerHTML = "Time: " + game.time;
        game.time--;
    } else if (game.mode == 1 && game.submode == 2) {
        document.getElementById("points").innerHTML = "P1: " + p1.points;
        document.getElementById("points2").innerHTML = "P2: " + p2.points;
    } else if (game.mode == 1 && game.submode == 3) {
        document.getElementById("points").innerHTML = "Points: " + add(p1.points, p2.points);
        document.getElementById("time").innerHTML = "Time: " + game.time;
        game.time--;
    }
    if (game.mode == 2 && game.submode == 1) {
        document.getElementById("points").innerHTML = "P1: " + p1.points;
        document.getElementById("points2").innerHTML = "P2: " + p2.points; 
    }
    if(game.time <= 0) {
        game.reset();
    }
    p1.update();
    if (game.players >= 2) {
        p2.update();
    }
    if (game.mode == 1) {
        b1.update("black");
    }
    button1.update();
    console.log(p1.crown, p2.crown);
    window.requestAnimationFrame(update);
}


//setup and prompts
game.mode = Number(prompt("Pick Game Mode (1 = chase, 2 = tag)"));
if (game.mode == 1) {
    game.submode = Number(prompt("Pick Sub-game Mode (1 = solo, 2 = versus, 3 = co-op)"));
    switch(game.submode) {
        case 1: game.players = 1; break;
        case 2: game.players = 2; break;
        case 3: game.players = 2; break;
    }
}
if (game.mode == 2) {
    game.submode = Number(prompt("Pick Sub-game Mode (1 = 2 player versus)"));
    switch(game.submode) {
        case 1: 
            game.players = 2; break;
    }
    game.crownOwner = Math.ceil(Math.random() * game.players); 
}
//game.players = prompt("Pick Player Amount (1 or 2)");

if (game.mode == 2 && game.players <= 1) {
    alert("Tag is 2 player only.");
    alert("It will be automatically changed to 2.")
    game.players = 2;
} 


var p1 = new player(0, 0, 25, 25, "blue", 1);
var p2 = new player(800, 0, 25, 25, "green", 2);
p1.op = p2;
p2.op = p1;
var b1 = new ball(250, 250, "cheese", "mungus");
var button1 = new button(250, 250, 100, 100, "gray");

window.requestAnimationFrame(update);