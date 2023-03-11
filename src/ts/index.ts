import {Application, Text} from "pixi.js";
import {Vars} from "./data/Vars";
import ViewManager from "./views/ViewManager";
import {GameView} from "./views/GameView";
import {MenuView} from "./views/MenuView";

window.addEventListener("contextmenu", e => {
    e.preventDefault()
    e.stopPropagation()
})

window.addEventListener("mousedown", e => {
    if (e.button !== 1) return
    e.preventDefault()
})

window.addEventListener("resize", e => {
    resize()
})

window.addEventListener("load", () => {
    Vars.app = new Application<HTMLCanvasElement>({
        antialias: true,
        resolution: window.devicePixelRatio || 1,
    })

    document.body.appendChild(Vars.app.view)

    const renderer = Vars.app.renderer
    renderer.view.style.left = "0px"
    renderer.view.style.top = "0px"
    renderer.view.style.position = "absolute"

    Text.defaultAutoResolution = false
    Text.defaultResolution = 2

    Vars.menuView = new MenuView()
    Vars.gameView = new GameView()
    Vars.viewManager = new ViewManager()
    Vars.viewManager.add("menu", Vars.menuView)
    Vars.viewManager.add("game", Vars.gameView)
    Vars.viewManager.show("menu")

    Vars.app.ticker.add((dt) => {
        Vars.viewManager.timer(dt)
    });

    resize()
});

function resize() {
    let width = window.innerWidth, height = window.innerHeight, renderer = Vars.app.renderer
    let ratio = Math.max(width / Vars.windowWidth, height / Vars.windowHeight) * window.devicePixelRatio
    renderer.resize(Math.ceil(Vars.windowWidth * ratio), Math.ceil(Vars.windowHeight * ratio))
    Vars.app.stage.scale.set(ratio, ratio)
    Vars.width = width / ratio
    Vars.height = height / ratio
    Vars.ratio = ratio
    Vars.viewManager.resize()
}