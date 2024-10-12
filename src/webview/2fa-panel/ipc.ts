import vscode from "vscode"
import * as userData from "../../component/user-data"

class TfaIpc {
    private constructor() {

    }

    private static _instance = new TfaIpc()

    public static instance(): TfaIpc {
        return this._instance
    }

    private panel: vscode.WebviewPanel | null = null

    private query: string | null = null

    public setQuery(query: string) {
        this.query = query
    }

    public setWebview(panel: vscode.WebviewPanel) {
        this.panel = panel
        this.panel.webview.onDidReceiveMessage((message: Message) => {
            switch (message.operation) {
                case Operation.Init: {
                    this.sendMessage({
                        operation: Operation.ReadUserData,
                        parameter: userData.readUserData(),
                    })
                    break;
                }
                case Operation.SaveUserData: {
                    this.sendMessage({
                        operation: Operation.ReadUserData,
                        parameter: userData.writeUserData(message.parameter as Array<userData.UserData>),
                    })
                    break;
                }
                case Operation.ExportUserData: {
                    userData.exportUserData()
                    break;
                }
            }
        })
    }

    private sendMessage(message: Message) {
        this.panel?.webview?.postMessage(message)
    }
}

enum Operation {
    ReadUserData = "ReadUserData",
    SaveUserData = "SaveUserData",
    ExportUserData = "ExportUserData",
    Init = "Init",
}

interface Message {
    operation: Operation,
    parameter: unknown,
}

export {
    TfaIpc,
}