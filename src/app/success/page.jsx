import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'

export default async function Success({ searchParams }) {
  // 💡 URL থেকে স্ট্যাটাস আপডেটের জন্য প্রয়োজনীয় প্যারামিটারগুলো রিসিভ করা হলো
  const { session_id, bookingId, ticketId, qty } = await searchParams

  if (!session_id)
    throw new Error('Please provide a valid session_id (`cs_test_...`)')

  const {
    status,
    customer_details: { email: customerEmail }
  } = await stripe.checkout.sessions.retrieve(session_id, {
    expand: ['line_items', 'payment_intent']
  })

  if (status === 'open') {
    return redirect('/')
  }

  if (status === 'complete') {
    try {
      const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL;

      // 🔄 আপনার এক্সপ্রেস ব্যাকএন্ডের PATCH API কে হিট করে ডাটাবেজ আপডেট করা হচ্ছে
      if (bookingId) {
        await fetch(`${serverUrl}/bookings/update-status/${bookingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'paid' })
        });
      }
    } catch (error) {
      // ব্যাকএন্ডে কোনো সমস্যা হলেও ইউজার যেন আটকে না থাকে, তাই এররটি শুধু কনসোল করা হলো
      console.error("Failed to update booking status in database:", error);
    }

    // ⚡ ডাটাবেজ আপডেট শেষে আপনার ডিজাইন করা ক্লায়েন্ট সাকসেস পেজে রিডাইরেক্ট করা হচ্ছে
    return redirect(
      `/dashboard/user/payment-success?session_id=${session_id}&bookingId=${bookingId || ''}&ticketId=${ticketId || ''}&qty=${qty || ''}`
    );
  }

  // সেফটি ফলব্যাক
  return redirect('/');
}