import UIMap from "./UIMap";
import global from "../global";
import config from "../config";
import { frameSyncState, reCalcFrameState } from "../logic/FrameSyncLogic";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class UIFrameSync extends cc.Component {

    @property(cc.Button)
    startFrameButton: cc.Button = null;
    /*
        @property(cc.Button)
        stopFrameButton: cc.Button = null;
    
        @property(cc.Button)
        runButton: cc.Button = null;
    
        @property(cc.Button)
        stopButton: cc.Button = null;
    */
    @property(UIMap)
    map: UIMap = null;
    /*
        @property(cc.Label)
        frameRateLabel: cc.Label = null;
    */
    @property(cc.Node)
    joystick: cc.Node = null;

    @property(cc.Button)
    respawnButton: cc.Button = null;

    @property(cc.Button)
    acceleratorButton: cc.Button = null;

    @property(cc.AudioClip)
    bgm: cc.AudioClip = null;
    // 开始帧同步、停止帧同步、跑（发送帧消息）、停（发送帧消息） 回调函数
    // 需要使用 SDK 实现请求
    public onStartFrameButtonClick: () => any = null;
    public onStopFrameButtonClick: () => any = null;
    // public onRunButtonClick: () => any = null;
    // public onStopButtonClick: () => any = null;
    public onJoystickClick: () => any = null;
    public onRespawnButtonClick: () => any = null;
    public onAcceleratorButtonClick: () => any = null;
    /*
        public setFrameRate(frameRate: number) {
            this.frameRateLabel.string = frameRate + "";
        }
    */
    // 设置地图大小
    public setMapSize(w?: number, h?: number) {
        const mW = typeof w !== "number" ? this.map.w : w;
        const mH = typeof h !== "number" ? this.map.h : h;

        this.map.setMapSize(mW, mH);
    }

    public setButtonState(isStartFrame: boolean) {
        this.startFrameButton.interactable = !isStartFrame;
        // this.stopFrameButton.interactable = isStartFrame;

        // this.runButton.interactable = isStartFrame;
        // this.stopButton.interactable = isStartFrame;
        this.respawnButton.interactable = isStartFrame;
        this.acceleratorButton.interactable = isStartFrame;
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.startFrameButton.node.off(cc.Node.EventType.TOUCH_START, this.onStartFrameButtonClickCallback, this);
        // this.stopFrameButton.node.off(cc.Node.EventType.TOUCH_START, this.onStopFrameButtonClickCallback, this);
        // this.runButton.node.off(cc.Node.EventType.TOUCH_START, this.onRunButtonClickCallback, this);
        // this.stopButton.node.off(cc.Node.EventType.TOUCH_START, this.onStopButtonClickCallback, this);
        this.joystick.off(cc.Node.EventType.TOUCH_MOVE, this.onJoystickClickCallback, this);
        this.respawnButton.node.off(cc.Node.EventType.TOUCH_START, this.onRespawnButtonClickCallback, this);
        this.acceleratorButton.node.off(cc.Node.EventType.TOUCH_START, this.onAcceleratorButtonClickCallback, this);

        this.startFrameButton.node.on(cc.Node.EventType.TOUCH_START, this.onStartFrameButtonClickCallback, this);
        // this.stopFrameButton.node.on(cc.Node.EventType.TOUCH_START, this.onStopFrameButtonClickCallback, this);
        // this.runButton.node.on(cc.Node.EventType.TOUCH_START, this.onRunButtonClickCallback, this);
        // this.stopButton.node.on(cc.Node.EventType.TOUCH_START, this.onStopButtonClickCallback, this);
        this.joystick.on(cc.Node.EventType.TOUCH_MOVE, this.onJoystickClickCallback, this);
        this.respawnButton.node.on(cc.Node.EventType.TOUCH_START, this.onRespawnButtonClickCallback, this);
        this.acceleratorButton.node.on(cc.Node.EventType.TOUCH_START, this.onAcceleratorButtonClickCallback, this);

        // this.setFrameRate(15);

        reCalcFrameState(global.room);
    }

    update(dt) {
        // 更新表现层
        this.map.setPlayers(frameSyncState.gamestate.players);
    }

    onStartFrameButtonClickCallback() {
        var id = cc.audioEngine.playMusic(this.bgm, false);
        cc.audioEngine.setLoop(id, true);
        this.startFrameButton.interactable && this.onStartFrameButtonClick && this.onStartFrameButtonClick();
    }

    /*
    onStopFrameButtonClickCallback() {
        this.stopFrameButton.interactable && this.onStopFrameButtonClick && this.onStopFrameButtonClick();
    }

    onRunButtonClickCallback() {
        this.runButton.interactable && this.onRunButtonClick && this.onRunButtonClick();
    }

    onStopButtonClickCallback() {
        this.stopButton.interactable && this.onStopButtonClick && this.onStopButtonClick();
    }
*/
    onJoystickClickCallback() {
        this.onJoystickClick && this.onJoystickClick();
    }

    onRespawnButtonClickCallback() {
        this.respawnButton.interactable && this.onRespawnButtonClick && this.onRespawnButtonClick();
        this.respawnButton.interactable = false;
        this.respawnButton.node.opacity = 100;
        this.scheduleOnce(function () {
            this.respawnButton.interactable = true;
            this.respawnButton.node.opacity = 255;
        }, 60);
    }

    onAcceleratorButtonClickCallback() {
        this.acceleratorButton.interactable && this.onAcceleratorButtonClick && this.onAcceleratorButtonClick();
        this.acceleratorButton.interactable = false;
        this.acceleratorButton.node.opacity = 100;
        this.scheduleOnce(function () {
            this.acceleratorButton.interactable = true;
            this.acceleratorButton.node.opacity = 255;
        }, 60);
    }

}
