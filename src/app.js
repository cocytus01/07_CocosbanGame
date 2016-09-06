var size;
var level = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 1, 0, 0, 0, 0, 1],
  [1, 1, 3, 3, 2, 0, 1],
  [1, 0, 0, 4, 0, 0, 1],
  [1, 0, 0, 1, 0, 2, 1],
  [1, 0, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1]
];
var playerPosition; //マップ内のプレイやの位置(ｘ、ｙ)を保持する
var playerSprite; //プレイヤーのスプライト
var cratesArray = []; //配置した木箱のスプライトを配列に保持する

var startTouch;
var endTouch;
var swipeTolerance = 10;//スワイプかを判断する閾値

var flg =0;
var audioEngine;


var gameScene = cc.Scene.extend({
  onEnter: function() {
    this._super();
    audioEngine = cc.audioEngine;

    audioEngine.playMusic(res.bgm, true);
    var layer0 = new gameLayer();
    layer0.init();
    this.addChild(layer0);
  }
});

var gameLayer = cc.Layer.extend({
  init: function() {
    this._super();
    //スプライトフレームのキャッシュオブジェクトを作成する
    cache = cc.spriteFrameCache;
    //スプライトフレームのデータを読み込む
    cache.addSpriteFrames(res.spritesheet_plist);
    var backgroundSprite = cc.Sprite.create(cache.getSpriteFrame("background.png"));
    //アンチエイリアス処理を止める
    backgroundSprite.getTexture().setAliasTexParameters();

    backgroundSprite.setPosition(240, 160);
    //スプライトがとても小さいので拡大する
    backgroundSprite.setScale(5);
    this.addChild(backgroundSprite);

    var levelSprite = cc.Sprite.create(cache.getSpriteFrame("level.png"));
    levelSprite.setPosition(240, 110);
    levelSprite.setScale(5);
    this.addChild(levelSprite);

    for (i = 0; i < 7; i++) {　　　　　　
      cratesArray[i] = [];　 //配列オブジェクトの生成
      for (j = 0; j < 7; j++) {
        switch (level[i][j]) {
          case 4:
          case 6:
            playerSprite = cc.Sprite.create(cache.getSpriteFrame("player.png"));
            playerSprite.setPosition(165 + 25 * j, 185 - 25 * i);
            playerSprite.setScale(5);
            this.addChild(playerSprite);
            playerPosition = {
              x: j,
              y: i
            };　　　　　　　　　　　　
            cratesArray[i][j] = null;　 //playerがいるので、その場所には木箱はないのでnullを代入する
            break;
          case 3:
          case 5:
            var crateSprite = cc.Sprite.create(cache.getSpriteFrame("crate.png"));
            crateSprite.setPosition(165 + 25 * j, 185 - 25 * i);
            crateSprite.setScale(5);
            this.addChild(crateSprite);
            cratesArray[i][j] = crateSprite;//(i,j)の位置にcrateSpriteを入れる
            break;
          default:
            cratesArray[i][j] = null;//木箱のコード以外の場合は、その場所に木箱がない値としてnullを代入する
            break;
        }
      }
    }
    //return true;
    cc.eventManager.addListener(listener, this);
  },
});

var listener = cc.EventListener.create({
event: cc.EventListener.TOUCH_ONE_BY_ONE,
swallowTouches: true,
onTouchBegan:function (touch,event) {
startTouch = touch.getLocation();
return true;
},
onTouchEnded:function(touch, event){
endTouch = touch.getLocation();
swipeDirection();
}
});
//スワイプ方向を検出する処理
function swipeDirection(){


    var distX = endTouch.x - startTouch.x ;
    var distY = endTouch.y - startTouch.y ;
    if(Math.abs(distX)+Math.abs(distY)>swipeTolerance){
        if(Math.abs(distX)>Math.abs(distY)){
            if(distX>0){//右方向移動
              //playerSprite.setPosition(playerSprite.getPosition().x+25,playerSprite.getPosition().y);
                move(1,0);
            }
            else{//左方向移動
              //playerSprite.setPosition(playerSprite.getPosition().x-25,playerSprite.getPosition().y);
                move(-1,0);
            }
        }
        else{
        //  console.log("endTouch.y "+endTouch.y );
        //  console.log("startTouch.y "+startTouch.y );
        //  console.log("distY "+ distY );
            if(distY>0){ //上方向移動
            //  playerSprite.setPosition(playerSprite.getPosition().x,playerSprite.getPosition().y+25);
               console.log("上 move(0,-1) distY "+ distY );
              move(0,-1);

            }
            else{ //下方向移動
              //playerSprite.setPosition(playerSprite.getPosition().x,playerSprite.getPosition().y-25);
              console.log("下 move(0,1) distY "+ distY );
              move(0,1);
            }
        }
    }
}


function move(deltaX,deltaY){
switch(level[playerPosition.y+deltaY][playerPosition.x+deltaX]){

    case 0:
    case 2:
        //プレイヤーの移動
        level[playerPosition.y][playerPosition.x]-=4;
        playerPosition.x+=deltaX;
        playerPosition.y+=deltaY;
        level[playerPosition.y][playerPosition.x]+=4;
        playerSprite.setPosition(165+25*playerPosition.x,185-25*playerPosition.y);
    break;
    case 3:
    //プレイやーと木箱の先に何もない(0)、或いは穴(2)ならば移動させる
    if(level[playerPosition.y+deltaY*2][playerPosition.x+deltaX*2]==0 ||
       level[playerPosition.y+deltaY*2][playerPosition.x+deltaX*2]==2){
        //4(プレイヤー)のいた場所がなにも無くなる(0)ため、-4
        level[playerPosition.y][playerPosition.x]-=4;
        playerPosition.x+=deltaX;
        playerPosition.y+=deltaY;
        //3(木箱)の場所が4(プレイヤー)になるため、+1
        level[playerPosition.y][playerPosition.x]+=1;
        playerSprite.setPosition(165+25*playerPosition.x,185-25*playerPosition.y);
        //0(なし)の場所に3(木箱)が来るため、+3
        level[playerPosition.y+deltaY][playerPosition.x+deltaX]+=3;

        if(level[playerPosition.y+deltaY][playerPosition.x+deltaX]==5){
          flg++;
          audioEngine.playEffect(res.se_down);
        }
        var movingCrate = cratesArray[playerPosition.y][playerPosition.x];
        movingCrate.setPosition(movingCrate.getPosition().x+25*deltaX,movingCrate.
        getPosition().y-25*deltaY);
        cratesArray[playerPosition.y+deltaY][playerPosition.x+deltaX]=movingCrate;
        cratesArray[playerPosition.y][playerPosition.x]=null;


        }
        break;
    }
    if(flg == 2){
      restartGame();
      //1秒待ってシーン遷移
      setTimeout(function(){
      cc.director.runScene(new GameOverScene());
    },1000);
        //this.addChild(label, 1);
      //console.log(level[playerPosition.y+deltaY][playerPosition.x+deltaX]+"flg"+flg);
    }
}
//宇宙船を元の位置に戻して、宇宙船の変数を初期化する
function restartGame() {
  //audioEngine.playEffect(res.se_miss);
  console.log("戻れ");
  /*cratesArray[playerPosition.y][playerPosition.x]=null;
  playerSprite.setPosition(240, 115);*/
  cc.director.runScene(new gameScene());
  level = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0, 0, 1],
    [1, 1, 3, 3, 2, 0, 1],
    [1, 0, 0, 4, 0, 0, 1],
    [1, 0, 0, 1, 0, 2, 1],
    [1, 0, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1]
  ];

}
