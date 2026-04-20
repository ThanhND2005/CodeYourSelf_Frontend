import api from '../lib/axios'

export const StudentService = {
    searchCourse : async (searchTerm : string) =>{
        const res = await api.get(`/student/searchCourse`,{params: {searchTerm},withCredentials: true})
        return res.data
    },
    getDetailMultipleCourse : async (multipleCourseId : string) =>{
        const res = await api.get(`/student/getDetailMultipleCourse/${multipleCourseId}`,{withCredentials: true})
        return res.data
    },
    getDetailCourse : async (courseId : string) =>{
        const res = await api.get(`/student/getDetailCourse/${courseId}`,{withCredentials: true})
        return res.data
    },
    getDetailCourses : async (courseId : string) =>{
        const res = await api.get(`/student/getDetailCourses/${courseId}`,{withCredentials: true})
        return res.data
    },
    getCoursePaid : async (courseId: string) =>{
        const res = await api.get(`/student/getCoursePaid/${courseId}`,{withCredentials: true})
        return res.data
    }
}