
var enemigoRana;
var lenguaRana;
var scene;
var config;
var tiempoRana = 30;
var ranas = new Array;


import * as glish from './glish.js';
import * as game from './game.js';

export function preload(){
	this.load.spritesheet('EnemigoRana','assets/image/enemigo.png', {frameWidth:32, frameHeight:32});
  this.load.image('punta_Lengua', 'assets/image/punta_Lengua.png');
  this.load.image('fragmento_Lengua', 'assets/image/fragmento_lengua.png');
	scene = this;
}

export function createEnemyRana(obj, conf){
    config = conf;
    enemigoRana = game.enemyList.create(obj.x,obj.y, 'EnemigoRana').setOrigin(0.5); 
    enemigoRana.name = 'rana';
    enemigoRana.vida = 7;
    enemigoRana.ataque = 1;
    enemigoRana.inmune = -1;
    enemigoRana.status = "none";
    enemigoRana.tiempoMoverse = 100;
    enemigoRana.trigger = scene.add.rectangle(enemigoRana.x,enemigoRana.y, config.width/1.5, config.height/1.5);
    scene.physics.add.existing(enemigoRana.trigger, false);
    enemigoRana.trigger.activado = false;
    enemigoRana.triggerAtaque = scene.add.rectangle(enemigoRana.x,enemigoRana.y, config.width/2, config.height/2);
    scene.physics.add.existing(enemigoRana.triggerAtaque, false);
    enemigoRana.triggerAtaque.activado = false;

    //console.log(glish.glish);
    scene.physics.add.overlap(glish.glish, enemigoRana.trigger, game.activarTrigger, null, scene);
    scene.physics.add.overlap(glish.glish, enemigoRana.triggerAtaque, updateLenguaRana, null, scene);
    scene.physics.add.overlap(glish.beamList, enemigoRana, game.activarTrigger, null, scene);

	ranas.push(enemigoRana)

	createLenguaRana(enemigoRana)
}

function esRana(enemy)
{
	if(enemy.name == "rana")
	{return true}
	else{return false}
}

function sacaLengua(atributo){

	for(var i = 0; i < ranas.length; i++)
	{
		if(ranas[i].triggerAtaque == atributo)
		{
			return ranas[i];
		}
	}
	return null;
}

function createLenguaRana(parent){

	//console.log(parent.name);
	parent.lengua=new Object;
	var l = parent.lengua;
	l.segmentos=new Array;
	l.maxLong = 15;
	l.cooldown = 60;
	l.time = 0;
}
function updateLenguaRana(o, atributo){
	var parent = sacaLengua(atributo)
	var l = parent.lengua;
 
	

	if(l.time <= 0)
	{
		l.time = l.cooldown;

		createLenguaSegments(l, parent)

		/*this.tweens.addCounter({
			from: 0,
			to: 3,
			duration: 500,
			onUpdate: function (tween)
			{
			}
		});*/
	}

	/*for(let i = 0; i < l.lenght, i++){
		l.setVelocityX(50*l.dir.x);
			l.setVelocityY(50*l.dir.y);
	}*/
	l.time--;
}// Lengua es una struct,contiene .segmentos, una array que contiene varias sprites en la que la 0 es la punta, .maxLong que contiene el numero de segmentos maximos, el tiempo para ser lanzada

function createLenguaSegments(l, parent)
{
	console.log(l.maxLong)
	l.segmentos.unshift(scene.physics.add.sprite(parent.x,parent.y, 'punta_Lengua'));
	for(var i = 1; i < l.maxLong; i++)
	{
		l.segmentos.push(scene.physics.add.sprite(parent.x,parent.y, 'fragmento_Lengua'));
		
	}
}