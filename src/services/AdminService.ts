import api from "@/lib/axios";

export const AdminServices ={
    getStudents : async () =>{
        const res = await api.get(`/admin/getStudents`,{withCredentials: true})
        return res.data
    },
    getStudentsPaginated : async (page: number = 1, limit: number = 10) =>{
        const res = await api.get(`/admin/getStudentsPaginated`,{params: {page, limit}, withCredentials: true})
        return res.data
    },
    deleteStudent : async (studentId : string) =>{
        await api.patch(`/admin/deleteStudent/${studentId}`,{},{withCredentials: true})
    },
    getTeachers : async () => {
        const res = await api.get(`/admin/getTeachers`,{withCredentials: true})
        return res.data
    },
    getTeachersPaginated : async (page: number = 1, limit: number = 10) => {
        const res = await api.get(`/admin/getTeachersPaginated`,{params: {page, limit}, withCredentials: true})
        return res.data
    },
    deleteTeacher : async (teacherId: string) =>{
        await api.patch(`/admin/deleteTeacher/${teacherId}`,{},{withCredentials: true})
    },
    getNotificaitons : async () =>{
        const res = await api.get(`/admin/getNotifications`,{withCredentials: true})
        return res.data
    },
    deleteNotification : async (notificationId: string) =>{
        await api.patch(`/admin/deleteNotification/${notificationId}`,{},{withCredentials: true})
    },
    getWaitCourses : async () =>{
        const res = await api.get(`/admin/getWaitCourses`,{withCredentials: true})
        return res.data
    },
    getStudentBills : async () =>{
        const res = await api.get(`/admin/getStudentBills`,{withCredentials: true})
        return res.data
    },
    postSalary : async () =>{
        await api.post(`/admin/postSalary`,{},{withCredentials: true})
    },
    getSalary : async () => {
        const res = await api.get(`/admin/getSalary`,{withCredentials: true})
        return res.data
    },
    deleteStudentBill : async (paymentId: string) =>{
        await api.patch(`/admin/deleteStudentBill/${paymentId}`,{},{withCredentials: true})
    },
    acceptWaitCourse : async (courseId: string) =>{
        await api.patch(`/admin/acceptWaitCourse/${courseId}`,{},{withCredentials:true})
    },
    acceptWaitMultipleCourse : async (courseId: string) =>{
        await api.patch(`/admin/acceptWaitMultipleCourse/${courseId}`,{},{withCredentials:true})
    },
    denyWaitCourse : async (courseId: string) =>{
        await api.delete(`/admin/denyWaitCourse/${courseId}`,{withCredentials: true})
    },
    denyWaitMultipleCourse : async (courseId: string) =>{
        await api.delete(`/admin/denyWaitMultipleCourse/${courseId}`,{withCredentials: true})
    },
    postStudentBill : async (courseId: string, studentId: string, amount: number) =>{
        await api.post(`/admin/postStudentBill`,{courseId,studentId,amount},{withCredentials: true})
    },
    getCourses : async () =>{
        const res = await api.get(`/admin/getCourses`,{withCredentials: true})
        return res.data
    },
    ReceiveNotification : async () =>{
        const res = await api.get(`/admin/ReceiveNotification`,{withCredentials: true})
        return res.data
    },
    postNotification : async (role: string, title: string, content: string) =>{
        await api.post(`/admin/postNotification`,{role,title,content},{withCredentials: true})
    },
    patchTeacher : async (teacherId : string, name: string, dob: Date,address: string, phone: string, gender:string)=>{
        await api.patch(`/admin/patchTeacher/${teacherId}`,{name, dob,address,phone, gender},{withCredentials: true})
    },
    getWaitMultipleCourses : async () => {
        const res = await api.get(`/admin/getWaitMultipleCourses`,{withCredentials: true})
        return res.data
    },
    getTeacherBill : async (salaryId : string) =>{
        const res = await api.get(`/admin/getTeacherBill/${salaryId}`,{withCredentials: true})
        return res.data.salary
    }
}