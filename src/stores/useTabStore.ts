import {type tabStudent, type tabTeacher } from '@/types/tab'
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
export const useTabTeacherStore  = create<tabTeacher>()(
    persist(
        (set, get) =>({
            tabActive : 'dashboard',
            setTabActive: (tab : string) => set({tabActive : tab})
        }),
        {
            name:'tab-teacher',
        }
    )
    
)