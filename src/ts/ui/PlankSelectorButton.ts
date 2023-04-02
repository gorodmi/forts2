import { Control, ControlType } from "../Control";
import { Vars } from "../data/Vars";
import { IPlank, Plank } from "../objects/Plank";
import { ElementSelectorButton } from "./ElementSelectorButton";

export class PlankSelectorButton extends ElementSelectorButton<new (data: IPlank) => Plank> {
    select() {
        Vars.gameView.menu.unselectPlanks()
        super.select()
        Control.plankType = this.type
        Control.setControlType(ControlType.POINT_PLACE)
    }
}