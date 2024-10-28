/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '../ui/form'
import CustomFormField from '../CustomFormField'
import SubmitButton from '../SubmitButton'
import { useState } from 'react'
import { getAppointmentSchema } from '@/lib/formValidation'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { useRouter } from 'next/navigation'
import { Doctors } from '@/constants'
import { SelectItem } from '../ui/select'
import Image from 'next/image'
import { createAppointment } from '@/lib/actions/appointment.actions'

export enum FormFieldType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  CHECKBOX = 'checkbox',
  PHONE_INPUT = 'phoneinput',
  SELECT = 'select',
  DATE_PICKER = 'datepicker',
  SKELETON = 'skeleton',
}

const AppointmentForm = ({
  userId,
  patientId,
  type,
}: {
  userId: string
  patientId: string
  type: 'create' | 'cancel' | 'schedule'
}) => {
  const router = useRouter()
  const AppointmentFormValidation = getAppointmentSchema(type)
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: '',
      schedule: new Date(),
      reason: '',
      note: '',
      cancellationReason: '',
    },
  })

  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true)

    let status
    switch (type) {
      case 'schedule':
        status = 'scheduled'
        break
      case 'cancel':
        status = 'cancelled'
        break
      default:
        status = 'pending'
        break
    }
    try {
      // You can use your backend API here to create a new user.
      // Example:
      // const createUser = async (userData: any) => {
      //   const res = await fetch('/api/users', {
      //     method: 'POST',
      //     headers: {
      //       'Content-Type': 'application/json',
      //     },
      //     body: JSON.stringify(userData),
      //   })
      //   return await res.json()
      // }
      // // Uncomment the following line and replace it with your actual API call.
      // // await createUser(userData)
      // // Redirect the user to the next page with the user's ID.
      // // This is just an example, you may want to replace this with your own logic.
      // // Example:
      // // router.push(`/patients/${user.$id}/register`)
      // // You can also use the following line if you want to store the user data in your local storage.
      if (type === 'create' && patientId) {
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          note: values.note,
          status: status as Status,
        }
        const appointment = await createAppointment(appointmentData)
        if (appointment) {
          form.reset()
          router.push(
            `patients/${userId}/new-appointment/success?appointmentId=${appointment.id}`
          )
        }
      }
    } catch (err) {
      console.error(err)
    }
    setIsLoading(false)
  }

  let buttonLabel

  switch (type) {
    case 'cancel':
      buttonLabel = 'Cancel Appointment'
      break
    case 'create':
      buttonLabel = 'Create Appointment'
      break
    case 'schedule':
      buttonLabel = 'Schedule Appointment'
      break
    default:
      break
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 flex-1 "
      >
        <section className="mb-12 space-y-4">
          <h1 className="header">New Appointment </h1>
          <p className="text-dark-700">
            Request a new appoitment in 10 seconds
          </p>
        </section>
        {type !== 'cancel' && (
          <>
            <CustomFormField
              control={form.control}
              fieldType={FormFieldType.SELECT}
              name="primaryPhysician"
              label="Doctor"
              placeholder="Select a Doctor"
            >
              {Doctors.map((doctor) => (
                <SelectItem key={doctor.name} value={doctor.name}>
                  <div className="flex cursor-pointer items-center gap-2">
                    <Image
                      src={doctor.image}
                      width={32}
                      height={32}
                      alt={doctor.name}
                      className="rounded-full border border-dark-500"
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </CustomFormField>
            <CustomFormField
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Expected appointment date"
              showTimeSelect
              dateFormat="MM/dd/yyyy - h:mm aa"
            />
            <div className="flex flex-col gap-6 xl:flex-row">
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                name="reason"
                label="Reason for appointment"
                placeholder="Enter reason for appointment"
              />
              <CustomFormField
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                name="note"
                label="Notes"
                placeholder="Enter notes"
              />
            </div>
          </>
        )}

        {type === 'cancel' && (
          <CustomFormField
            control={form.control}
            fieldType={FormFieldType.TEXTAREA}
            name="cancellationReason"
            label="Reason for cancellation"
            placeholder="Enter reason for cancellation"
          />
        )}

        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'
          } w-full`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  )
}

export default AppointmentForm
