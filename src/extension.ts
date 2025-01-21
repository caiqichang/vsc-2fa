import vscode from "vscode"
import * as tfaCommand from "./command/2fa-command"
import { App } from "./util/app"
import * as command from "./command/index"
import base64_convertor from "./webview/base64_convertor"
import regular_expression_test from "./webview/regular_expression_test"

const activate = (context: vscode.ExtensionContext) => {
    App.instance().setContext(context);

    [
        {
            command: command.CommandName.tfa,
            handler: tfaCommand.action
        },
    ].forEach(i => {
        vscode.commands.registerCommand(i.command, (args) => i.handler(i.command, args))
    });

    [
        {
            command: base64_convertor.commandName,
            handler: base64_convertor.showPanel,
        },
        {
            command: regular_expression_test.commandName,
            handler: regular_expression_test.showPanel,
        },
    ].forEach(i => {
        vscode.commands.registerCommand(i.command, () => i.handler())
    });
}

export {
    activate,
}