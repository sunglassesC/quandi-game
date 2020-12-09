export { Player }
import { Game } from "./Game"

export let areaProportion: number

class Player {
    private _game: Game
    private _name: string
    private _spawnPlace: [number, number]
    private _spawnDirection: [number, number]
    private _position: [number, number]
    private _pointRadius = 10
    private _direction: [number, number]
    private _targetDirection: [number, number]
    private _speed = 5
    private _line: [number, number][] = []
    private _area: [number, number][] = []
    private _reservedArea: [number, number][] = []
    private _propNum = 0
    private _reviveTime = -1
    private _inArea = true
    private _isDead = false
    private _acceleratingTime = 0
    public lastUpdateFrameId = 1
    // public static readonly deltaX = 0
    // public static readonly deltaY = 0
    public static readonly mapSize = 800

    private initArea([x, y]: [number, number], deltaDegree: number): void {
        const r = Player.mapSize / 5
        const numOfPoints = Math.floor(2 / 3 * Math.PI * r)
        for (let i = 0; i <= numOfPoints; i += 1) {
            const degree = 2 * Math.PI * i / (numOfPoints * 3) + deltaDegree
            const tempX = r * Math.cos(degree)
            const tempY = r * Math.sin(degree)
            this._reservedArea.push([x + tempX, y + tempY])
            this._area.push([x + tempX, y + tempY])
        }
        this._reservedArea.push([x, y])
        this._area.push([x, y])
        this.getAreaProportion()
    }

    constructor(name: string, [x, y]: [number, number], lastUpdateFrameId: number, game: Game) {
        this._game = game
        this._name = name
        this._spawnPlace = [x, y]
        this._position = [x, y]

        if (this.distance([x, y], [0, Player.mapSize * Math.sqrt(3) / 2]) < Player.mapSize / 10) {
            this.initArea([0, Player.mapSize * Math.sqrt(3) / 2], -Math.PI / 3)
            this._spawnDirection = [1, 0]
        } else if (this.distance([x, y], [Player.mapSize * 2, Player.mapSize * Math.sqrt(3) / 2]) < Player.mapSize / 10) {
            this.initArea([Player.mapSize * 2, Player.mapSize * Math.sqrt(3) / 2], Math.PI * 2 / 3)
            this._spawnDirection = [-1, 0]
        } else if (this.distance([x, y], [Player.mapSize / 2, 0]) < Player.mapSize / 10) {
            this.initArea([Player.mapSize / 2, 0], 0)
            this._spawnDirection = [1 / 2, Math.sqrt(3) / 2]
        } else if (this.distance([x, y], [Player.mapSize / 2 * 3, Player.mapSize * Math.sqrt(3)]) < Player.mapSize / 10) {
            this.initArea([Player.mapSize / 2 * 3, Player.mapSize * Math.sqrt(3)], Math.PI)
            this._spawnDirection = [-1 / 2, -Math.sqrt(3) / 2]
        } else if (this.distance([x, y], [Player.mapSize / 2 * 3, 0]) < Player.mapSize / 10) {
            this.initArea([Player.mapSize / 2 * 3, 0], Math.PI / 3)
            this._spawnDirection = [-1 / 2, Math.sqrt(3) / 2]
        } else if (this.distance([x, y], [Player.mapSize / 2, Player.mapSize * Math.sqrt(3)]) < Player.mapSize / 10) {
            this.initArea([Player.mapSize / 2, Player.mapSize * Math.sqrt(3)], -Math.PI * 2 / 3)
            this._spawnDirection = [1 / 2, -Math.sqrt(3) / 2]
        }
        this._direction = [this._spawnDirection[0], this._spawnDirection[1]]
        this._targetDirection = [this._spawnDirection[0], this._spawnDirection[1]]
        this.lastUpdateFrameId = lastUpdateFrameId
    }

    get name(): string {
        return this._name
    }

    get position(): [number, number] {
        return this._position
    }

    get line(): [number, number][] {
        return this._line
    }

    get area(): [number, number][] {
        return this._area
    }

    get reservedArea(): [number, number][] {
        return this._reservedArea
    }

    // get UIPosition(): [number, number] {
    //     return [this._position[0] + Player.deltaX, this._position[1] + Player.deltaY]
    // }

    // get UILine(): [number, number][] {
    //     const UILine = []
    //     for (const p of this._line) {
    //         UILine.push([p[0] + Player.deltaX, p[1] + Player.deltaY])
    //     }
    //     return UILine
    // }

    // get UIArea(): [number, number][] {
    //     const UIArea = []
    //     for (const p of this._area) {
    //         UIArea.push([p[0] + Player.deltaX, p[1] + Player.deltaY])
    //     }
    //     return UIArea
    // }

    // get UIReservedArea(): [number, number][] {
    //     const UIReservedArea = []
    //     for (const p of this._reservedArea) {
    //         UIReservedArea.push([p[0] + Player.deltaX, p[1] + Player.deltaY])
    //     }
    //     UIReservedArea.pop()
    //     return UIReservedArea
    // }

    get isDead(): boolean {
        return this._isDead
    }

    get pointRadius(): number {
        return this._pointRadius
    }

    set direction(d: [number, number]) {
        this._targetDirection = d
    }

    set speed(speed: number) {
        this._speed = speed
    }

    private vectorToAngel(vector: [number, number]): number {
        if (vector === [0, 0]) {
            return 0
        }
        if (vector[0] === 0) {
            if (vector[1] > 0) {
                return 90
            } else {
                return 270
            }
        }
        if (vector[1] === 0) {
            if (vector[0] > 0) {
                return 0
            } else {
                return 180
            }
        }
        const radian = Math.atan(Math.abs(vector[1] / vector[0]))
        const temp_angel = 180 / Math.PI * radian
        if (vector[0] > 0) {
            if (vector[1] > 0) {
                return temp_angel
            } else {
                return 360 - temp_angel
            }
        } else {
            if (vector[1] > 0) {
                return 180 - temp_angel
            } else {
                return 180 + temp_angel
            }
        }
    }

    public die(): void {
        this._isDead = true
        this._line.length = 0
        this._position = [this._spawnPlace[0], this._spawnPlace[1]]
        this._reviveTime = Game.respawnTime
        this._inArea = true
    }

    public respawnCountDown(): void {
        this._reviveTime--
        if (this._reviveTime === 0) {
            this.respawn()
        }
    }

    public accelerate(): void {
        this._speed = 10
        this._acceleratingTime = 75
    }

    public respawn(): void {
        this._position = [this._spawnPlace[0], this._spawnPlace[1]]
        this._isDead = false
        this._direction = [this._spawnDirection[0], this._spawnDirection[1]]
        this._targetDirection = [this._spawnDirection[0], this._spawnDirection[1]]
        this._acceleratingTime = 0
        this._speed = 5
    }

    public respawnImmediately(): void {
        this._reviveTime = 0
        this.respawn()
    }

    private setDirection(): void {
        const last_angel = this.vectorToAngel(this._direction)
        const next_angel = this.vectorToAngel(this._targetDirection)

        const maxDiff = 30

        let temp1 = last_angel - next_angel
        let temp2 = next_angel - last_angel
        if (temp1 < 0) {
            temp1 += 360
        }
        if (temp2 < 0) {
            temp2 += 360
        }

        const difference = Math.min(temp1, temp2)   //上一个方向与当前要设置的方向的角度差值
        if (difference <= maxDiff) {
            this._direction = [this._targetDirection[0], this._targetDirection[1]]
        } else {
            const midLine = (last_angel + 180) % 360    //上一个方向的反方向角度，
            if ((midLine > last_angel && next_angel > last_angel && next_angel < midLine)
                || (midLine < last_angel && (next_angel > last_angel || next_angel < midLine))) {
                let angel = (last_angel + maxDiff) % 360
                this._direction = [Math.cos(angel * Math.PI / 180), Math.sin(angel * Math.PI / 180)]
            } else {
                let angel = last_angel - maxDiff
                if (angel < 0) {
                    angel += 360
                }
                this._direction = [Math.cos(angel * Math.PI / 180), Math.sin(angel * Math.PI / 180)]
            }
        }
    }

    public move(): void {
        if (this._acceleratingTime > 0) {
            this._acceleratingTime--
            if (this._acceleratingTime === 0) {
                this._speed = 5
            }
        }

        this.setDirection()

        const last_position: [number, number] = [this._position[0], this._position[1]]

        //更新该player位置
        const temp = Math.sqrt(this._direction[0] ** 2 + this._direction[1] ** 2)
        if (temp !== 0) {
            this._position[0] += this._direction[0] * this._speed / temp
            this._position[1] += this._direction[1] * this._speed / temp
        }

        const size = Player.mapSize
        const border: [number, number][] = [[0, size * Math.sqrt(3) / 2], [size / 2, 0], [size / 2 * 3, 0], [size * 2, size * Math.sqrt(3) / 2], [size / 2 * 3, size * Math.sqrt(3)], [size / 2, size * Math.sqrt(3)]]

        if (!this.inPolygon(border, this._position)) {
            this.die()
            return
        }

        this.checkInOtherSpawnplace()

        for (let i = 0; i < this._line.length - (this._pointRadius / this._speed * 3); i++) {
            if (this.distance(this._line[i], this._position) < this._pointRadius) {
                this.die()
                return
            }
        }

        if (this._inArea) { //上一步在area内
            if (!this.inPolygon(this._area, this._position)) {
                //当前位置加入line
                this._line.push([last_position[0], last_position[1]])
                this._line.push([this._position[0], this._position[1]])

                this._inArea = false
            }
        } else {        //上一步不在area内
            if (!this.inPolygon(this._area, this._position)) {
                this._line.push([this._position[0], this._position[1]])
            } else {    //执行圈地
                this.updateArea(this._line)
                this._game.finishQuandi(this)

                this._inArea = true
                this._line.length = 0
            }
        }
    }

    //被圈地时更新area
    public checkArea(line: [number, number][]): void {
        let inMyArea = false
        const newLine: [number, number][] = []
        for (let i = 0; i < line.length; i++) {
            if (!inMyArea) {    //上一个点不在area内
                if (this.inPolygon(this._area, line[i])) {
                    newLine.push([line[i][0], line[i][1]])
                    inMyArea = true
                }
            } else {  //上一个点在area内
                if (this.inPolygon(this._area, line[i])) {
                    newLine.push([line[i][0], line[i][1]])
                } else {
                    this.updateArea(newLine)
                    inMyArea = false
                    newLine.length = 0
                }
            }
        }
        if (inMyArea) {
            this.updateArea(newLine)
        }
    }

    //圈地或被圈地时，根据line更新area
    private updateArea(line: [number, number][]): void {

        if (line.length < 3) {
            return
        }

        const area1 = []    //这里area1和area2分别存储line和
        const area2 = []    //area组成的两个新的area的点序列
        for (const p of line) {
            area1.push(p)
            area2.push(p)
        }

        let startIndex = 0, endIndex = 0    //line的起止点与area中最近的点的序列
        let min1 = Infinity, min2 = Infinity
        for (let i = 0; i < this._area.length; i++) {
            const dist1 = this.distance(this._area[i], line[0])
            if (dist1 < min1) {
                min1 = dist1
                startIndex = i
            }

            const dist2 = this.distance(this._area[i], line[line.length - 1])
            if (dist2 < min2) {
                min2 = dist2
                endIndex = i
            }
        }

        //将area1和area2补充完整
        for (let i = endIndex; i !== startIndex; i = (i + 1) % this._area.length) {
            area1.push(this._area[i])
        }
        area1.push(this._area[startIndex])

        for (let i = endIndex; i !== startIndex;) {
            area2.push(this._area[i])

            i -= 1
            if (i < 0) {
                i += this._area.length
            }
        }
        area2.push(this._area[startIndex])

        this._area = []

        //根据this._spawnPlace选择area1或area2
        if (this.inPolygon(area1, [this._spawnPlace[0] + this._spawnDirection[0] * this._speed, this._spawnPlace[1] + this._spawnDirection[1] * this._speed])) {
            for (const p of area1) {
                this._area.push(p)
            }
        } else {
            for (const p of area2) {
                this._area.push(p)
            }
        }

        if (this._line.length === 0) {   //不在划线中
            if (!this.inPolygon(this._area, this._position)) {
                this.die()
            }
        } else {    //正在划线
            if (!this.inPolygon(this._area, this._line[0])) {
                this.die()
            }
        }

        this.getAreaProportion()
    }

    //距离
    private distance(point1: [number, number], point2: [number, number]): number {
        return Math.sqrt((point1[0] - point2[0]) ** 2 + (point1[1] - point2[1]) ** 2)
    }

    //计算多边形面积
    private acreage(area: [number, number][]): number {
        if (area.length < 3) {
            return 0
        }

        let s = 0
        for (let i = 0; i < area.length; ++i) {
            s += area[i][0] * area[(i + 1) % area.length][1] - area[i][1] * area[(i + 1) % area.length][0]
        }

        return Math.abs(s / 2.0)
    }

    private getAreaProportion(): void {
        const size = Player.mapSize
        const border: [number, number][] = [[0, size * Math.sqrt(3) / 2], [size / 2, 0], [size / 2 * 3, 0], [size * 2, size * Math.sqrt(3) / 2], [size / 2 * 3, size * Math.sqrt(3)], [size / 2, size * Math.sqrt(3)]]
        areaProportion = this.acreage(this._area) / this.acreage(border) * 1000
    }

    // 判断点point是否在area内部
    public inPolygon(area: [number, number][], point: [number, number]): boolean {
        let count = 0;
        for (let i = 0; i < area.length; i++) {
            const v1 = area[i]
            const v2 = area[(i + 1) % area.length]

            if (point[0] === v1[0] && point[1] === v1[1]) {
                return true
            }

            if (point[1] > Math.min(v1[1], v2[1]) && point[1] <= Math.max(v1[1], v2[1])) {
                const x = (point[1] - v1[1]) * (v2[0] - v1[0]) / (v2[1] - v1[1]) + v1[0]
                if (point[0] < x) {
                    count++
                } else if (point[0] === x) {
                    return true
                }
            }
        }

        if (count % 2 === 0) {
            return false
        } else {
            return true
        }
    }

    private checkInOtherSpawnplace(): void {
        for (const p of this._game.players) {
            if (p !== this) {
                if (this.inPolygon(p.reservedArea, this._position)) {
                    this.die()
                }
            }
        }
    }

    // public checkCollision(line: [number, number][]): void {
    //     for (let i = 5; i < line.length - 2; i++) {
    //         if (this.distance(line[i], this._position) < this._pointRadius) {
    //             this.die()
    //         }
    //     }
    // }

    public checkCollision(p: [number, number]): void {
        for (let i = 0; i < this._line.length; i++) {
            if (this.distance(this._line[i], p) < this._pointRadius) {
                this.die()
            }
        }
    }

}
