import { create } from 'zustand'
import { toast } from 'sonner'
import type { authState } from '@/types/store'
import { authService } from '@/services/authService'


export const useAuthStore = create<authState>((set, get) => ({
    accessToken: null,
    user: null,
    loading: false,
    setAccessToken: (accessToken) => {
        set({ accessToken })
    },
    setLoading : (loading) =>{
        set({loading})
    },
    clearState: () => {
        set({ accessToken: null })
        set({ user: null })
        set({ loading: false })
    },
    signup: async (name, address, dob, gender, username, password, role) => {
        try {
            set({ loading: true })
            await authService.signUP(name, address, dob, gender, username, password, role)
            toast.success("Đăng ký tài khoản thành công !")
        } catch (error) {
            console.error(error)
            toast.error("Đăng ký tài khoản thất bại !")
        }
        finally {
            set({ loading: false })
        }
    },
    signin: async (username, password) => {
        try {
            set({ loading: true })
            const { accessToken } = await authService.signIn(username, password)
            set({ accessToken })
            await get().getMe()
            toast.success("Đăng nhập thành công !")
        } catch (error) {
            console.error(error)
            toast.error("Đăng nhập thất bại !")
        }
        finally {
            set({ loading: false })
        }
    },
    signinAdmin: async (username, password) => {
        try {
            set({ loading: true })
            const { accessToken } = await authService.signInadmin(username, password)
            set({ accessToken })
            await get().getMe()
            toast.success("Đăng nhập thành công !")
        } catch (error) {
            console.error(error)
            toast.error("Đăng nhập thất bại !")
        }
        finally {
            set({ loading: false })
        }
    },
    signinTeacher : async (username, password) =>{
        try {
            set({ loading: true })
            const { accessToken } = await authService.signinTeacher(username, password)
            set({ accessToken })
            await get().getMe()
            toast.success("Đăng nhập thành công !")
        } catch (error) {
            console.error(error)
            toast.error("Đăng nhập thất bại !")
        }
        finally
        {
            set({ loading: false })
        }
    },
    signout: async () => {
        try {
            set({ loading: true })
            set({accessToken : null,user: null})
            await authService.signOut()
            toast.success("Đăng xuất thành công !")
        } catch (error) {
            console.error(error)
            toast.error("Đăng xuất thất bại !")
        }
        finally {
            set({ loading: false })
        }
    },
    getMe: async () => {
        try {
            set({ loading: true })
            const user = await authService.getMe()
            set({ user })
        } catch (error) {
            console.error(error)
            get().clearState()
            toast.error("Lấy thông tin thất bại !")
        }
        finally {
            set({ loading: false })
        }
    },
    refresh: async () => {
        try {
            set({ loading: true })
            const { user, getMe } = get()
            const accessToken = await authService.refresh()
            set({accessToken})
            if(!user)
            {
               await getMe()
            }
        } catch (error) {
            console.error(error)
            get().clearState()
        }
        finally {
            set({ loading: false })
        }
    }
}))