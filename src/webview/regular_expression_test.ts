import vscode from "vscode"
import { initWebviewPanel } from "../util/webview_panel_util"

class regular_expression_test {
    private panel: vscode.WebviewPanel | null = null

    private key = "regular_expression_test"
    
    private initPanel = () => {
        initWebviewPanel(this.key, "Regular Expression Test", `static/${this.key}.html`)
    }
    
    public showPanel = () => {
        if (this.panel === null) {
            this.initPanel()
        }else if (!this.panel.visible) {
            this.panel.reveal()
        }
    }
}
const instance = new regular_expression_test()

export default {
    commandName: "regexp",
    showPanel: instance.showPanel,
}