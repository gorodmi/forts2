import {Container, Graphics, LINE_CAP, Text, TextStyle} from "pixi.js";
import {ObjectSelectorButton} from "./ObjectSelectorButton";
import {Vars} from "../data/Vars";
import {BalloonObject} from "../objects/objectTypes/BalloonObject";
import {RocketObject} from "../objects/objectTypes/RocketObject";
import { Plank } from "../objects/Plank";
import { Point } from "../objects/Point";
import { PointSelectorButton } from "./PointSelectorButton";
import { PlankSelectorButton } from "./PlankSelectorButton";
import { RubberPlank } from "../objects/planks/RubberPlank";
import { SteelPlank } from "../objects/planks/SteelPlank";
import { SteelPoint } from "../objects/points/SteelPoint";
import { Control, ControlType } from "../Control";
import { RopePlank } from "../objects/planks/RopePlank";

const tabStyle = new TextStyle({
    fontFamily: "monospace",
    fontSize: 16,
    fill: 0x000000,
    stroke: 0xFFFFFF,
    strokeThickness: 3
})

export class Menu extends Container {
    menuBackground: Graphics
    menuButton: Graphics
    pointContainer: Container
    pointTab: Graphics
    pointText: Text
    plankContainer: Container
    plankTab: Graphics
    plankText: Text
    objectContainer: Container
    objectTab: Graphics
    objectText: Text
    objectSelectors: Array<ObjectSelectorButton> = []
    pointSelectors: Array<PointSelectorButton> = []
    plankSelectors: Array<PlankSelectorButton> = []
    tabs: Array<Graphics> = []
    tabContainers: Array<Container> = []

    open = false
    selectedTab = 0

    constructor() {
        super();
        this.menuBackground = new Graphics()
        this.menuBackground.beginFill(0xCCAAAA)
        this.menuBackground.drawRect(0, 0, Vars.width / 6, Vars.height)
        this.menuBackground.endFill()
        this.addChild(this.menuBackground)

        this.menuButton = new Graphics()
        this.menuButton.eventMode = 'dynamic'
        this.menuButton.cursor = `pointer`
        this.menuButton.on(`click`, e => {
            this.open = !this.open
            this.resize()
        })
        this.menuButton.beginFill(0xCCAAAA)
        this.menuButton.drawRoundedRect(-40, -40, 40, 40, 5)
        this.menuButton.drawRect(-5, -40, 5, 40)
        this.menuButton.endFill()
        this.menuButton.lineStyle({width: 5, color: 0x000000, cap: LINE_CAP.ROUND})
        this.menuButton.moveTo(-30, -30)
        this.menuButton.lineTo(-10, -30)
        this.menuButton.moveTo(-30, -20)
        this.menuButton.lineTo(-10, -20)
        this.menuButton.moveTo(-30, -10)
        this.menuButton.lineTo(-10, -10)
        this.addChild(this.menuButton)

        this.pointContainer = new Container();
        [
            new PointSelectorButton("point", Point),
            new PointSelectorButton("steel ball", SteelPoint)
        ].forEach((s, i) => {
            s.position.set(Vars.width / 6 / 2, 60 + i * 50)
            this.pointContainer.addChild(s)
            this.pointSelectors.push(s)
        })
        this.addChild(this.pointContainer)
        this.pointTab = new Graphics()
        this.pointTab.eventMode = "dynamic"
        this.pointTab.cursor = "pointer"
        this.pointTab.on("click", e => this.selectTab(0))
        this.pointTab.beginFill(0xDDAAAA)
        this.pointTab.drawRect(0, 0, Vars.width / 6 / 3, 30)
        this.pointTab.endFill()
        this.pointText = new Text("points", tabStyle)
        this.pointText.anchor.set(0.5)
        this.pointText.position.set(Vars.width / 6 / 3 / 2, 30 / 2)
        this.pointTab.addChild(this.pointText)
        this.addChild(this.pointTab)

        this.plankContainer = new Container()
        this.plankContainer.visible = false;
        [
            new PlankSelectorButton("wood", Plank),
            new PlankSelectorButton("rubber", RubberPlank),
            new PlankSelectorButton("steel", SteelPlank),
            new PlankSelectorButton("rope", RopePlank)
        ].forEach((s, i) => {
            s.position.set(Vars.width / 6 / 2, 60 + i * 50)
            this.plankContainer.addChild(s)
            this.plankSelectors.push(s)
        })
        this.addChild(this.plankContainer)
        this.plankTab = new Graphics()
        this.plankTab.eventMode = "dynamic"
        this.plankTab.cursor = "pointer"
        this.plankTab.on("click", e => this.selectTab(1))
        this.plankTab.position.x = Vars.width / 6 / 3
        this.plankTab.beginFill(0xDDAAAA)
        this.plankTab.drawRect(0, 0, Vars.width / 6 / 3, 30)
        this.plankTab.endFill()
        this.plankText = new Text("planks", tabStyle)
        this.plankText.anchor.set(0.5)
        this.plankText.position.set(Vars.width / 6 / 3 / 2, 30 / 2)
        this.plankTab.addChild(this.plankText)
        this.addChild(this.plankTab)

        this.objectContainer = new Container()
        this.objectContainer.visible = false;
        [
            new ObjectSelectorButton("balloon", BalloonObject),
            new ObjectSelectorButton("rocket", RocketObject)
        ].forEach((s, i) => {
            s.position.set(Vars.width / 6 / 2, 60 + i * 50)
            this.objectContainer.addChild(s)
            this.objectSelectors.push(s)
        })
        this.addChild(this.objectContainer)
        this.objectTab = new Graphics()
        this.objectTab.eventMode = "dynamic"
        this.objectTab.cursor = "pointer"
        this.objectTab.on("click", e => this.selectTab(2))
        this.objectTab.position.x = Vars.width / 6 / 3 * 2
        this.objectTab.beginFill(0xDDAAAA)
        this.objectTab.drawRect(0, 0, Vars.width / 6 / 3, 30)
        this.objectTab.endFill()
        this.objectText = new Text("objects", tabStyle)
        this.objectText.anchor.set(0.5)
        this.objectText.position.set(Vars.width / 6 / 3 / 2, 30 / 2)
        this.objectTab.addChild(this.objectText)
        this.addChild(this.objectTab)

        this.tabs.push(this.pointTab, this.plankTab, this.objectTab)
        this.tabContainers.push(this.pointContainer, this.plankContainer, this.objectContainer)
    }

    unselectPoints() {
        this.pointSelectors.forEach(p => p.unselect())
    }

    unselectPlanks() {
        this.plankSelectors.forEach(p => p.unselect())
    }

    unselectSelectors() {
        this.objectSelectors.forEach(s => s.unselect())
    }

    unselectTabs() {
        this.tabContainers.forEach(c => c.visible = false)
    }

    select(num: number) {
        if (num >= this.objectSelectors.length) return
        let selector = this.objectSelectors[num]
        selector.select()
    }

    selectTab(num: number) {
        if (num >= this.tabs.length) return
        this.unselectTabs()
        let container = this.tabContainers[num]
        container.visible = true
        this.selectedTab = num
        this.resize()
    }

    resize() {
        this.position.set(this.open ? Vars.width / 6 * 5 : Vars.width, 0)
        this.menuButton.position.set(0, Vars.height)

        this.tabs.forEach((tab, i) => {
            tab.clear()
            tab.beginFill(i == this.selectedTab ? 0xFF6666 : 0xDDAAAA)
            tab.drawRect(0, 0, Vars.width / 6 / 3, 30)
            tab.endFill()
        })
    }
}