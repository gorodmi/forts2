import {GameObject, IGameObject} from "../objects/objectTypes/GameObject";
import {Control, ControlType} from "../Control";
import {Vars} from "../data/Vars";
import { ElementSelectorButton } from "./ElementSelectorButton";

export class ObjectSelectorButton extends ElementSelectorButton<new (params: IGameObject) => GameObject> {
    select() {
        if (this.selected) {
            this.unselect()
            Control.setControlType(ControlType.POINT_PLACE)
        } else { 
            Vars.gameView.menu.unselectSelectors()
            super.select()
            Control.setControlType(ControlType.OBJECT_PLACE)
            Control.removeBuildingObject()
            Control.addBuildingObject(this.type)
        }
    }
}