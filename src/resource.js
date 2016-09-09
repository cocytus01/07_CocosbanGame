var res = {
    spritesheet_plist : "res/spritesheet.plist",
    spritesheet_png : "res/spritesheet.png",
    spritesheet2_plist : "res/spritesheet2.plist",
    spritesheet2_png : "res/spritesheet2.png",

    se_down: "res/sound/down.mp3",
    bgm:"res/sound/gontiti.mp3",
    move:"res/sound/move.mp3",
    Pmove:"res/sound/move_p.mp3",
    clear:"res/sound/clear.wav",
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
