import {
    Dialog,
    DialogContent,
    DialogTrigger,
  } from "@/components/ui/dialog";
import { StudentService } from "@/services/StudentService";
import { useCourseStore } from "@/stores/useCourseStore";
import { useTabStudentStore } from "@/stores/useTabStore";
import { LoaderCircle } from "lucide-react";
import { useEffect } from "react";
  
  interface PaymentDialogProps {
    children: React.ReactNode;
  }
  

  
  export default function PaymentDialog3({
    children,
  }: PaymentDialogProps) {
    const {payment} = useCourseStore()
    const {setTabActive} = useTabStudentStore()
    useEffect(()=>{
      if(!payment) return 
      let interval : ReturnType<typeof setInterval>
      if(payment.status == "PENDING"){
        interval = setInterval( async () =>{
          try {
            console.log(payment.paymentId)
            const payment2 = await StudentService.getBillSingleCourse2(payment.paymentId)
            if(payment2 && payment2.status == "SUCCESS"){
              await StudentService.PaymentSuccessRoadmap(payment.paymentId)
              setTabActive('profile')
              clearInterval(interval)
            }
          } catch (error) {
            console.error(error)
          }
        },3000)
      }
      return () => {
        if(interval) { 
          clearInterval(interval)
        }
      }
    },[payment?.status, payment?.paymentId])
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
                Khóa học tự xây dựng
              </h2>
  
              <p className="text-lg font-medium">
                Bao gồm nhiều giáo viên
              </p>
            </div>
  
            <div className="border-b border-[#851385]" />
  
            {/* COURSE OVERVIEW */}
            <div className="space-y-2 text-lg">
              <h3 className="font-bold text-xl">
                Tổng quan về khóa học:
              </h3>
  
            
  
           
  
              <p>
                + Giá: {payment?.amount} vnđ
              </p>
            </div>
  
            <div className="border-b border-[#851385]" />
  
            {/* PAYMENT DETAIL */}
            <div className="space-y-4 flex flex-col items-center">
              <h3 className="font-bold text-xl self-start">
                Chi tiết thanh toán:
              </h3>
              {payment ?( <img
                src= {payment?.qrUrl}
                alt="QR Payment"
                className="w-44 h-44 border-2 border-[#851385] p-2 rounded-xl object-contain"
              /> ):(<LoaderCircle className="w-20 h-20 animate-spin"/>) }
              
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