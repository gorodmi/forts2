import {Application} from "pixi.js";
import ViewManager from "../views/ViewManager";
import {GameView} from "../views/GameView";
import {Vector2} from "./Vector2";
import {MenuView} from "../views/MenuView";

export namespace Vars {
    export let app: Application<HTMLCanvasElement>;
    export let gameView: GameView
    export let menuView: MenuView
    export let viewManager: ViewManager
    export let windowWidth: number = 1280
    export let windowHeight: number = 720
    export let width: number = Vars.windowWidth
    export let height: number = Vars.windowHeight
    export let ratio: number = 1
    export let gravity: Vector2 = new Vector2({x: 0, y: 1})
}