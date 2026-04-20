export interface Student {
    userId: string;
    name: string;
    dob: Date; 
    address: string;
    phone: string;
    gender: string;    
    avatarUrl: string; 
}
export interface CourseRecord {
  courseId: string;
  name: string;
  cost: number;
  summary: string;
  deleted: number;
  teacherId: string;
  rate: number;
  status: string;
  imageUrl: string;
  teacherName: string; 
  isMultiple: string; 
}
export interface StudentState {
    loading: boolean;
    student: Student | null;
    trendingCourses : CourseRecord[] | null,
    newCourses : CourseRecord[] | null 
    setTrendingCourse : (trendingCourses : CourseRecord[]) => void 
    setNewCourse : (newCourses : CourseRecord[]) => void
    setStudent: (student: Student) => void;
    setLoading: (status: boolean) => void;
}