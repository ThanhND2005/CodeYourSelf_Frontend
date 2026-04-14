import React, { useState } from "react";

export default function RatingDialog({ open, onClose }: any) {
  const [rating, setRating] = useState(0);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white w-96 p-6 rounded-2xl shadow-lg border border-[#851385]"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-6 text-[#851385]">
          Đánh giá khóa học
        </h2>

        <div className="flex justify-center gap-3 mb-8">
          {[1, 2, 3, 4, 5].map((star) => (
            <svg
              key={star}
              onClick={() => setRating(star)}
              fill={star <= rating ? "#851385" : "none"}
              stroke="#851385"
              viewBox="0 0 24 24"
              className="w-10 h-10 cursor-pointer"
            >
              <path
                strokeWidth={1.5}
                d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l2.036 6.26a1 1 0 00.95.69h6.588c.969 0 1.371 1.24.588 1.81l-5.33 3.873a1 1 0 00-.364 1.118l2.036 6.26c.3.921-.755 1.688-1.54 1.118l-5.33-3.873a1 1 0 00-1.176 0l-5.33 3.873c-.784.57-1.838-.197-1.539-1.118l2.036-6.26a1 1 0 00-.364-1.118L2.337 11.687c-.783-.57-.38-1.81.588-1.81h6.588a1 1 0 00.95-.69l2.036-6.26z"
              />
            </svg>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2 rounded-xl text-white bg-[#851385]"
        >
          Đánh giá
        </button>
      </div>
    </div>
  );
}