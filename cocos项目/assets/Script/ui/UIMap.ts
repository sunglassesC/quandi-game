import { Player } from "../logic/Player";
import UIPlayer from "./UIPlayer";
import * as Util from "../util";
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
let playersPool: cc.NodePool = null;
const AREACOLOR = ['#99E550', '#8874A3', '#a7acbb', '#8D5524', '#5e9cf7', '#FE4A49'];
const LINECOLOR = ['#B8EF92', '#AEACC4', '#bdcfd3', '#B19978', '#91c6f6', '#F4928E'];
const PLAYERCOLOR = ['#99E550', '#8874A3', '#a7acbb', '#8D5524', '#5e9cf7', '#FE4A49'];
const PLAYERBORDERCOLOR = ['#72AC3C', '#66577A', '#7D828B', '#6A401B', '#4B78B8', '#C33838']

const mapOutsideColor = '#80f8fd', mapBorderColor = '#565f5b', mapInsideColor = '#e7fff4'

// 初始化对象池
function initPlayersPool(playerPrefab: cc.Prefab) {
    if (playersPool) {
        return;
    }

    playersPool = new cc.NodePool();

    for (let i = 0; i < 6; i++) {
        let player = cc.instantiate(playerPrefab);
        playersPool.put(player);
    }
}

function getFromPlayersPool(playerPrefab: cc.Prefab) {
    let player = null;
    if (playersPool.size() > 0) {
        player = playersPool.get();
    } else {
        player = cc.instantiate(playerPrefab);
    }

    return player;
}

function removeToPlayerPool(player) {
    playersPool.put(player);
}

function drawCircle(context: cc.Graphics, point, r, lineWidth, fillColor, strokeColor, originPoint) {
    context.moveTo(point[0] + r - originPoint[0], point[1] - originPoint[1]);
    context.fillColor = fillColor;
    context.strokeColor = strokeColor;
    context.lineWidth = lineWidth;
    context.arc(point[0] - originPoint[0], point[1] - originPoint[1], r, 0 * Math.PI, 2 * Math.PI);
    context.stroke();
    context.fill();
}

function drawCurve(context: cc.Graphics, pointList, width, color, originPoint) {
    if (pointList.length !== 0) {
        context.lineWidth = width;
        context.strokeColor = color;
        context.moveTo(pointList[0][0] - originPoint[0], pointList[0][1] - originPoint[1]);
        for (let i = 1; i < pointList.length; i++) {
            context.lineTo(pointList[i][0] - originPoint[0], pointList[i][1] - originPoint[1]);
        }
        context.stroke();
    }  
}

function drawPolygon(context: cc.Graphics, pointList, color, originPoint) {
    if (pointList.length !== 0) {
        context.fillColor = color;
        context.moveTo(pointList[0][0] - originPoint[0], pointList[0][1] - originPoint[1]);
        for (let i = 1; i < pointList.length; i++) {
            context.lineTo(pointList[i][0] - originPoint[0], pointList[i][1] - originPoint[1]);
        }
        context.fill();
    }
}

@ccclass
export default class UIMap extends cc.Component {

    @property(cc.Prefab)
    playerPrefab: cc.Prefab = null;

    // 地图尺寸
    public w: number = 13;
    public h: number = 6;

    public players: UIPlayer[] = [];

    // 地图单元格宽度（像素）
    public tileSize = 40;

    setMapSize(w, h) {
        this.w = w;
        this.h = h;
    }

    setPlayers(players: Player[]) {
        if (!Array.isArray(players)) {
            players = [];
        }
        // Util.appendLog(`玩家数: ${players.length}`);
        this.players.splice(players.length).forEach(player => removeToPlayerPool(player));

        for (let i = this.players.length; i < players.length; i++) {
            this.players.push(getFromPlayersPool(this.playerPrefab));

        }

        // 六边形边长
        const size = Player.mapSize;

        // 游戏界面长宽
        const screenWidth = 960, screenHeight = 480

        // 镜头中心的玩家
        const centerPlayer = players.find(player => player.name === MGOBE.Player.id)

        // originPoint为原点，也即玩家位置减去屏幕长宽的一半
        let centerPosition: [number, number] = [centerPlayer.position[0], centerPlayer.position[1]]
        let originPoint = [centerPosition[0] - screenWidth / 2, centerPosition[1] - screenHeight / 2]

        const context = this.getComponent(cc.Graphics);
        context.clear();


        const mapBackground: [number, number][] = [[0, -100], [960, -100], [960, 500], [0, 500]]
        drawPolygon(context, mapBackground, mapOutsideColor, [0, 0]);

        
        let border: [number, number][] = [[0, size * Math.sqrt(3) / 2], [size / 2, 0], [size / 2 * 3, 0], [size * 2, size * Math.sqrt(3) / 2], [size / 2 * 3, size * Math.sqrt(3)], [size / 2, size * Math.sqrt(3)]];
        drawPolygon(context, border, mapInsideColor, originPoint);

        
        
        // 绘制顺序为领地，line，保留区边界，玩家position
        // 原因是：玩家始终在最上层，接着是保留区边界，line须在领地上层
        players.forEach((player, i) => {
            // const uiPlayer = this.players[i].getComponent(UIPlayer);
            // 将玩家的逻辑坐标转换成地图画布坐标，更新表现层玩家位置
            // const {x, y} = this.convertPosition(player.x, player.y);
            // uiPlayer.node.parent = this.node;
            // uiPlayer.initPlayer(player.id, x, y);
            // Util.appendLog(`i: ${i} Pid: ${player.name}`);
            drawPolygon(context, player.area, AREACOLOR[i], originPoint);
        });
        players.forEach((player, i) => {
            drawCurve(context, player.line, 5, LINECOLOR[i], originPoint);
        });
        players.forEach((player, i) => {
            drawCurve(context, player.reservedArea, 1, cc.Color.WHITE, originPoint);
        });

        // 画地图边界
        const borderWidth = 10
        let border1: [number, number][] = []
        border1.push([border[0][0] - borderWidth * 2 / Math.sqrt(3), border[0][1]])
        border1.push([border[1][0] - borderWidth / Math.sqrt(3), border[1][1] - borderWidth])
        border1.push([border[2][0] + borderWidth / Math.sqrt(3), border[2][1] - borderWidth])
        border1.push([border[3][0] + borderWidth * 2 / Math.sqrt(3), border[3][1]])
        border1.push([border[4][0] + borderWidth / Math.sqrt(3), border[4][1] + borderWidth])
        border1.push([border[5][0] - borderWidth / Math.sqrt(3), border[5][1] + borderWidth])
        border1.push([border[0][0] - borderWidth * 2 / Math.sqrt(3), border[0][1]])
        drawCurve(context, border1, borderWidth * 2, mapBorderColor, originPoint)

        players.forEach((player, i) => {
            drawCircle(context, player.position, player.pointRadius, 5, PLAYERCOLOR[i], PLAYERBORDERCOLOR[i], originPoint);
        });
        

        // const test: [number, number][] = [[50, 50], [200, 50], [200, 200], [50, 200], [50, 50]]
        // drawCurve(context, test, 10, cc.Color.RED, [0, 0]);



        // 接下来绘制小地图，为整个地图的缩略图
        originPoint = [0, -250]

        //缩小比例
        const shrinkRate = 8
        const miniMapWidth = Player.mapSize / shrinkRate * 2
        const miniMapHeight = Player.mapSize / shrinkRate * Math.sqrt(3)


        let miniMapCenter: [number, number] = [border[0][0] + Player.mapSize, border[0][1]]
        miniMapCenter[0] /= shrinkRate
        miniMapCenter[1] /= shrinkRate
        drawCircle(context, miniMapCenter, Player.mapSize / shrinkRate, 5, '#cee4da', '#57605c', originPoint)

        for (let i = 0; i < border.length; i++) {
            border[i][0] /= shrinkRate;
            border[i][1] /= shrinkRate;
        }
        drawPolygon(context, border, cc.Color.WHITE, originPoint);


        // 找到中心玩家的颜色号，以绘制小地图
        let centerPlayerColorNum = 0
        for (let i = 0;i < players.length;i++) {
            if (players[i] === centerPlayer) {
                centerPlayerColorNum = i
            }
        }

        let miniMapArea: [number, number][] = []
        for (const p of centerPlayer.area) {
            miniMapArea.push([p[0] / shrinkRate, p[1] / shrinkRate])
        }
        drawPolygon(context, miniMapArea, AREACOLOR[centerPlayerColorNum], originPoint);
    
        
        let miniMapLine: [number, number][] = []
        for (const p of centerPlayer.line) {
            miniMapLine.push([p[0] / shrinkRate, p[1] / shrinkRate])
        }
        drawCurve(context, miniMapLine, 2, LINECOLOR[centerPlayerColorNum], originPoint);
     

        const miniMapPosition = [centerPlayer.position[0] / shrinkRate, centerPlayer.position[1] / shrinkRate]
        drawCircle(context, miniMapPosition, centerPlayer.pointRadius / shrinkRate, 1, PLAYERCOLOR[centerPlayerColorNum], PLAYERBORDERCOLOR, originPoint);
        
    }



    // 坐标转换：逻辑坐标 -> 画布坐标
    convertPosition(mapX: number, mapY: number) {
        const x = mapX * this.tileSize + this.tileSize / 2;
        const y = mapY * this.tileSize + this.tileSize / 2;

        return { x, y };
    }

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {
        initPlayersPool(this.playerPrefab);
    }

    update(dt) {
        this.node.width = 0;// = this.w * this.tileSize;
        this.node.height = 0;// = this.h * this.tileSize;
    }

    onDisable() {
        const context = this.getComponent(cc.Graphics);
        context.clear()
    }
}
