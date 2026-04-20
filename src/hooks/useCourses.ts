import { StudentService } from '@/services/StudentService'
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