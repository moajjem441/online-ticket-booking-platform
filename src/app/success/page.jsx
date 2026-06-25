import { stripe } from '@/lib/stripe'
import { redirect } from 'next/navigation'

export default async function Success({ searchParams }) {
  // URL থেকে প্যারামিটার রিসিভ করা
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

      if (bookingId) {
        // 🔄 cache: 'no-store' যুক্ত করা হয়েছে যাতে Next.js রিকোয়েস্ট ক্যাশ না করে সরাসরি হিট করে
        const res = await fetch(`${serverUrl}/bookings/update-status/${bookingId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'paid' }),
          cache: 'no-store' 
        });

        // 💡 অত্যন্ত গুরুত্বপূর্ণ: রেসপন্স অবজেক্টটি রিড করতে হবে, 
        // যাতে এক্সপ্রেস ব্যাকএন্ডের কাজ শেষ হওয়া পর্যন্ত এই ফাংশন অপেক্ষা করে।
        if (res.ok) {
          const updateData = await res.json();
          console.log("Database updated successfully:", updateData);
        } else {
          console.error("Express server returned an error:", res.status);
        }
      }
    } catch (error) {
      console.error("Failed to update booking status in database:", error);
    }

    // ⚡ ডাটাবেজ আপডেট নিশ্চিত হওয়ার পর রিডাইরেক্ট হবে
    return redirect(
      `/dashboard/user/payment-success?session_id=${session_id}&bookingId=${bookingId || ''}&ticketId=${ticketId || ''}&qty=${qty || ''}`
    );
  }

  // সেফটি ফলব্যাক
  return redirect('/');
}