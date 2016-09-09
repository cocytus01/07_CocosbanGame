//thirdScene.js
var ThirdLayer = cc.Layer.extend({
    ctor: function() {
        this._super();
        var size = cc.director.getWinSize();

        if(stageSelect != 3){
          var label = cc.LabelTTF.create("STAGE　CLEAR！", "PixelMplus10", 40);
          label.setPosition(size.width / 2, size.height * 4 / 5);
          this.addChild(label, 1);

          var label2 = cc.LabelTTF.create("Next Stage→", "PixelMplus10", 30);
          label2.setPosition(size.width / 2, size.height / 5);
          this.addChild(label2, 1);
        }
        else
        {
          var label = cc.LabelTTF.create("STAGE　ALL　CLEAR！\n\n  Congratulations!", "PixelMplus10", 40);
          label.setPosition(size.width / 2, size.height * 4 / 5);
          this.addChild(label, 1);

          var label2 = cc.LabelTTF.create("Touch to Restart!", "PixelMplus10", 30);
          label2.setPosition(size.width / 2, size.height / 5);
          this.addChild(label2, 1);

        }
        audioEngine.stopMusic();
        audioEngine.playEffect(res.clear);
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            swallowTouches: true,
            onTouchBegan: this.onTouchBegan,
            onTouchMoved: this.onTouchMoved,
            onTouchEnded: this.onTouchEnded
          }, this);
          return true;
        },
    onTouchBegan: function(touch, event) {
        return true;
    },
    onTouchMoved: function(touch, event) {},
    onTouchEnded: function(touch, event) {
      //restartGame();
      if(stageSelect != 3){
        flg=0;
        stageSelect +=1;
      }else{
        stageSelect = 1;
      }
      cc.director.runScene(new gameScene());
    },
});


var GameOverScene = cc.Scene.extend({
    onEnter: function() {
        this._super();
        // 背景レイヤーをその場で作る
        var backgroundLayer = new cc.LayerColor(new cc.Color(0, 0, 0, 200));
        this.addChild(backgroundLayer);

        var layer3 = new ThirdLayer();
        this.addChild(layer3);
    }
});
