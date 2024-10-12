/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Form } from '../ui/form'
import CustomFormField from '../CustomFormField'
import SubmitButton from '../SubmitButton'
import { useState } from 'react'
import { userFormValidation } from '@/lib/formValidation'
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import router from 'next/router'
import { createUser } from '@/lib/actions/patient.actions'

export enum FormFieldType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  CHECKBOX = 'checkbox',
  PHONE_INPUT = 'phoneinput',
  SELECT = 'select',
  DATE_PICKER = 'datepicker',
  SKELETON = 'skeleton',
}

const PatientForm = () => {
  const [isLoading, setIsLoading] = useState(false)
  const form = useForm<z.infer<typeof userFormValidation>>({
    resolver: zodResolver(userFormValidation),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  })

  async function onSubmit({
    name,
    email,
    phone,
  }: z.infer<typeof userFormValidation>) {
    setIsLoading(true)
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
      const userData = {
        name,
        email,
        phone,
      }
      console.log(userData)
      const user = await createUser(userData)
      if (user) router.push(`/patients/${user.$id}/register`)
    } catch (err) {
      console.error(err)
    }
    setIsLoading(false)
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 flex-1 "
      >
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi There </h1>
          <p className="text-dark-700">Schedule your first appoitment</p>
        </section>
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="name"
          label="Full Name"
          placeholder="MK Anas"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name="email"
          label="Email"
          placeholder="mkanas@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />
        <CustomFormField
          control={form.control}
          fieldType={FormFieldType.PHONE_INPUT}
          name="phone"
          label="Phone Number"
          placeholder="(555) 373-4253"
        />
        <SubmitButton isLoading={isLoading}> Get Started</SubmitButton>
      </form>
    </Form>
  )
}

export default PatientForm
