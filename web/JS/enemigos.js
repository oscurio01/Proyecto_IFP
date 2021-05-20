import * as glish from './glish.js';
var go;
var scene;

export function updateEnemySwamp(s, enemyList){
    Phaser.Actions.Call(enemyList.getChildren(), function(go) {
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
                        go.tiempoMoverse = Phaser.Math.Between(50, 70);
                        if(go.body != undefined){
                            go.setVelocity(0);
                        }
                    },300);
                }
            }else if(go.name == 'mosquito' && go.status != "paralizado"){
                scene.physics.moveTo(go, glish.glish.x, glish.glish.y, Phaser.Math.Between(180, 210));
                go.play('fly', true);  
                if(go.x < glish.glish.x){
                  go.flipX = true;
                }else{
                  go.flipX = false;
                }
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

export function activarTrigger(e, go){

    if(go.trigger != undefined){
    	go.trigger.activado = true;

    }
	else if(e.trigger != undefined)
	{
		e.trigger.activado = true;
	}
	else{
    	go.activado = true;
    }

}

export function recibirDanyo(obj1, obj2){
    var aleatorio;
    console.log("Ataque "+obj2.ataque+" vida "+obj1.vida);
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
      aleatorio = Math.floor(Math.random() * (20-2+1)) + 2;
      if(obj1 !=glish.glish && aleatorio == 3){
          obj1.status = "paralizado";
          obj1.temporizador = 230;
          console.log("paralizado");
      }
      if(obj1.vida <= 0){
          obj1.destroy();
          if(obj1.trigger !=null){
              obj1.trigger.activado = false;
              obj1.trigger.destroy();
              if(obj1.triggerAtaque !=null){
                obj1.triggerAtaque.activado = false;
                obj1.triggerAtaque.destroy();
              }
          }
      }
      obj1.inmune = 130;
    }
}
