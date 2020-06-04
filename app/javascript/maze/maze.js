import Phaser from 'phaser';
import sky from "./assets/sky.png";
import platform from "./assets/platform.png";
import star from "./assets/star.png";
import bomb from "./assets/bomb.png";
import dude from "./assets/dude.png";

let player;
let obstacles;
let cursors;
let gameOver = false;
let _goRight = false;
let movingRight = false;
let _goLeft = false;
let movingLeft = false;
let _goUp = false;
let movingUp = false;
let _goDown = false;
let movingDown = false;
let currentX = 0;
let currentY = 0;
let delta = 50;

let config = {
    type: Phaser.AUTO,
    transparent: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 0},
            debug: true
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update,
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_VERTICALLY,
        parent: 'game',
        width: 900,
        height: 500,
    }
};
let game = new Phaser.Game(config);

function preload() {
    this.load.image('sky', sky);
    this.load.image('ground', platform);
    this.load.image('star', star);
    this.load.image('bomb', bomb);
    this.load.spritesheet('dude', dude, {frameWidth: 32, frameHeight: 48});
}

function create() {
    //  A simple background for our game
    this.add.image(450, 250, 'sky');

    //  The obstacles group
    obstacles = this.physics.add.staticGroup();

    let maze = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    ];

    // Build maze placing all defined obstacles
    for (let r = 1; r <= 10; r++) {
        for (let c = 1; c <= 18; c++) {
            if (maze[r - 1][c - 1] === 1) {
                obstacles.create(c * 50 - 25, r * 50 - 25, 'ground');
            }
        }
    }

    // The player and its settings
    player = this.physics.add.sprite(75, 425, 'dude');
    // player.setAllowGravity(false);

    //  Player physics properties. Give the little guy a slight bounce.
    player.setCollideWorldBounds(true);

    //  Our player animations, turning, walking left and walking right.
    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('dude', {start: 0, end: 3}),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [{key: 'dude', frame: 4}],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('dude', {start: 5, end: 8}),
        frameRate: 10,
        repeat: -1
    });

    //  Input Events
    cursors = this.input.keyboard.createCursorKeys();

    //  Collide the player with the obstacles
    this.physics.add.collider(player, obstacles, hitObstacle, null, this);
}

function update() {
    if (gameOver) {
        return;
    }

    // console.log("player(x,y)=(%d,%d)", player.x, player.y);

    if (_goRight) {
        if (!movingRight) {
            currentX = player.x;
            movingRight = true;
        }

        player.x += 1;
        player.anims.play('right', true);

        if (player.x === currentX + delta) {
            _goRight = false;
            movingRight = false;
        }
    } else if (_goLeft) {
        if (!movingLeft) {
            currentX = player.x;
            movingLeft = true;
        }

        player.x -= 1;
        player.anims.play('left', true);

        if (player.x === currentX - delta) {
            _goLeft = false;
            movingLeft = false;
        }
    } else if (_goUp) {
        if (!movingUp) {
            currentY = player.y;
            movingUp = true;
        }

        player.y -= 1;
        // player.anims.play('up', true);

        if (player.y === currentY - delta) {
            _goUp = false;
            movingUp = false;
        }
    } else if (_goDown) {
        if (!movingDown) {
            currentY = player.y;
            movingDown = true;
        }

        player.y += 1;
        // player.anims.play('down', true);

        if (player.y === currentY + delta) {
            _goDown = false;
            movingDown = false;
        }
    } else {
        player.setVelocity(0, 0);
        player.anims.play('turn');
    }

    if (cursors.left.isDown) {
        player.setVelocityX(-160);

        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);

        player.anims.play('right', true);
    } else {
    }

    if (cursors.up.isDown) {
        player.setVelocityY(-330);
    }
}

function hitObstacle(player, obstacle) {
    _goRight = false;
    movingRight = false;
    _goLeft = false;
    movingLeft = false;
    _goUp = false;
    movingUp = false;
    _goDown = false;
    movingDown = false;

    document.getElementById('message').innerText = "Game over";
}

export function goRight() {
    _goRight = true;
}

export function goLeft() {
    _goLeft = true;
}

export function goUp() {
    _goUp = true;
}

export function goDown() {
    _goDown = true;
}

export function isMoving() {
    return _goDown || _goUp || _goLeft || _goRight;
}
