import api from '../lib/axios'

export const StudentService = {
    searchCourse : async (searchTerm : string) =>{
        const res = await api.get(`/student/searchCourse`,{params: {searchTerm},withCredentials: true})
        return res.data.courseSearchs
    }
}