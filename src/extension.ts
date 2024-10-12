import vscode from "vscode"
import * as tfaCommand from "./command/2fa-command"
import { App } from "./util/app"
import * as command from "./command/index"

const activate = (context: vscode.ExtensionContext) => {
    App.instance().setContext(context);

    [
        {
            command: command.CommandName.tfa,
            handler: tfaCommand.action
        },
    ].forEach(i => {
        vscode.commands.registerCommand(i.command, (args) => i.handler(i.command, args))
    })
}

export {
    activate,
}