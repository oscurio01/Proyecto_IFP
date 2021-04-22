
var enemigoRana;
var lenguaRana;
var scene;
var config;
var tiempoRana = 30;
import * as glish from './glish.js';
import * as game from './game.js';

export function preload(){
	this.load.spritesheet('EnemigoRana','assets/image/enemigo.png', {frameWidth:32, frameHeight:32});
	scene = this;
}

export function createEnemyRana(obj, enemyList, conf){
    config = conf;
    enemigoRana = enemyList.create(obj.x,obj.y, 'EnemigoRana').setOrigin(0.5); 
    enemigoRana.name = 'rana';
    enemigoRana.vida = 7;
    enemigoRana.ataque = 1;
    enemigoRana.inmune = -1;
    enemigoRana.status = "none";
    enemigoRana.EnAire = false;
    enemigoRana.tiempoMoverse = 100;
    enemigoRana.trigger = scene.add.rectangle(enemigoRana.x,enemigoRana.y, config.width/1.5, config.height/1.5);
    scene.physics.add.existing(enemigoRana.trigger, false);
    enemigoRana.trigger.active = false;
    enemigoRana.triggerAtaque = scene.add.rectangle(enemigoRana.x,enemigoRana.y, config.width/2, config.height/2);
    scene.physics.add.existing(enemigoRana.triggerAtaque, false);
    enemigoRana.triggerAtaque.active = false;

    //console.log(glish.glish);
    scene.physics.add.overlap(glish.glish, enemigoRana.trigger, game.activarTrigger, null, scene);
    scene.physics.add.overlap(glish.glish, enemigoRana.triggerAtaque, createLenguaRana, null, scene);
    scene.physics.add.overlap(glish.beamList, enemigoRana, game.activarTrigger, null, scene);

}


function createLenguaRana(){
    if(tiempoRana <=0){
        tiempoRana = 30;

        lenguaRana = scene.physics.add.sprite(enemigoRana.x,enemigoRana.y, 'ondas').setOrigin(0.5); 
        lenguaRana.name = 'lenguaRana';
        lenguaRana.vida = enemigoRana.vida;
        lenguaRana.ataque = 2;

    }

    if(tiempoRana > 0){
        tiempoRana--;
    }
}
function updateLenguaRana() {

    
}