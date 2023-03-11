import {Vars} from "../data/Vars"
import View from "./View"

export default class ViewManager {
    windows: Map<string, View> = new Map()
    currentView?: View

    add(name: string, view: View) {
        this.windows.set(name, view)
        view.name = name
        if (this.currentView === undefined)
            this.currentView = view
    }

    active(view: View | string) {
        return this.currentView === view || (typeof view === "string" && this.currentView === this.windows.get(view))
    }

    show(name: string) {
        if (this.currentView !== undefined) {
            Vars.app.stage.removeChild(this.currentView)
            this.currentView.onClose()
            this.currentView = undefined
        }
        if (this.windows.has(name)) {
            this.currentView = this.windows.get(name)!
            Vars.app.stage.addChild(this.currentView!)
            this.currentView!.onShow()
        }
        this.resize()
    }

    timer(dt: number) {
        this.currentView?.onTimer(dt)
    }

    get() {
        return this.currentView
    }

    resize() {
        this.get()?.resize();
    }
}