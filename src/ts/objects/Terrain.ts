import {IVector2, Vector2} from "../data/Vector2";
import {setOrNew} from "../Util";
import {Container, Graphics} from "pixi.js";
import {Rectangle} from "../data/Rectangle";
import {Vars} from "../data/Vars";
import {Line} from "../data/Line";
import {Collisions} from "../data/Collisions";
import {GameElement} from "./GameElement";
import {ZIndex} from "./ZIndex";

export interface ITerrain {
    points?: Array<IVector2>
}

export class Terrain extends GameElement {
    points: Array<Vector2>
    lines: Array<Line>

    boundingBox: Rectangle

    graphics: Graphics

    constructor(params: ITerrain = {}) {
        super()
        this.points = (params.points ?? []).map(p => setOrNew(p, Vector2))
        this.lines = []
        for (let i = 0; i < this.points.length; i++) {
            this.lines.push(new Line({
                a: this.points[i],
                b: this.points[(i + 1) % this.points.length]
            }))
        }

        let min = {
            x: this.points.reduce((a, b) => a.x < b.x ? a : b).x,
            y: this.points.reduce((a, b) => a.y < b.y ? a : b).y
        }
        let max = {
            x: this.points.reduce((a, b) => a.x > b.x ? a : b).x,
            y: this.points.reduce((a, b) => a.y > b.y ? a : b).y
        }
        this.boundingBox = new Rectangle({
            pos: {x: min.x, y: min.y},
            size: {x: max.x - min.x, y: max.y - min.y}
        })

        this.view.zIndex = ZIndex.TERRAIN
        this.graphics = new Graphics()
        this.graphics.beginFill(0x888888)
        this.graphics.drawPolygon(this.points)
        this.graphics.endFill()
        this.view.addChild(this.graphics)
    }

    update(dt: number) {
        super.update(dt)
        let points = Vars.gameView.points.filter(p => this.boundingBox.in(p.pos))
        points.filter(p => p.updating && this.in(p.pos)).forEach(point => {
            let {line} = this.closestLine(point.pos)
            let push = Collisions.pointToLineProj(line, point.pos)
            point.force.init()
            point.vel.init()
            point.pos.set(push)
        })
    }

    in(vec: Vector2) {
        let pointOut = this.boundingBox.pos.copy.add(this.boundingBox.size).add({x: 100, y: 100})
        let ray = new Line({a: vec, b: pointOut})
        let intersections = this.lines.filter(line => Collisions.lineLineCollision(line, ray)).length
        return intersections % 2 !== 0
    }

    push(vec: Vector2) {
        if (!this.in(vec)) return vec
        let {line} = this.closestLine(vec)
        let push = Collisions.pointToLineProj(line, vec)
        return vec.set(push)
    }

    closestLine(vec: Vector2): {line: Line, dst: number} {
        let minLine = this.lines[0], minDst = this.boundingBox.size.x * this.boundingBox.size.y
        this.lines.forEach(line => {
            let dst = Collisions.pointToLineDst2(line, vec)
            if (dst < minDst) {
                minLine = line
                minDst = dst
            }
        })
        return {line: minLine, dst: Math.sqrt(minDst)}
    }
}