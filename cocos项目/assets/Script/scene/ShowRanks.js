import { areaProportion } from "../logic/Player"

cc.Class({
    extends: cc.Component,

    properties: {
        wxSubContextView: cc.Node       //主域视窗容器
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        // 获取授权
        this.initUserInfoButton();
    },

    showRanks() {
        if (typeof wx === 'undefined') {
            return;
        }

        if (!this.wxSubContextView.active) {
            // 设置容器可见
            this.wxSubContextView.active = true;

            // 设置随机数(把这个当做玩家每局结算时的分数)
            // let score = Math.round(Math.random() * 100);
            let score = areaProportion

            // 发送结算分数到开放域
            wx.getOpenDataContext().postMessage({
                message: score
            });
        }
        else {
            // 设置容器不可见，即关闭排行榜，并让开放域清空排名信息
            this.wxSubContextView.active = false;
            wx.getOpenDataContext().postMessage({
                message: 'clear'
            });
        }
    },

    initUserInfoButton() {
        // 微信授权，此代码来自Cocos官方
        if (typeof wx === 'undefined') {
            return;
        }

        let systemInfo = wx.getSystemInfoSync();
        let width = systemInfo.windowWidth;
        let height = systemInfo.windowHeight;
        let button = wx.createUserInfoButton({
            type: 'text',
            text: '',
            style: {
                left: 0,
                top: 0,
                width: width,
                height: height,
                lineHeight: 40,
                backgroundColor: '#00000000',
                color: '#00000000',
                textAlign: 'center',
                fontSize: 10,
                borderRadius: 4
            }
        });

        button.onTap((res) => {
            if (res.userInfo) {
                // 可以在这里获取当前玩家的个人信息，如头像、微信名等。
                console.log('授权成功！');
            }
            else {
                console.log('授权失败！');
            }

            button.hide();
            button.destroy();
        });
    },
});
