import vscode from "vscode"
import { App } from "../util/app"
import * as fileUtil from "../util/file-util"

const getEditorSelection = (): string => {
    return vscode.window.activeTextEditor?.document.getText(vscode.window.activeTextEditor?.selection) ?? ""
}

const showError = (content: unknown) => {
    console.error(content)
    vscode.window.showErrorMessage(content as string)
}

const showNotification = (content: string) => {
    vscode.window.showInformationMessage(content)
}

const showStatusBar = (content: string) => {
    vscode.window.setStatusBarMessage(content)
}

const showModal = (content: string) => {
    vscode.window.showInformationMessage("2FA", {
        modal: true,
        detail: content,
    })
}

const readPackageJson = (): any => {
    App.instance().getContext()?.extension?.packageJSON
}

const createWebviewPanel = (id: string, title: string): vscode.WebviewPanel => {
    return vscode.window.createWebviewPanel(id, title,
        vscode.window.activeTextEditor ? vscode.ViewColumn.Beside : vscode.ViewColumn.Active,
        {
            enableScripts: true,
            enableFindWidget: true,
            retainContextWhenHidden: true,
            localResourceRoots: [vscode.Uri.file(App.instance().getContext()?.extensionPath ?? "")],
        },
    )
}

const createWebviewUri = (webviewPanel: vscode.WebviewPanel, subpath: string): vscode.Uri => {
    return webviewPanel.webview.asWebviewUri(createUri(subpath))
}

const createWebviewViewUri = (webviewView: vscode.WebviewView, subpath: string): vscode.Uri => {
    return webviewView.webview.asWebviewUri(createUri(subpath))
}

const createUri = (subpath: string): vscode.Uri => {
    return vscode.Uri.file(`${App.instance().getContext()?.extensionPath ?? ""}${subpath}`)
}

const exportToFile = (content: string, fileName: string) => {
    vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
    }).then(uri => {
        if (uri && uri.length > 0) {
            let path = `${uri[0].fsPath}/${fileName}`
            fileUtil.writeFile(path, content)
            showNotification(`Export to file ${path}`)
        }
    })
}

const escapeHtml = (content: string) => {
    return content.replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll('\'', '&#39;')
}

const getColorTheme = () => {
    return ({
        1: "Light",
        2: "Dark",
        3: "HighContrast",
        4: "HighContrastLight",
    })[vscode.window.activeColorTheme.kind];
}

export {
    getEditorSelection,
    readPackageJson,
    showError,
    showNotification,
    showStatusBar,
    showModal,
    createWebviewPanel,
    createWebviewUri,
    createUri,
    exportToFile,
    escapeHtml,
    createWebviewViewUri,
    getColorTheme,
}