export interface CourseSearch {
    courseId: string, 
    name: string,
    cost: number, 
    imageUrl: string,
    rate: number
}
export interface CourseState {
    courseSearchs : CourseSearch[] | null 
    setCourseSearch : (courses : CourseSearch[]) => void
}