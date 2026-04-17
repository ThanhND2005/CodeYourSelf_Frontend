

export interface Student {
    userId: string, 
    name: string, 
    dob: Date, 
    address: string, 
    phone: string,
    gender: string, 
    avatarUrl: string,
}

export interface Teacher {
    userId: string,
    name: string,
    dob: Date,
    address: string,
    phone: string,
    gender: string,
    createdAt: Date,
}
export interface Course{
    courseId: string, 
    name: string, 
    cost: number,
    summary: string, 
    teacherId: string, 
    rate: number, 
    multipleCourseId: string, 
    imageUrl: string,
}
export interface Payment{
    paymentId: string, 
    createdAt: Date,
    amount: number,
    courseId: string,
    courseName: string,
    studentId: string,
    studentName: string,
    qrUrl: string,
    status: string,
    periodMonth : number, 
    periodYear: number
}
export interface WaitCourse{
  courseId: string,
  name: string,
  cost: string,
  summary: string,
  teacherId: string,
  teacherName: string,
}
export interface DashboardNotificationDTO {
  id: string;              
  message: string;         
  createdAt: string;       
  senderAvatarUrl: string; 
}
export interface Notification {
  notificationId: string;
  senderId: string;
  receiverId: string;
  receiverRole: string;
  title: string;
  content: string;
  createdAt: string;
}
export interface adminState {
    students: Student[] | null,
    teachers: Teacher[] | null,
    courses : Course[] | null,
    payments : Payment[] | null,
    waitCourses : WaitCourse[] | null,
    notifications : Notification[] | null,
    receivedNotifications: DashboardNotificationDTO[] | null,
    setNotifications : (notifications: Notification[]) => void
    setReceivedNotificatons : (receivedNotifications : DashboardNotificationDTO[]) => void,
    setWaitCourses: (waitCourses : WaitCourse[]) => void,
    setPayments : (payments : Payment[]) => void,
    setCourses: (courses : Course[]) => void
    setTeachers: (teachers : Teacher[]) => void
    setStudents : (students : Student[]) => void
}