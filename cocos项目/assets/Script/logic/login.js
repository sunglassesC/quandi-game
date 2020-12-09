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

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        let exportJson = {};
let sysInfo = window.wx.getSystemInfoSync();
//获取微信界面大小
let width = sysInfo.screenWidth;
let height = sysInfo.screenHeight;
window.wx.getSetting({
    success (res) {
        console.log(res.authSetting);
        if (res.authSetting["scope.userInfo"]) {
            console.log("用户已授权");
            window.wx.getUserInfo({
                success(res){
                    console.log(res);
                    exportJson.userInfo = res.userInfo;
                    //此时可进行登录操作
                }
            });
        }else {
            console.log("用户未授权");
            let button = window.wx.createUserInfoButton({
                type: 'text',
                text: '',
                style: {
                    left: 0,
                    top: 0,
                    width: width,
                    height: height,
                    backgroundColor: '#00000000',//最后两位为透明度
                    color: '#ffffff',
                    fontSize: 20,
                    textAlign: "center",
                    lineHeight: height,
                }
            });
            button.onTap((res) => {
                if (res.userInfo) {
                    console.log("用户授权:", res);
                    exportJson.userInfo = res.userInfo;
                    //此时可进行登录操作
                    button.destroy();
                }else {
                    console.log("用户拒绝授权:", res);
                }
            });
        }
    }
 })


    },

    // update (dt) {},
});
