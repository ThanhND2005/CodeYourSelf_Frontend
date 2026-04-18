import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TeacherService } from "@/services/TeacherService";
import { useTeacherStore } from "@/stores/useTeacherStore";

// --- SCHEMAS TÁCH BIỆT ---
const commentSchema = z.object({
  content: z.string().trim().min(1, "Bình luận không được để trống"),
});

const replySchema = z.object({
  content: z.string().trim().min(1, "Phản hồi không được để trống"),
});

type CommentFormValues = z.infer<typeof commentSchema>;
type ReplyFormValues = z.infer<typeof replySchema>;

// --- MOCK DATA TYPES ---
interface ReplyMock {
  replyId: string;
  commentId: string;
  userId: string;
  content: string;
  createdAt: string;
  userName: string;
  avatarUrl?: string;
}


interface CommentDialogProps {
  open: boolean;
  onClose: () => void;
  courseId?: string;
}

// Giả lập Database chứa tất cả phản hồi trên server


export default function CommentDialog({ open, onClose, courseId }: CommentDialogProps) {
  // 1. STATE BÌNH LUẬN CHÍNH
  const {comments,setComment} = useTeacherStore()

  // 2. STATE PHẢN HỒI (Lưu trữ phản hồi theo commentId)
  const [repliesMap, setRepliesMap] = useState<Record<string, ReplyMock[]>>({});
  // Quản lý xem bình luận nào đang được mở form phản hồi
  const [activeReplyId, setActiveReplyId] = useState<string | null>(null);

  // 3. CẤU HÌNH FORM BÌNH LUẬN
  const commentForm = useForm<CommentFormValues>({
    resolver: zodResolver(commentSchema),
    defaultValues: { content: "" },
  });

  // 4. CẤU HÌNH FORM PHẢN HỒI
  const replyForm = useForm<ReplyFormValues>({
    resolver: zodResolver(replySchema),
    defaultValues: { content: "" },
  });

  if (!open) return null;

  // --- HÀM XỬ LÝ: KHI BẤM NÚT PHẢN HỒI ---
  const handleOpenReply = async (commentId: string) => {
    // Nếu bấm lại vào chính nó thì đóng lại
    if (activeReplyId === commentId) {
      setActiveReplyId(null);
      replyForm.reset();
      return;
    }

    setActiveReplyId(commentId);
    replyForm.reset(); // Clear form mỗi khi mở bình luận khác

    // Giả lập gọi API lấy danh sách phản hồi khớp với mã bình luận (commentId)
    if (!repliesMap[commentId]) {
      // Hàm filter này mô phỏng câu query: SELECT * FROM Reply WHERE commentId = ?
      const {replies} = await TeacherService.getReply(commentId)
      
      setRepliesMap((prev) => ({
        ...prev,
        [commentId]: replies,
      }));
    }
  };

  // --- HÀM XỬ LÝ: SUBMIT BÌNH LUẬN MỚI ---
  const onSubmitComment = async (data: CommentFormValues) => {
    const userId = useTeacherStore.getState().teacher?.userId as string
    const courseId1 = useTeacherStore.getState().course?.courseId as string
    try {
      await TeacherService.postComment(courseId1,userId,data.content)
      const {comments : comments1} = await TeacherService.getComment(courseId1)
      setComment(comments1)
    } catch (error) {
      console.error(error)
    }finally{
      commentForm.reset();

    }
  };

  // --- HÀM XỬ LÝ: SUBMIT PHẢN HỒI MỚI ---
  const onSubmitReply = async (data: ReplyFormValues) => {
    if (!activeReplyId) return;
    const userId = useTeacherStore.getState().teacher?.userId as string
    try {
      await TeacherService.postReply(activeReplyId, userId,data.content)
      const {replies} = await TeacherService.getReply(activeReplyId)
      setRepliesMap((prev) => ({
        ...prev,
        [activeReplyId]: [...(prev[activeReplyId] || []), replies],
      }));
    } catch (error) {
      console.error(error)
    }

    // Cập nhật lại danh sách phản hồi của commentId đó

    replyForm.reset();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        className="bg-white w-[650px] h-[600px] rounded-2xl p-5 flex flex-col border border-[#851385] shadow-2xl animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="text-lg font-semibold text-[#851385] mb-4">
          Bình luận khóa học
        </div>

        {/* FORM 1: TẠO BÌNH LUẬN */}
        <form onSubmit={commentForm.handleSubmit(onSubmitComment)} className="mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-purple-100 flex-shrink-0 border border-purple-200"></div>
            
            <div className="flex-1 flex flex-col gap-1">
              <input
                {...commentForm.register("content")}
                placeholder="Nhập bình luận của bạn..."
                className={`w-full bg-gray-50 px-4 py-2.5 rounded-full outline-none border transition-colors ${
                  commentForm.formState.errors.content ? "border-red-500 focus:border-red-500" : "border-gray-200 focus:border-[#851385]"
                }`}
              />
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-full text-white bg-[#851385] hover:bg-[#6a0f6a] transition-colors font-medium flex-shrink-0"
            >
              Gửi
            </button>
          </div>
          {commentForm.formState.errors.content && (
            <p className="text-red-500 text-sm mt-1.5 ml-14">{commentForm.formState.errors.content.message}</p>
          )}
        </form>

        {/* DANH SÁCH BÌNH LUẬN */}
        <div className="flex-1 overflow-y-auto space-y-5 pr-2 custom-scrollbar">
          {comments?.map((cmt) => (
            <div key={cmt.commentId} className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex-shrink-0">
                {cmt.avatarUrl && <img src={cmt.avatarUrl} alt="" className="w-full h-full rounded-full object-cover" />}
              </div>

              <div className="flex-1">
                <div className="bg-gray-50 rounded-2xl p-3 border border-gray-100">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800">{cmt.userName}</span>
                    <span className="text-xs text-gray-400">
                      {new Date(cmt.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                  </div>
                  <div className="text-sm text-gray-700">{cmt.content}</div>
                </div>
                
                {/* NÚT PHẢN HỒI (Đã xóa nút Thích) */}
                <div className="flex gap-4 mt-1.5 ml-2">
                  <button 
                    onClick={() => handleOpenReply(cmt.commentId)}
                    className="text-xs font-semibold text-gray-500 hover:text-[#851385] transition-colors"
                  >
                    {activeReplyId === cmt.commentId ? "Đóng phản hồi" : "Phản hồi"}
                  </button>
                </div>

                {/* KHU VỰC HIỂN THỊ VÀ TẠO PHẢN HỒI (Chỉ hiện khi bấm vào Phản hồi của cmt này) */}
                {activeReplyId === cmt.commentId && (
                  <div className="mt-3 space-y-3">
                    
                    {/* DANH SÁCH PHẢN HỒI LẤY ĐƯỢC TỪ DB */}
                    {repliesMap[cmt.commentId]?.map(reply => (
                      <div key={reply.replyId} className="flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex-shrink-0"></div>
                        <div className="bg-white rounded-2xl p-2.5 border border-purple-100 flex-1 shadow-sm">
                           <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-800 text-sm">{reply.userName}</span>
                            <span className="text-xs text-gray-400">
                              {new Date(reply.createdAt).toLocaleDateString("vi-VN")}
                            </span>
                          </div>
                          <div className="text-sm text-gray-700">{reply.content}</div>
                        </div>
                      </div>
                    ))}

                    {/* FORM 2: TẠO PHẢN HỒI */}
                    <form onSubmit={replyForm.handleSubmit(onSubmitReply)} className="flex items-start gap-2 pt-2">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex-shrink-0 mt-1"></div>
                      <div className="flex-1">
                        <div className="flex gap-2">
                          <input
                            {...replyForm.register("content")}
                            placeholder={`Phản hồi ${cmt.userName}...`}
                            className={`flex-1 bg-white px-4 py-2 text-sm rounded-full outline-none border transition-colors ${
                              replyForm.formState.errors.content ? "border-red-500" : "border-gray-200 focus:border-[#851385]"
                            }`}
                          />
                          <button
                            type="submit"
                            className="px-4 py-2 rounded-full text-white bg-[#851385] hover:bg-[#6a0f6a] transition-colors text-sm font-medium"
                          >
                            Gửi
                          </button>
                        </div>
                        {replyForm.formState.errors.content && (
                          <p className="text-red-500 text-xs mt-1 ml-2">{replyForm.formState.errors.content.message}</p>
                        )}
                      </div>
                    </form>

                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition-colors"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}