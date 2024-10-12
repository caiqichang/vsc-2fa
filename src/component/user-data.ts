import * as common from "../util/common"
import { App } from "../util/app"

const key = "user-data"

interface UserData {
    name: string,
    key: string,
}

const readUserData = (): Array<UserData> => {
    return (App.instance().getContext()?.globalState.get(key) ?? []) as Array<UserData>
}

const writeUserData = (content: Array<UserData>) => {
    App.instance().getContext()?.globalState.update(key, content)
}

const exportUserData = () => {
    common.exportToFile(JSON.stringify(readUserData(), null, 4), "2fa.json")
}

export {
    key,
    UserData,
    readUserData,
    writeUserData,
    exportUserData,
}