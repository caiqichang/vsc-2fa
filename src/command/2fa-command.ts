import { TfaPanel } from "../webview/2fa-panel/index"
import * as command from "./index"

const action = (command: command.CommandName, args: any[]) => {
    TfaPanel.instance().showPanel(command, args)
}

export {
    action,
}