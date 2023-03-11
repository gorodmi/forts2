import {IVector2, Vector2} from "./Vector2";
import {setOrNew} from "../Util";

export interface IRectangle {
    pos?: IVector2
    size?: IVector2
}

export class Rectangle {
    pos: Vector2
    size: Vector2

    constructor(params: IRectangle = {}) {
        this.pos = setOrNew(params.pos, Vector2)
        this.size = setOrNew(params.size, Vector2)
    }

    in(point: Vector2) {
        return point.x >= this.pos.x &&
            point.y >= this.pos.y &&
            point.x <= this.pos.x + this.size.x &&
            point.y <= this.pos.y + this.size.y
    }
}