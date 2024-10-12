'use server'

import { ID, Query } from 'node-appwrite'
import { users } from '../appwrite.config'
import { parseStringify } from '../utils'
export const createUser = async (user: CreateUserParams) => {
  try {
    console.log('create user')
    const newUser = await users.create(
      ID.unique(),
      user.email,
      user.phone,
      undefined,
      user.name
    )
    return parseStringify(newUser)

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log('error:', error)
    if (error && error?.code === 409) {
      const documents = await users.list([Query.equal('email', [user.email])])
      return documents?.users[0]
    }
  }
}
