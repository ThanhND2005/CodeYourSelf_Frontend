import { StudentService } from '@/services/StudentService'
import { useCourseStore } from '@/stores/useCourseStore'
import {useQuery} from '@tanstack/react-query'


export const useTrendingCourses = () =>{
    return useQuery({
        queryKey : ['couses','trending'],
        queryFn : StudentService.getTrendingCourse,
        staleTime: 5*60*1000
    })
}
export const useNewCourses = () => {
    return useQuery({
        queryKey: ['courses','new'],
        queryFn : StudentService.getNewCourse,
        staleTime: 5*60*100
    })
}
export const useVideo = () =>{
    
    return useQuery({
        queryKey : ['course','videos'],
        queryFn : () => StudentService.getCoursePaid(useCourseStore.getState().course?.courseId as string),
        staleTime : 0
    })
}
export const useLessonProgress = () =>{
    return useQuery({
        queryKey : ['course','lessonProgress'],
        queryFn : () => StudentService.getLessonProgress(useCourseStore.getState().course?.courseId as string),
        staleTime : Infinity
    })
}
export const useMultipleCourse = () =>{
    return useQuery({
        queryKey : ['course','multiple'],
        queryFn : StudentService.getMultipleCourseByStudentId,
        staleTime: Infinity
    })
}