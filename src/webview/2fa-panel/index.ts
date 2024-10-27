import * as common from "../../util/common"
import vscode from "vscode"
import * as command from "../../command/index"
import * as fileUtil from "../../util/file-util"
import { TfaIpc } from "./ipc"

class TfaPanel {
    private constructor() {

    }
    private static _instance = new TfaPanel()

    public static instance(): TfaPanel {
        return this._instance
    }

    private panel: vscode.WebviewPanel | null = null

    private initPanel = () => {
        this.panel = common.createWebviewPanel("2faPanel", "2FA")
        this.panel.onDidDispose(() => this.panel = null)
        this.panel.iconPath = common.createUri("/resources/logo.png")
        this.panel.webview.html = fileUtil.readExtensionFile("static/2fa-panel.html").toString()
            .replaceAll("${extensionPath}", common.createWebviewUri(this.panel, "").toString())
            .replaceAll("${version}", Math.random().toString())
        TfaIpc.instance().setWebview(this.panel)
    }

    public showPanel = (cmd: command.CommandName, args: any[]) => {
        if (this.panel === null) {
            this.initPanel()
        } else if (!this.panel.visible) {
            this.panel.reveal()
        }
    }
}

export {
    TfaPanel,
}