import React, { useState } from 'react';
import { Star, MessageSquare, Send } from 'lucide-react';

const Feedback = () => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comments, setComments] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setRating(0);
      setComments('');
    }, 4000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="w-full text-center mb-8 border-b border-gray-200 pb-6">
        <h2 className="text-4xl font-serif text-gray-900 mb-2">Share Your Experience</h2>
        <p className="text-gray-500 font-medium">Your insightful feedback elevates the LuxuryStay standard iteratively.</p>
      </div>

      <form onSubmit={handleSubmit} className="w-full bg-white rounded-xl shadow-sm border border-gray-100 p-8 md:p-12 space-y-10">
        {submitted && (
          <div className="bg-green-50 border border-green-200 p-5 rounded-lg text-green-800 text-center font-bold tracking-wide shadow-sm flex items-center justify-center">
            <Star className="w-5 h-5 mr-3 fill-green-800" /> Thank you! Your verified feedback has been submitted securely.
          </div>
        )}

        <div className="flex flex-col items-center">
          <label className="block text-sm font-bold text-gray-700 uppercase tracking-widest mb-6">Rate Your Stay</label>
          <div className="flex space-x-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star 
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className={`w-12 h-12 md:w-16 md:h-16 cursor-pointer drop-shadow-sm transition-all hover:scale-110 duration-200 ${(hoverRating || rating) >= star ? 'text-[#D4AF37] fill-[#D4AF37]' : 'text-gray-200'}`}
              />
            ))}
          </div>
          <p className="mt-5 text-[11px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-4 py-1.5 rounded-full border border-gray-100">
            {rating === 1 && 'Poor'}
            {rating === 2 && 'Fair'}
            {rating === 3 && 'Good'}
            {rating === 4 && 'Excellent'}
            {rating === 5 && 'Perfect'}
            {rating === 0 && 'Select a rating to proceed'}
          </p>
        </div>

        <div className="pt-4 border-t border-gray-100">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center">
            <MessageSquare className="w-4 h-4 mr-2" /> Additional Comments
          </label>
          <textarea 
            rows="5" 
            value={comments} 
            onChange={(e) => setComments(e.target.value)} 
            placeholder="Tell us what you loved, or how we can improve our operations..."
            className="w-full p-5 font-medium text-gray-800 border border-gray-200 rounded-lg shadow-sm focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] bg-gray-50 focus:bg-white resize-none transition"
            required={rating > 0 && rating < 4} // Require comments if rating is low
          ></textarea>
        </div>

        <button type="submit" disabled={submitted || rating === 0} className="w-full bg-zinc-900 hover:bg-black text-white py-4.5 rounded-lg font-bold tracking-widest uppercase text-sm shadow-xl transition flex items-center justify-center p-4 disabled:opacity-50 hover:-translate-y-0.5">
           <Send className="w-5 h-5 mr-3 shrink-0" /> Transmit Review
        </button>
      </form>
    </div>
  );
};

export default Feedback;
