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
    },
    
    getInformation : async (userId: string) =>{
        const res = await api.get(`/student/getInformation/${userId}`, {withCredentials: true})
        return res.data
    },

    patchInformation : async (
        userId: string, 
        name: string, 
        dob: Date, 
        address: string, 
        phone: string, 
        gender: string
    ) => {
        await api.patch(
            `/student/patchInformation/${userId}`, 
            { name, dob, address, phone, gender }, 
            { withCredentials: true }
        )
    },

    patchAvatar : async (userId: string, avatar: File) =>{
        const formData = new FormData()
        formData.append('avatar', avatar)
        await api.patch(`/student/patchAvatar/${userId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
            withCredentials: true
        })
    }
}