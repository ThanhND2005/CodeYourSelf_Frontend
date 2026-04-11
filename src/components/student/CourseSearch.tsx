import { useCourseStore } from "@/stores/useCourseStore";
import React from "react";

const CourseSearch = () => {
  const courseSearchs = useCourseStore((s) => s.courseSearchs);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Các khóa học đơn trong hệ thống:</h1>
      <ul className="grid grid-cols-4 gap-6">
        {courseSearchs?.map((course) => (
          <li key={course.courseId}>
            <div className="flex flex-col bg-white h-100 shadow-md rounded-2xl transition-all duration-300 ease-in-out hover:scale-105 ">
              <div className="h-50 rounded-t-2xl overflow-hidden">
                <img
                  src={course.imageUrl}
                  alt="logo"
                  className="w-full object-cover"
                />
              </div>
              <div className="flex flex-col flex-1 p-5">
                <div className="flex flex-col space-y-1">
                  <span className="text-xl font-bold text-gray-800 line-clamp-2 leading-tight">
                    {course.name}
                  </span>
                  <span className="text-sm text-gray-500">
                    ⭐ Đánh giá: {course.rate}/5
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
