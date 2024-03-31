import type { User } from '../server/payload-types'
import type { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies'
import type { NextRequest } from 'next/server'

export const getServerSideUser = async (
  cookies: NextRequest['cookies'] | ReadonlyRequestCookies
) => {
  const token = cookies.get('payload-token')?.value

  const meRes = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/users/me`,
    {
      headers: {
        Authorization: `JWT ${token}`,
      },
    }
  )

  const { user } = (await meRes.json()) as {
    user: User | null
  }

  return { user }
}