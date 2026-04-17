import {type adminState, type Course, type DashboardNotificationDTO, type Notification, type Payment, type Student, type Teacher, type WaitCourse } from "@/types/admin";

import { create } from "zustand";



export const useAdminStore = create<adminState>((set,get)=>({
    students : null,
    teachers: null,
    courses : null,
    payments: null,
    waitCourses :null,
    receivedNotifications : null,
    notifications: null,
    waitMultipleCourses : null,
    setWaitMultipleCourse: (waitMultipleCourses : WaitCourse[]) => set({waitMultipleCourses}),
    setNotifications: (notifications : Notification[]) => set({notifications}),
    setReceivedNotificatons : (receivedNotifications : DashboardNotificationDTO[]) => set({receivedNotifications}),
    setWaitCourses : (waitCourses: WaitCourse[]) => set({waitCourses}),
    setPayments: (payments : Payment[]) => set({payments}), 
    setCourses : (courses : Course[]) => set({courses}),
    setTeachers : (teachers : Teacher[]) => set({teachers}),
    setStudents : (students : Student[]) => set({students})
}))