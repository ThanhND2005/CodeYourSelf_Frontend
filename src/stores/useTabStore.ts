import {type tabStudent } from '@/types/tab'
import {create} from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'


export const useTabStudentStore  = create<tabStudent>()(
    persist(
        (set, get) =>({
            tabActive : 'dashboard',
            setTabActive: (tab : string) => set({tabActive : tab})
        }),
        {
            name:'tab-student',
        }
    )
    
)