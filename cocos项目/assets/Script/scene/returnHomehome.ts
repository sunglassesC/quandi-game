// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Node)
    backBtn: cc.Node = null;

    @property
    backScene: string = '';

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        if (!!this.backScene) {
            this.backBtn.on(cc.Node.EventType.TOUCH_START, () => cc.director.loadScene(this.backScene));
        }
    }

    // update (dt) {}
}
