import type { Payment } from "./course";

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
    avatarUrl: string,
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

export interface WaitCourse{
  courseId: string,
  name: string,
  cost: string,
  summary: string,
  teacherId: string,
  teacherName: string,
  imageUrl: string,
  status: string
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
export interface Salary {
  salaryId: string;
  createdAt: string;
  amount: number;
  teacherId: string;
  status: string; // "PAID" | "PENDING"
  qrUrl: string;
  periodMonth: number;
  periodYear: number;
}

export interface adminState {
    students: Student[] | null,
    teachers: Teacher[] | null,
    courses : Course[] | null,
    payments : Payment[] | null,
    waitCourses : WaitCourse[] | null,
    waitMultipleCourses : WaitCourse[] | null,
    notifications : Notification[] | null,
    receivedNotifications: DashboardNotificationDTO[] | null,
    salary : Salary[] | null 
    setSalary : (salary : Salary[]) => void
    setWaitMultipleCourse : (waitMultipleCourses : WaitCourse[]) => void
    setNotifications : (notifications: Notification[]) => void
    setReceivedNotificatons : (receivedNotifications : DashboardNotificationDTO[]) => void,
    setWaitCourses: (waitCourses : WaitCourse[]) => void,
    setPayments : (payments : Payment[]) => void,
    setCourses: (courses : Course[]) => void
    setTeachers: (teachers : Teacher[]) => void
    setStudents : (students : Student[]) => void
}