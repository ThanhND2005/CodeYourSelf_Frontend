import React from "react";
import { FaJava } from "react-icons/fa";
import { SiSpringboot } from "react-icons/si";

const coursesInProgress = [
  {
    id: 1,
    title: "Java Basic",
    price: "Free",
    teacher: "Đào Vũ Đạt",
    progress: 85,
    icon: FaJava,
    color: "#f89820",
  },
  {
    id: 2,
    title: "Java Springboot",
    price: "Free",
    teacher: "Đào Vũ Đạt",
    progress: 45,
    icon: SiSpringboot,
    color: "#6DB33F",
  },
  {
    id: 3,
    title: "Advanced Java Core",
    price: "1tr",
    teacher: "Đào Vũ Đạt",
    progress: 20,
    icon: FaJava,
    color: "#f89820",
  },
];

const coursesCompleted = [
  {
    id: 4,
    title: "Java",
    price: "2tr",
    teacher: "Đào Vũ Đạt",
    icon: FaJava,
    color: "#f89820",
  },
  {
    id: 5,
    title: "OOP với Java",
    price: "800k",
    teacher: "Đào Vũ Đạt",
    icon: FaJava,
    color: "#f89820",
  },
];

export default function StudyProgress() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Tiến độ học tập
      </h1>

      <div className="bg-[#fbd8f8] rounded-2xl p-6 shadow-lg">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* LEFT COLUMN */}
          <div className="flex flex-col">
            <h2 className="text-xl font-semibold mb-4">
              Đang trong tiến độ
            </h2>

            <div className="flex flex-col gap-4">
              {coursesInProgress.map((course) => {
                const Icon = course.icon;

                return (
                  <div
                    key={course.id}
                    className="bg-white rounded-xl p-4 shadow-md flex justify-between items-center hover:shadow-lg transition-all duration-200"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Icon
                          size={30}
                          color={course.color}
                        />
                        <h3 className="font-semibold text-lg">
                          {course.title}
                        </h3>
                      </div>

                      <p className="text-sm">
                        Học phí: {course.price}
                      </p>
                      <p className="text-sm">
                        Giáo viên: {course.teacher}
                      </p>

                      <p className="text-sm mt-2">
                        Tiến độ: {course.progress}%
                      </p>

                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-pink-500 h-2 rounded-full transition-all duration-500"
                          style={{
                            width: `${course.progress}%`,
                          }}
                        />
                      </div>
                    </div>

                    <button className="ml-4 bg-[#fbd8f8] text-[#851385] px-4 py-2 rounded-lg text-sm hover:opacity-80">
                      Tiếp tục
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="flex flex-col border-l lg:pl-6">
            <h2 className="text-xl font-semibold mb-4">
              Đã hoàn thành
            </h2>

            <div className="flex flex-col gap-4">
              {coursesCompleted.map((course) => {
                const Icon = course.icon;

                return (
                  <div
                    key={course.id}
                    className="bg-white rounded-xl p-4 shadow-md flex justify-between items-center hover:shadow-lg transition-all duration-200"
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <Icon
                          size={30}
                          color={course.color}
                        />
                        <h3 className="font-semibold text-lg">
                          {course.title}
                        </h3>
                      </div>

                      <p className="text-sm">
                        Học phí: {course.price}
                      </p>
                      <p className="text-sm">
                        Giáo viên: {course.teacher}
                      </p>

                      <p className="text-sm text-green-600 font-medium">
                        Đã hoàn thành
                      </p>
                    </div>

                    <button className="ml-4 bg-[#fbd8f8] text-[#851385] px-4 py-2 rounded-lg text-sm hover:opacity-80">
                      Xem lại
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}