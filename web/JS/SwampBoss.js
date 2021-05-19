//TODO: crear una caja que suelte mosquitos cada x segundos, hace que los tentaculos sean como el scyther 
var enemyList;
var config;
export var enemigoBoss;
var scene;
var tentaculos;
var tentacleList;
import * as glish from './glish.js';

export function preload(){
  this.load.spritesheet('BossSwamp','assets/images/bossPoison.png', { frameWidth: 86, frameHeight: 86});
  this.load.spritesheet('tentacle','assets/images/enemigo.png', { frameWidth: 86, frameHeight: 86});
  scene = this;

}

export function createBoss(obj, conf, el){
    tentacleList = scene.physics.add.group();
    config = conf;
    enemyList = el;
    enemigoBoss = scene.physics.add.sprite(obj.x,obj.y, 'BossSwamp').setOrigin(0.5); 
    enemigoBoss.vida = 30;
    enemigoBoss.ataque = 1;
    enemigoBoss.inmune = -1;
    enemigoBoss.status = "none";
    enemigoBoss.muerto = false;
    enemigoBoss.crearTentaculo = false;
    enemigoBoss.tiempo = 0;
    enemigoBoss.trigger = scene.add.rectangle(enemigoBoss.x,enemigoBoss.y+150, 500, 400);
    scene.physics.add.existing(enemigoBoss.trigger, false);
    enemigoBoss.trigger.activado = false;

    scene.physics.add.overlap(glish.glish, enemigoBoss.trigger, activarTrigger, null, scene);
    scene.physics.add.overlap(glish.beamList, enemigoBoss, activarTrigger, null, scene);


}

function generateTentacles(parent){
  tentacleList.create(parent.x-100,parent.y, 'tentacle').setOrigin(0.5);
  tentacleList.create(parent.x-50,parent.y, 'tentacle').setOrigin(0.5);
  tentacleList.create(parent.x+50,parent.y, 'tentacle').setOrigin(0.5);
  tentacleList.create(parent.x+100,parent.y, 'tentacle').setOrigin(0.5);
  enemigoBoss.crearTentaculo = true;
}

function activarTrigger(){
  enemigoBoss.trigger.activado = true;
  //crear un muro que evite poder salir de la pelea y genera los tentaculos;
}


export function updateBoss(){

  if(enemigoBoss.trigger.activado){
    if(enemigoBoss.crearTentaculo == false){
      generateTentacles(enemigoBoss);
    }
    Phaser.Actions.Call(tentacleList.getChildren(), function(go){



    });
  }

  if(enemigoBoss.vida <= 0){
      enemigoBoss.muerto = true;
  }
}