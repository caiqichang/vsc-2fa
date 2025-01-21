const vscode = acquireVsCodeApi()

const copy = obj => obj ? JSON.parse(JSON.stringify(obj)) : obj

const getEditorColorTheme = theme => {
    return ({
        "Light": "vs",
        "Dark": "vs-dark",
        "HighContrast": "hc-black",
        "HighContrastLight": "hc-light",
    })[theme];
}

const exportFile = (content, fileName) => {
    let i = content.length;
    let buffer = new Uint8Array(i)
    while (i--) {
        buffer[i] = content.charCodeAt(i)
    }

    let a = document.createElement("a")
    a.href = URL.createObjectURL(new Blob([buffer], { type: "multipart/example" }))
    a.download = fileName
    a.click()
}