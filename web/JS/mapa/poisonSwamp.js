import * as glish from '../glish.js';
import * as ranas from '../ranas.js';
import * as mosquitos from '../mosquitos.js';
import * as utilidades from '../utilidades.js';
import * as enemigos from '../enemigos.js';
import * as portal from '../portal.js';
import * as npc from '../NPC.js';
import * as swampBoss from '../SwampBoss.js'
console.clear();
var config = {
    type: Phaser.AUTO,
    width: 400,
    height: 300,
    pixelArt:true,
	fps: {
		target: 60,
		forceSetTimeOut: true
	},
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 0 },
        }
    },
    scene: {
    	preload: preload,
    	create: create,
        update:update
    },
    scale:{
		//mode: Phaser.Scale.FIT,
		parent: 'game',
		mode: Phaser.Scale.ENVELOPE,
        //autoCenter: Phaser.Scale.CENTER_BOTH,
		//zoom: 2,
	},
    
};

var game=new Phaser.Game(config);

var scene;
var camera;
var gameOver;
var fondoAguaBuena;
var fondo;
var tileSpawner;
export var enemyList;

var fpsText;
var suelo;
var poisonTiles;
var poisonAspectTiles;
var poisonTilesId;
var cutTiles;
var cutTilesId;
var cutTiles2;
var cutTilesId2;

var pausado = false;

function preload(){

    this.load.image('tiles', 'assets/mapa/terrain.png');
    this.load.image('tiles2', 'assets/mapa/terrain2.png');
    this.load.image('tiles3', 'assets/mapa/terrain3.png');
    this.load.tilemapTiledJSON('pantano', 'JS/PantanoVenenosoVerdadero.json');
    glish.preload.call(this);
    ranas.preload.call(this);
    mosquitos.preload.call(this);
	  portal.preload.call(this);
    npc.preload.call(this);
    swampBoss.preload.call(this);
}
/*
  =======    =========    ========    =======    ===============    ========
  =          =       =    =           =     =           =           =
  =          =       =    =           =     =           =           =
  =          ========     =======     =======           =           =======
  =          =     =      =           =     =           =           =
  =          =      =     =           =     =           =           =
  =======    =       =    ========    =     =           =           ========
*/
function create(){

    scene = this;
    document.body.style.cursor = "none";
    camera = this.cameras.main;
    gameOver = 0;
    


    const map = this.make.tilemap({key:"pantano"});

    const tileset = map.addTilesetImage("terreno", "tiles");
    const tileset2 = map.addTilesetImage("terreno2", "tiles2");
    const tileset3 = map.addTilesetImage("terreno3", "tiles3");

    suelo = map.createLayer('ground', tileset2).setDepth(-3);
    fondoAguaBuena = map.createLayer('ground2', tileset2).setDepth(-1);
    fondo = map.createLayer('AguaMala', tileset2).setDepth(-1);
    scene.obstaculos = map.createLayer('Obstaculos', tileset);
    scene.obstaculos2 = map.createLayer('obstaculo2', tileset).setDepth(-1);
    scene.obstaculos3 = map.createLayer('obstaculo3', tileset).setDepth(-1);
    scene.copaDeArbol = map.createLayer('copaDelArbol', tileset).setDepth(3);
    scene.casa2 = map.createLayer('casa2', tileset3);
    scene.casa1 = map.createLayer('casa1', tileset3);
    tileSpawner = map.createFromObjects('RespawnEnemigos');

    //fondo.setCollisionByExclusion(-1, true);
    scene.obstaculos.setCollisionByProperty({collides:true});

    scene.obstaculos2.setCollisionByProperty({collides:true});
    scene.obstaculos2.setCollisionByProperty({cut_attack:true});

    scene.casa1.setCollisionByProperty({collides:true});
    scene.casa2.setCollisionByProperty({collides:true});

    scene.obstaculos3.setCollisionByProperty({collides:true});
    scene.obstaculos3.setCollisionByProperty({cut_attack:true});
    //Movimiento del veneno
    this.tweens.timeline({
        targets: fondo, duration: 1500,
        loop: -1,
        tweens: [{ alpha: 0.7, }, { alpha: 1, },],
    });
    /*const debubGraphics = this.add.graphics().setAlpha(0.55);
    scene.obstaculos.renderDebug(debubGraphics,{
        tileColor:null,
        collidingTileColor: new Phaser.Display.Color(243,134,48,255),
        faceColor: new Phaser.Display.Color(40,39,37,255)
    });*/

    
    //Grupos Creados


    enemyList = this.physics.add.group();
    enemyList.lengua = this.physics.add.group();

    glish.create();
    
    //Enseña los FPS que tiene el juego
    fpsText = this.add.text(16,16,'FPS: '+ game.loop.actualFps,{fontsize:'8px',fill:'#FFF'}).setScrollFactor(0).setDepth(10);

    tileSpawner.forEach(obj => {
        this.physics.world.enable(obj);
        obj.setAlpha(0);
        if(obj.name == 'rana'){
            ranas.createEnemyRana(obj, config, enemyList);
        }
        else if(obj.name == 'mosquito'){
            mosquitos.createEnemyMosquito(obj, config, enemyList);
        }else if(obj.name == 'conseguir_glish'){
            npc.create(obj);        
        }else if(obj.name == 'BossCalamar'){
             swampBoss.createBoss(obj, config);
        }

    })

	portal.createAnims();
	portal.create(tileSpawner);


    //Overlap
    poisonTiles = fondo.filterTiles(tile => tile.properties.veneno).map(x => x.index);
    poisonAspectTiles = fondo.filterTiles(tile => tile.properties.aspectoVeneno).map(x => x.index);
    poisonTilesId = [...(new Set(poisonTiles))];
    fondo.setTileIndexCallback(poisonTilesId, glish.poisonPlayer, this.physics.add.overlap(glish.glish, fondo));
    fondo.setTileIndexCallback(poisonTilesId, glish.poisonPlayer, this.physics.add.overlap(glish.ondaList, fondo));
    fondo.setTileIndexCallback(poisonAspectTiles, glish.poisonPlayer, this.physics.add.overlap(glish.ondaList, fondo));

    cutTiles = scene.obstaculos2.filterTiles(tile => tile.properties.cut_attack).map(x => x.index);
    cutTilesId = [...(new Set(cutTiles))];

    cutTiles2 = scene.obstaculos3.filterTiles(tile => tile.properties.cut_attack).map(x => x.index);
    cutTilesId2 = [...(new Set(cutTiles2))];

    scene.obstaculos2.setTileIndexCallback(cutTilesId, glish.climbing_plant, this.physics.add.overlap(glish.beamList, scene.obstaculos2));

    scene.obstaculos3.setTileIndexCallback(cutTilesId2, glish.climbing_plant, this.physics.add.overlap(glish.beamList, scene.obstaculos3));

    this.physics.add.overlap(enemyList, glish.beamList,enemigos.recibirDanyo);
    this.physics.add.overlap(glish.glish,enemyList, glish.recibirDanyo);




    //Colisiones

    this.physics.add.collider(enemyList, enemyList);

    this.physics.add.collider(glish.glish, scene.obstaculos);
    this.physics.add.collider(glish.glish, scene.obstaculos2);
    this.physics.add.collider(glish.glish, scene.obstaculos3);
    this.physics.add.collider(glish.glish, scene.casa1);
    this.physics.add.collider(glish.glish, scene.casa2);
    this.physics.add.collider(glish.beamList, scene.obstaculos);
    this.physics.add.collider(glish.beamList, scene.casa1);
    this.physics.add.collider(glish.beamList, scene.casa2);
    this.physics.add.collider(glish.beamList, scene.obstaculos3);

	portal.collisionPortal(glish.glish)

}
/*
 =        =   ==========     ========     =======    =============    ========
 =        =    =        =    =       =    =     =          =          =
 =        =    =        =    =        =   =     =          =          =
 =        =    =========     =        =   =======          =          ======
 =        =    =             =        =   =     =          =          =
 =        =    =             =       =    =     =          =          =
  ========     =             ========     =     =          =          ========
*/
function update(time, delta){
  if(gameOver == 0){    

    glish.update(config);

    fpsText.text = "FPS: "+Math.floor(game.loop.actualFps) + " UpRate: " + Math.floor(delta) + "ms";

    if (glish.keyP.isDown && pausado == false){
      this.physics.pause();
      setTimeout(() => {
        pausado = true;
      }, 1000);
    }
    if(glish.keyP.isDown && pausado == true){
      this.physics.resume();
      setTimeout(() => {
        pausado = false;
      }, 1000);
    }
    enemigos.updateEnemySwamp(scene, enemyList);

	portal.update();

  npc.update();

  }

}

/*
    ===============   =            =     ==         =   ============  ==============     ============       ==         =
    =                 =            =     = =        =   =                    =          =            =      = =        =
    =                 =            =     =  =       =   =                    =         =              =     =  =       =
    ===============   =            =     =    =     =   =                    =        =                =    =    =     =
    =                 =            =     =     =    =   =                    =         =              =     =     =    =
    =                 =            =     =      =   =   =                    =          =            =      =      =   =
    =                  ============      =        ===   ============  ==============     ============       =        ===

*/

