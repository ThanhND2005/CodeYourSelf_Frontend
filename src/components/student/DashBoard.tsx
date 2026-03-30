import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BookOpen, CheckCircle, BarChart } from "lucide-react";

const courses = [
  { name: "ReactJS", progress: 40, color: "bg-indigo-400" },
  { name: "MongoDB", progress: 30, color: "bg-lime-400" },
  { name: "NodeJS", progress: 50, color: "bg-green-500" },
  { name: "Python", progress: 80, color: "bg-pink-500" },
];

const suggested = [
  { name: "Java", color: "bg-red-400" },
  { name: "C++", color: "bg-cyan-400" },
];

const DashBoard = () => {
  return (
    <>
      {/* TIẾN ĐỘ */}
      <div className="bg-[#FBD8F8] p-3 rounded-2xl shadow mb-4">
        <h2 className="mb-3 font-medium text-base">Tiến độ học tập</h2>

        <div className="flex gap-4">
          <button className="flex-1 !bg-yellow-400 text-yellow-900 rounded-xl p-3 text-left hover:scale-[1.02] transition shadow">
            <div className="flex items-center gap-2">
              <BookOpen size={20} />
              <span className="font-semibold">Khóa đang học</span>
            </div>
            <p className="text-4xl font-bold mt-1">5</p>
          </button>

          <button className="flex-1 !bg-green-400 text-green-900 rounded-xl p-3 text-left hover:scale-[1.02] transition shadow">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} />
              <span className="font-semibold">Khóa hoàn thành</span>
            </div>
            <p className="text-4xl font-bold mt-1">8</p>
          </button>

          <div className="flex-1 bg-orange-300 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <BarChart size={20} />
              <span className="font-semibold">Tiến độ tổng hợp</span>
            </div>
            <p className="text-4xl font-bold mt-1">40%</p>
          </div>
        </div>

        <div className="flex justify-center mt-3">
          <span className="text-[#851385] cursor-pointer font-semibold text-sm">
            Xem tất cả
          </span>
        </div>
      </div>

      {/* COURSES + SUGGEST */}
      <div className="flex gap-6">
        <div className="flex-1 bg-[#FBD8F8] p-4 rounded-2xl shadow flex flex-col justify-between">
          <div>
            <h2 className="mb-4 font-medium">Khóa học của tôi</h2>

            <div className="grid grid-cols-2 gap-4">
              {courses.map((course) => (
                <div
                  key={course.name}
                  className={cn(
                    "p-4 rounded-xl text-white shadow",
                    course.color
                  )}
                >
                  <h3 className="font-semibold">{course.name}</h3>
                  <p className="text-sm">
                    Tiến độ: {course.progress}%
                  </p>

                  <Button className="mt-3 !bg-[#FBD8F8] text-[#851385]">
                    Tiếp tục
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <span className="text-[#851385] cursor-pointer font-semibold">
              Xem tất cả
            </span>
          </div>
        </div>

        <div className="w-[260px] bg-[#FBD8F8] p-4 rounded-2xl shadow flex flex-col justify-between">
          <div>
            <h2 className="mb-4 font-medium">Khóa học đề xuất</h2>

            <div className="flex flex-col gap-4">
              {suggested.map((item) => (
                <div
                  key={item.name}
                  className={cn(
                    "p-4 rounded-xl text-white shadow",
                    item.color
                  )}
                >
                  <h3 className="font-semibold">{item.name}</h3>

                  <Button className="mt-3 !bg-[#FBD8F8] text-[#851385]">
                    Xem trước
                  </Button>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-4">
            <span className="text-[#851385] cursor-pointer font-semibold">
              Xem tất cả
            </span>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashBoard;