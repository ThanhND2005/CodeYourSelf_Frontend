import React, { useState } from "react";

export default function CommentDialog({ open, onClose }: any) {
  const [message, setMessage] = useState("");

  const [comments, setComments] = useState([
    {
      commentId: 1,
      userName: "Nguyễn Linh",
      content: "K bt mấy bài về sau thế nào chứ bài đầu tiên đã thấy hay phết r",
      createAt: "26/12/2025"
    }
  ]);

  if (!open) return null;

  const handleSend = () => {
    if (!message.trim()) return;

    setComments([
      ...comments,
      {
        commentId: Date.now(),
        userName: "Bạn",
        content: message,
        createAt: "2025-12-26T10:30:00"
      }
    ]);

    setMessage("");
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-[650px] h-[520px] rounded-2xl p-5 flex flex-col border border-[#851385]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="text-lg font-semibold text-[#851385] mb-4">
          Bình luận
        </div>

        {/* INPUT */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-gray-300"></div>

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập bình luận..."
            className="flex-1 bg-gray-100 px-4 py-2 rounded-full outline-none"
          />

          <button
            onClick={handleSend}
            className="px-4 py-2 rounded-full text-white bg-[#851385]"
          >
            Gửi
          </button>
        </div>

        {/* COMMENT LIST */}
        <div className="flex-1 overflow-y-auto space-y-4">
          {comments.map((cmt) => (
            <div key={cmt.commentId} className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300"></div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{cmt.userName}</span>
                  <span className="text-sm text-gray-400">
                    {cmt.createAt}
                  </span>
                </div>

                <div className="text-sm mt-1">{cmt.content}</div>

                <div className="text-sm text-[#851385] mt-1 cursor-pointer">
                  Phản hồi
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-200"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}