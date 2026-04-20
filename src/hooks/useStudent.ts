import { StudentService } from "@/services/StudentService"
import { useQuery } from "@tanstack/react-query"


export const useNotifcations = () => {
    return useQuery({
        queryKey : ['student','notification'],
        queryFn : StudentService.getNotification,
        staleTime : 5*60*1000
    })
}
export const useProgressCourse = () => {
    return useQuery({
        queryKey : ['student','progressCourse'],
        queryFn: StudentService.getProgressCourse,
        staleTime: 5*60*1000
    })
}