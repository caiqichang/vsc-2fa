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
                    
                    break;
                }
            }
        },
        async refresh() {

        },
        async setupTimer() {
            this.remain = 30 - Math.round(new Date().getTime() / 1000 % 30)
            this.timer = setInterval(() => {
                if (this.remain === 0) {
                    clearInterval(this.timer)
                    this.refresh()
                } else {
                    this.remain--
                }
            }, 1000)
        }
    },
})

app.config.compilerOptions.isCustomElement = tag => tag.startsWith("vscode-")

const appInstance = app.mount("#app")

window.addEventListener("message", event => {
    appInstance.receiveMessage(event.data)
})