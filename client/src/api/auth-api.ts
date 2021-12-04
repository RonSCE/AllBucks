import $api ,{AuthResponse,AuthMeResponse} from "./api"
export default class AuthService {
    static async login(cid: string, password: string) {
        return $api.post<AuthResponse>('/auth/login', {cid, password}).then(res => res.data)
    }

    static async register(cid: string, password: string,name:string){
        return $api.post<AuthResponse>('/auth/register', {cid, password,name}).then(res => res.data)
    }
    static async me(){
        return $api.get<AuthMeResponse>('/auth/me').then(res => res.data)
    }
    static async staffRegister(cid: string, password: string,name:string, type:string){
        return $api.post<AuthMeResponse>('/auth/staff-register', {cid, password,name,type}).then(res => res.data)
    }
}