
var enemigoMosquito;
var scene;
var config;
import * as glish from './glish.js';
import * as game from './game.js';

export function preload(){
  this.load.spritesheet('mosq','assets/image/mosqui.png', { frameWidth: 32, frameHeight: 32});
  scene = this;
}

export function createEnemyMosquito(obj, conf){
    config = conf;
    enemigoMosquito = game.enemyList.create(obj.x,obj.y, 'mosq').setOrigin(0.5); 
    enemigoMosquito.name = 'mosquito';
    enemigoMosquito.vida = 7;
    enemigoMosquito.ataque = 1;
    enemigoMosquito.inmune = -1;
    enemigoMosquito.status = "none";
    enemigoMosquito.tiempoMoverse = 100;
    enemigoMosquito.trigger = scene.add.rectangle(enemigoMosquito.x,enemigoMosquito.y, config.width/1.5, config.height/1.5);
    scene.physics.add.existing(enemigoMosquito.trigger, false);
    enemigoMosquito.trigger.activado = false;

    scene.physics.add.overlap(glish.glish, enemigoMosquito.trigger, game.activarTrigger, null, scene);
    scene.physics.add.overlap(glish.beamList, enemigoMosquito, game.activarTrigger, null, scene);


}
