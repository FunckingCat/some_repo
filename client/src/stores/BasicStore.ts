// import { makeAutoObservable } from "mobx"
// import { AxiosInstance } from "axios";
import axios from "utils/api"

abstract class BasicStore {
    rootStore
    api
    status = "initial" as "initial" | "pending" | "success" | "error" | "forbidden";
    error = null as string | null;

    constructor(rootStore?: any) {
        this.rootStore = rootStore;

        // not working yet
        this.api = axios.create({
            baseURL: process.env.REACT_APP_BASE_URL || "http://localhost:8080/api",
        });
        this.api.interceptors.request.use((request) => { this.statusPending(); return request }, (err) => { this.statusError(); throw err });
        this.api.interceptors.response.use((response) => { this.statusSuccess(); return response }, (err) => { this.statusError(); throw err });
    }

    statusPending = () => { this.status = "pending" }
    statusSuccess = () => { this.status = "success" }
    statusError = () => { this.status = "error" }
    statusForbidden = () => { this.status = "forbidden" }
}

export default BasicStore

// current template

// import { makeSimpleAutoObservable } from "utils/mobx-extensions"
// import { action } from "mobx";
// import { api } from "utils/api"
// import BasicStore from "./BasicStore"

// class NameStore extends BasicStore {
//     constructor(...args: any[]) {
//         super(...args);
//         makeSimpleAutoObservable(this);
//     }
// }

// export default NameStore;