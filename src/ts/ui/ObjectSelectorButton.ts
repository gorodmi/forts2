import {Graphics, Text, TextMetrics, TextStyle} from "pixi.js";
import {GameObject, IGameObject} from "../objects/objectTypes/GameObject";
import {Control, ControlType} from "../Control";
import {Vars} from "../data/Vars";

const textStyle = new TextStyle({
    fontFamily: "monospace",
    fontSize: 40,
    fill: 0x000000,
    stroke: 0xFFFFFF,
    strokeThickness: 5,
    wordWrap: true,
    wordWrapWidth: 200,
    breakWords: true,
})

export class ObjectSelectorButton extends Graphics {
    nameText: Text
    type: new (params: IGameObject) => GameObject

    constructor(name: string, type: new (params: IGameObject) => GameObject) {
        super();
        this.type = type

        this.interactive = true
        this.on("click", e => {this.select()})

        this.beginFill(0xFFFFFF)
        this.drawRoundedRect(-100, -20, 200, 40, 5)
        this.endFill()

        this.nameText = new Text(name, textStyle)
        this.addChild(this.nameText)

        let nameSize = TextMetrics.measureText(this.nameText.text, this.nameText.style, false, this.nameText.canvas)
        this.nameText.x = -nameSize.width / 2
        this.nameText.y = -nameSize.height / 2
    }

    select() {
        Vars.gameView.unselectSelectors()
        this.tint = 0x00FF00
        Control.setControlType(ControlType.OBJECT_PLACE)
        Control.removeBuildingObject()
        Control.addBuildingObject(this.type)
    }
}