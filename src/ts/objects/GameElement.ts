import { Container } from "pixi.js";
import {ZIndex} from "./ZIndex";

export class GameElement {
    view: Container

    constructor() {
        this.view = new Container()
        this.view.zIndex = ZIndex.DEFAULT
    }

    add() {

    }

    delete() {

    }

    update(dt: number) {

    }
}