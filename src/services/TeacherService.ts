import api from '../lib/axios'

export const TeacherService = {
    getInformation : async (userId: string) =>{
        const res = await api.get(`/teacher/getInformation/${userId}`,{withCredentials: true})
        return res.data
    },
    patchInformation : async (userId: string,name: string, dob: Date,address: string,phone: string, gender: string, bankName: string, bankAccount: string) =>{
        await api.patch(`/teacher/patchInformation/${userId}`,{name,dob,address,phone,gender,bankName,bankAccount},{withCredentials: true})
    },
    postCourse : async (userId: string, name: string, cost: string, summary: string) =>{
        await api.post(`/teacher/postCourse/${userId}`,{name, cost,summary},{withCredentials: true})
    },
    addVideo : async (courseId: string, name: string, video: File) =>{
        const formData = new FormData()
        formData.append('video',video)
        formData.append('name',name)
        await api.post(`/teacher/addVideo/${courseId}`,formData,{withCredentials: true})
    },
    deleteCourse: async (courseId: string) =>{
        await api.patch(`/teacher/deleteCourse/${courseId}`,{},{withCredentials: true})
    },
    getStudents : async (courseId: string) =>{
        const res = await api.get(`/teacher/getStudents/${courseId}`,{withCredentials: true})
        return res.data
    },
    postComment : async (courseId: string, userId: string, content: string) =>{
        await api.post(`/teacher/postComment/${courseId}`,{userId,content},{withCredentials: true})
    },
    patchAvatar : async (userId: string, avatar: File) =>{
        const formData = new FormData()
        formData.append('avatar',avatar)
        await api.patch(`/patchAvatar/${userId}`,formData,{withCredentials: true})
    },
    getStudentsByTeacher : async (teacherId : string) =>{
        const res = await api.get(`/teacher/getStudentsByTeacher/${teacherId}`,{withCredentials: true})
        return res.data
    },
    getSingleCourses : async (teacherId: string) =>{
        const res = await api.get(`/teacher/getSingleCourses/${teacherId}`,{withCredentials: true})
        return res.data
    },
    getMultipleCourses : async (teacherId: string) =>{
        const res = await api.get(`/teacher/getMultipleCourses/${teacherId}`,{withCredentials: true})
        return res.data
    }
}