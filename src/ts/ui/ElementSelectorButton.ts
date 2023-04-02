import {Graphics, Text, TextStyle} from "pixi.js";

const textStyle = new TextStyle({
    fontFamily: "monospace",
    fontSize: 40,
    fill: 0x000000,
    stroke: 0xFFFFFF,
    strokeThickness: 5,
})

export class ElementSelectorButton<T> extends Graphics {
    nameText: Text
    type: T
    selected = false

    constructor(name: string, type: T) {
        super();
        this.type = type

        this.eventMode = `static`
        this.cursor = "pointer"
        this.on("click", e => {this.select()})

        this.beginFill(0xFFFFFF)
        this.drawRoundedRect(-150, -20, 300, 40, 5)
        this.endFill()

        this.nameText = new Text(name, textStyle)
        this.nameText.anchor.set(0.5)
        this.addChild(this.nameText)
    }

    select() {
        this.tint = 0x00FF00
        this.selected = true
    }

    unselect() {
        this.tint = 0xFFFFFF
        this.selected = false
    }
}