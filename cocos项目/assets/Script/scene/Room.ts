import global from "../global";
import * as Util from "../util";
import Dialog from "../ui/Dialog";
import TabButton from "../ui/TabButton";
import UIChat from "../ui/UIChat";
// import UIStateSync from "../ui/UIStateSync";
import UIFrameSync from "../ui/UIFrameSync";
import { calcFrame, FrameSyncCmd, setDefauleFrameState, frameSyncState, reCalcFrameState, clearFrames, pushFrames } from "../logic/FrameSyncLogic";
// import { setState, setDefauleSyncState } from "../logic/StateSyncLogic";
import ReadOnlyEditor from "../ui/ReadOnlyEditor";
import { dir } from "../ui/JoyStick";
export let roomId: any;

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

export enum SyncType {
    msg = "房间内发消息",
    state = "实时服务器状态同步",
    frame = "帧同步",
}

export enum StateSyncCmd {
    up = 1,
    down = 2,
    left = 3,
    right = 4,
}

@ccclass
export default class Room extends cc.Component {

    @property(cc.Label)
    gameIdLlabel: cc.Label = null;

    @property(cc.Label)
    playerIdLlabel: cc.Label = null;

    @property(ReadOnlyEditor)
    roomIdEditBox: ReadOnlyEditor = null;

    @property(cc.Label)
    onlineLlabel: cc.Label = null;

    @property(cc.Button)
    leaveRoomButton: cc.Button = null;

    @property(cc.Button)
    dismissRoomButton: cc.Button = null;

    @property(cc.Prefab)
    dialogPrefab: cc.Prefab = null;

    @property(TabButton)
    roomMsgTabButton: TabButton = null;

    /*    @property(TabButton)
        stateSyncTabButton: TabButton = null;
    */
    @property(TabButton)
    frameSyncTabButton: TabButton = null;

    @property(cc.Label)
    syncTypesLabel: cc.Label = null;

    @property(cc.Label)
    syncTypesTitleLabel: cc.Label = null;

    @property(cc.Prefab)
    chatPrefab: cc.Prefab = null;

    /*    @property(cc.Prefab)
        statSyncPrefab: cc.Prefab = null;
    */
    @property(cc.Prefab)
    frameSyncPrefab: cc.Prefab = null;

    @property(cc.Node)
    contentNode: cc.Node = null;

    public uiChat: UIChat = null;
    // public uiStateSync: UIStateSync = null;
    public uiFrameSync: UIFrameSync = null;

    private started = false;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        this.initView();
        this.initListener();
    }

    initView() {
        this.initDialog();
        this.initPrefab();
        this.onRoomUpdate();
    }

    initDialog() {
        // 设置对话框
        const dialogNode = cc.instantiate(this.dialogPrefab) as cc.Node;
        dialogNode.parent = this.node;
    }

    initListener() {
        global.room && (global.room.onUpdate = () => this.onRoomUpdate());
        this.leaveRoomButton.node.on(cc.Node.EventType.TOUCH_START, () => this.onLeaveRoomButtonClick());
        this.dismissRoomButton.node.on(cc.Node.EventType.TOUCH_START, () => this.onDismissRoomButtonClick());
        // tabs
        this.roomMsgTabButton.node.on(cc.Node.EventType.TOUCH_START, () => this.onRoomMsgTabButtonClick());
        // this.stateSyncTabButton.node.on(cc.Node.EventType.TOUCH_START, () => this.onStateSyncTabButtonClick());
        this.frameSyncTabButton.node.on(cc.Node.EventType.TOUCH_START, () => this.onFrameSyncTabButtonClick());
        // 广播回调
        Util.setBroadcastCallbacks(global.room, this, this as any);
    }

    initPrefab() {
        // 房间内消息同步
        const chatNode = cc.instantiate(this.chatPrefab) as cc.Node;
        chatNode.parent = this.contentNode;
        this.uiChat = chatNode.getComponent(UIChat);
        this.uiChat.onSubmit = (msg) => msg && this.sendToClient(msg);

        // 帧同步
        const frameSyncNode = cc.instantiate(this.frameSyncPrefab) as cc.Node;
        frameSyncNode.parent = this.contentNode;
        this.uiFrameSync = frameSyncNode.getComponent(UIFrameSync);
        // this.uiFrameSync.onRunButtonClick = () => this.sendFrame([0,1]);
        // this.uiFrameSync.onStopButtonClick = () => this.sendFrame([0,0]);
        this.uiFrameSync.onJoystickClick = () => this.sendFrame(dir);
        this.uiFrameSync.onRespawnButtonClick = () => this.sendFrame([10, 10]);
        this.uiFrameSync.onAcceleratorButtonClick = () => this.sendFrame([20, 20]);
        this.uiFrameSync.onStartFrameButtonClick = () => this.startFrameSync();
        this.uiFrameSync.onStopFrameButtonClick = () => this.stopFrameSync();
    }

    setRoomView() {
        const roomInfo = global.room && global.room.roomInfo || { playerList: [], owner: undefined } as MGOBE.types.RoomInfo;

        // 设置文本标签
        this.gameIdLlabel.string = global.gameId;
        this.playerIdLlabel.string = MGOBE.Player.id;
        this.roomIdEditBox.setValue(roomInfo.id || "");
        roomId = roomInfo.id;
        this.onlineLlabel.string = roomInfo.playerList.filter(p => p.commonNetworkState && p.relayNetworkState).length + "" || "0";

        // 设置 tips
        this.syncTypesLabel.string = roomInfo.customProperties || SyncType.msg;

        // 设置 tabs 按钮
        if (roomInfo.owner === MGOBE.Player.id) {
            // 房主
            this.roomMsgTabButton.node.active =
                // this.stateSyncTabButton.node.active =
                this.frameSyncTabButton.node.active = true;
            this.syncTypesLabel.node.active =
                this.syncTypesTitleLabel.node.active = false;

            this.leaveRoomButton.node.x = this.dismissRoomButton.node.x - 20 - this.dismissRoomButton.node.width;
            this.dismissRoomButton.node.active = true;
        } else {
            // 非房主
            this.roomMsgTabButton.node.active =
                //this.stateSyncTabButton.node.active =
                this.frameSyncTabButton.node.active = false;
            this.syncTypesLabel.node.active =
                this.syncTypesTitleLabel.node.active = true;

            this.leaveRoomButton.node.x = this.dismissRoomButton.node.x;
            this.dismissRoomButton.node.active = false;
        }

        this.roomMsgTabButton.setActive(this.syncTypesLabel.string === SyncType.msg);
        // this.stateSyncTabButton.setActive(this.syncTypesLabel.string === SyncType.state);
        this.frameSyncTabButton.setActive(this.syncTypesLabel.string === SyncType.frame);

        // 设置同步操作界面部分
        this.uiChat.node.active = this.roomMsgTabButton.isActive;
        // this.uiStateSync.node.active = this.stateSyncTabButton.isActive;
        this.uiFrameSync.node.active = this.frameSyncTabButton.isActive;

        // 设置帧同步按钮状态
        if(roomInfo.frameSyncState === MGOBE.types.FrameSyncState.START){
            this.uiFrameSync.setButtonState(true);
        }
        // this.uiFrameSync.setButtonState(roomInfo.frameSyncState === MGOBE.types.FrameSyncState.START);

        // 角色游戏状态
        if (roomInfo.customProperties !== SyncType.frame) {
            setDefauleFrameState({ roomInfo } as MGOBE.Room);
        }
        // if (roomInfo.customProperties !== SyncType.state) {
        //     setDefauleSyncState({ roomInfo } as MGOBE.Room);
        // }
        Util.appendLog(`z人数: ${frameSyncState.gamestate.numberOfPlayers}`)
        // 房间人数变化，重新计算帧同步状态
        if (roomInfo.playerList.length !== frameSyncState.gamestate.numberOfPlayers) {
            reCalcFrameState({ roomInfo } as MGOBE.Room);
        }
    }

    // 点击离开房间按钮
    onLeaveRoomButtonClick() {
        Dialog.open("确定要退出房间码？", "退出房间后，再进入需要重新创建房间", () => this.leaveRoom());
    }

    // 点击解散房间按钮
    onDismissRoomButtonClick() {
        Dialog.open("确定要解散房间码？", "解散房间后，再进入需要重新创建房间", () => this.dismissRoom());
    }

    // 点击房间内发消息
    onRoomMsgTabButtonClick() {
        this.changeCustomProperties(SyncType.msg);
    }

    // 点击实时服务器状态同步
    // onStateSyncTabButtonClick() {
    //     if (global.room && global.room.roomInfo && global.room.roomInfo.frameSyncState === MGOBE.types.FrameSyncState.START) {
    //         // 如果已开始帧同步，就先停止
    //         this.stopFrameSync(() => this.changeCustomProperties(SyncType.state));
    //     } else {
    //         this.changeCustomProperties(SyncType.state);
    //     }
    // }

    // 点击帧同步
    onFrameSyncTabButtonClick() {
        this.changeCustomProperties(SyncType.frame);
    }

    // update (dt) {}

    onDisable() {
        // 场景销毁时一定要清理回调，避免引用UI时报错
        global.room && (global.room.onUpdate = null);
        // 关闭对话框
        Dialog.close();
        // 清理广播回调
        Util.setBroadcastCallbacks(global.room, this, {});
        // 清理帧缓存
        clearFrames();

        frameSyncState.gamestate.players.length = 0;
    }

    /////////////////////////////////// SDK 操作 ///////////////////////////////////
    // SDK Room 更新回调
    onRoomUpdate() {
        // 如果不在房间内，或者房间已经销毁，回到上一页
        if (!global.room || !global.room.roomInfo || !global.room.roomInfo.playerList || !global.room.roomInfo.playerList.find(p => p.id === MGOBE.Player.id)) {
            return cc.director.loadScene("mgobe");
        }

        this.setRoomView();
    }

    // SDK 修改房间自定义信息
    changeCustomProperties(customProperties: SyncType) {
        Util.appendLog(`正在修改房间自定义信息为：${customProperties}`);

        global.room.changeRoom({ customProperties }, event => {
            if (event.code === MGOBE.ErrCode.EC_OK) {
                Util.appendLog(`修改房间自定义信息成功`);
            } else {
                Util.appendLog(`修改房间自定义信息失败，错误码：${event.code}`);
            }
        });
    }

    // SDK 退出房间
    leaveRoom() {
        Util.appendLog(`正在退出房间`);
        frameSyncState.gamestate.players.length = 0;

        global.room.leaveRoom({}, event => {
            if (event.code === MGOBE.ErrCode.EC_OK) {
                Util.appendLog(`退出房间成功`);
                cc.audioEngine.stopMusic();
            } else {
                Util.appendLog(`退出房间失败，错误码：${event.code}`);
            }
        });
    }

    // SDK 解散房间
    dismissRoom() {
        Util.appendLog(`正在解散房间`);
        frameSyncState.gamestate.players.length = 0;

        global.room.dismissRoom({}, event => {
            if (event.code === MGOBE.ErrCode.EC_OK) {
                Util.appendLog(`解散房间成功`);
                cc.audioEngine.stopMusic();
            } else {
                Util.appendLog(`解散房间失败，错误码：${event.code}`);
            }
        });
    }

    // SDK 发送房间消息
    sendToClient(msg: string) {
        Util.appendLog(`正在发送房间消息`);

        const sendToClientPara: MGOBE.types.SendToClientPara = {
            recvPlayerList: [],
            recvType: MGOBE.types.RecvType.ROOM_ALL,
            msg,
        };

        global.room.sendToClient(sendToClientPara, event => {
            if (event.code === MGOBE.ErrCode.EC_OK) {
                Util.appendLog(`发送房间消息成功`);
            } else {
                Util.appendLog(`发送房间消息失败，错误码：${event.code}`);
            }
        });
    }

    // SDK 发送帧消息
    sendFrame(cmd: [number, number]) {
        Util.appendLog(`正在发送帧消息`);

        const sendFramePara: MGOBE.types.SendFramePara = {
            data: {
                cmd,
            },
        };

        global.room.sendFrame(sendFramePara, event => {
            if (event.code === MGOBE.ErrCode.EC_OK) {
                Util.appendLog(`发送帧消息成功`);
            } else {
                Util.appendLog(`发送帧消息失败，错误码：${event.code}`);
            }
        });
    }

    // SDK 开始帧同步
    startFrameSync() {
        Util.appendLog(`正在开始帧同步`);
        this.scheduleOnce(function () {
            this.stopFrameSync();
        }, 300)

        global.room.startFrameSync({}, event => {
            if (event.code === MGOBE.ErrCode.EC_OK) {
                Util.appendLog(`开始帧同步成功`);
            } else {
                Util.appendLog(`开始帧同步失败，错误码：${event.code}`);
            }
        });
    }

    // SDK 停止帧同步
    stopFrameSync(success?: () => any) {
        Util.appendLog(`正在停止帧同步`);

        global.room.stopFrameSync({}, event => {
            if (event.code === MGOBE.ErrCode.EC_OK) {
                Util.appendLog(`停止帧同步成功`);
                success && success();
            } else {
                Util.appendLog(`停止帧同步失败，错误码：${event.code}`);
            }
        });
    }

    /////////////////////////////////// SDK 广播 ///////////////////////////////////
    // SDK 玩家进房广播
    onJoinRoom(event: MGOBE.types.BroadcastEvent<MGOBE.types.JoinRoomBst>) {
        Util.appendLog(`广播：玩家进房`);
    }

    // SDK 玩家退房广播
    onLeaveRoom(event: MGOBE.types.BroadcastEvent<MGOBE.types.LeaveRoomBst>) {
        Util.appendLog(`广播：玩家退房`);
    }

    // SDK 房间解散广播
    onDismissRoom(event: MGOBE.types.BroadcastEvent<MGOBE.types.DismissRoomBst>) {
        Util.appendLog(`广播：房间解散`);
        return cc.director.loadScene("mgobe");
    }

    // SDK 开始帧同步
    onStartFrame() {
        clearFrames();
    }

    // SDK 停止帧同步
    onStopFrame() {
        clearFrames();
    }

    // SDK 房间内消息广播
    onRecvFromClient(event: MGOBE.types.BroadcastEvent<MGOBE.types.RecvFromClientBst>) {
        this.uiChat.appendMsg(event.data.msg, event.data.sendPlayerId === MGOBE.Player.id);
    }

    // SDK 帧同步广播
    onRecvFrame(event: MGOBE.types.BroadcastEvent<MGOBE.types.RecvFrameBst>) {
        pushFrames(event.data.frame);
        calcFrame(event.data.frame);
    }
}
