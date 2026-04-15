import {type MultipleCourse, type Notification, type SingleCourse, type Student, type Teacher, type teacherState } from '@/types/teacher'
import {create} from 'zustand'

export const useTeacherStore = create<teacherState>((set, get) =>({
    teacher: null,
    loading: false,
    students: null,
    singleCourses: null,
    multipleCourses:null,
    notifications: null, 
    setNotifications: (notifications : Notification[]) => set({notifications}),
    setTeacher: (teacher: Teacher) => set({teacher}),
    setStudents: (students : Student[]) => set({students}),
    setSingleCourses :(singleCourses : SingleCourse[]) => set({singleCourses}),
    setMultipleCoures: (multipleCourses : MultipleCourse[]) => set({multipleCourses})
}))