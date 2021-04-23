import * as game from './game.js';
import * as glish from './glish.js';
var enemyList;
var go;
var scene;

export function updateEnemySwamp(s){
    Phaser.Actions.Call(game.enemyList.getChildren(), function(go) {
      scene = s;

        if (go.trigger.activado){
            //console.log();
            go.trigger.x = go.x;
            go.trigger.y = go.y;
            if(go.name == 'rana'){
                
                go.triggerAtaque.x = go.x;
                go.triggerAtaque.y = go.y;

                if(go.tiempoMoverse == 0 && go.status != "paralizado"){
                    scene.physics.moveTo(go, glish.glish.x, glish.glish.y, 500);
                    go.tiempoMoverse = -1;
                    setTimeout(()=>{
                        go.tiempoMoverse = Phaser.Math.Between(170, 200);
                        if(go.body != undefined){
                            go.setVelocity(0);
                        }
                    },300);
                }
            }else if(go.name == 'mosquito' && go.status != "paralizado"){
                scene.physics.moveTo(go, glish.glish.x, glish.glish.y, 180);
                
                go.play('fly', true);                
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
        //go.trigger.activado = false
        if(go.inmune >= 0){
            go.inmune--;
        }
    }); 
}