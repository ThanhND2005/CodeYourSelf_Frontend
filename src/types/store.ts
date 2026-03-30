
export interface User {
    userid : string, 
    role : 'admin' | 'teacher' | 'parent',
}
export interface authState {
    accessToken : string|null,
    user : User | null,
    loading : boolean,
    setLoading : (loading : boolean) => void
    setAccessToken : (accessToken : string) => void
    clearState : () => void
    signup :(name : string, address : string, dob: Date,gender: string,username: string,password:string,role: string) => Promise<void>
    signin :(username : string, password : string) => Promise<void>
    signinAdmin :(username : string, password : string) => Promise<void>
    signinTeacher: (username: string, password: string) => Promise<void>
    signout :() => Promise<void>
    getMe: () => Promise<void>
    refresh: () => Promise<void>
}