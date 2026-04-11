import { type CourseState, type CourseSearch, type MultipleCourseSearch, type Course, type MultipleCourse, type Video } from '@/types/course'
import {create} from 'zustand'


export const useCourseStore = create<CourseState>((set,get)=>({
    courseSearchs: null,
    multipleCourseSearchs: null,
    course : null,
    multipleCourse: null,
    courses : null,
    videos: null,
    setCourseSearch: (courses : CourseSearch[]) => set({courseSearchs: courses}),
    setMultipleCourseSearch: (courses : MultipleCourseSearch[]) => set({multipleCourseSearchs : courses}),
    setCourse : (course : Course) => set({course}),
    setMultipleCourse: (course : MultipleCourse) => set({multipleCourse : course}),
    setCourses : (courses : Course[]) => set({courses}),
    setVideos: (videos : Video[]) => set({videos})
}))