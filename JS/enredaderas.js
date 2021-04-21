var scene;
var config;

export function preload(){
    this.load.image('missile1', 'assets/image/missile1.png');
    scene = this;
}

export function create_veins(obj){

    obj.setTexture('missile1').setDepth(10).setOrigin(0.5);


}