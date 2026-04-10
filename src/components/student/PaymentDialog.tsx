import {
    Dialog,
    DialogContent,
    DialogTrigger,
  } from "@/components/ui/dialog";
  
  interface PaymentDialogProps {
    children: React.ReactNode;
  }
  
  const mockPaymentData = {
    courseName: "Khóa học OOP với Java",
    teacher: "Đào Vũ Đạt",
    totalChapters: 7,
    totalLessons: 56,
    totalVideos: 49,
    totalExercises: 7,
    duration: "12h 30p",
    price: "800k",
  };
  
  export default function PaymentDialog({
    children,
  }: PaymentDialogProps) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>
  
        <DialogContent className="max-w-[650px] rounded-3xl p-8">
          <div className="space-y-6">
  
            {/* HEADER */}
            <div>
              <h2 className="text-2xl font-bold">
                {mockPaymentData.courseName}
              </h2>
  
              <p className="text-lg font-medium">
                Thầy: {mockPaymentData.teacher}
              </p>
            </div>
  
            <div className="border-b border-[#851385]" />
  
            {/* COURSE OVERVIEW */}
            <div className="space-y-2 text-lg">
              <h3 className="font-bold text-xl">
                Tổng quan về khóa học:
              </h3>
  
              <p>+ {mockPaymentData.totalChapters} chương</p>
  
              <p>
                + {mockPaymentData.totalLessons} bài học:
                {" "}
                {mockPaymentData.totalVideos} video +{" "}
                {mockPaymentData.totalExercises} bài tập
              </p>
  
              <p>
                + Thời lượng: {mockPaymentData.duration}
              </p>
  
              <p>
                + Giá: {mockPaymentData.price}
              </p>
            </div>
  
            <div className="border-b border-[#851385]" />
  
            {/* PAYMENT DETAIL */}
            <div className="space-y-4 flex flex-col items-center">
              <h3 className="font-bold text-xl self-start">
                Chi tiết thanh toán:
              </h3>
  
              <img
                src="https://res.cloudinary.com/dlzg0btqt/image/upload/v1775838606/609991dc-e549-4ccb-b899-ac49d31cb4d1_yygily.jpg"
                alt="QR Payment"
                className="w-44 h-44 border-2 border-[#851385] p-2 rounded-xl object-contain"
              />
  
              <p className="text-sm text-gray-500 text-center">
                Vui lòng quét mã QR để thanh toán.
                <br />
                Hệ thống sẽ tự động xác nhận giao dịch.
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }