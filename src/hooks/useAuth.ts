import { StudentService } from '@/services/StudentService'
import { useAuthStore } from '@/stores/useAuthStore'
import {useQuery} from '@tanstack/react-query'


export const useStudentInfor = () =>{
    const user = useAuthStore.getState().user
    return useQuery({
        queryKey: ['auth','student'],
        queryFn: () =>  StudentService.getInformation(user?.userId as string),
        staleTime: Infinity
    })
}