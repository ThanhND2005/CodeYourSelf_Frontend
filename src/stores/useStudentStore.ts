import { create } from 'zustand';
import { type CourseRecord, type Student, type StudentState } from '@/types/student';

export const useStudentStore = create<StudentState>((set) => ({
    student: null,
    loading: false,
    trendingCourses : null,
    newCourses:null,
    setTrendingCourse: (trendingCourses : CourseRecord[]) => set({trendingCourses}),
    setNewCourse: (newCourses : CourseRecord[]) => set({newCourses}),
    setStudent: (student: Student) => set({ student }),
    setLoading: (loading: boolean) => set({ loading }),
    clearStudent: () => set({ student: null })
}));