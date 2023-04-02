import {IPoint, Point} from "./Point";
import {Graphics, LINE_CAP} from "pixi.js";
import {Vector2} from "../data/Vector2";
import {Vars} from "../data/Vars";
import {setOrNew} from "../Util";
import { GameElement } from "./GameElement";
import {ZIndex} from "./ZIndex";
import {Line} from "../data/Line";

export interface IPlank {
    a?: IPoint
    b?: IPoint
    springCoefficient?: number
    targetLength?: number
    maxHealth?: number
    health?: number
    toughness?: number
    limit?: number
    building?: boolean
    color?: number
}

export class Plank extends GameElement {
    a: Point
    b: Point
    springCoefficient: number
    targetLength: number
    maxHealth: number
    health: number
    toughness: number
    limit: number
    building: boolean
    color: number
    
    graphics: Graphics

    constructor(params: IPlank = {}) {
        super()
        this.a = setOrNew(params.a, Point)
        this.b = setOrNew(params.b, Point)
        this.springCoefficient = params.springCoefficient ?? 0.75
        this.targetLength = params.targetLength ?? this.a.pos.dst(this.b.pos)
        this.maxHealth = params.maxHealth ?? 100
        this.health = params.health ?? this.maxHealth
        this.toughness = params.toughness ?? 10
        this.limit = params.limit ?? this.targetLength / 10
        this.building = params.building ?? false
        this.color = params.color ?? 0x8B4513

        this.view.zIndex = ZIndex.PLANK
        this.graphics = new Graphics();
        this.view.addChild(this.graphics);
        this.add()
    }

    add() {
        super.add();
        Vars.gameView.planks.push(this)
    }

    delete() {
        super.delete()
        let index = Vars.gameView.planks.indexOf(this)
        if (index > -1) Vars.gameView.planks.splice(index, 1)
        Vars.gameView.objects.filter(o => o.plank === this).forEach(o => {
            Vars.gameView.gameContainer.removeChild(o.view)
            o.delete()
        })
    }

    get updating() {
        return !this.building
    }

    get line() {
        return new Line({
            a: this.a.pos,
            b: this.b.pos,
        })
    }

    getDiff() {
        let dst = this.a.pos.dst(this.b.pos)
        return dst - this.targetLength
    }

    update(dt: number) {
        super.update(dt)
        let diff = this.getDiff()

        if (this.updating && !(!this.a.updating && !this.b.updating)) {
            let angle = this.a.pos.angle(this.b.pos)

            let force = diff * this.springCoefficient
            let aForce = Vector2.fromAngle(angle)
            let bForce = Vector2.fromAngle(angle + Math.PI)

            if (!this.a.updating) {
                aForce.mul(0)
                bForce.mul(force)
            } else if (!this.b.updating) {
                aForce.mul(force)
                bForce.mul(0)
            } else {
                let sum = 1 / (this.a.mass + this.b.mass)
                aForce.mul(force * sum * this.b.mass)
                bForce.mul(force * sum * this.a.mass)
            }

            this.a.force.sub(aForce)
            this.b.force.sub(bForce)
        }

        if (diff > this.limit) {
            this.health -= (diff - this.limit) / this.toughness
        }

        if (this.health <= 0) {
            Vars.gameView.gameContainer.removeChild(this.view)
            this.delete()
        }

        this.draw()
    }

    draw() {
        let healthRatio = this.health / this.maxHealth
        this.graphics.clear()
        this.graphics.lineStyle({width: healthRatio * 5 + 5, color: this.color, cap: LINE_CAP.ROUND})
        this.graphics.moveTo(this.a.pos.x, this.a.pos.y)
        this.graphics.lineTo(this.b.pos.x, this.b.pos.y)

        if (this.building) this.graphics.alpha = 0.5
        else this.graphics.alpha = 1
    }
}