//TODO: crear una caja que suelte mosquitos cada x segundos, hace que los tentaculos sean como el scyther 

var enemigoBoss;
var scene;
var config;
var tentaculos;
var tentacleList = this.physics.add.group();
import * as glish from './glish.js';

export function preload(){
  this.load.spritesheet('BossSwamp','assets/images/bossPoison.png', { frameWidth: 86, frameHeight: 86});
  this.load.spritesheet('tentacle','assets/images/bossPoison.png', { frameWidth: 86, frameHeight: 86});
  scene = this;
}

export function createBoss(obj, conf){
    config = conf;
    enemigoBoss = scene.physics.add.sprite(obj.x,obj.y, 'BossSwamp').setOrigin(0.5); 
    enemigoBoss.vida = 30;
    enemigoBoss.ataque = 1;
    enemigoBoss.inmune = -1;
    enemigoBoss.status = "none";
    enemigoBoss.muerto = false;
    enemigoBoss.tiempo = 0;
    enemigoBoss.trigger = scene.add.rectangle(enemigoBoss.x,enemigoBoss.y, enemigoBoss.width/1.5, enemigoBoss.height/1.5);
    scene.physics.add.existing(enemigoBoss.trigger, false);
    enemigoBoss.trigger.activado = false;

    scene.physics.add.overlap(glish.glish, enemigoBoss.trigger, activarTrigger, null, scene);
    scene.physics.add.overlap(glish.beamList, enemigoBoss, activarTrigger, null, scene);


}

function generateTentacles(parent){
  tentaculos = tentacleList.create(parent.x,parent.y, 'tentacle').setOrigin(0.5);
  tentaculos.angle = Math.atan2(glish.glish.y - tentaculos.y , 	glish.glish.x - tentaculos.x)* 180/Math.PI;
}

function activarTrigger(){
  enemigoBoss.trigger.activado = true;
  //crear un muro que evite poder salir de la pelea y genera los tentaculos;
}


export function updateBoss(){

  Phaser.Actions.Call(tentacleList.getChildren(), function(go){
    if (enemigoBoss.trigger.activado){
      if(enemigoBoss.tiempo > 0){
        enemigoBoss.tiempo--;
      }else{
        generateTentacles(enemigoBoss);
        enemigoBoss.tiempo = 30;
      }



    }

  });

  if(enemigoBoss.vida <= 0){
      enemigoBoss.muerto = true;
  }
}