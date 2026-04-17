import api from '../lib/axios'

export const TeacherService = {
    getInformation : async (userId: string) =>{
        const res = await api.get(`/teacher/getInformation/${userId}`,{withCredentials: true})
        return res.data
    },
    patchInformation : async (userId: string,name: string, dob: Date,address: string,phone: string, gender: string, bankName: string, bankAccount: string) =>{
        await api.patch(`/teacher/patchInformation/${userId}`,{name,dob,address,phone,gender,bankName,bankAccount},{withCredentials: true})
    },
    postCourse : async (userId: string, name: string, cost: number, summary: string) =>{
        await api.post(`/teacher/postCourse/${userId}`,{name, cost,summary},{withCredentials: true})
    },
    postMultipleCourse : async (userId: string, name: string, cost: number, summary: string) =>{
        await api.post(`/teacher/postMultipleCourse/${userId}`,{name, cost,summary},{withCredentials: true})
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
        await api.patch(`/teacher/patchAvatar/${userId}`,formData,{withCredentials: true})
    },
    patchImageCourse : async(courseId: string, image: File) =>{
        const formData = new FormData()
        formData.append('image',image)
        await api.patch(`/teacher/patchImageCourse/${courseId}`,formData,{withCredentials: true})
    },
    patchImageMultipleCourse : async(courseId: string, image: File) =>{
        const formData = new FormData()
        formData.append('image2',image)
        await api.patch(`/teacher/patchImageMultipleCourse/${courseId}`,formData,{withCredentials: true})
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
    },
    postNotification : async(teacherId: string, title: string, content: string) => {
        await api.post(`/teacher/postNotification/${teacherId}`,{title,content},{withCredentials: true})
    },
    getNotifications : async(teacherId: string) =>{
        const res = await api.get(`/teacher/getNotifications/${teacherId}`,{withCredentials: true})
        return res.data
    },
    deleteNotification : async(notificationId : string)=>{
        await api.patch(`/teacher/deleteNotification/${notificationId}`,{},{withCredentials: true})
    },
    patchCourse: async (courseId: string, name: string, cost: number, summary: string) =>{
        await api.patch(`/teacher/patchCourse/${courseId}`,{name, cost,summary},{withCredentials: true})
    },
    patchMultipleCourse : async(courseId: string, name: string, cost: number, summary: string) =>{
        await api.patch(`/teacher/patchMultipleCourse/${courseId}`,{name, cost, summary},{withCredentials: true})
    },
    addCourse : async (courseId: string, multipleCourseId: string) =>{
        await api.patch(`/teacher/addCourse/${multipleCourseId}`,{courseId},{withCredentials: true})
    },
    removeCourse: async (courseId: string) =>{
        await api.patch(`/teacher/removeCourse`,{courseId},{withCredentials: true})
    },
    getVideo : async (courseId: string)=>{
        const res = await api.get(`/teacher/getVideo/${courseId}`,{withCredentials: true})
        return res.data
    },
    getStats : async (teacherId: string) =>{
        const res  = await api.get(`/teacher/monthly-stats/${teacherId}`,{withCredentials: true})
        return res.data
    },
    deleteMultipleCourse : async (courseId: string) =>{
        await api.patch(`/teacher/deleteMultipleCourse/${courseId}`,{},{withCredentials : true})
    },
    deleteStudent : async (courseId: string, studentId: string) =>{
        await api.patch('/teacher/deleteStudent',{courseId,studentId},{withCredentials: true})
    },
    patchTeacher : async (teacherId : string, name: string, dob: Date,address: string, phone: string, gender:string)=>{
        await api.patch(`/teacher/patchTeacher/${teacherId}`,{name, dob,address,phone, gender},{withCredentials: true})
    }
}