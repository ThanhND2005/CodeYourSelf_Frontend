export interface CourseSearch {
    courseId: string, 
    name: string,
    cost: number, 
    imageUrl: string,
    rate: number,
    teacherName: string
}
export interface MultipleCourseSearch {
    multipleCourseId: string, 
    name: string,
    cost: number, 
    imageUrl: string,
    rate: number,
    teacherName: string,
}
export interface Course {
    courseId: string,
    name: string,
    cost: number,
    imageUrl: string,
    summary: string,
    teacherId: string,
    teacherName: string,
    rate: number,
    multipleCourseId: string,
    lessons: Video[]
}
export interface Video {
    courseId: string, 
    name: string, 
    videoUrl: string
}
export interface MultipleCourse{
    multipleCourseId: string,
    name: string,
    cost: number,
    imageUrl: string,
    sumary: string,
    teacherId: string,
    rate: number,
}
export interface CourseState {
    courseSearchs : CourseSearch[] | null 
    multipleCourseSearchs : MultipleCourseSearch[] | null
    course: Course | null
    multipleCourse: MultipleCourse | null
    courses : Course[] | null
    videos : Video[]| []
    setCourseSearch : (courses : CourseSearch[]) => void
    setMultipleCourseSearch : (courses : MultipleCourseSearch[]) => void 
    setCourse : (course : Course) => void
    setMultipleCourse : (course : MultipleCourse) => void
    setCourses : (courses : Course[]) => void
    setVideos: (videos : Video[]) => void
}