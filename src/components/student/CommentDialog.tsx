import React, { useState, useRef, useEffect } from "react";

export default function CommentDialog(
    { open, onClose }: { open: boolean; onClose: () => void }
  ) {
  const [message, setMessage] = useState("");

  const [comments, setComments] = useState([
    {
      commentId: "cmt-001",
      content: "Bài đầu dễ hiểu thật",
      createdAt: "2026-04-17 10:30",
      user: {
        userId: "acc-008",
        username: "Nguyễn Linh",
      },
    },
    {
      commentId: "cmt-002",
      content: "Đúng rồi, giảng dễ hiểu 😆",
      createdAt: "2026-04-17 10:32",
      user: {
        userId: "acc-002",
        username: "Thầy Đạt",
      },
    },
  ]);

  const currentUserId = "acc-008"; // giả lập user đang login
  const bottomRef = useRef<HTMLDivElement | null>(null);
  

  if (!open) return null;

  const handleSend = () => {
    if (!message.trim()) return;

    const newComment = {
      commentId: "cmt-" + Date.now(),
      content: message,
      createdAt: new Date().toLocaleString(),
      user: {
        userId: currentUserId,
        username: "Bạn",
      },
    };

    setComments((prev) => [...prev, newComment]);
    setMessage("");
  };

  // auto scroll xuống cuối
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [comments]);

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-[650px] h-[520px] rounded-2xl flex flex-col border border-[#851385] shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="px-5 py-4 border-b font-semibold text-[#851385] flex justify-between items-center">
          <span>Chat khóa học</span>

          <button
            onClick={onClose}
            className="text-gray-400 hover:text-black text-lg"
          >
            ✕
          </button>
        </div>

        {/* MESSAGE LIST */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-gray-50">
          {comments.map((cmt) => {
            const isMe = cmt.user.userId === currentUserId;

            return (
              <div
                key={cmt.commentId}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div className="max-w-[70%]">
                  {!isMe && (
                    <div className="text-xs text-gray-500 mb-1">
                      {cmt.user.username}
                    </div>
                  )}

                  <div
                    className={`px-4 py-2 rounded-2xl text-sm break-words
                      ${
                        isMe
                          ? "bg-[#851385] text-white rounded-br-none"
                          : "bg-white text-gray-800 border rounded-bl-none"
                      }
                    `}
                  >
                    {cmt.content}
                  </div>

                  <div className="text-[10px] text-gray-400 mt-1 text-right">
                    {cmt.createdAt}
                  </div>
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        {/* INPUT */}
        <div className="p-3 border-t flex items-center gap-2 bg-white">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="flex-1 bg-gray-100 px-4 py-2 rounded-full outline-none focus:ring-2 focus:ring-[#851385]"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />

          <button
            onClick={handleSend}
            className="px-4 py-2 rounded-full text-white bg-[#851385] hover:bg-[#6a0f6a] transition"
          >
            Gửi
          </button>
        </div>
      </div>
    </div>
  );
}