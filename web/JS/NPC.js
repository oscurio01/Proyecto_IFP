import * as utilidades from './utilidades.js';
import * as glish from './glish.js';
var npc1, scene, interacturar, keyE;

export function preload() {
  this.load.spritesheet('npc1', 'assets/images/Glish.png', { frameWidth: 32, frameHeight: 32 });
  this.load.spritesheet('buttonE', 'assets/images/buttonE.png', { frameWidth: 22, frameHeight: 44 });
  scene = this;
}

export function create(obj) {
  npc1 = scene.physics.add.sprite(obj.x, obj.y, 'npc1');
  interacturar = scene.physics.add.sprite(obj.x, obj.y-32, 'buttonE').setDepth(-1);
  npc1.trigger = scene.add.rectangle(npc1.x,npc1.y, 90, 90);
  scene.physics.add.existing(npc1.trigger, false);
  npc1.trigger.activado = false;
  keyE = scene.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E);
	scene.anims.create({
		key: 'inter',
		frames: scene.anims.generateFrameNumbers('buttonE'),
		frameRate: 2,
		repeat: -1
	});

  scene.label = scene.add.text(50,50, '').setDepth(1).setScrollFactor(0).setWordWrapWidth(200);
	  //typewriteTextWrapped('Hello, World!')
  scene.physics.add.overlap(glish.glish, npc1.trigger, activarTrigger, null, scene);

}

function activarTrigger(player, npc){
  
  interacturar.setPosition(player.x-64, player.y - 32);
  interacturar.setDepth(1);
  interacturar.anims.play('inter', true);
  typewriteText('Estamos '+glish.glish.vida+' tontos');


}

export function update(){

  if(Phaser.Geom.Intersects.RectangleToRectangle(glish.glish.getBounds(), npc1.trigger.getBounds())){
    interacturar.setAlpha(1);
  }else{
    interacturar.setAlpha(0);
  }

}

function typewriteText(text)
{
	const length = text.length
	let i = 0

	scene.time.addEvent({
		callback: () => {
			  scene.label.text += text[i];
			  ++i;
		},
		repeat: length - 1,
		delay: 200
	})
  
}