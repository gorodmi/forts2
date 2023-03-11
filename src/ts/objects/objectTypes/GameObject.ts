import {GameElement} from "../GameElement";
import {ZIndex} from "../ZIndex";
import {IPlank, Plank} from "../Plank";
import {setOrNew} from "../../Util";
import {Graphics} from "pixi.js";
import {Vars} from "../../data/Vars";

export interface IGameObject {
    plank?: IPlank
    ratio?: number
    flip?: boolean
    building?: boolean
}

export class GameObject extends GameElement {
    plank: Plank
    ratio: number
    flip: boolean
    building: boolean
    graphics: Graphics

    constructor(params: IGameObject = {}) {
        super();
        this.plank = setOrNew(params.plank, Plank)
        this.ratio = params.ratio ?? 0.5
        this.flip = params.flip ?? false
        this.building = params.building ?? false

        this.view.zIndex = ZIndex.OBJECT
        this.view.addChild(this.graphics = new Graphics())
        this.add()
    }

    shouldUpdate() {
        return !this.building
    }

    update(dt: number) {
        super.update(dt);
        let midpoint = this.plank.a.pos.copy
        let add = this.plank.b.pos.copy.sub(midpoint).mul(this.ratio)
        midpoint.add(add)
        this.view.position.set(midpoint.x, midpoint.y)
        this.view.rotation = this.plank.a.pos.angle(this.plank.b.pos) + (this.flip ? Math.PI : 0)

        if (this.building) this.graphics.alpha = 0.5
        else this.graphics.alpha = 1
    }

    add() {
        super.add();
        Vars.gameView.objects.push(this)
    }

    delete() {
        super.delete()
        let index = Vars.gameView.objects.indexOf(this)
        if (index > -1) Vars.gameView.objects.splice(index, 1)
    }
}