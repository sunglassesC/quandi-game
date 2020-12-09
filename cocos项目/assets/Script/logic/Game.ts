export { Game }
import { Player } from "./Player"
// import { strict as assert } from "assert"


class Game {
    private _players: Player[] = []

    public static readonly respawnTime: number = 150

    constructor(names: string[], positions: [number, number][]) {
        // assert.equal(names.length, positions.length)
        for (let i = 0; i < names.length; i++) {
            this._players.push(new Player(names[i], positions[i], 1, this));
        }
    }

    public addPlayer(name: string, position: [number, number], lastUpdateFrameId: number): void {
        this._players.push(new Player(name, position, lastUpdateFrameId, this));
    }

    // public straightMove(directionLists: [number, number][]): void {
    //     for (let i = 0; i < this._players.length; i++) {
    //         if (!this.players[i].isDead) {
    //             this._players[i].direction = directionLists[i]
    //             this._players[i].move()
    //             for (let j = 0; j < this._players.length; j++) {
    //                 if (i !== j) {
    //                     this._players[j].checkCollision(this._players[i].position)
    //                 }
    //             }
    //         } else {
    //             this._players[i].respawnCountDown()
    //         }
    //     }
    //     if (this._number_of_players === 2) {

    //     } 
    //     else if (this._number_of_players === 4) {

    //     }
    //     else if (this._number_of_players === 6) {

    //     }
    // }

    public finishQuandi(player: Player): void {
        for (const p of this._players) {
            if (p !== player) {
                p.checkArea(player.line)
            }
        }
    }

    public position(name: string): [number, number] {
        return this._players.find(p => p.name === name).position;
    }

    public line(name: string): [number, number][] {
        return this._players.find(p => p.name === name).line
    }
    public area(name: string): [number, number][] {
        return this._players.find(p => p.name === name).area
    }
    get players(): Player[] {
        return this._players
    }
    get numberOfPlayers(): number {
        return this._players.length
    }
}