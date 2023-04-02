import { LINE_CAP } from "pixi.js";
import { IPlank, Plank } from "../Plank";
import { Line } from "../../data/Line";
import { Vector2 } from "../../data/Vector2";

export class RopePlank extends Plank {
    constructor(data: IPlank) {
        super(data)
        this.color = 0x7F6A4E
    }

    getDiff(): number {
        return Math.max(super.getDiff(), 0)
    }

    draw() {
        let healthRatio = this.health / this.maxHealth
        this.graphics.clear()
        this.graphics.lineStyle({width: healthRatio * 5 + 5, color: this.color, cap: LINE_CAP.ROUND})
        this.graphics.moveTo(this.a.pos.x, this.a.pos.y)
        let diff = super.getDiff()
        let normal = new Line({a: this.a.pos, b: this.b.pos}).normal.mul(diff / 2)
        if (normal.dot(new Vector2({x: 0, y: 1})) < 0) normal.mul(-1)
        let cp1 = this.a.pos.copy.add(normal)
        let cp2 = this.b.pos.copy.add(normal)
        this.graphics.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, this.b.pos.x, this.b.pos.y)
        if (this.building) this.graphics.alpha = 0.5
        else this.graphics.alpha = 1
    }
}