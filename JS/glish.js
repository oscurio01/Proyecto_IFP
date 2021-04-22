
var scene;
var pointer;
var cursor;
export var glish;
var keyUp;
var keyRight;
var keyLeft;
var keyDown;
var fire;
var relentizar;
var puntero;
var config;
var velocity;
var velocity2;
var tiempo;
var tiempo2;
var tiempoEstado;
var relentizar;
export var beamList;
export var ondaList;
var ondaDeDanyo;
var ondaCura; 
var vidaText;
var map;

import * as game from './game.js';
import * as utilidades from './utilidades.js';

export function preload(){
	this.load.image('missile1', 'assets/image/missile1.png');
	this.load.spritesheet('glish','assets/image/Glish.png', {frameWidth:32, frameHeight:32});
    this.load.spritesheet('ondas','assets/image/ondas.png', {frameWidth:32, frameHeight:32});
    this.load.spritesheet('cura','assets/image/AitorMolestaParte1.png', {frameWidth:32, frameHeight:32});
    scene = this;
}

export function create(){

	createCursor();
    //Crear la Glish o el jugador
    glish = scene.physics.add.sprite( 500, 200, 'glish').setOrigin(0.5,0.5); 
    glish.status = "none";
    //Vida del jugador
    glish.vida = 10;
    glish.inmune = -1;
   	glish.tiempoStatus = 0;

    moverKEY();

    scene.cameras.main.startFollow(glish);
    vidaText =scene.add.text(16,0,'Vida: '+ glish.vida,{fontsize:'8px',fill:'#FFF'}).setScrollFactor(0); 
    beamList = scene.physics.add.group();
    ondaList = scene.physics.add.group();

    velocity = 200;
    velocity2 = 6;
    tiempo = 0;
    tiempo2 = 0;
    tiempoEstado = 0;
    relentizar = 0;

    //console.log(scene.obstaculos);
    scene.physics.add.collider(glish, scene.obstaculos);
    scene.physics.add.collider(glish, scene.obstaculos2);
    scene.physics.add.collider(glish, scene.obstaculos3);
}

export function update(conf){

	updateCursor(conf);

    moverPersonaje.call(scene);

    if(pointer.isDown && tiempo == 0){
        ondasRockeras.call(scene);
    }
    if(fire.isDown && tiempo2 == 0){
        heavyMetal.call(scene);
    }

    atacarPersonaje.call(scene);

    updateEstadosDelJugador.call(scene);

    vidaText.text = "Vida: "+ glish.vida;

}

function createCursor(){
	pointer = scene.input.activePointer;
	//Cursor
    cursor = scene.physics.add.sprite(0, 0,'missile1');
   	puntero = new Phaser.Geom.Point();
}

function updateCursor(conf){
    config = conf;
    puntero.x = glish.x - config.width / 2 + pointer.x;
    puntero.y = glish.y - config.height / 2 + pointer.y;
    cursor.x = puntero.x;
    cursor.y = puntero.y;

}

function moverKEY(){

    keyUp = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    keyRight = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
    keyLeft = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    keyDown = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    fire = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
}

function moverPersonaje(){
    if(glish.body != undefined){
        if(keyUp.isDown){
            glish.setVelocityY(-velocity+relentizar);

        } else if(keyDown.isDown){
            glish.setVelocityY(velocity-relentizar);

        }else{glish.setVelocityY(0);}

        if(keyRight.isDown){
            glish.setVelocityX(velocity-relentizar);

        } else if(keyLeft.isDown){
            glish.setVelocityX(-velocity+relentizar);

        }else{glish.setVelocityX(0);}

    }

}

function ondasRockeras(){

    ondaDeDanyo = beamList.create(glish.x, glish.y, 'ondas');
    ondaDeDanyo.ataque = 2;
    tiempo = 80;
    ondaDeDanyo.scale = 0.4;
    ondaDeDanyo.limite = 2;
    ondaDeDanyo.angle = Math.atan2( puntero.y - glish.y, puntero.x - glish.x);
    ondaDeDanyo.angle = ondaDeDanyo.angle * 180/Math.PI;
    Phaser.Actions.Call(beamList.getChildren(), function(go) {
        go.dir = new Phaser.Math.Vector2( Math.cos(go.angle*Math.PI/180), Math.sin(go.angle*Math.PI/180));
        go.dir.normalize();
    });

}

function heavyMetal(){

    ondaCura = ondaList.create(glish.x, glish.y, 'cura');

    if(glish.vida < 10){
        glish.vida +=1;
    }

    ondaCura.scale = 0.4;
    ondaCura.limite = 5;

    Phaser.Actions.Call(ondaList.getChildren(), function(go) {
        go.setSize(go.width, go.height);
        go.dir = new Phaser.Math.Vector2( 0, 0);
        go.dir.normalize();
    });
    tiempo2 = 400;
}

function atacarPersonaje(){

    if(tiempo > 0){
        tiempo--;
    }
    if(tiempo2 > 0){
        tiempo2--;
    }

    //Indica el movimiento tanto del disparo recto como el direccionado
    Phaser.Actions.Call(beamList.getChildren(), function(go) {
        go.x = go.x+velocity2*go.dir.x;
        go.y = go.y+velocity2*go.dir.y;

        if(go.scale <= go.limite){
            go.scale += 0.03;
        }
        if(go.scale != null){
            go.setScale(go.scale);
        }
        if(go.scale >= go.limite){
            go.destroy();
        }
    }); 

    Phaser.Actions.Call(ondaList.getChildren(), function(go) {
        go.x = glish.x;
        go.y = glish.y;

        if(go.scale <= go.limite){
            go.scale += 0.07;
            if(glish.vida > 10){
                glish.vida = 10;
            }
            glish.status = "none";
            relentizar = 0;
        }
        if(go.scale != null){
            go.setScale(go.scale);
        }
        if(go.scale >= go.limite){
            go.destroy();
        }   
    }); 

}

function updateEstadosDelJugador(){
    if(glish.status != "none"){
        if(glish.status == "envenenado"){
            if(glish.tiempoStatus %60 == 0){
                glish.vida -= 1;
            }
            if(glish.tiempoStatus <= 0){
                glish.status = "none";
                relentizar = 0;
            }else{
                glish.tiempoStatus--;
            }
        }
    }

    if(glish.inmune >= 0){
        glish.inmune--;
    }

}

export function climbing_plant(obj,casilla){

    if(obj == ondaDeDanyo && casilla.properties.cut_attack){
        console.log("destruida");
        obj.destroy();
        utilidades.collisionSwitch(casilla, false);
        casilla.properties.cut_attack = false;
        casilla.setAlpha(0);
        
    }
}

export function destroyOnda(obj1, obj2){
    obj1.destroy();
}

export function poisonPlayer(obj,casilla){
    if(obj == glish && casilla.properties.veneno){
        glish.status = "envenenado";
        if(glish.tiempoStatus == 0){
        glish.tiempoStatus = 300;
        }
        relentizar = 100;

    }
    else if ((casilla.properties.aspectoVeneno || casilla.properties.veneno) && (obj == ondaList || obj !=glish))
    {
        casilla.setAlpha(0);
        casilla.properties.veneno=false;
    
        setTimeout(()=>{
            if(!casilla.properties.aspectoVeneno){
                casilla.properties.veneno = true;
            }
            casilla.setAlpha(1);
        },7000);
    }
    //console.log(casilla.properties.veneno);
}