import React from "react";

const userData = {
  name: "Bùi Hồng Phong",
  dob: "31/07/2005",
  address: "Hà Nội",
  gender: "Nam",
  avatarUrl: "https://i.pravatar.cc/150"
};

const courses = [
  {
    coureId: 1,
    courseName: "Java Springboot",
    cost: 0,
    teacherName: "Đào Vũ Đạt",
    progress: 70
  },
  {
    id: 2,
    courseName: "ReactJS cơ bản",
    price: "500.000đ",
    teacher: "Nguyễn Văn A",
    progress: 40
  }
];

export default function Profile() {
  return (
    <div className="p-6">
      
      {/* CARD */}
      <div
        className="p-6 rounded-2xl shadow"
        style={{
          background: "linear-gradient(135deg, #FBD8F8, #ffffff)"
        }}
      >
        <div className="flex gap-8">

          {/* LEFT */}
          <div className="w-1/3 flex flex-col items-center text-center">
            <img
              src={userData.avatarUrl}
              alt="avatar"
              className="w-40 h-40 rounded-full object-cover border-4 border-white shadow"
            />

            <h2 className="mt-4 text-xl font-semibold text-[#851385]">
              {userData.name}
            </h2>

            <button className="mt-4 px-4 py-2 rounded-lg bg-[#851385] text-white">
              Edit Profile
            </button>
          </div>

          {/* RIGHT */}
          <div className="flex-1">

            {/* INFO */}
            <div className="bg-white p-4 rounded-xl shadow mb-6">
              <h3 className="font-semibold text-[#851385] mb-3">
                Thông tin cá nhân
              </h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><b>Ngày sinh:</b> {userData.dob}</div>
                <div><b>Giới tính:</b> {userData.gender}</div>
                <div><b>Địa chỉ:</b> {userData.address}</div>
              </div>
            </div>

            {/* COURSE LIST */}
            <div className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-semibold text-[#851385] mb-4">
                Khóa học của bạn
              </h3>

              <div className="space-y-4">
                {courses.map((course) => (
                  <div
                    key={course.id}
                    className="p-4 border rounded-xl hover:shadow transition"
                  >
                    <div className="font-medium text-[#851385]">
                      {course.courseName}
                    </div>

                    <div className="text-sm text-gray-600 mt-1">
                      Giáo viên: {course.teacher}
                    </div>

                    <div className="text-sm text-gray-600">
                      Học phí: {course.price}
                    </div>

                    {/* PROGRESS */}
                    <div className="mt-2">
                      <div className="text-xs mb-1">
                        Tiến độ: {course.progress}%
                      </div>

                      <div className="w-full bg-gray-200 h-2 rounded-full">
                        <div
                          className="h-2 rounded-full bg-[#851385]"
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}