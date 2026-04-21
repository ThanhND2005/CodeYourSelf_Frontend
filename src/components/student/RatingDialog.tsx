import React, { useState } from "react";

type RatingDialogProps = {
  open: boolean;
  onClose: () => void;
  courseId: string;
  onSubmit: (courseId: string, rating: number) => Promise<void>;
};

export default function RatingDialog({
  open,
  onClose,
  courseId,
  onSubmit,
}: RatingDialogProps) {
  const [rating, setRating] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);

  if (!open) return null;

  const handleClose = () => {
    if (loading) return;
    setRating(0);
    onClose();
  };

  const handleSubmit = async () => {
    if (rating === 0 || loading) return;

    try {
      setLoading(true);
      await onSubmit(courseId, rating);
      setRating(0);
      onClose();
    } catch (err) {
      console.error("Submit rating failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center backdrop-blur-sm">
      <div className="bg-white w-80 p-6 rounded-xl shadow-2xl">
        <h2 className="text-lg font-semibold mb-5 text-center">
          Đánh giá khóa học
        </h2>

        {/* STAR */}
        <div className="flex justify-center gap-2 mb-6">
          {[1, 2, 3, 4, 5].map((star) => (
            <span
              key={star}
              onClick={() => !loading && setRating(star)}
              className={`text-3xl cursor-pointer transition ${
                star <= rating ? "text-yellow-400" : "text-gray-300"
              } ${
                loading
                  ? "opacity-50 cursor-not-allowed"
                  : "hover:scale-125"
              }`}
            >
              ★
            </span>
          ))}
        </div>

        {/* ACTION */}
        <div className="flex justify-end gap-3">
          <button
            onClick={handleClose}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition font-medium disabled:opacity-50"
          >
            Hủy
          </button>

          <button
            onClick={handleSubmit}
            disabled={rating === 0 || loading}
            className={`px-4 py-2 rounded-lg text-white font-medium transition ${
              rating === 0 || loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-[#851385] hover:bg-[#6a0f6a]"
            }`}
          >
            {loading ? "Đang gửi..." : "Gửi"}
          </button>
        </div>
      </div>
    </div>
  );
}