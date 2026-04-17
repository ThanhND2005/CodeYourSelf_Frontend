import React, { useState } from "react";
import { createPortal } from "react-dom";

type User = {
  userId: string;
  username: string;
  avatar: string;
};

type Reply = {
  replyId: string;
  content: string;
  createdAt: string;
  user: User;
};

type Comment = {
  commentId: string;
  content: string;
  createdAt: string;
  user: User;
  replies: Reply[];
};

export default function CommentDialog(
  { open, onClose }: { open: boolean; onClose: () => void }
) {
  const currentUser: User = {
    userId: "acc-008",
    username: "Nguyễn Linh",
    avatar: "https://i.pravatar.cc/40?img=1",
  };

  const [comments, setComments] = useState<Comment[]>([
    {
      commentId: "cmt-001",
      content: "Bài này dễ hiểu thật",
      createdAt: "10:00",
      user: {
        userId: "acc-008",
        username: "Nguyễn Linh",
        avatar: "https://i.pravatar.cc/40?img=1",
      },
      replies: [
        {
          replyId: "rep-001",
          content: "Chuẩn luôn em 👍",
          createdAt: "10:01",
          user: {
            userId: "acc-002",
            username: "Thầy Đạt",
            avatar: "https://i.pravatar.cc/40?img=2",
          },
        },
      ],
    },
    {
      commentId: "cmt-002",
      content: "Có ai hiểu phần controller chưa?",
      createdAt: "10:05",
      user: {
        userId: "acc-009",
        username: "Minh Anh",
        avatar: "https://i.pravatar.cc/40?img=3",
      },
      replies: [],
    },
  ]);

  const [newComment, setNewComment] = useState("");
  const [replyBox, setReplyBox] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  if (!open) return null;

  // 🔥 thêm comment
  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const newCmt: Comment = {
      commentId: "cmt-" + Date.now(),
      content: newComment,
      createdAt: new Date().toLocaleTimeString(),
      user: currentUser,
      replies: [],
    };

    setComments([newCmt, ...comments]);
    setNewComment("");
  };

  // 🔥 thêm reply
  const handleAddReply = (commentId: string) => {
    if (!replyText.trim()) return;

    const newReply: Reply = {
      replyId: "rep-" + Date.now(),
      content: replyText,
      createdAt: new Date().toLocaleTimeString(),
      user: currentUser,
    };

    setComments((prev) =>
      prev.map((cmt) =>
        cmt.commentId === commentId
          ? { ...cmt, replies: [...cmt.replies, newReply] }
          : cmt
      )
    );

    setReplyText("");
    setReplyBox(null);
  };

  return createPortal(
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-[9999]"
      onClick={onClose}
    >
      <div
        className="bg-white w-[750px] h-[600px] rounded-2xl flex flex-col shadow-xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* HEADER */}
        <div className="px-5 py-4 border-b font-semibold text-[#851385] flex justify-between">
          <span>Bình luận khóa học</span>
          <button onClick={onClose}>✕</button>
        </div>

        {/* ADD COMMENT */}
        <div className="p-4 border-b flex gap-3">
          <img src={currentUser.avatar} className="w-10 h-10 rounded-full" />

          <input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Viết bình luận..."
            className="flex-1 bg-gray-100 px-4 py-2 rounded-full outline-none"
          />

          <button
            onClick={handleAddComment}
            className="px-4 py-2 bg-[#851385] text-white rounded-full"
          >
            Đăng
          </button>
        </div>

        {/* LIST */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {comments.map((cmt) => (
            <div key={cmt.commentId}>
              {/* COMMENT CHA */}
              <div className="flex gap-3">
                <img src={cmt.user.avatar} className="w-10 h-10 rounded-full" />

                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {cmt.user.username}
                  </div>

                  <div className="text-sm mt-1">{cmt.content}</div>

                  <div className="text-xs text-gray-400 mt-1">
                    {cmt.createdAt}
                  </div>

                  <button
                    onClick={() => setReplyBox(cmt.commentId)}
                    className="text-sm text-[#851385] mt-1"
                  >
                    Phản hồi
                  </button>

                  {/* REPLY INPUT */}
                  {replyBox === cmt.commentId && (
                    <div className="flex gap-2 mt-2">
                      <input
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Nhập phản hồi..."
                        className="flex-1 bg-gray-100 px-3 py-1 rounded-full text-sm"
                      />

                      <button
                        onClick={() => handleAddReply(cmt.commentId)}
                        className="text-sm bg-[#851385] text-white px-3 rounded-full"
                      >
                        Gửi
                      </button>
                    </div>
                  )}

                  {/* REPLIES */}
                  <div className="mt-3 space-y-3 ml-6 border-l pl-4">
                    {cmt.replies.map((rep) => (
                      <div key={rep.replyId} className="flex gap-2">
                        <img
                          src={rep.user.avatar}
                          className="w-8 h-8 rounded-full"
                        />

                        <div>
                          <div className="text-sm font-medium">
                            {rep.user.username}
                          </div>

                          <div className="text-sm">{rep.content}</div>

                          <div className="text-xs text-gray-400">
                            {rep.createdAt}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}