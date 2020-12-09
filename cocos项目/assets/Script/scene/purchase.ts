import Dialog from "../ui/Dialog";
// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Prefab)
    dialogPrefab: cc.Prefab = null;

    @property(cc.Button)
    purchaseButton: cc.Button = null;

    start () {
        this.initDialog();
        this.initListener();
    }

    initDialog() {
        // 设置对话框
        const dialogNode = cc.instantiate(this.dialogPrefab) as cc.Node;
        dialogNode.parent = this.node;
    }

    initListener() {
        this.purchaseButton.node.on(cc.Node.EventType.TOUCH_START, () => this.onPurchaseClick());
    }

    onPurchaseClick() {
        Dialog.open("确定要购买吗？", "点击确定以购买", () => this.enter());
    }

    enter() {
        //cc.director.loadScene("homehome");
    }
    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    // update (dt) {}
}
