import {type Course, type MonthlyIncomeStat, type MultipleCourse, type Notification, type SingleCourse, type Student, type Teacher, type teacherState, type Video } from '@/types/teacher'
import {create} from 'zustand'

export const useTeacherStore = create<teacherState>((set, get) =>({
    teacher: null,
    loading: false,
    students: null,
    singleCourses: null,
    multipleCourses:null,
    notifications: null, 
    videos : null,
    stats : null,
    course: null,
    setCourse : (course: Course) => set({course}),
    setStats : (stats : MonthlyIncomeStat[]) => set({stats}),
    setVideos : (videos : Video[]) => set({videos}),
    setNotifications: (notifications : Notification[]) => set({notifications}),
    setTeacher: (teacher: Teacher) => set({teacher}),
    setStudents: (students : Student[]) => set({students}),
    setSingleCourses :(singleCourses : SingleCourse[]) => set({singleCourses}),
    setMultipleCoures: (multipleCourses : MultipleCourse[]) => set({multipleCourses})
}))