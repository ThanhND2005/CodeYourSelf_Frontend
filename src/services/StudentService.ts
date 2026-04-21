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
        return res.data.videos
    },
    
    getInformation : async (userId: string) =>{
        const res = await api.get(`/student/getInformation/${userId}`, {withCredentials: true})
        return res.data.student
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
    },
    getNewCourse : async () =>{
        const res = await api.get(`/student/getNewCourse`,{withCredentials: true})
        return res.data.newCourses
    },
    getTrendingCourse : async () =>{
        const res = await api.get(`/student/getTrendingCourse`,{withCredentials : true})
        return res.data.trendingCourses
    },
    getNotification : async () => {
        const res = await api.get('/student/getNotification',{withCredentials: true})
        return res.data.notifications
    },
    getProgressCourse : async() => {
        const res = await api.get('/student/getProgressCourse',{withCredentials: true})
        return res.data.progressCourse
    },
    patchCourse : async (courseId: string, rate: number) =>{
        await api.patch('/student/patchCourse',{courseId,rate},{withCredentials: true})
    },
    getLessonProgress : async (courseId : string)=>{
        const res = await api.get(`/student/getLessonProgress/${courseId}`,{withCredentials: true})
        return res.data.progress
    },
    SyncProgress : async (videoId: string, currentTime : number, isCompleted : boolean) =>{
        await api.patch(`/student/SyncProgress`,{videoId,currentTime,isCompleted},{withCredentials: true})
    },
    patchCourseProgress : async (courseId : string) =>{
        await api.patch(`/student/patchCourseProgress/${courseId}`,{},{withCredentials: true})
    }
}