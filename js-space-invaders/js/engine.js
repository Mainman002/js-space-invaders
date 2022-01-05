

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


function Screen_Init(_main, _canvas){
    _canvas.width = _main.window_size.w;
    _canvas.height = _main.window_size.h;
    _canvas.style.width = `${_main.window_size.w}px`;
    _canvas.style.height = `${_main.window_size.h}px`;
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
                if (this.pos.x > main.players[0].pos.x + main.players[0].size.w*0.5 + 10) {
                    // main.key_right = true;
                    // main.key_left = false;
                    main.players[0].pos.x = this.pos.x - main.players[0].size.w*0.5;
                    // console.log("Greater");
                } else if (this.pos.x < main.players[0].pos.x + main.players[0].size.w*0.5 - 10) {
                    main.players[0].pos.x = this.pos.x - main.players[0].size.w*0.5;
                    // main.key_right = false;
                    // main.key_left = true;
                    // console.log("Less");
                // } else if (this.pos.x > main.players[0].pos.x + main.players[0].size.w*0.5 + 10 || this.pos.x < main.players[0].pos.x + main.players[0].size.w*0.5 - 10) {
                    // main.key_right = false;
                    // main.key_left = false;
                    // main.players[0].drag = 100;
                    // main.players[0].acceleration = 100;

                    // main.players[0].pos.x = this.pos.x;
                // } else {
                //     main.key_right = false;
                //     main.key_left = false;
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
                    // main.players[0].pos.x = this.pos.x - main.players[0].size.w*0.5;
                    // console.log(this.pos.x);
                    // main.key_left = false;
                    // main.key_right = false;
                    // console.log(main.key_left);
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
                    // console.log("Pressed Left: ", this.left);
                    break;
                case "ArrowLeft":
                    this.left = this.key_state;
                    main.key_left = this.key_state;
                    // console.log("Pressed Left: ", this.left);
                    break;
                case "d":
                    this.right = this.key_state;
                    main.key_right = this.key_state;
                    // console.log("Pressed Right: ", this.right);
                    break;
                case "ArrowRight":
                    this.right = this.key_state;
                    main.key_right = this.key_state;
                    // console.log("Pressed Right: ", this.right);
                    break;
                case "w":
                    this.up = this.key_state;
                    main.key_up = this.key_state;

                    this.shoot = this.key_state;
                    main.key_shoot = this.key_state;
                    // console.log("Pressed Up: ", this.up);
                    break;
                case "ArrowUp":
                    this.up = this.key_state;
                    main.key_up = this.key_state;

                    this.shoot = this.key_state;
                    main.key_shoot = this.key_state;
                    // console.log("Pressed Up: ", this.up);
                    break;
                case "s":
                    this.up = this.key_state;
                    main.key_down = this.key_state;
                    // console.log("Pressed Down: ", this.down);
                    break;
                case "ArrowDown":
                    this.up = this.key_state;
                    main.key_down = this.key_state;
                    // console.log("Pressed Down: ", this.down);
                    break;
                case " ":
                    this.jump = this.key_state;
                    main.key_jump = this.key_state;

                    this.shoot = this.key_state;
                    main.key_shoot = this.key_state;
                    // console.log("Pressed Jump: ", this.jump);
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
        // this.frame = {x: 0, y: 0};
        this.states = [];
        this.currentState = this.states[0];
        this.state = 0;
        this.dir = 0;
        // this.speed = 0.5;
        this.acceleration = 0.04;
        this.drag = 0.03;
        this.velocity = 0;
        this.max_speed = 0.5;
        this.pos = pos;
        this.size = size;
        this.color = color;
        this.shoot_timer = 0;
        this.shoot_max = 11;
    }

    init() {
        // console.log(this.image);

        // this.image.style.color="#FF0000";
        
        // console.log("Pushed Player");
    }

    draw() {
        // Rect(this.main.ctx, this.pos, this.size, this.color, 1);
        // Draw_Image_Simple(this.main.ctx, this.image, this.pos, this.size);
        Draw_Image(this.main.ctx, this.image, {x: 0, y: 0}, {w: 16, h: 8}, {x: this.pos.x + this.size.w*0.5, y: this.pos.y + this.size.h*0.5}, this.size, 1);        
    
        // Color_Image(this);
    }

    update(dt) {

        // if (this.main.key_shoot) {
        //     console.log("Shooting");
        // }

        // switch (this.state) {
        //     case 0:

        //         break;
        // }

        // if (!this.main.key_left && !this.main.key_right) {
        //     this.state = 1
        // } else if (this.main.key_left && this.main.key_right) {
        //     this.state = 2
        // } else if (this.main.key_left) {
        //     this.state = 3
        // } else if (!this.main.key_left) {
        //     this.state = 4
        // } else if (this.main.key_right) {
        //     this.state = 5
        // } else if (!this.main.key_right) {
        //     this.state = 6
        // }

        if (!this.main.canPress) {
            if (!this.main.shoot) {
                this.main.canPress = true;
                console.log("Up");
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
            if (Math.round(this.pos.x > 2)) {
                this.state = 3;
            } else {
                this.state = 0;
            }
        } else if (this.main.key_right) {
            if (Math.round(this.pos.x < canvas.width - this.size.w-2)) {
                this.state = 4;
            } else {
                this.state = 0;
            }
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
            // Move Left and Right
            this.dir = 0;
            if (this.velocity > 0) {
                this.velocity -= this.drag;
            }
            
        } if (this.state == 3) {
            // Move Left
            if (Math.round(this.pos.x > 0)) {
                this.dir = -1;
                if (this.velocity > -this.max_speed) {
                    this.velocity -= this.acceleration;
                }
            } else {
                this.state = 0;
            }
            
        } else if (this.state == 4) {
            // Move Right
            this.dir = 1;
            if (this.velocity < this.max_speed) {
                this.velocity += this.acceleration;
            }
        } 

        this.pos.x = Math.round(this.pos.x + this.velocity * dt); 

        if (Math.round(this.pos.x > canvas.width - this.size.w)) {
            this.state = 0;
            this.pos.x = Math.round(canvas.width - this.size.w);
        }   

        if (Math.round(this.pos.x < 0)) {
            this.state = 0;
            this.pos.x = Math.round(this.pos.x < 0);
        }  
    }
}


class Laser {
    constructor(main, pos, size, dmg) {
        this.main = main;
        this.ctx = main.ctx;
        this.damage = dmg;
        this.speed = 0.21;
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


class Block {
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
        this.color = main.colors[this.health];
        this.alive = true;
    }

    init() {
        this.currentFrame.x = Random_Num(0, 4);
        // this.frame.x = Math.round(16 * this.currentFrame.x);
        // console.log("Enemy");
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


        // this.pos.y = Math.round(this.pos.y + -this.speed * dt);
        this.frame.x = Math.round(16 * this.currentFrame.x);
        this.frame.y = 8*this.type;


        // Rect(this.main.colorsCtx, this.pos, this.size, this.main.colors[this.health], 1);
        // Draw_Image_Simple(this.main.ctx, this.image, this.pos, this.size);
        // Composite_Color(this.main, this, this.color, {x: this.pos.x, y: this.pos.y, w: this.size.w, h: this.size.h})
        // Draw_Image(this.ctx, this.image, {x: 16*this.health, y: 8*this.frame.y}, {w: 16, h: 8}, {x: this.pos.x + this.size.w*0.5, y: this.pos.y + this.size.h*0.5}, this.size, 1);
        
        
        // this.ctx.fillStyle = this.color;
        // this.ctx.globalCompositeOperation = "source-in";
        // this.ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Color_Image(this.main.ctx, this);

        // if (this.health >= 0) {
        //     Draw_Text(this.main.ctx, `${this.health}`, `center`, null, {x: this.pos.x+this.size.w*0.5, y: this.pos.y+this.size.h-2}, 10, "Black", 1);
        // }
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
            ++this.pos.x * this.dir;
        } else {
            --this.pos.x * this.dir;
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

        this.cRedCtx = cRed.getContext('2d');
        this.cOrangeCtx = cOrange.getContext('2d');
        this.cYellowCtx = cYellow.getContext('2d');
        this.cGreenCtx = cGreen.getContext('2d');
        this.cTealCtx = cTeal.getContext('2d');
        this.cWhiteCtx = cWhite.getContext('2d');

        this.window_size = {w: 480, h: 256};
        this.game_state = "MainMenu";
        this.start_btn = false;
        this.players = [];
        this.blocks = [];
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

        // console.log("Loaded Main");
    }

    reset_game() {
        this.game_state = "Game";
        this.start_btn = false;
        this.players = [];
        this.blocks = [];
        this.lasers = [];
        // this.blockLimits = {min_x: 1, max_x: 7, min_y: 2, max_y: 12};
        this.blockLimits = {min_x: Random_Num(0, 3), max_x: Random_Num(4, 7), min_y: Random_Num(1, 4), max_y: Random_Num(5, 10)};
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
        this.players.push(new Player(this, {x: Math.round(canvas.width*0.5-32), y: Math.round(canvas.height-17)}, {w: 32, h: 16}, "White"));
        this.players.forEach(ob => ob.init());

        for (let x = this.blockLimits.min_x; x < this.blockLimits.max_x; ++x) {
            for (let y = this.blockLimits.min_y; y < this.blockLimits.max_y; ++y) {
                let hp = Random_Num(0, Random_Num(0, this.colors.length-2));
                this.blocks.push(new Block(this, {x: 36 * x, y: 18 * y}, {w: 32, h: 16}, {x: hp, y: hp}, hp));
            }
        }

        this.blocks.forEach(ob => ob.init());

        // console.log("Reset_Game");
    }

    draw() {
        if (this.game_state === "MainMenu") {
            Draw_Text(this.ctx, `Press Spacebar or Tap Screen to Play`, `center`, null, {x: canvas.width*0.5, y: canvas.height*0.5}, 20, `White`, 1);
        }

        if (this.game_state === "GameOver") {
            Draw_Text(this.ctx, `Press Spacebar or Tap Screen to Play Again`, `center`, null, {x: canvas.width*0.5, y: canvas.height*0.5}, 20, `White`, 1);
        }

        if (this.game_state === "Game") {
            this.blocks.forEach(ob => ob.draw());
            this.lasers.forEach(ob => ob.draw());
            this.players.forEach(ob => ob.draw());

            // Draw_Text(this.ctx, `Lasers: ${this.lasers.length}`, 'left', null, {x: 8, y:18}, 16, 'White', 1);

            // Draw_Text(this.ctx, `Touch: ${this.touchEvent}`, 'left', null, {x: 8, y:18}, 16, 'White', 1);
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

            for (let i = 0; i < this.blocks.length; i++){
                if (this.blocks[i].pos.y > canvas.height-this.blocks[i].size.h || Collider_Area(this.blocks[i], this.players[0])){
                    this.start_btn = false;
                    this.game_state = "GameOver";
                }

                if (this.blocks[i].dir === 1 && this.blocks[i].pos.x > canvas.width-this.blocks[i].size.w){
                    for (let i = 0; i < this.blocks.length; i++){
                        this.blocks[i].dir = -1;
                        this.blocks[i].pos.y += 14;
                    }
                } else if (this.blocks[i].dir === -1 && this.blocks[i].pos.x < 0){
                    for (let i = 0; i < this.blocks.length; i++){
                        this.blocks[i].dir = 1;
                        this.blocks[i].pos.y += 14;
                    }
                }

                if (this.blocks[i] && !this.blocks[i].alive){
                    this.blocks.splice(i, 1);
                    i--;
                }
            }

            if (this.blocks.length < 1) {
                this.start_btn = false;
                this.game_state = `GameOver`;
            }

            this.blocks.forEach(ob => ob.update(dt));
            this.lasers.forEach(ob => ob.update(dt));
            this.players.forEach(ob => ob.update(dt));
        }
    }
}


window.addEventListener('load', (e) => {
    const main = new(Main);
    main.init();
    
    window.addEventListener('resize', (e) => {
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
    window.addEventListener('touchstart', Input.touchListener, { passive: false });
    window.addEventListener('touchend', Input.touchListener, { passive: false });
    window.addEventListener('touchmove', Input.touchListener, { passive: false });

    // Mouse
    window.addEventListener('mousedown', Input.mouseListener, { passive: false });
    window.addEventListener('mouseup', Input.mouseListener, { passive: false });

    // Keyboard
    window.addEventListener("keydown", Input.keyListener);
    window.addEventListener("keyup", Input.keyListener);
    

    let lastTime = 1;
    function animate(timeStamp) {
        if (!timeStamp) timeStamp = 0;

        main.ctx.clearRect(0, 0, canvas.width, canvas.height);

        main.cRedCtx.clearRect(0, 0, canvas.width, canvas.height);
        main.cOrangeCtx.clearRect(0, 0, canvas.width, canvas.height);
        main.cYellowCtx.clearRect(0, 0, canvas.width, canvas.height);
        main.cGreenCtx.clearRect(0, 0, canvas.width, canvas.height);
        main.cTealCtx.clearRect(0, 0, canvas.width, canvas.height);
        main.cWhiteCtx.clearRect(0, 0, canvas.width, canvas.height);


        // main.colorsCtx.clearRect(0, 0, canvas.width, canvas.height);

        // Composite_Color(canvas, cColors);

        const dt = timeStamp - lastTime;
        lastTime = timeStamp;

        main.update(dt);
        main.draw();

        requestAnimationFrame(animate);
    }
    animate();
});



