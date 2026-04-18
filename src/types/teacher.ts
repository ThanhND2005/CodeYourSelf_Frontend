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
    courseId: string, 
    studentId: string, 
    status: string, 
    createdAt : Date,
    progress: number, 
    name: string, 
    avatarUrl: string
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
        imageUrl:string,
        status: string
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
export interface Course {
  courseId: string;           
  name: string;              
  cost: number;               
  summary: string;            
  deleted: number;           
  teacherId: string;          
  rate: number | null;        
  multipleCourseId: string;   
  status: string;             
  imageUrl: string | null;   
}
export interface MultipleCourse2 {
  multipleCourseId: string;   
  name: string;              
  cost: number;               
  sumary: string | null;      
  deleted: number;            
  rate: number | null;       
  teacherId: string;         
  imageUrl: string | null;  
  status: string;             
}
export interface MonthlyIncomeStat {
  id: string;
  periodMonth: number;
  periodYear: number;
  isCurrent: boolean;
  totalCoursesSold: number;
  totalProfit: number;       
  commission: number;        
  bestSellingCourse: Course; 
  highestCourseSales: number;
  newStudents: number;       
}
export interface ReplyMock {
  replyId: string;
  commentId: string;
  userId: string;
  content: string;
  createdAt: string;
  userName: string;
  avatarUrl?: string;
}
export interface CommentMock {
  commentId: string;
  courseId: string;
  userId: string;
  content: string;
  createdAt: string;
  
  userName: string;
  avatarUrl?: string;
  
}
export interface teacherState {
    loading: boolean,
    teacher:Teacher | null,
    students: Student[] | null,
    singleCourses: SingleCourse[] | null,
    multipleCourses: MultipleCourse[] | null,
    notifications: Notification[] | null 
    videos : Video[] | null
    stats : MonthlyIncomeStat[] | null
    course: Course | null 
    comments : CommentMock[] | null 
    replies : ReplyMock[] | null
    setComment : (comments : CommentMock[]) => void
    setReply : (replies : ReplyMock[]) => void
    setCourse: (course: Course) => void
    setStats : (stats : MonthlyIncomeStat[]) => void
    setNotifications: (notifications : Notification[]) => void
    setTeacher : (teacher : Teacher) => void
    setStudents : (students : Student[]) => void
    setSingleCourses: (singleCourses : SingleCourse[]) => void 
    setMultipleCoures : (multipleCourses: MultipleCourse[]) => void
    setVideos : (videos : Video[]) => void
}