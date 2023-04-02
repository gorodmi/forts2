import { Control, ControlType } from "../Control";
import { Vars } from "../data/Vars";
import { IPoint, Point } from "../objects/Point";
import { ElementSelectorButton } from "./ElementSelectorButton";

export class PointSelectorButton extends ElementSelectorButton<new (data: IPoint) => Point> {
    select() {
        Vars.gameView.menu.unselectPoints()
        super.select()
        Control.pointType = this.type
        Control.setControlType(ControlType.POINT_PLACE)
    }
}