import { type CourseState, type CourseSearch } from '@/types/course'
import {create} from 'zustand'


export const useCourseStore = create<CourseState>((set,get)=>({
    courseSearchs: null,
    setCourseSearch: (courses : CourseSearch[]) => set({courseSearchs: courses}),

}))