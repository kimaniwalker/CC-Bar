"use client"
import { inter, montserrat } from "@/components/ds/Fonts";
import { Input } from "@/components/ds/Input";
import { MultiSelectField } from "@/components/ds/MultiSelect";
import { Text } from "@/components/ds/Text";
import useHandlePayment from "@/hooks/useHandleCheckout";
import useStripe from "@/hooks/useStripe";
import { ReservationsFormInputs } from "@/types/Reservations";
import Stripe from "stripe";
import { form } from "motion/react-client";
import { useRouter } from "next/navigation";
import { ReactNode } from "react";
import { SubmitHandler, useForm, FormProvider } from "react-hook-form";



export const ReservationsForm = ({ date, available_timeslots }: { date?: string, available_timeslots: ReactNode }) => {
  const methods = useForm<ReservationsFormInputs>({mode: "onBlur", reValidateMode: "onChange"});
  const { register, handleSubmit, watch, formState:{
    isValid,errors, 
  } } = methods;
  const router = useRouter();
  const {formatReservationsData} = useHandlePayment()
  const {checkout} = useStripe()

   const handleCheckout = async (body:Stripe.Checkout.SessionCreateParams) => {
      const session = await checkout(body)
      if (session.url) router.push(session.url);
    }

  const onSubmit: SubmitHandler<ReservationsFormInputs> = (data) => {
    const reservationsData = formatReservationsData({redirect_url: '/',ReservationsFormData: data});
    console.log({reservationsData})
    handleCheckout(reservationsData)

  }

  const handleSelectDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    console.log("Selected date:", selectedDate);
    router.push(`?date=${selectedDate}`);
  }
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
  
  const maxDate = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(
    new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  );

  return (<div className="py-8 flex justify-center w-full">
    <div className="flex flex-col p-4 w-full max-w-3xl justify-center items-center">
      <Text size="xl" className="text-2xl font-bold mb-4 text-center">Your Experience Awaits</Text>
      <Text size="md" className="text-lg text-gray-600 text-center">An intimate, hands-on experience designed for creativity and relaxation.</Text>
      <Text size="sm" className="mt-2 text-gray-600 text-xs">Reservations available up to 30 days in advance</Text>
      
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 w-full max-w-lg">
          <div className="mb-4">
            <Input errorMessage={errors.name?.message} type="text" id="name" placeholder="Your Name" required {...register('name', { required: "This field is required"})} />
          </div>
          <div className="mb-4">
            <Input errorMessage={errors.email?.message} type="email" id="email" placeholder="Your Email" required {...register('email', {required: "This field is required"})} />
          </div>
          <div className="mb-4">
            <Input errorMessage={errors.phone?.message} type="tel" id="phone" placeholder="Your Phone Number" required {...register('phone', {required: "This field is required"})} />
          </div>
          <div className="mb-4">
            <Input errorMessage={errors.date?.message} defaultValue={date} min={today} max={maxDate} type="date" id="date" required {...register('date', {required: "This field is required"})} onChange={handleSelectDate} />
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">Available timeslots</label>
            {available_timeslots}
          </div>

          <div className="mb-4">
            <label className="block mb-2 font-medium text-gray-700">Select Activities</label>
            
            <MultiSelectField fieldName="activities" options={["Candle Making", "Soap Making", "Bath Bombs"]} />
          </div>

          <div className="mb-4">
            <Input errorMessage={errors.guests?.message} defaultValue={1} max={8} min={1} type="number" id="guests" placeholder="Number of Guests" {...register('guests', {required: "This field is required"})} />
          </div>
          <button disabled={!isValid} type="submit" className={`w-full px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-500 transition ${montserrat.className}`}>Secure Your Reservation</button>
        </form>
      </FormProvider>
    </div>
  </div>
  );
}