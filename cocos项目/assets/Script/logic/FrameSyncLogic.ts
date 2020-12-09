import { GameState } from "./GameState";
import global from "../global";
import { Game } from "./Game";
import { Player } from "./Player"
// 帧广播消息缓存
let frames: MGOBE.types.Frame[] = [];

//游戏状态
let gamestate = new Game([], []);

// 帧消息命令：跑、停
export enum FrameSyncCmd {
    run = 1,
    stop = 2,
    joystick = 3,
}

export interface PlayerState {
    cmd: FrameSyncCmd,
    dir: 1 | -1,
    lastUpdateFrameId: number,
}

// 帧同步逻辑状态
export const frameSyncState: GameState = {
    gamestate
};

export function clearFrames() {
    frames = [];
}

export function pushFrames(frame: MGOBE.types.Frame) {
    frames.push(frame);
}

export function random(from: number, to: number, fixed: number) {
    return Math.round(Math.random() * (to - from) * 10 ** fixed) / (10 ** fixed);
}

// 重新从第一帧计算逻辑状态
export function reCalcFrameState(room: MGOBE.Room) {
    setDefauleFrameState(room);
    frames.forEach(frame => {
        calcFrame(frame);
    });
}

const size = Player.mapSize;
const initSite: [number, number][] = [[0, size * Math.sqrt(3) / 2], [size * 2, size * Math.sqrt(3) / 2], [size / 2, 0], [size / 2 * 3, size * Math.sqrt(3)], [size / 2 * 3, 0], [size / 2, size * Math.sqrt(3)]];

// 设置默认逻辑状态
export function setDefauleFrameState(room: MGOBE.Room) {

    const roomInfo = room.roomInfo || { playerList: [] } as MGOBE.types.RoomInfo;
    // frameSyncState.players = [];
    // Util.appendLog(`玩家数: ${room.roomInfo.playerList.length}`);
    roomInfo.playerList.forEach((p, i) => {
        // const player: PlayerData<PlayerState> = {
        //     x: 0,
        //     y: i,
        //     id: p.id,
        //     state: {
        //         cmd: FrameSyncCmd.stop,
        //         dir: 1,
        //         lastUpdateFrameId: 1,
        //     },
        // };

        // setDefaultPlayerState(player, p.id, i);

        // frameSyncState.players.push(player);
        if (!frameSyncState.gamestate.players.find(player => player.name === p.id))
            frameSyncState.gamestate.addPlayer(p.id, initSite[i], 1);
    });
}

// function setDefaultPlayerState(player: PlayerData<PlayerState>, id: string, y: number) {
//     player.id = id;
//     player.x = 0;
//     player.y = y;
//     player.state.cmd = FrameSyncCmd.stop;
//     player.state.dir = 1;
//     player.state.lastUpdateFrameId = 1;
// }

const MAX_X = 18 - 1;
const MIN_X = 0;
const DELTA_FRAME = 1;
let s = 0;

function setPlayerCMD(id: string, cmd: [number, number]) {
    const player = frameSyncState.gamestate.players.find(p => p.name === id) || {} as Player;
    // if (cmd === 1) {
    //     if (s === 0) {
    //         player.direction = [1, 0];
    //     } else if (s === 1) {
    //         player.direction = [0, 1];
    //     } else if (s === 2) {
    //         player.direction = [-1, 0];
    //     } else if (s === 3) {
    //         player.direction = [0, -1];
    //     }
    //     s = (s + 1) % 4;
    // } else if (cmd === 2) {
    //     player.direction = [0, 0];
    // } else if (cmd === 3) {
    //     // player.direction = dir
    //     player.direction = [1, 1];
    // }
    if (cmd[0] === 10 && cmd[1] === 10) {
        if (player.isDead) {
            player.respawnImmediately();
        }
    } else if (cmd[0] === 20 && cmd[1] === 20) {
        if (!player.isDead){
            player.accelerate()
        }
    } else {
        player.direction = cmd;
    }
}

// 根据命令字更新玩家状态
function calcPlayerState(player: Player, frameId: number) {
    // if (player.state.cmd === FrameSyncCmd.stop) {
    //     return;
    // }

    let direction: [number, number];

    if (frameId - player.lastUpdateFrameId > DELTA_FRAME) {
        player.lastUpdateFrameId = frameId;
        if (!player.isDead) {
            player.move()
            for (const p of frameSyncState.gamestate.players) {
                if (p !== player) {
                    p.checkCollision(player.position)
                }
            }
        } else {
            player.respawnCountDown()
        }
    }
}

// 根据每一帧计算游戏逻辑
export function calcFrame(frame: MGOBE.types.Frame) {
    // Util.appendLog(`frame: ${frame.id}`);
    if (frame.id === 1) {
        setDefauleFrameState(global.room);
    }

    if (frame.items && frame.items.length > 0) {
        frame.items.forEach(item => {
            setPlayerCMD(item.playerId, item.data["cmd"]);
        });
    }

    frameSyncState.gamestate.players.forEach(player => calcPlayerState(player, frame.id));
}