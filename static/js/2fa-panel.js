"use strict"

const vscode = acquireVsCodeApi()

const copy = (obj) => {
    return JSON.parse(JSON.stringify(obj))
}

const app = Vue.createApp({
    data() {
        return {
            Operation: {
                ReadUserData: "ReadUserData",
                SaveUserData: "SaveUserData",
                ExportUserData: "ExportUserData",
                Init: "Init",
            },
            state: {
                list: [],
                inputData: {
                    name: null,
                    secret: null,
                },
                message: "",
                confirmBtn: false,
                confirmItem: null,
            },
            remain: null,
            timer: null,
        }
    },
    created() {
        this.getState()
        vscode.postMessage({
            operation: this.Operation.Init,
            parameter: {},
        })
        this.setupTimer()
    },
    watch: {
        state: {
            deep: true,
            handler() {
                this.setState()
            }
        }
    },
    methods: {
        getState() {
            let state = vscode.getState()
            if (state) {
                this.state = copy(state)
            }
        },
        setState() {
            vscode.setState(copy(this.state))
        },
        receiveMessage(data) {
            switch (data.operation) {
                case this.Operation.ReadUserData: {
                    this.state.list = data.parameter
                    this.updateCode()
                    break;
                }
            }
        },
        saveUserData() {
            vscode.postMessage({
                operation: this.Operation.SaveUserData,
                parameter: this.state.list.map(i => {
                    return {
                        name: i.name,
                        secret: i.secret,
                    }
                }),
            })
        },
        exportUserData() {
            vscode.postMessage({
                operation: this.Operation.ExportUserData,
                parameter: {},
            })
        },
        async updateCode() {
            for (let i = 0; i < this.state.list.length; i++) {
                let item = this.state.list[i]
                item.code = await this.get2faCode(item.secret)
            }
        },
        async refresh() {
            await this.updateCode()
            this.setupTimer()
        },
        setupTimer() {
            this.remain = 30 - Math.round(new Date().getTime() / 1000 % 30)
            this.timer = setInterval(() => {
                if (this.remain === 0) {
                    clearInterval(this.timer)
                    this.refresh()
                } else {
                    this.remain--
                }
            }, 1000)
        },
        async get2faCode(content) {
            const to_hex = str => {
                const arr = new Uint8Array(Math.ceil(str.length / 2))
                for (let i = 0; i < str.length;) {
                    arr[i / 2] = parseInt(str.slice(i, i += 2), 16)
                }
                return arr
            }

            const base32 = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567"
            let bit = ""
            for (let i = 0; i < content.length; i++) {
                bit += base32.indexOf(content.charAt(i).toUpperCase()).toString(2).padStart(5, "0")
            }
            let hex = ""
            for (var i = 0; i + 4 <= bit.length; i += 4) {
                hex = hex + parseInt(bit.substring(i, i + 4), 2).toString(16);
            }
            const salt = Math.floor(new Date().getTime() / 1000 / 30).toString(16).padStart(16, "0")

            const algorithm = { name: "HMAC", hash: "SHA-1" }
            const key = await crypto.subtle.importKey("raw", to_hex(hex), algorithm, false, ["sign", "verify"])
            const signature = await crypto.subtle.sign(algorithm.name, key, to_hex(salt))

            const encode = Array.from(new Uint8Array(signature)).map(i => i.toString(16).padStart(2, "0")).join("")
            const length = parseInt(encode.substring(encode.length - 1), 16) * 2
            const code_str = "" + (parseInt(encode.substring(length, length + 8), 16) & 0x7FFF_FFFF)
            return code_str.substring(code_str.length - 6, code_str.length)
        },
        saveAction() {
            if (!this.state.inputData.name || this.state.inputData.name.trim() === "") {
                this.state.message = "[Name] is blank."
                return;
            }
            if (!this.state.inputData.secret || this.state.inputData.secret.trim() === "") {
                this.state.message = "[Secret] is blank."
                return;
            }
            let existName = this.state.list.filter(i => i.name === this.state.inputData.name)
            if (existName.length > 0) {
                this.state.message = `[Name] existed.`
                return;
            }

            this.state.list.unshift({
                name: this.state.inputData.name,
                secret: this.state.inputData.secret,
                code: "",
            })
            this.updateCode()
            this.saveUserData()

            this.state.inputData.name = null
            this.state.inputData.secret = null
            this.state.message = ""
        },
        removeAction(row) {
            this.state.confirmItem = row
            this.state.message = `Did you confirm to remove [${row.name}] ? This can not be restored!`
            this.state.confirmBtn = true
        },
        confirmAction() {
            this.state.list = this.state.list.filter(i => i.name !== this.state.confirmItem.name)
            this.saveUserData()
            this.cancelAction()
        },
        cancelAction() {
            this.state.confirmItem = null
            this.state.message = ""
            this.state.confirmBtn = false
        },
    },
})

app.config.compilerOptions.isCustomElement = tag => tag.startsWith("vscode-")

const appInstance = app.mount("#app")

window.addEventListener("message", event => {
    appInstance.receiveMessage(event.data)
})