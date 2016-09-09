var size;

var level2 = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 2, 1, 0, 0, 0, 1],
  [1, 0, 3, 0, 1, 0, 1],
  [1, 2, 3, 4, 3, 0, 1],
  [1, 3, 2, 0, 1, 2, 1],
  [1, 0, 0, 1, 1, 1, 1],
  [1, 1, 1, 1, 1, 1, 1]
];
var playerPosition2; //マップ内のプレイやの位置(ｘ、ｙ)を保持する
var playerSprite2; //プレイヤーのスプライト
var cratesArray2 = []; //配置した木箱のスプライトを配列に保持する

var startTouch2;
var endTouch2;
var swipeTolerance2 = 10;//スワイプかを判断する閾

var flg2 =0;
var audioEngine;

var gameScene2 = cc.Scene.extend({
  onEnter: function() {
    this._super();
    audioEngine = cc.audioEngine;

    if (!audioEngine.isMusicPlaying()) {
      audioEngine.playMusic(res.bgm , true);
    }

    var layer0 = new gamelayer2();
    layer0.init();
    this.addChild(layer0);

    LevelText = cc.LabelTTF.create("LEVEL2","PixelMplus10","20",cc.TEXT_ALIGNMENT_CENTER);
    this.addChild(LevelText);
    LevelText.setPosition(100,185);

    ResetText = cc.LabelTTF.create("キーボードでリセット！","PixelMplus10","10",cc.TEXT_ALIGNMENT_CENTER);
    this.addChild(ResetText);
    ResetText.setPosition(100,165);

    ExplanText = cc.LabelTTF.create("注意！\n木箱は一度穴に落とすと\n動かせなくなるヨ！","PixelMplus10","10",cc.TEXT_ALIGNMENT_CENTER);
    this.addChild(ExplanText);
    ExplanText.setPosition(100,105);

  }
});

var gamelayer2 = cc.Layer.extend({
  init: function() {
    this._super();
    //スプライトフレームのキャッシュオブジェクトを作成する
    cache2 = cc.spriteFramecache2;
    //スプライトフレームのデータを読み込む
    cache2.addSpriteFrames(res.spritesheet2_plist);
    var backgroundSprite2 = cc.Sprite.create(cache2.getSpriteFrame("background.png"));
    //アンチエイリアス処理を止める
    backgroundSprite2.getTexture().setAliasTexParameters();

    backgroundSprite2.setPosition(240, 160);
    //スプライトがとても小さいので拡大する
    backgroundSprite2.setScale(5);
    this.addChild(backgroundSprite2);

    var levelSprite2 = cc.Sprite.create(cache2.getSpriteFrame("level.png"));
    levelSprite2.setPosition(240, 110);
    levelSprite2.setScale(5);
    this.addChild(levelSprite2);

    for (i = 0; i < 7; i++) {　　　　　　
      cratesArray2[i] = [];　 //配列オブジェクトの生成
      for (j = 0; j < 7; j++) {
        switch (level[i][j]) {
          case 4:
          case 6:
            playerSprite2 = cc.Sprite.create(cache2.getSpriteFrame("player.png"));
            playerSprite2.setPosition(165 + 25 * j, 185 - 25 * i);
            playerSprite2.setScale(5);
            this.addChild(playerSprite2);
            playerPosition2 = {
              x: j,
              y: i
            };　　　　　　　　　　　　
            cratesArray2[i][j] = null;　 //playerがいるので、その場所には木箱はないのでnullを代入する
            break;
          case 3:
          case 5:
            var crateSprite2 = cc.Sprite.create(cache2.getSpriteFrame("crate.png"));
            crateSprite2.setPosition(165 + 25 * j, 185 - 25 * i);
            crateSprite2.setScale(5);
            this.addChild(crateSprite2);
            cratesArray2[i][j] = crateSprite2;//(i,j)の位置にcrateSprite2を入れる
            break;
          default:
            cratesArray2[i][j] = null;//木箱のコード以外の場合は、その場所に木箱がない値としてnullを代入する
            break;
        }
      }
    }
    //return true;
    cc.eventManager.addListener(listener, this);
    cc.eventManager.addListener(Keylistener, this);

  },
});

var Keylistener = cc.EventListener.create( {
    event: cc.EventListener.KEYBOARD,
    onKeyPressed: function (keyCode, event) {
      restartGame2();
    },
    onKeyReleased: function (keyCode, event) {

        cc.log( keyCode, " is released");
    }
} );

var listener = cc.EventListener.create({
event: cc.EventListener.TOUCH_ONE_BY_ONE,
swallowTouches: true,
onTouchBegan:function (touch,event) {
startTouch2 = touch.getLocation();
return true;
},
onTouchEnded:function(touch, event){
endTouch2 = touch.getLocation();
swipeDirection();
}
});
//スワイプ方向を検出する処理
function swipeDirection(){


    var distX2 = endTouch2.x - startTouch2.x ;
    var distY2 = endTouch2.y - startTouch2.y ;
    if(Math.abs(distX2)+Math.abs(distY2)>swipeTolerance2){
        if(Math.abs(distX2)>Math.abs(distY2)){
            if(distX2>0){//右方向移動
              //playerSprite2.setPosition(playerSprite2.getPosition().x+25,playerSprite2.getPosition().y);
                move2(1,0);
            }
            else{//左方向移動
              //playerSprite2.setPosition(playerSprite2.getPosition().x-25,playerSprite2.getPosition().y);
                move2(-1,0);
            }
        }
        else{
        //  console.log("endTouch2.y "+endTouch2.y );
        //  console.log("startTouch2.y "+startTouch2.y );
        //  console.log("distY2 "+ distY2 );
            if(distY2>0){ //上方向移動
            //  playerSprite2.setPosition(playerSprite2.getPosition().x,playerSprite2.getPosition().y+25);
               console.log("上 move22(0,-1) distY2 "+ distY2 );
              move2(0,-1);

            }
            else{ //下方向移動
              //playerSprite2.setPosition(playerSprite2.getPosition().x,playerSprite2.getPosition().y-25);
              console.log("下 move2(0,1) distY2 "+ distY2 );
              move2(0,1);
            }
        }
    }
}


function move2(deltaX2,deltaY2){
switch(level2[playerPosition2.y+deltaY2][playerPosition2.x+deltaX2]){
    case 0:
    case 2:
        //プレイヤーの移動
        level2[playerPosition2.y][playerPosition2.x]-=4;
        playerPosition2.x+=deltaX2;
        playerPosition2.y+=deltaY2;
        level2[playerPosition2.y][playerPosition2.x]+=4;
        playerSprite2.setPosition(165+25*playerPosition2.x,185-25*playerPosition2.y);
        audioEngine.playEffect(res.Pmove);
    break;
    case 3:
    //プレイやーと木箱の先に何もない(0)、或いは穴(2)ならば移動させる
    if(level2[playerPosition2.y+deltaY2*2][playerPosition2.x+deltaX2*2]==0 ||
       level2[playerPosition2.y+deltaY2*2][playerPosition2.x+deltaX2*2]==2){
        //4(プレイヤー)のいた場所がなにも無くなる(0)ため、-4
        level2[playerPosition2.y][playerPosition2.x]-=4;
        playerPosition2.x+=deltaX2;
        playerPosition2.y+=deltaY2;
        //3(木箱)の場所が4(プレイヤー)になるため、+1
        level2[playerPosition2.y][playerPosition2.x]+=1;
        playerSprite2.setPosition(165+25*playerPosition2.x,185-25*playerPosition2.y);
        //0(なし)の場所に3(木箱)が来るため、+3
        level2[playerPosition2.y+deltaY2][playerPosition2.x+deltaX2]+=3;

        if(level2[playerPosition2.y+deltaY2][playerPosition2.x+deltaX2]==5){
          flg2++;
          audioEngine.playEffect(res.se_down);
        }
        var movingCrate = cratesArray2[playerPosition2.y][playerPosition2.x];
        movingCrate.setPosition(movingCrate.getPosition().x+25*deltaX2,movingCrate.
        getPosition().y-25*deltaY2);
        cratesArray2[playerPosition2.y+deltaY2][playerPosition2.x+deltaX2]=movingCrate;
        cratesArray2[playerPosition2.y][playerPosition2.x]=null;
        audioEngine.playEffect(res.move);

        }
        break;
    }

    if(flg2 == 4){
      //restartGame();
      //1秒待ってシーン遷移
      setTimeout(function(){
      cc.director.runScene(new GameOverScene());
    },500);
        //this.addChild(label, 1);
      //console.log(level[playerPosition2.y+deltaY2][playerPosition2.x+deltaX2]+"flg2"+flg2);
    }

}
//宇宙船を元の位置に戻して、宇宙船の変数を初期化する
function restartGame2() {
  flg2 = 0;
  console.log("戻れ2");
  cc.director.runScene(new gameScene2());
  level2 = [
    [1, 1, 1, 1, 1, 1, 1],
    [1, 2, 1, 0, 0, 0, 1],
    [1, 0, 3, 0, 1, 0, 1],
    [1, 2, 3, 4, 3, 0, 1],
    [1, 3, 2, 0, 1, 2, 1],
    [1, 0, 0, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1]
  ];

}
