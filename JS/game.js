import * as glish from './glish.js';
import * as ranas from './ranas.js';
import * as mosquitos from './mosquitos.js';
import * as utilidades from './utilidades.js';


var config = {
    type: Phaser.AUTO,
    width: 400,
    height: 300,
    pixelArt:true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true,
            gravity: { y: 0 },
            fps:60
        }
    },
    scene: {
    	preload: preload,
    	create: create,
        update:update
    },
    scale:{
        zoom:2
    }
    
};

var game=new Phaser.Game(config);

var scene;
var camera;
var gameOver;

var fondoAguaBuena;
var puntos;
var puntosText;
var fondo;
var enemyTileSpawner;
var enemyList;

var fpsText;
var poisonTiles;
var poisonAspectTiles;
var poisonTilesId;
var cutTiles;
var cutTilesId;
var cutTiles2;
var cutTilesId2;

function preload(){
	//this.load.image('bg', 'assets/image/background.jpg');

    this.load.image('tiles', 'assets/atlas/terrain.png');
    this.load.image('tiles2', 'assets/atlas/terrain2.png');
    this.load.tilemapTiledJSON('pantano', 'JS/PantanoVenenoso.json');
    glish.preload.call(this);
    ranas.preload.call(this);
    mosquitos.preload.call(this);
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

    camera = this.cameras.main;
    gameOver = 0;

    const map = this.make.tilemap({key:"pantano"});

    const tileset = map.addTilesetImage("terreno", "tiles");
    const tileset2 = map.addTilesetImage("terreno2", "tiles2");

    const Suelo = map.createLayer('ground', tileset2,0,0).setDepth(-3);
    fondoAguaBuena = map.createLayer('ground2', tileset2).setDepth(-1);
    fondo = map.createLayer('AguaMala', tileset2).setDepth(-1);
    scene.obstaculos = map.createLayer('Obstaculos', tileset);
    scene.obstaculos2 = map.createLayer('obstaculo2', tileset);
    scene.obstaculos3 = map.createLayer('obstaculo3', tileset);
    enemyTileSpawner = map.createFromObjects('RespawnEnemigos');

    //fondo.setCollisionByExclusion(-1, true);
    scene.obstaculos.setCollisionByProperty({collides:true});

    scene.obstaculos2.setCollisionByProperty({collides:true});
    scene.obstaculos2.setCollisionByProperty({cut_attack:true});

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

    glish.create();

    //Marca los puntos obtenidos por derrotar enemigos
    puntos = 0;
    puntosText =this.add.text(16,-63,'Puntos: '+ puntos,{fontsize:'8px',fill:'#FFF'}).setScrollFactor(0);
    
    //Grupos Creados


    enemyList = this.physics.add.group();

    //Vida en texto


    //Enseña los FPS que tiene el juego
    fpsText = this.add.text(16,16,'FPS: '+ game.loop.actualFps,{fontsize:'8px',fill:'#FFF'}).setScrollFactor(0); 

    enemyTileSpawner.forEach(obj => {
        this.physics.world.enable(obj);
        obj.setAlpha(0);
        if(obj.name == 'rana'){
            ranas.createEnemyRana(obj, enemyList, config);
        }else if(obj.name == 'mosquito'){
            mosquitos.createEnemyMosquito(obj, enemyList, config);
        }
    })

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

    //this.physics.add.overlap(glish.beamList, scene.obstaculos, glish.destroyOnda);
    this.physics.add.overlap(enemyList, glish.beamList,hitSprites);
    this.physics.add.overlap(glish.glish,enemyList, hitSprites);


    //Tamaño de la camara total y seguimiento de la camara al personaje
    camera.setBounds(0, 0, map.widthInPixels, map.heightInPixels);


    //Colisiones

    this.physics.add.collider(enemyList, enemyList);

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
function update(){

    if(gameOver == 0){    

        glish.update(config);
        puntosText.text = "Puntos: " + puntos;

        fpsText.text = "FPS: "+game.loop.actualFps;
        updateEnemySwamp();

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


export function activarTrigger(e, go){
    go.active = true;
}

function updateEnemySwamp(){
    Phaser.Actions.Call(enemyList.getChildren(), function(go) {

        if (go.trigger.active){
            go.trigger.x = go.x;
            go.trigger.y = go.y;
            if(go.name == 'rana'){
                
                go.triggerAtaque.x = go.x;
                go.triggerAtaque.y = go.y;

                if(go.tiempoMoverse == 0 && go.status != "paralizado"){
                    scene.physics.moveTo(go, glish.glish.x, glish.glish.y, 500);
                    go.EnAire = true;
                    go.tiempoMoverse = -1;
                    setTimeout(()=>{
                        go.tiempoMoverse = Phaser.Math.Between(70, 100);
                        if(go.body != undefined){
                            go.setVelocity(0);
                        }
                        go.EnAire = false;
                    },300);
                }
            }else if(go.name == 'mosquito' && go.status != "paralizado"){
                scene.physics.moveTo(go, glish.glish.x, glish.glish.y, 200);
                
            }

            if(go.status == "paralizado" && go.temporizador !=0){
                go.temporizador--;
                go.setVelocity(0);
            }
            if(go.temporizador == 0){
                go.status = "none";
            }
            if(go.tiempoMoverse != 0){
                go.tiempoMoverse--;

            }
        }
        //go.trigger.active = false
        if(go.inmune >= 0){
            go.inmune--;
        }
    }); 
}

function hitSprites(obj1, obj2){
    var aleatorio;
    //console.log(obj2.ataque+" Y "+obj1.vida);
    if(obj1.inmune <= 0){

        obj1.setAlpha(0);
        scene.tweens.add({
            targets: obj1,
            alpha: 1,
            duration: 200,
            ease: 'Linear',
            repeat: 5,
        });
        obj1.vida -= obj2.ataque;
        aleatorio = 3;//Math.floor(Math.random() * (20-2+1)) + 2;
        if(obj1 !=glish.glish && aleatorio == 3){
            obj1.status = "paralizado";
            obj1.temporizador = 240;
            console.log("paralizado");
        }
        obj1.inmune = 200;
    }
    if(obj1.vida <= 0){
        obj1.destroy();
        if(obj1.trigger !=null){
            obj1.trigger.active = false;
            obj1.trigger.destroy();
        }
    }
}