import { NextResponse } from 'next/server'

export function GET(request: Request) {
  const bookingUrl = process.env.CAL_COM_BOOKING_URL
  return NextResponse.redirect(new URL(bookingUrl || '/#contact', request.url))
}
