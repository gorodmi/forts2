import {GameObject, IGameObject} from "./GameObject";
import {Vars} from "../../data/Vars";

export class BalloonObject extends GameObject {
    constructor(params: IGameObject = {}) {
        super(params)
        this.graphics.beginFill(0x8888FF)
        this.graphics.drawRoundedRect(-50, -10, 100, 10, 5)
        this.graphics.endFill()
    }

    update(dt: number) {
        super.update(dt);
        if (this.shouldUpdate()) {
            let force = Vars.gravity.copy.neg()
            this.plank.a.force.add(force.mul(this.ratio))
            this.plank.b.force.add(force.mul(1 - this.ratio))
        }
    }
}