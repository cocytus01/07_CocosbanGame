var size;

var playerPosition; //マップ内のプレイやの位置(ｘ、ｙ)を保持する
var playerSprite; //プレイヤーのスプライト
var cratesArray = []; //配置した木箱のスプライトを配列に保持する

var stageSelect = 1;

var startTouch;
var endTouch;
var swipeTolerance = 10;//スワイプかを判断する閾値

var flg = 0;
var audioEngine;

var gameScene = cc.Scene.extend({
  onEnter: function() {
    this._super();
    audioEngine = cc.audioEngine;

    if (!audioEngine.isMusicPlaying()) {
      audioEngine.playMusic(res.bgm , true);
    }

    if(stageSelect==1){
       level = [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 1, 0, 0, 0, 2, 1],
        [1, 1, 3, 3, 2, 0, 1],
        [1, 0, 0, 4, 0, 0, 1],
        [1, 0, 3, 1, 0, 2, 1],
        [1, 0, 0, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ];
    }else
    if(stageSelect == 2) {
       level = [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 2, 1, 0, 0, 0, 1],
        [1, 0, 3, 0, 1, 0, 1],
        [1, 2, 3, 4, 3, 0, 1],
        [1, 3, 2, 0, 1, 2, 1],
        [1, 0, 0, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ];
    }else
    if(stageSelect == 3) {
       level = [
        [1, 1, 1, 1, 1, 1, 1],
        [1, 2, 0, 3, 0, 2, 1],
        [1, 3, 0, 3, 0, 1, 1],
        [1, 2, 0, 4, 3, 2, 1],
        [1, 1, 3, 1, 0, 0, 1],
        [1, 2, 0, 0, 0, 1, 1],
        [1, 1, 1, 1, 1, 1, 1]
      ];
    }

    var layer0 = new gameLayer();
    layer0.init();
    this.addChild(layer0);

    LevelText = cc.LabelTTF.create("LEVEL"+stageSelect,"PixelMplus10","20",cc.TEXT_ALIGNMENT_CENTER);
    this.addChild(LevelText);
    LevelText.setPosition(100,185);

    ResetText = cc.LabelTTF.create("キーボードでリセット！\nひとつ前には\n戻れないヨ！","PixelMplus10","10",cc.TEXT_ALIGNMENT_CENTER);
    this.addChild(ResetText);
    ResetText.setPosition(100,150);

    ExplanText = cc.LabelTTF.create("　　　　注意！　　　\n木箱は一度穴に落とすと\n動かせなくなるヨ！","PixelMplus10","10",cc.TEXT_ALIGNMENT_CENTER);
    this.addChild(ExplanText);
    ExplanText.setPosition(100,105);

  }
});

var gameLayer = cc.Layer.extend({
  init: function() {
    this._super();
    console.log(stageSelect);

    //スプライトフレームのデータを読み込む
      //スプライトフレームのキャッシュオブジェクトを作成する
      cache = cc.spriteFrameCache;
      cache.addSpriteFrames(res.spritesheet_plist);

      var backgroundSprite = cc.Sprite.create(cache.getSpriteFrame("background.png"));
      //アンチエイリアス処理を止める
      backgroundSprite.getTexture().setAliasTexParameters();

      backgroundSprite.setPosition(240, 160);
      //スプライトがとても小さいので拡大する
      backgroundSprite.setScale(5);
      this.addChild(backgroundSprite);

      var levelSprite = cc.Sprite.create(cache.getSpriteFrame("level"+stageSelect+".png"));
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
    cc.eventManager.addListener(Keylistener, this);

  },
});

var Keylistener = cc.EventListener.create( {
    event: cc.EventListener.KEYBOARD,
    onKeyPressed: function (keyCode, event) {
      if(keyCode == 82){
        cc.director.runScene(new GameOverScene());
      }
      else{
        restartGame();
      }
    }
} );

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
                move(1,0);
            }
            else{//左方向移動
                move(-1,0);
            }
        }
        else{
            if(distY>0){ //上方向移動
               console.log("上 move(0,-1) distY "+ distY );
              move(0,-1);

            }
            else{ //下方向移動
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
        audioEngine.playEffect(res.Pmove);
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
        audioEngine.playEffect(res.move);

        }
        break;
    }

    if(stageSelect == 1 && flg == 2 + stageSelect){
      //1秒待ってシーン遷移
      setTimeout(function(){
        cc.director.runScene(new GameOverScene());
      },500);
    }else
    if(stageSelect == 2 && flg == 2 + stageSelect){
      //1秒待ってシーン遷移
      setTimeout(function(){
        cc.director.runScene(new GameOverScene());
      },500);
    }
    if(stageSelect == 3 && flg == 2 + stageSelect){
      //1秒待ってシーン遷移
      setTimeout(function(){
        cc.director.runScene(new GameOverScene());
      },500);
    }
}
//宇宙船を元の位置に戻して、宇宙船の変数を初期化する
function restartGame() {
  flg = 0;
  console.log("戻れ"+stageSelect);
  cc.director.runScene(new gameScene());
  if(stageSelect==1){
    level = [
      [1, 1, 1, 1, 1, 1, 1],
      [1, 1, 0, 0, 0, 2, 1],
      [1, 1, 3, 3, 2, 0, 1],
      [1, 0, 0, 4, 0, 0, 1],
      [1, 0, 3, 1, 0, 2, 1],
      [1, 0, 0, 1, 1, 1, 1],
      [1, 1, 1, 1, 1, 1, 1]
    ];
  }else
  if(stageSelect==2){
    level = [
     [1, 1, 1, 1, 1, 1, 1],
     [1, 2, 1, 0, 0, 0, 1],
     [1, 0, 3, 0, 1, 0, 1],
     [1, 2, 3, 4, 3, 0, 1],
     [1, 3, 2, 0, 1, 2, 1],
     [1, 0, 0, 1, 1, 1, 1],
     [1, 1, 1, 1, 1, 1, 1]
   ];
  }
  if(stageSelect==3){
    level = [
     [1, 1, 1, 1, 1, 1, 1],
     [1, 2, 0, 3, 0, 2, 1],
     [1, 3, 0, 3, 0, 1, 1],
     [1, 2, 0, 4, 3, 2, 1],
     [1, 1, 3, 1, 0, 0, 1],
     [1, 2, 0, 0, 0, 1, 1],
     [1, 1, 1, 1, 1, 1, 1]
   ];
 }
}
