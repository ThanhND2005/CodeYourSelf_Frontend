export interface Teacher {
    userId: string, 
    name: string, 
    dob: Date,
    address: string,
    phone: string,
    gender: string,
    createdAt: Date,
    bankName: string,
    bankAccount: string,
    avatarUrl: string,
}
export interface Student {
    userId : string,
    name: string,
    couseId: string, 
    courseName: string,
}
export interface SingleCourse{
    courseId: string, 
        name: string, 
        cost: number, 
        summary:string, 
        deleted:number, 
        teacherId:string, 
        rate:number, 
        multipleCourseId:string, 
        status:string, 
        imageUrl:string
}
export interface MultipleCourse{
    multipleCourseId: string, 
        name:string, 
        cost:number, 
        summary: string, 
        deleted:number, 
        rate: number, 
        teacherId: string, 
        imageUrl:string
}
export interface Notification {
    senderId: string, 
    receiverId: string,
    notificationId: string, 
    title: string, 
    content: string, 
    createdAt: Date
}
export interface Video{
    courseId: string, 
    name: string,
    videoId: string, 
    videoUrl: string, 
}
export interface teacherState {
    loading: boolean,
    teacher:Teacher | null,
    students: Student[] | null,
    singleCourses: SingleCourse[] | null,
    multipleCourses: MultipleCourse[] | null,
    notifications: Notification[] | null 
    videos : Video[] | null
    setNotifications: (notifications : Notification[]) => void
    setTeacher : (teacher : Teacher) => void
    setStudents : (students : Student[]) => void
    setSingleCourses: (singleCourses : SingleCourse[]) => void 
    setMultipleCoures : (multipleCourses: MultipleCourse[]) => void
    setVideos : (videos : Video[]) => void
}