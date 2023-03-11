import {IVector2, Vector2} from "../data/Vector2";
import {Vars} from "../data/Vars";
import {Container, DisplayObject, Graphics} from "pixi.js";
import {setOrNew} from "../Util";
import {GameElement} from "./GameElement";
import {ZIndex} from "./ZIndex";

export interface IPoint {
    pos?: IVector2
    vel?: IVector2
    force?: IVector2
    mass?: number
    anchor?: boolean
    building?: boolean
    selected?: boolean
}

export class Point extends GameElement {
    static readonly radius = 5

    pos: Vector2
    vel: Vector2
    force: Vector2
    mass: number
    anchor: boolean
    building: boolean
    selected: boolean

    graphics: Graphics

    constructor(params: IPoint = {}) {
        super()
        this.pos = setOrNew(params.pos, Vector2)
        this.vel = setOrNew(params.vel, Vector2)
        this.force = setOrNew(params.force, Vector2)
        this.mass = params.mass ?? 1
        this.anchor = params.anchor ?? false
        this.building = params.building ?? false
        this.selected = params.selected ?? false

        this.view.zIndex = ZIndex.POINT
        this.graphics = new Graphics()
        this.graphics.beginFill(0xFFFFFF)
        this.graphics.drawCircle(0, 0, Point.radius)
        this.graphics.endFill()
        this.view.addChild(this.graphics)
        this.add()
    }

    add() {
        super.add();
        Vars.gameView.points.push(this)
    }

    delete() {
        super.delete()
        let index = Vars.gameView.points.indexOf(this)
        if (index > -1) Vars.gameView.points.splice(index, 1)
        Vars.gameView.planks.filter(p => p.a === this || p.b === this).forEach(p => {
            Vars.gameView.gameContainer.removeChild(p.view)
            p.delete()
        })
    }

    get updating() {
        return !this.anchor && !this.building
    }

    update(dt: number) {
        super.update(dt)
        if (this.updating) {
            this.force.add(Vars.gravity.copy.mul(this.mass))
            this.vel.add(this.force)
            this.force.init()
            this.vel.mul(0.99)
            this.pos.add(this.vel)

            if (this.pos.dst2() > 50000 ** 2) {
                Vars.gameView.gameContainer.removeChild(this.view)
                this.delete()
            }
        }
    }

    draw() {
        this.view.position.set(this.pos.x, this.pos.y)
        if (this.selected) this.graphics.tint = 0x00FF00
        else this.graphics.tint = 0xFFFFFF

        if (this.building) this.graphics.alpha = 0.5
        else this.graphics.alpha = 1
    }
}