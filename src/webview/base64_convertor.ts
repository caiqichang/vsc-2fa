import vscode from "vscode"
import { initWebviewPanel } from "../util/webview_panel_util"

class base64_convertor {
    private panel: vscode.WebviewPanel | null = null

    private key = "base64_convertor"
    
    private initPanel = () => {
        initWebviewPanel(this.key, "Base64 Convertor", `static/${this.key}.html`)
    }
    
    public showPanel = () => {
        if (this.panel === null) {
            this.initPanel()
        }else if (!this.panel.visible) {
            this.panel.reveal()
        }
    }
}
const instance = new base64_convertor()

export default {
    commandName: "base64",
    showPanel: instance.showPanel,
}