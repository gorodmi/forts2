import {IVector2, Vector2} from "./Vector2";
import {setOrNew} from "../Util";
import {Rectangle} from "./Rectangle";

export interface ILine {
    a?: IVector2
    b?: IVector2
}

export class Line {
    a: Vector2
    b: Vector2

    constructor(params: ILine = {}) {
        this.a = setOrNew(params.a, Vector2)
        this.b = setOrNew(params.b, Vector2)
    }

    // https://stackoverflow.com/questions/22668659/calculate-on-which-side-of-a-line-a-point-is
    side(p: Vector2) {
        return Math.sign((this.b.x - this.a.x) * (p.y - this.a.y) - (p.x - this.a.x) * (this.b.y - this.a.y))
    }

    get normal() {
        return new Vector2({
            x: this.b.y - this.a.y,
            y: this.a.x - this.b.x
        }).norm()
    }

    get length() {
        return Math.sqrt(this.length2)
    }

    get length2() {
        return this.a.dst2(this.b)
    }

    get boundingBox() {
        let pos = new Vector2({x: Math.min(this.a.x, this.b.x), y: Math.min(this.a.y, this.b.y)})
        let size = new Vector2({x: Math.min(this.a.x, this.b.x), y: Math.min(this.a.y, this.b.y)}).sub(pos)
        return new Rectangle({pos: pos, size: size})
    }
}