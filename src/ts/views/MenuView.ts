import View from "./View";
import {Graphics, Text, TextStyle, TextMetrics} from "pixi.js";
import {Vars} from "../data/Vars";

const titleStyle = new TextStyle({
    fontFamily: "monospace",
    fontSize: 150,
    fill: 0x884444,
    stroke: 0xFFFFFF,
    strokeThickness: 5
})

const playStyle = new TextStyle({
    fontFamily: "monospace",
    fontSize: 50,
    fill: 0x000000,
    stroke: 0xFFFFFF,
    strokeThickness: 5
})

export class MenuView extends View {
    titleText: Text
    playButton: Graphics
    playText: Text

    constructor() {
        super();
        this.titleText = new Text("forts", titleStyle)
        this.addChild(this.titleText)

        this.playButton = new Graphics()
        this.playButton.eventMode = `static`
        this.playButton.cursor = "pointer"
        this.playButton.on("click", e => {Vars.viewManager.show("game")})
        this.playButton.lineStyle({width: 5, color: 0xFFFFFF})
        this.playButton.beginFill(0xFF0000)
        this.playButton.drawRoundedRect(- 300 / 2, - 100 / 2, 300, 100, 10)
        this.playButton.endFill()
        this.addChild(this.playButton)

        this.playText = new Text("play", playStyle)
        this.playButton.addChild(this.playText)
    }

    resize() {
        super.resize();
        let titleSize = TextMetrics.measureText(this.titleText.text, this.titleText.style, false, this.titleText.canvas)
        this.titleText.x = -titleSize.width / 2 + Vars.width / 2
        this.titleText.y = -titleSize.height / 2 + 100

        this.playButton.position.set(Vars.width / 2, Vars.height / 2)

        let playSize = TextMetrics.measureText(this.playText.text, this.playText.style, false, this.playText.canvas)
        this.playText.x = -playSize.width / 2
        this.playText.y = -playSize.height / 2
    }
}