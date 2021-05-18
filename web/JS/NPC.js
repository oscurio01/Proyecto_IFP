import * as utilidades from './utilidades.js';
import * as glish from './glish.js';
var npc1;
var scene;
var interacturar;
export function preload() {
  this.load.spritesheet('npc1', 'assets/images/Glish.png', { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('buttonSpace', 'assets/images/buttonE.png', { frameWidth: 22, frameHeight: 21 });
  scene = this;
}

export function create(obj) {
  npc1 = scene.physics.add.sprite(obj.x, obj.y, 'npc1');
  interacturar = scene.physics.add.sprite(obj.x, obj.y-32, 'buttonSpace').setDepth(-1);
  npc1.trigger = scene.add.rectangle(npc1.x,npc1.y, 200, 150);
  scene.physics.add.existing(npc1.trigger, false);
  npc1.trigger.activado = false;
  scene.physics.add.overlap(glish.glish, npc1.trigger, activarTrigger, null, scene);
}

function activarTrigger(player, npc){
  interacturar.setPosition(player.x, player.y - 32);
  interacturar.setDepth(1);
}

export function update(){
  if(scene.physics.add.overlap(glish.glish, npc1.trigger)){

  }else{
    interacturar.setAlpha(0);
  }
}