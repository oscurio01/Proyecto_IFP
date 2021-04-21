
var enemigoMosquito;
var scene;
var config;
import * as glish from './glish.js';
import * as game from './game.js';

export function preload(){
    this.load.image('missile1', 'assets/image/missile1.png');
    scene = this;
}

export function createEnemyMosquito(obj, enemyList, conf){
    config = conf;
    enemigoMosquito = enemyList.create(obj.x,obj.y, 'missile1').setOrigin(0.5); 
    enemigoMosquito.name = 'mosquito';
    enemigoMosquito.vida = 7;
    enemigoMosquito.ataque = 1;
    enemigoMosquito.inmune = -1;
    enemigoMosquito.status = "none";
    enemigoMosquito.EnAire = true;
    enemigoMosquito.tiempoMoverse = 100;
    enemigoMosquito.trigger = scene.add.rectangle(enemigoMosquito.x,enemigoMosquito.y, config.width/1.5, config.height/1.5);
    scene.physics.add.existing(enemigoMosquito.trigger, false);
    enemigoMosquito.trigger.active = false;

    scene.physics.add.overlap(glish.glish, enemigoMosquito.trigger, game.activarTrigger, null, scene);
    scene.physics.add.overlap(glish.beamList, enemigoMosquito, game.activarTrigger, null, scene);

}