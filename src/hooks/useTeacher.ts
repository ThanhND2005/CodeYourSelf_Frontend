import { TeacherService } from "@/services/TeacherService";
import { useQuery } from "@tanstack/react-query";



export const useNotificationCourse = () =>{
    return useQuery({
        queryKey:['notification','course'],
        queryFn: TeacherService.getNotificationCourse,
        staleTime: -1
    })
}