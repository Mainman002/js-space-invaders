
// Random integer
function Random_Num(_min, _max) {
    return Math.floor(Math.random() * (_max - _min + 1)) + _min;
}

// Used to initialize project images
function Image_Loader_Init(image_dict) {
    return image_dict;
}

// Used on objects to display images
function Image_Loader_Load(src) {
  const image = new Image;
  image.src = src;
  return image;
}

// Draw image to canvas with style color
function Color_Image(ob) {
    ob.ctx.save();

    // Draw mask to buffer
    ob.ctx.drawImage(ob.image, ob.frame.x, ob.frame.y, 16, 8, ob.pos.x, ob.pos.y, ob.size.w, ob.size.h);

    // Draw the color only where the mask exists (using source-in)
    ob.main.cRedCtx.fillStyle = `Red`;
    ob.main.cOrangeCtx.fillStyle = `Orange`;
    ob.main.cYellowCtx.fillStyle = `Yellow`;
    ob.main.cGreenCtx.fillStyle = `Green`;
    ob.main.cTealCtx.fillStyle = `Teal`;
    ob.main.cWhiteCtx.fillStyle = `White`;

    ob.ctx.globalCompositeOperation = "source-in";
    ob.ctx.fillRect(0, 0, canvas.width, canvas.height);

    ob.ctx.restore();
}

function Draw_Text(_ctx, _text, _align, _font, _pos, _size, _color, _a) {
    _ctx.globalAlpha = _a;
    _ctx.textAlign = _align;
    _ctx.fillStyle = _color;
  
    if (_font){
        _ctx.font = `${_size}px ${_font}`;
    } else {
        _ctx.font = `${_size}px ${"Noto Sans"}`;
    }
  
    _ctx.fillText(`${_text}`, _pos.x, _pos.y);
    _ctx.globalAlpha = 1;
  }


function Rect(_ctx, _pos, _size, _color, _a){
    _ctx.globalAlpha = _a;
    _ctx.fillStyle = _color;
    _ctx.fillRect(_pos.x, _pos.y, _size.w, _size.h);
    _ctx.globalAlpha = 1;
}


const Draw_Image = function (_ctx, _image, _frame, _spriteSize, _pos, _size, _a) {
    _ctx.globalAlpha = _a;
  
    _ctx.save();
    _ctx.translate(_pos.x, _pos.y);
    // _ctx.rotate(_rot);
  
    _ctx.drawImage(_image, 
    _frame.x, _frame.y, _spriteSize.w, _spriteSize.h, 
    _pos.x-_pos.x-_size.w * 0.5, _pos.y-_pos.y-_size.h * 0.5, 
    _size.w, _size.h);
  
    _ctx.restore();
    _ctx.globalAlpha = 1.0;
  }
  
  
  const Draw_Image_Simple = function (_ctx, _image, _pos, _size, _a) {
    _ctx.globalAlpha = _a;
  
    _ctx.drawImage(_image, 
    _pos.x, _pos.y, _size.w, _size.h);
    _ctx.globalAlpha = 1.0;
  }


// Checks if ob_a (Mouse) + Size is inside in ob_b (Button, Tower, Enemy, etc)
function Collider_Area (ob_a, ob_b) {
    const inAreaZone = ( ob_a.pos.x + ob_a.size.w * 0.5) > 
                        ( ob_b.pos.x + ob_b.size.w - ob_b.size.w ) - ( ob_a.size.w * 0.5 ) &&

                        ( ob_a.pos.x + -ob_a.size.w * 0.5 ) < 
                        ( ob_b.pos.x + ob_b.size.w ) - ( ob_a.size.w * 0.5 ) &&

                        ( ob_a.pos.y + ob_a.size.h * 0.5) > 
                        ( ob_b.pos.y + ob_b.size.h - ob_b.size.h ) - ( ob_a.size.h * 0.5 ) &&

                        ( ob_a.pos.y + -ob_a.size.h * 0.5 ) < 
                        ( ob_b.pos.y + ob_b.size.h ) - ( ob_a.size.h * 0.5 )

    return inAreaZone;
  };

function ScreenEdge () {
    return {
        left: 0,
        right: canvas.width,
        up: 0,
        down: canvas.height
    }
}

function InsideArea (position, size) {
    return {
        left: position.x,
        right: position.x + size.w,
        up: position.y,
        down: position.y + size.h
    }
}
  
function CompareAreas (A, B) {
    const check = (
        A.left >= B.left &&
        A.right <= B.right &&
        A.up >= B.up &&
        A.down <= B.down
    )

    return check
}

function Screen_Init(_main, _canvas){
    _canvas.width = _main.window_size.w;
    _canvas.height = _main.window_size.h;
    _canvas.style.width = `${_main.window_size.w}px`;
    _canvas.style.height = `${_main.window_size.h}px`;

    Screen_Resize(_main, _main.ctx, _canvas)
    Screen_Resize(_main, _main.colorsCtx, cColors);
    Screen_Resize(_main, _main.cRedCtx, cRed);
    Screen_Resize(_main, _main.cOrangeCtx, cOrange);
    Screen_Resize(_main, _main.cYellowCtx, cYellow);
    Screen_Resize(_main, _main.cGreenCtx, cGreen);
    Screen_Resize(_main, _main.cTealCtx, cTeal);
    Screen_Resize(_main, _main.cWhiteCtx, cWhite);
}

function Screen_Resize(main, _ctx, _canvas){
    const border = 50;
    
    const aspectList = {
        box:{w:5, h:4.5},
        wide:{w:6.5, h:4}
    }

    const aspect = aspectList.box;

    const img_smooth = false;
    let w = window.innerWidth;
    let h = w * (aspect.h / aspect.w);
    
    if (h < window.innerHeight){
        // Check window width
        w = window.innerWidth;
        h = w * (aspect.h / aspect.w);
    } else {
        // Check window height
        h = window.innerHeight;
        w = h * (aspect.w / aspect.h);
    }
    
    if (main.debug) console.log("Resized", "W", Math.floor(w), "H", Math.floor(h));
    
    _canvas.style.width = `${w - border}px`;
    _canvas.style.height = `${h - border}px`;
    
    // Graphic sharpness
    _ctx.mozImageSmoothingEnabled = img_smooth;
    _ctx.msImageSmoothingEnabled = img_smooth;
    _ctx.imageSmoothingEnabled = img_smooth;
}


// Key Input Inspired by Frank Poth 08/13/2017 https://youtu.be/8uIt9a2XBrw
class Controller {
    constructor(main) {
        this.main = main;
        this.left = false;
        this.right = false;
        this.up = false;
        this.down = false;
        this.jump = false;
        this.shoot = false;
        this.pos = {x: 0, y: 0};
        this.lastPos = {x: 0, y: 0};

        this.touchListener = function(event) {
            event.preventDefault();
            this.touch_state = (event.type === "touchstart")?true:false;

            if (main.players[0]) {
                this.pos = {x: main.players[0].pos.x + main.players[0].size.w*0.5, y: main.players[0].pos.y};
            } else {
                this.pos = {x: 0, y: 0};
            }

            if (event.touches[0] && event.touches[0].clientX) {
                this.pos.x = event.touches[0].clientX;
            // } else {
            //     this.pos.x = 0;
            }

            if (event.touches[0] && event.touches[0].clientY) {
                this.pos.y = event.touches[0].clientY;
            // } else {
            //     this.pos.y = 0;
            }

            // START ---------------------------------------------------------------

            let bounds = canvas.getBoundingClientRect();

            // get the mouse coordinates, subtract the canvas top left and any scrolling
            if (event.touches[0]) {
                this.pos.x = event.touches[0].clientX - bounds.left - scrollX;
                this.pos.y = event.touches[0].clientY - bounds.top - scrollY;
            // }

                // first normalize the mouse coordinates from 0 to 1 (0,0) top left
                // off canvas and (1,1) bottom right by dividing by the bounds width and height
                this.pos.x /= bounds.width; 
                this.pos.y /= bounds.height; 

                // then scale to canvas coordinates by multiplying the normalized coords with the canvas resolution
                this.pos.x *= canvas.width;
                this.pos.y *= canvas.height;

            // Center Mouse Bounds
            // this.pos.x = this.pos.x - main.mouse.size.w * 0.5;
            // this.pos.y = this.pos.y - main.mouse.size.h * 0.5;
            }


            // END ---------------------------------------------------------------

            if (main.players[0]) {
                if (main.players[0].pos.x < this.pos.x) {
                    main.players[0].state = 3;
                }

                if (this.pos.x > ScreenEdge().left + 4 && this.pos.x < ScreenEdge().right - 4) {
                    main.players[0].pos.x = this.pos.x - main.players[0].size.w*0.5;
                }
            }
            
            switch(event.type) {
                case "touchstart":
                    this.shoot = this.touch_state;
                    main.mouse.pressed = this.touch_state;
                    main.key_shoot = this.touch_state;
                    break;

                case "touchend":
                    this.shoot = this.touch_state;
                    main.mouse.pressed = this.touch_state;
                    main.key_shoot = this.touch_state;
                    main.canPress = true;
                    break;
            }
        }


        this.mouseListener = function(event) {
            event.preventDefault();
            this.mouse_state = (event.type === "mousedown")?true:false;

            switch(event.type) {
                case "mousedown":
                    this.shoot = this.mouse_state;
                    main.mouse.pressed = this.mouse_state;
                    main.key_shoot = this.mouse_state;
                    break;

                case "mouseup":
                    this.shoot = this.mouse_state;
                    main.mouse.pressed = this.mouse_state;
                    main.key_shoot = this.mouse_state;
                    main.canPress = true;
                    break;
            }
        }

        
        this.keyListener = function(event) {
            this.key_state = (event.type === "keydown")?true:false;

            switch(event.key) {
                case "a":
                    this.left = this.key_state;
                    main.key_left = this.key_state;
                    break;
                case "ArrowLeft":
                    this.left = this.key_state;
                    main.key_left = this.key_state;
                    break;
                case "d":
                    this.right = this.key_state;
                    main.key_right = this.key_state;
                    break;
                case "ArrowRight":
                    this.right = this.key_state;
                    main.key_right = this.key_state;
                    break;
                case "w":
                    this.up = this.key_state;
                    main.key_up = this.key_state;

                    this.shoot = this.key_state;
                    main.key_shoot = this.key_state;
                    break;
                case "ArrowUp":
                    this.up = this.key_state;
                    main.key_up = this.key_state;

                    this.shoot = this.key_state;
                    main.key_shoot = this.key_state;
                    break;
                case "s":
                    this.up = this.key_state;
                    main.key_down = this.key_state;
                    break;
                case "ArrowDown":
                    this.up = this.key_state;
                    main.key_down = this.key_state;
                    break;
                case " ":
                    this.jump = this.key_state;
                    main.key_jump = this.key_state;

                    this.shoot = this.key_state;
                    main.key_shoot = this.key_state;
                    break;
            }
        }
    }
}


class Player {
    constructor(main, pos, size, color) {
        this.main = main;
        this.ctx = main.ctx;
        this.image = main.images.players;
        this.states = [];
        this.currentState = this.states[0];
        this.state = 0;
        this.dir = 0;
        this.acceleration = 15;
        this.drag = 30;
        this.velocity = 0;
        this.max_speed = 300;
        this.pos = pos;
        this.size = size;
        this.color = color;
        this.shoot_timer = 0;
        this.shoot_max = 20;
        this.dt = 0;
    }

    init() {
 
    }

    draw() {
        Draw_Image(this.main.ctx, this.image, {x: 0, y: 0}, {w: 16, h: 8}, {x: this.pos.x + this.size.w*0.5, y: this.pos.y + this.size.h*0.5}, this.size, 1);        
    }

    Stop() {
        this.state = 0;
        this.dir = 0;
        this.velocity = 0;
    }

    MoveLeft() {
        this.state = 3;
        this.dir = -1;
        if (this.velocity > -this.max_speed) {
            this.velocity -= this.acceleration;
        }
        // this.pos.x = Math.round(this.pos.x - this.velocity * this.dt); 
    }

    MoveRight() {
        this.state = 4;
        this.dir = 1;
        if (this.velocity < this.max_speed) {
            this.velocity += this.acceleration;
        }
        // this.pos.x = Math.round(this.pos.x + this.velocity * this.dt); 
    }


    update(dt) {
        this.dt = dt;

        if (!this.main.canPress) {
            if (!this.main.shoot) {
                this.main.canPress = true;
            }
        }

        if (this.main.canPress) {
            if (this.main.key_shoot) {
                if (this.shoot_timer === 0) {
                    // this.main.lasers.push(new Laser(this.main, {x: this.pos.x - 25 + this.size.w*0.5, y: this.pos.y-5}, {w: 4, h:8}, 1));
                    // this.main.lasers.push(new Laser(this.main, {x: this.pos.x - 13 + this.size.w*0.5, y: this.pos.y-5}, {w: 4, h:8}, 1));
                    this.main.lasers.push(new Laser(this.main, {x: this.pos.x + this.size.w*0.5 - 2, y: this.pos.y-5}, {w: 4, h:8}, 1));
                    // this.main.lasers.push(new Laser(this.main, {x: this.pos.x + 13 + this.size.w*0.5, y: this.pos.y-5}, {w: 4, h:8}, 1));
                    // this.main.lasers.push(new Laser(this.main, {x: this.pos.x + 25 + this.size.w*0.5, y: this.pos.y-5}, {w: 4, h:8}, 1));
                    this.shoot_timer = this.shoot_max;
                } else {
                    --this.shoot_timer * dt;
                }
            } else {
                this.shoot_timer = 2;
            }
        }

        if (!this.main.key_left && !this.main.key_right) {
            this.state = 1;
        } else if (this.main.key_left && this.main.key_right) {
            this.state = 1;
        } else if (this.main.key_left) {
            if (Math.round(this.pos.x > ScreenEdge().left + 4)) {
                this.state = 3;
            } else {
                this.state = 0;
            }
        } else if (this.main.key_right) {
            if (Math.round(this.pos.x < ScreenEdge().right - this.size.w-4)) {
                this.state = 4;
            } else {
                this.state = 0;
            }
        } 

        if (Math.round(this.pos.x < ScreenEdge().left + 4)){
            this.Stop();
            this.pos.x = ScreenEdge().left + 4;
        }

        if (Math.round(this.pos.x > ScreenEdge().right - this.size.w-4)){
            this.Stop();
            this.pos.x = ScreenEdge().right - this.size.w-4;
        }

        if (this.state == 0) {
            // Standing
            this.velocity = 0;
            this.dir = 0;
            this.state = 0;

        } else if (this.state == 1) {
            // Stopped
            if (this.dir == -1) {
                if (this.velocity < 0) {
                    this.velocity += this.drag;
                } else {
                    this.velocity = 0;
                    this.dir = 0;
                    this.state = 0;
                }

            } else if (this.dir == 1) {
                if (this.velocity > 0) {
                    this.velocity -= this.drag;
                } else {
                    this.velocity = 0;
                    this.dir = 0;
                    this.state = 0;
                }
            }

        } else if (this.state == 2) {
            Stop();
        } if (this.state == 3) {
            // Move Left
            if (Math.round(this.pos.x > 0)) {
                this.MoveLeft();
            } else {
                this.state = 0;
            }
            
        // Move Right
        } else if (this.state == 4) {
            this.MoveRight();
        } 
        this.pos.x = Math.round(this.pos.x + this.velocity * dt); 
    }
}


class Laser {
    constructor(main, pos, size, dmg) {
        this.main = main;
        this.ctx = main.ctx;
        this.damage = dmg;
        this.speed = 200;
        this.pos = pos;
        this.size = size;
        this.color = "Teal";
        this.alive = true;
    }

    init() {

    }

    draw() {
        Rect(this.main.ctx, this.pos, this.size, this.color, 1);
    }

    update(dt) {
        this.pos.y = Math.round(this.pos.y + -this.speed * dt); 
        this.pos.x = Math.round(this.pos.x); 
        
        if (this.pos.y < 0) {
            this.alive = false;
        }
    }
}


class Enemy {
    constructor(main, pos, size, frame, hp) {
        this.main = main;
        this.ctx = main.ctx;
        this.image = main.images.enemies;
        this.frame = frame;
        this.currentFrame = {x: 0, y: frame.y};
        this.animSpeed = 0;
        this.type = hp;
        this.health = hp;
        this.dir = 1;
        this.pos = pos;
        this.size = size;
        this.spd = 0.6;
        this.color = main.colors[this.health];
        this.alive = true;
    }

    init() {
        this.currentFrame.x = Random_Num(0, 4);
    }

    draw() {
        if (this.animSpeed < 5) {
            ++this.animSpeed;
        } else {
            if (this.currentFrame.x < 5) {
                this.currentFrame.x += 1;
            } else {
                this.currentFrame.x = 0;
            }
            this.animSpeed = 0;
        }

        this.frame.x = Math.round(16 * this.currentFrame.x);
        this.frame.y = 8*this.type;
    }

    update(dt) {

        switch (this.health) {
            case 0:
                this.ctx = this.main.cRedCtx;
                Color_Image(this);
            break;

            case 1:
                this.ctx = this.main.cOrangeCtx;
                Color_Image(this);
            break;

            case 2:
                this.ctx = this.main.cYellowCtx;
                Color_Image(this);
            break;

            case 3:
                this.ctx = this.main.cGreenCtx;
                Color_Image(this);
            break;

            case 4:
                this.ctx = this.main.cTealCtx;
                Color_Image(this);
            break;

            case 5:
                this.ctx = this.main.cWhiteCtx;
                Color_Image(this);
            break;
        }

        if (this.dir === 1) {
            this.pos.x = (this.pos.x + this.spd + this.main.speedMod) + this.dir * dt;
        } else {
            this.pos.x = (this.pos.x + -this.spd - this.main.speedMod) + -this.dir * dt;
        }

        if (this.health < 0) {
            this.alive = false;
        }

        if (this.alive) {
            for (let i = 0; i < this.main.lasers.length; i++){
                if (this.main.lasers[i].alive && Collider_Area(this.main.lasers[i], this)) {
                    this.main.lasers[i].alive = false;
                    this.health -= 1;
                }
            }
        }
    }
}


class Main {
    constructor() {
        this.ctx = canvas.getContext('2d');
        this.colorsCtx = cColors.getContext('2d');

        this.touch = {
            x: undefined,
            y: undefined
        };

        this.cRedCtx = cRed.getContext('2d');
        this.cOrangeCtx = cOrange.getContext('2d');
        this.cYellowCtx = cYellow.getContext('2d');
        this.cGreenCtx = cGreen.getContext('2d');
        this.cTealCtx = cTeal.getContext('2d');
        this.cWhiteCtx = cWhite.getContext('2d');

        this.speedMod = 0;

        this.window_size = {w: 480, h: 256};
        this.game_state = "MainMenu";
        this.start_btn = false;
        this.players = [];
        this.enemies = [];
        this.lasers = [];
        this.blockLimits = {min_x: 1, max_x: 7, min_y: 2, max_y: 10};
        this.colors = ["Red", "Orange", "Yellow", "Green", "Teal", "White"];

        this.images = {
            enemies: Image_Loader_Load('img/Enemies.png'),
            players: Image_Loader_Load('img/Players.png'),
        }

        // Input Events
        this.canPress = true;
        this.key_left = false;
        this.key_right = false;
        this.key_up = false;
        this.key_down = false;
        this.key_jump = false;
        this.key_shoot = false;

        this.mouse = {
            pos: {x: 0, y: 0},
            size: {w: 0.2, h: 0.2},
            fingers: 0,
            pressed: false
        }
    }

    init() {
        Screen_Init(this, canvas);
        Screen_Resize(this, this.ctx, canvas);

        Screen_Init(this, cColors);
        Screen_Resize(this, this.colorsCtx, cColors);

        Screen_Init(this, cRed);
        Screen_Resize(this, this.cRedCtx, cRed);

        Screen_Init(this, cOrange);
        Screen_Resize(this, this.cOrangeCtx, cOrange);

        Screen_Init(this, cYellow);
        Screen_Resize(this, this.cYellowCtx, cYellow);

        Screen_Init(this, cGreen);
        Screen_Resize(this, this.cGreenCtx, cGreen);

        Screen_Init(this, cTeal);
        Screen_Resize(this, this.cTealCtx, cTeal);

        Screen_Init(this, cWhite);
        Screen_Resize(this, this.cWhiteCtx, cWhite);
    }

    reset_game() {
        this.game_state = "Game";
        this.start_btn = false;
        this.speedMod = 0;
        this.players = [];
        this.enemies = [];
        this.lasers = [];
        this.blockLimits = {min_x: 1, max_x: Random_Num(7, 9), min_y: 1, max_y: Random_Num(6, 8)};
        Random_Num(0, this.colors.length-1)
        
        // Input Events
        this.canPress = false;
        this.key_left = false;
        this.key_right = false;
        this.key_up = false;
        this.key_down = false;
        this.key_jump = false;
        // this.key_shoot = false;

        this.init_objs();
    }

    init_objs() {
        this.players.push(new Player(this, {x: Math.round(canvas.width*0.5-32), y: Math.round(canvas.height-13)}, {w: 32, h: 12}, "White"));
        this.players.forEach(ob => ob.init());

        for (let x = this.blockLimits.min_x; x < this.blockLimits.max_x; ++x) {
            for (let y = this.blockLimits.min_y; y < this.blockLimits.max_y; ++y) {
                let hp = Random_Num(0, Random_Num(0, this.colors.length-2));
                this.enemies.push(new Enemy(this, {x: 36 * x, y: 16 * y}, {w: 30, h: 14}, {x: hp, y: hp}, hp));
            }
        }

        this.enemies.forEach(ob => ob.init());
    }

    draw() {
        if (this.game_state === "MainMenu") {
            Draw_Text(this.ctx, `Press Spacebar or Tap Screen to Play`, `center`, null, {x: canvas.width*0.5, y: canvas.height*0.5}, 20, `White`, 1);
        }

        if (this.game_state === "GameOver") {
            Draw_Text(this.ctx, `Press Spacebar or Tap Screen to Play Again`, `center`, null, {x: canvas.width*0.5, y: canvas.height*0.5}, 20, `White`, 1);
        }

        if (this.game_state === "Game") {
            this.enemies.forEach(ob => ob.draw());
            this.lasers.forEach(ob => ob.draw());
            this.players.forEach(ob => ob.draw());
        }
    }

    update(dt) {
        if (!this.start_btn && !this.key_shoot) {
            this.start_btn = true;
        }

        if (this.game_state === "MainMenu") {
            if (this.start_btn && this.key_shoot) {
                this.reset_game();
            }
        }

        if (this.game_state === "GameOver") {
            if (this.start_btn && this.key_shoot) {
                this.reset_game();
            }
        }

        if (this.game_state === "Game") {
            for (let i = 0; i < this.lasers.length; i++){
                if (this.lasers[i] && !this.lasers[i].alive){
                    this.lasers.splice(i, 1);
                    i--;
                }
            }

            for (let i = 0; i < this.enemies.length; i++){
                if (this.enemies[i].pos.y > canvas.height-this.enemies[i].size.h || Collider_Area(this.enemies[i], this.players[0])){
                    this.start_btn = false;
                    this.game_state = "GameOver";
                }

                if (this.enemies[i].dir === 1 && this.enemies[i].pos.x > canvas.width-this.enemies[i].size.w){
                    for (let i = 0; i < this.enemies.length; i++){
                        this.enemies[i].dir = -1;
                        this.enemies[i].pos.y += 14;
                    }
                } else if (this.enemies[i].dir === -1 && this.enemies[i].pos.x < 0){
                    for (let i = 0; i < this.enemies.length; i++){
                        this.enemies[i].dir = 1;
                        this.enemies[i].pos.y += 14;
                    }
                }

                if (this.enemies[i] && !this.enemies[i].alive){
                    this.speedMod = this.speedMod + 0.052;
                    this.enemies.splice(i, 1);
                    i--;
                }
            }

            if (this.enemies.length < 1) {
                this.start_btn = false;
                this.game_state = `GameOver`;
            }

            this.enemies.forEach(ob => ob.update(dt));
            this.lasers.forEach(ob => ob.update(dt));
            this.players.forEach(ob => ob.update(dt));
        }
    }
}

addEventListener('load', (e) => {
    const main = new(Main);
    main.init();

    Screen_Resize(main, main.ctx, canvas);
    
    addEventListener('resize', (e) => {
        Screen_Resize(main, main.ctx, canvas);
        Screen_Resize(main, main.colorsCtx, cColors);

        Screen_Resize(main, main.cRedCtx, cRed);
        Screen_Resize(main, main.cOrangeCtx, cOrange);
        Screen_Resize(main, main.cYellowCtx, cYellow);
        Screen_Resize(main, main.cGreenCtx, cGreen);
        Screen_Resize(main, main.cTealCtx, cTeal);
        Screen_Resize(main, main.cWhiteCtx, cWhite);
    });

    // Update loop ---------------------------------------
    const Input = new Controller(main);

    // Touch
    addEventListener('touchstart', Input.touchListener, { passive: false });
    addEventListener('touchend', Input.touchListener, { passive: false });
    addEventListener('touchmove', Input.touchListener, { passive: false });

    // Mouse
    addEventListener('mousedown', Input.mouseListener, { passive: false });
    addEventListener('mouseup', Input.mouseListener, { passive: false });

    // Keyboard
    addEventListener("keydown", Input.keyListener);
    addEventListener("keyup", Input.keyListener);

    const deltaTime = 1 / 60
    let accumulatedTime = 0
    let lastTime = 0
  
    function animate (time) {
      accumulatedTime += (time - lastTime) / 1000
  
      while (accumulatedTime > deltaTime) {
        main.ctx.clearRect(0, 0, canvas.width, canvas.height);

        main.cRedCtx.clearRect(0, 0, canvas.width, canvas.height);
        main.cOrangeCtx.clearRect(0, 0, canvas.width, canvas.height);
        main.cYellowCtx.clearRect(0, 0, canvas.width, canvas.height);
        main.cGreenCtx.clearRect(0, 0, canvas.width, canvas.height);
        main.cTealCtx.clearRect(0, 0, canvas.width, canvas.height);
        main.cWhiteCtx.clearRect(0, 0, canvas.width, canvas.height);
  
        main.update(deltaTime);
        main.draw();
  
        accumulatedTime -= deltaTime;
      }
      requestAnimationFrame(animate);
      lastTime = time;
    }
    animate(0);
  });

function input_touch() {

    game.addEventListener('touchstart', (e) => {
    const x = e.touches[0].screenX;
    const y = e.touches[0].screenY;

    main.touch.x = x;
    main.touch.y = y;

    e.preventDefault();
    });

    game.addEventListener('touchmove', (e) => {
    const x = e.touches[0].screenX;
    const y = e.touches[0].screenY;

    if (y > main.touch.y) {
        main.input.swipeDown = true;
    }

    if (y < main.touch.y) {
        main.input.swipeUp = true;
    }

    if (x > main.touch.x) {
        main.input.swipeRight = true;
    }

    if (x < main.touch.x) {
        main.input.swipeLeft = true;
    }

    main.touch.x = x;
    main.touch.y = y;
    });

    game.addEventListener('touchend', () => {
    main.input.swipeUp = false;
    main.input.swipeDown = false;
    main.input.swipeLeft = false;
    main.input.swipeRight = false;
    });

    game.addEventListener('touchcancel', () => {
    main.input.swipeUp = false;
    main.input.swipeDown = false;
    main.input.swipeLeft = false;
    main.input.swipeRight = false;
    });
}

