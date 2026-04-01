import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Users, BookOpen, Pencil } from "lucide-react";

const myCourses = [
  { name: "Web design basic", color: "bg-green-300" },
  { name: "2D Games", color: "bg-indigo-400" },
  { name: "3D Games", color: "bg-pink-400" },
  { name: "Mobile app", color: "bg-amber-300" },
];

export default function DashBoard  ()  {
  return (
    <>
    <div className="flex flex-col gap-6">

      {/* STATS dạng button */}
      <div className="flex gap-6">

        <button className="flex-1 bg-yellow-300 text-yellow-900 rounded-2xl p-4 text-left shadow hover:scale-[1.02] transition">
          <div className="flex items-center gap-2">
            <Users size={20} />
            <span className="font-semibold">Học viên của tôi</span>
          </div>
          <p className="text-3xl font-bold mt-2">30</p>
        </button>

        <button className="flex-1 bg-green-300 text-green-900 rounded-2xl p-4 text-left shadow hover:scale-[1.02] transition">
          <div className="flex items-center gap-2">
            <BookOpen size={20} />
            <span className="font-semibold">Khóa học đã đăng</span>
          </div>
          <p className="text-3xl font-bold mt-2">12</p>
        </button>

      </div>

      {/* COURSES FULL WIDTH */}
      <div className="bg-[#E6C3E8] p-6 rounded-2xl shadow">
        <h2 className="mb-4 text-lg font-semibold">Khóa học của tôi</h2>

        <div className="flex flex-col gap-4">
          {myCourses.map((course) => (
            <div
              key={course.name}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl shadow",
                course.color
              )}
            >
              <div className="flex items-center gap-3">
                <BookOpen />
                <span className="font-semibold text-lg">
                  {course.name}
                </span>
              </div>

              <Button className="!bg-[#FBD8F8] text-[#851385] flex items-center gap-2">
                <Pencil size={16} /> Sửa
              </Button>
            </div>
          ))}
        </div>
      </div>

    </div>
    </>
  );
};

