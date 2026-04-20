import { create } from 'zustand';
import { type Student, type StudentState } from '@/types/student';

export const useStudentStore = create<StudentState>((set) => ({
    student: null,
    loading: false,

    setStudent: (student: Student) => set({ student }),
    setLoading: (loading: boolean) => set({ loading }),
    clearStudent: () => set({ student: null })
}));