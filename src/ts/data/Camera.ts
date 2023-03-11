import {Vector2} from "./Vector2";
import {Vars} from "./Vars";

export class Camera {
    pos: Vector2 = new Vector2()
    scale: number = 1

    screenToCanvas(vec: Vector2) {
        return vec.div(this.scale).div(Vars.ratio)
    }

    canvasToScreen(vec: Vector2) {
        return vec.mul(Vars.ratio).mul(this.scale)
    }

    canvasToWorld(vec: Vector2) {
        return vec.sub(this.pos).add({
            x: Vars.width / 2 * (1 - 1 / this.scale),
            y: Vars.height / 2 * (1 - 1 / this.scale),
        })
    }

    worldToCanvas(vec: Vector2) {
        return vec.add(this.pos).sub({
            x: Vars.width / 2 * (1 - 1 / this.scale),
            y: Vars.height / 2 * (1 - 1 / this.scale),
        })
    }

    screenToWorld(vec: Vector2) {
        return this.canvasToWorld(this.screenToCanvas(vec))
    }

    worldToScreen(vec: Vector2) {
        return this.canvasToScreen(this.worldToCanvas(vec))
    }
}