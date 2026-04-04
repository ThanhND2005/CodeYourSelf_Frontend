import { cn } from "@/lib/utils";
import {
  Users,
  UserCheck,
  BookOpen,
  DollarSign,
  ClipboardList,
  FileText,
  Wallet,
} from "lucide-react";

const stats = [
  {
    title: "Tổng học viên",
    value: 165,
    icon: Users,
    color: "bg-green-300 text-green-900",
  },
  {
    title: "Tổng giáo viên",
    value: 24,
    icon: UserCheck,
    color: "bg-blue-300 text-blue-900",
  },
  {
    title: "Tổng khóa học",
    value: 34,
    icon: BookOpen,
    color: "bg-purple-300 text-purple-900",
  },
  {
    title: "Tổng doanh số",
    value: "82tr VND",
    icon: DollarSign,
    color: "bg-pink-300 text-pink-900",
  },
];

const pending = [
  {
    title: "Yêu cầu duyệt khóa học",
    count: 5,
    icon: BookOpen,
    color: "bg-green-200",
  },
  {
    title: "Đơn đăng kí ứng tuyển giáo viên",
    count: 2,
    icon: FileText,
    color: "bg-indigo-200",
  },
  {
    title: "Yêu cầu rút tiền",
    count: 3,
    icon: Wallet,
    color: "bg-orange-200",
  },
];

const users = [
  {
    title: "Học viên",
    count: 165,
    icon: Users,
    color: "bg-green-300",
  },
  {
    title: "Giáo viên",
    count: 24,
    icon: UserCheck,
    color: "bg-indigo-300",
  },
];

const activities = [
  "Đã đăng ký khóa NodeJS",
  "Yêu cầu duyệt khóa python cơ bản",
  "Đã đăng ký khóa C++",
  "Duyệt yêu cầu rút tiền",
  "Đăng ký khóa C++",
];

const DashBoard = () => {
  return (
    <div className="space-y-6">

      {/* HEADER TEXT */}
      <h1 className="text-xl font-semibold">Xin chào Admin!</h1>

      {/* STATS */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.title}
              className={cn(
                "p-4 rounded-xl shadow flex justify-between items-center hover:scale-[1.02] transition",
                item.color
              )}
            >
              <div>
                <p className="text-sm">{item.title}</p>
                <p className="text-2xl font-bold">{item.value}</p>
              </div>
              <Icon size={32} />
            </button>
          );
        })}
      </div>

      {/* MAIN CONTENT */}
      <div className="flex gap-6">

        {/* LEFT */}
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-2 gap-4">

          <div className="bg-[#FBD8F8] p-5 rounded-2xl shadow">
            <h2 className="mb-4 font-medium text-lg">Chờ phê duyệt</h2>

            <div className="space-y-4">
              {pending.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl shadow",
                      item.color
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={22} />
                      <span className="font-medium">{item.title}</span>
                    </div>

                    <span className="text-xl font-bold bg-white px-3 py-1 rounded-lg">
                      {item.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* USER MANAGEMENT */}
          <div className="bg-[#FBD8F8] p-5 rounded-2xl shadow">
            <h2 className="mb-4 font-medium text-lg">Quản lý người dùng</h2>

            <div className="space-y-4">
              {users.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-xl shadow",
                      item.color
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={22} />
                      <span className="font-medium">{item.title}</span>
                    </div>

                    <span className="font-semibold bg-white px-3 py-1 rounded-lg">
                      {item.count}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
          </div>
          {/* PENDING */}
        </div>
      </div>
    </div>
  );
};

export default DashBoard;