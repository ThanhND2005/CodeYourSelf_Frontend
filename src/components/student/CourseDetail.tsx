import React, { useState } from "react";
import {
  Plus,
  Minus,
  Clock,
  BookOpen,
  MapPin,
  Gauge,
} from "lucide-react";
import { SiSpringboot } from "react-icons/si";
import PaymentDialog from "./PaymentDialog";

const fakeCourse = {
  title: "Java Springboot",
  teacher: "Đào Vũ Đạt",
  price: "Free",
  logo: SiSpringboot,
  logoColor: "#6DB33F",
  difficulty: "Trung bình",
  duration: "9h 30 phút",
  totalLessons: 38,
  description: [
    "Hiểu nền tảng springboot",
    "Xây dựng ứng dụng Web cơ bản",
    "Kết nối cơ sở dữ liệu",
    "Thiết kế kiến trúc Backend chuẩn",
    "Triển khai ứng dụng",
  ],
};

const fakeChapters = [
  {
    id: 1,
    title: "Giới thiệu SpringBoot",
    lessons: [
      "SpringBoot là gì?",
      "Cài đặt môi trường",
      "Project Structure",
      "Dependency Injection",
    ],
  },
  {
    id: 2,
    title: "SpringBoot Web",
    lessons: [
      "REST Controller",
      "Request Mapping",
      "Validation",
      "Exception Handler",
      "DTO Pattern",
    ],
  },
  {
    id: 3,
    title: "Làm việc với Database",
    lessons: [
      "JPA/Hibernate",
      "Repository",
      "MySQL Integration",
      "Transaction",
    ],
  },
  {
    id: 4,
    title: "Service Layer & Architecture",
    lessons: [
      "Layered Architecture",
      "Business Logic",
      "Service Pattern",
      "Mapper",
      "Unit Test",
      "Best Practices",
    ],
  },
  {
    id: 5,
    title: "Security & Authentication",
    lessons: [
      "Spring Security",
      "JWT Authentication",
      "Role Permission",
      "Refresh Token",
      "OAuth2",
    ],
  },
];

export default function CourseDetail() {
  const [expanded, setExpanded] = useState<number[]>([]);

  const toggleChapter = (id: number) => {
    setExpanded((prev) =>
      prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id]
    );
  };

  const toggleExpandAll = () => {
    if (expanded.length === fakeChapters.length) {
      setExpanded([]);
    } else {
      setExpanded(fakeChapters.map((c) => c.id));
    }
  };

  const Logo = fakeCourse.logo;

  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6">
        Chi tiết khóa học:
      </h1>

      <div className="bg-[#fbd8f8] rounded-3xl shadow-lg p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* LEFT SECTION */}
        <div className="lg:col-span-2">
          <h2 className="text-3xl font-bold">
            {fakeCourse.title}
          </h2>

          <p className="text-xl font-semibold mb-4">
            Giáo viên: {fakeCourse.teacher}
          </p>

          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">
              Nội dung khóa học ({fakeChapters.length} chương)
            </h3>

            <button
              onClick={toggleExpandAll}
              className="text-[#851385] font-semibold hover:underline"
            >
              {expanded.length === fakeChapters.length
                ? "Thu gọn tất cả"
                : "Mở rộng tất cả"}
            </button>
          </div>

          <div className="space-y-4">
            {fakeChapters.map((chapter) => {
              const isOpen = expanded.includes(chapter.id);

              return (
                <div
                  key={chapter.id}
                  className="bg-white rounded-2xl shadow-md overflow-hidden"
                >
                  <button
                    onClick={() => toggleChapter(chapter.id)}
                    className="w-full px-5 py-4 flex justify-between items-center hover:bg-gray-50 transition"
                  >
                    <div className="flex items-center gap-4">
                      {isOpen ? (
                        <Minus className="text-[#851385]" />
                      ) : (
                        <Plus className="text-[#851385]" />
                      )}

                      <span className="font-semibold text-lg">
                        {chapter.id}. {chapter.title}
                      </span>
                    </div>

                    <span className="font-semibold text-gray-600">
                      {chapter.lessons.length} bài học
                    </span>
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-4 space-y-2">
                      {chapter.lessons.map((lesson, index) => (
                        <button
                          key={index}
                          className="w-full text-left px-4 py-3 rounded-xl bg-[#fff6ff] hover:bg-[#f7e8f7] transition shadow-sm"
                            
                        >
                          Bài {index + 1}: {lesson}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="p-6 h-fit">
          <div className="flex justify-center mb-4">
            <Logo size={90} color={fakeCourse.logoColor} />
          </div>

        <PaymentDialog>
            <button className="w-full bg-[#851385] hover:bg-[#6a0f6a] text-white py-3 rounded-xl font-semibold mb-6">
                Đăng ký học
            </button>
        </PaymentDialog>

          <h3 className="text-2xl font-bold mb-3">
            Học phí: {fakeCourse.price}
          </h3>

          <div className="mb-5">
            <h4 className="font-bold mb-2">
              Mục tiêu khóa học:
            </h4>

            <ul className="list-decimal pl-5 text-sm space-y-1 font-semibold">
              {fakeCourse.description.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-3 text-sm font-semibold">
            <div className="flex items-center gap-2">
              <Gauge size={18} />
              <span>Độ khó: {fakeCourse.difficulty}</span>
            </div>

            <div className="flex items-center gap-2">
              <Clock size={18} />
              <span>Thời lượng: {fakeCourse.duration}</span>
            </div>

            <div className="flex items-center gap-2">
              <BookOpen size={18} />
              <span>Tổng số bài học: {fakeCourse.totalLessons}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={18} />
              <span>Học mọi lúc, mọi nơi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}