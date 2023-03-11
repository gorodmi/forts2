import {GameObject, IGameObject} from "./GameObject";
import {Vector2} from "../../data/Vector2";

export class RocketObject extends GameObject {
    constructor(params: IGameObject = {}) {
        super(params)
        this.graphics.beginFill(0xFF8888)
        this.graphics.drawRoundedRect(-10, -30, 20, 30, 5)
        this.graphics.endFill()
    }

    update(dt: number) {
        super.update(dt);
        if (this.shouldUpdate()) {
            let force = Vector2.fromAngle(this.view.rotation + Math.PI / 2).mul(5)
            this.plank.a.force.add(force.copy.mul(this.ratio))
            this.plank.b.force.add(force.copy.mul(1 - this.ratio))
        }
    }
}