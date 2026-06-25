import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';

// স্ট্রাইপ সিক্রেট কী দিয়ে ইনিশিয়েলাইজ করুন
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(request) {
  try {
    const headersList = await headers();
    const origin = headersList.get('origin');
    
    // ফ্রন্টএন্ড থেকে পাঠানো বডি ডাটা রিসিভ করা
    const { bookingId, ticketId, amount, ticketTitle, bookingQuantity } = await request.json();

    // ডাইনামিক প্রাইস এবং লাইন আইটেমস তৈরি করা
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'bdt', // অথবা আপনার প্রয়োজন অনুযায়ী কারেন্সি
            product_data: {
              name: ticketTitle,
              metadata: { ticketId: ticketId },
            },
            // স্ট্রাইপ পয়সা বা সেন্ট হিসেবে হিসাব করে, তাই মোট টাকাকে কোয়ান্টিটি দিয়ে ভাগ করে ১০০ দিয়ে গুন হবে
            unit_amount: Math.round((Number(amount) / Number(bookingQuantity)) * 100),
          },
          quantity: Number(bookingQuantity),
        },
      ],
      mode: 'payment',
      // পেমেন্ট সফল বা ক্যানসেল হলে ইউজার যেখানে ফিরে যাবে
      success_url: `${origin}/dashboard/user/my-bookings?payment_success=true&bookingId=${bookingId}&ticketId=${ticketId}&qty=${bookingQuantity}`,
      cancel_url: `${origin}/dashboard/user/my-bookings?payment_cancel=true`,
      metadata: {
        bookingId: bookingId,
        ticketId: ticketId,
        bookingQuantity: bookingQuantity.toString()
      }
    });

    // ক্লায়েন্ট সাইডে রিডাইরেক্ট করার জন্য সেশন ইউআরএল এবং আইডি পাঠানো
    return NextResponse.json({ url: session.url, sessionId: session.id });
  } catch (err) {
    console.error("Stripe Session Error:", err);
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}