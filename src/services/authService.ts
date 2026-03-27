import api from "@/lib/axios";


export const authService = {
    signUP : async (name : string, address : string, dob: Date,gender: string,username: string,password:string,role: string) =>{
        const res = await api.post('/auth/signup',{name,address,dob,gender,username,password,role},{withCredentials:true})
        return res.data
    },
    signIn : async (username : string, password : string) =>{
        const res = await api.post('/auth/signin',{username,password},{withCredentials: true})
        return res.data
    },
    signInadmin : async(username : string, password: string) =>{
        const res = await api.post('/auth/signinAdmin',{username,password},{withCredentials:true})
        return res.data
    },
    signinTeacher : async(username : string,password: string) =>{
        const res = await api.post('/auth/signinTeacher',{username,password},{withCredentials:true})
        return res.data
    },
    signOut : async () =>{
        return api.post('/auth/signout',{},{withCredentials: true})
    },
    getMe :async () =>{
        const res = await api.get('/auth/authme',{withCredentials:true})
        return res.data.user 
    },
    refresh : async () =>{
        const res = await api.post('/auth/refresh',{},{withCredentials: true})
        return res.data.accessToken
    }
}