import { StudentService } from "@/services/Student";
import { useCourseStore } from "@/stores/useCourseStore";
import { useTabStudentStore } from "@/stores/useTabStore";
import React from "react";

const CourseSearch = () => {
  const courseSearchs = useCourseStore((s) => s.courseSearchs);
  const multipleCourseSearchs = useCourseStore((s) => s.multipleCourseSearchs)
  const {setTabActive} = useTabStudentStore()
  const {setMultipleCourse,setCourses,setCourse,setVideos} = useCourseStore()
  const onClickCourse = async (courseId : string) =>{
      const {course} = await StudentService.getDetailCourse(courseId)
      const {videos} = await StudentService.getCoursePaid(courseId)
      setCourse(course)
      setVideos(videos)
      setTabActive('coursedetail2')
  }
  const onClickMultiple = async (multipleCourseId : string) =>{
      console.log(multipleCourseId)
      const {multipleCourse} = await StudentService.getDetailMultipleCourse(multipleCourseId)
      const {courses} = await StudentService.getDetailCourses(multipleCourseId)
      setMultipleCourse(multipleCourse)
      setCourses(courses)
      setTabActive('coursedetail')
  }
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Các khóa học đơn trong hệ thống:</h1>
      <ul className="grid grid-cols-4 gap-6">
        {courseSearchs?.map((course) => (
          <li key={course.courseId} onClick={() => onClickCourse(course.courseId)}>
            <div className="flex flex-col bg-white h-100 shadow-md rounded-2xl transition-all duration-300 ease-in-out hover:scale-105 ">
              <div className="flex h-50 rounded-t-2xl overflow-hidden items-center justify-center">
                <img
                  src={course.imageUrl}
                  alt="logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col flex-1 p-5">
                <div className="flex flex-col space-y-1">
                  <span className="text-xl font-bold text-gray-800 line-clamp-2 leading-tight">
                    {course.name}
                  </span>
                  <span className="text-sm text-black font-bold">
                    Giáo viên: {course.teacherName}
                  </span>
                  <span className="text-sm text-gray-500">
                    ⭐ Đánh giá: {Math.floor(course.rate)}/5
                  </span>
                </div>
                <div className="mt-auto pt-4 border-t border-gray-50">
                    <div className="h-[1px] w-full bg-gray-400 my-4"></div>
                  <span className="text-xl font-semibold text-green-600">
                    Giá: {course.cost.toLocaleString()} vnđ
                  </span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
      <h1 className="text-2xl font-bold mb-6 mt-6">Các khóa tổng quát trong hệ thống:</h1>
      <ul className="grid grid-cols-4 gap-6">
        {multipleCourseSearchs?.map((course) => (
          <li key={course.multipleCourseId} onClick={() => onClickMultiple(course.multipleCourseId)}>
            <div className="flex flex-col bg-white h-100 shadow-md rounded-2xl transition-all duration-300 ease-in-out hover:scale-105 ">
              <div className="flex justify-center items-center h-50 rounded-t-2xl overflow-hidden">
                <img
                  src={course.imageUrl}
                  alt="logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col flex-1 p-5">
                <div className="flex flex-col space-y-1">
                  <span className="text-xl font-bold text-gray-800 line-clamp-2 leading-tight">
                    {course.name}
                  </span>
                  <span className="text-sm text-black font-bold">
                    Giáo viên: {course.teacherName}
                  </span>
                  <span className="text-sm text-gray-500">
                    ⭐ Đánh giá: {Math.floor(course.rate)}/5
                  </span>
                </div>
                <div className="mt-auto pt-4 border-t border-gray-50">
                    <div className="h-[1px] w-full bg-gray-400 my-4"></div>
                  <span className="text-xl font-semibold text-green-600">
                    Giá: {course.cost.toLocaleString()} vnđ
                  </span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CourseSearch;
