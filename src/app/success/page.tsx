import useStripe from "@/hooks/useStripe"
import { CheckoutType } from "@/types/Reservations";

export default async function Success({
    searchParams,
}: {
    searchParams: Promise<{ session_id: string, type: CheckoutType }>;
}) {
    const params = await searchParams;
    const session_id = params.session_id ?? "";
    const type = params.type ?? "";
    const { retreiveCheckoutSession } = useStripe()
    const session = await retreiveCheckoutSession(session_id)

    const orderInfo = session.session.metadata

    if (type === CheckoutType.RESERVATION) {
        return (<div className="py-8 flex justify-center w-full">
            <div className="flex flex-col p-4 w-full max-w-3xl justify-center">
                <h1 className="text-2xl font-bold mb-4 text-center">Reservation Confirmed</h1>
                <p className="text-lg">Thank you {orderInfo?.name}. Your Candle Cow Bar experience has been reserved, and we look forward to welcoming you.</p>

                <h3 className="text-xl font-semibold my-4">Location</h3>
                <p className="text-md mb-2">4052 Helena Rd.</p>
                <p className="text-md mb-2">Helena, AL 35080</p>
                <p className="text-md mb-2">Please plan to arrive <b className="font-semibold">10–15 minutes prior to your scheduled time</b> so you can settle in and fully enjoy your experience.</p>

                <h3 className="text-xl font-semibold my-4">What to Expect</h3>
                <p className="text-md mb-2">Your reservation includes a <b>$25 deposit</b>, which will be applied toward your experience.
                    Depending on the activities you’ve selected, there may be an additional balance due at the time of your visit.</p>
                <p>Our team will guide you through your chosen activities to ensure a seamless and memorable experience.</p>

                <h3 className="text-xl font-semibold my-4">Cancellation Policy</h3>
                <p className="text-md mb-2">Cancellations made at least 24 hours in advance will receive a full refund. Cancellations made within 24 hours of the scheduled time will forfeit the deposit.</p>
                <p>If you need to reschedule, please contact us at least 24 hours in advance, and we will do our best to accommodate your request based on availability.</p>

                <h3 className="text-xl font-semibold my-4">A Final Note</h3>
                <p className="text-md mb-2">We’ve thoughtfully prepared your session, and your time has been set aside just for you. Arriving early helps us begin your experience smoothly and without interruption.</p>
                <p className="text-md mb-2">We look forward to hosting you. </p>

                <h3 className="text-xl font-semibold my-4">Reservation Details</h3>
                <p className="text-md mb-2">Name: {orderInfo?.name}</p>
                <p className="text-md mb-2">Email: {orderInfo?.email}</p>
                <p className="text-md mb-2">Phone: {orderInfo?.phone}</p>
                <p className="text-md mb-2">Reservation Date: {orderInfo?.date}</p>
                <p className="text-md mb-2">Reservation Time: {orderInfo?.time}</p>

                <p className="text-md mb-2">Guests: {orderInfo?.guests}</p>
                <p className="text-md mb-2">Activities: {orderInfo?.activities}</p>
                {orderInfo?.special_requests && <p className="text-md mb-2">Special Requests: {orderInfo.special_requests}</p>}
            </div>
        </div>)
    }

    return (<div className="py-8 flex justify-center w-full">
        <div className="flex flex-col p-4 w-full max-w-3xl justify-center items-center">
            <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
            <p className="text-lg mb-6">Thank you for your purchase. Your payment has been processed successfully.</p>
        </div>
    </div>)
}