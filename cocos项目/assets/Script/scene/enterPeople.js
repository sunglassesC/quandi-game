// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html
import * as Util from "../util";
import Home from "./Home";
import global from "../global";
import configs from "../config";

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
    },

    // update (dt) {},
    changeScene() {
        Home.gameId = configs.gameId;
        Home.secretKey = configs.secretKey;
        Home.url = configs.url;
        Util.checkMgobe();
        this.initSDK();
        cc.director.loadScene("numPeople");
    },

    /////////////////////////////////// SDK 操作 ///////////////////////////////////
    // SDK 初始化
    initSDK() {
        if (Util.isInited()) {
            return Util.appendLog("SDK 已经初始化，无需重复操作");
        }

        if (!Home.gameId || !Home.secretKey || !Home.url) {
            return Util.appendLog("请在首页填入正确的 gameId、secretKey、url");
        }

        Util.appendLog("正在初始化 SDK");

        Util.initSDK(Home.gameId, Home.secretKey, Home.url, "", event => {
            if (event.code === MGOBE.ErrCode.EC_OK) {
                Util.appendLog("初始化 SDK 成功");
                this.initView();
                global.room.onUpdate = () => this.onRoomUpdate();
            } else {
                Util.appendLog(`初始化 SDK 失败，错误码：${event.code}`);
            }
        });
    }
});
