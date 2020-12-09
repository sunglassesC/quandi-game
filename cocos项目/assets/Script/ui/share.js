import { roomId } from "../scene/Room";
// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

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
    onLoad () {
        this.passiveShare();                     // 监听被动转发
        this.getWXQuery();                       // 获取分享卡片参数
    },

    activeShare() {
        // 主动分享按钮
        //if (typeof wx === 'undefined') {
           // return;
        //}

        wx.shareAppMessage({
            title: '我邀请你来玩圈地大作战游戏~房间号是'+roomId, 
            imageUrl: cc.url.raw('img.png'),        // 分享图片要放在 wechatgame/res/raw-assers 路径下
            query: 'shareMsg='+'分享卡片上所带的信息'  // query最大长度(length)为2048
        });
    },

    passiveShare() {
        // 监听小程序右上角菜单的「转发」按钮
        if (typeof wx === 'undefined') {
            return;
        }

        // 显示当前页面的转发按钮
        wx.showShareMenu({
            success: (res) => {
                console.log('开启被动转发成功！');
            },
            fail: (res) => {
                console.log(res);
                console.log('开启被动转发失败！');
            }
        });

        wx.onShareAppMessage(() => {
            return {
                title: '我邀请你来玩圈地大作战游戏~', 
                imageUrl: cc.url.raw('img.png'),        // 分享图片要放在 wechatgame/res/raw-assets 路径下
                query: 'shareMsg='+'分享卡片上所带的信息'  // query最大长度(length)为2048
            }
        });
    },

    getWXQuery() {
        // 当其他玩家从分享卡片上点击进入时，获取query参数
        if (typeof wx === 'undefined') {
            return;
        }

        let object = wx.getLaunchOptionsSync();
        let shareMsg = object.query['shareMsg'];
        console.log(shareMsg);
        return shareMsg;
    },

});
