import { NextResponse } from 'next/server';
import jwksClient from 'jwks-rsa';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { createUser } from '@/app/dashboard/_actions/user';

// The Kinde issuer URL should already be in your `.env` file
// from when you initially set up Kinde. This will fetch your
// public JSON web keys file
const client = jwksClient({
  jwksUri: `${process.env.KINDE_ISSUER_URL}/.well-known/jwks.json`,
});

export async function POST(req: Request) {
  try {
    // Get the token from the request
    const token = await req.text();

    console.log('[token]: ', token);

    // Decode the token
    const decodedJWT = jwt.decode(token, { complete: true });
    if (!decodedJWT) {
      return NextResponse.json({
        status: 500,
        statusText: 'error decoding JWT',
      });
    }

    const { header } = decodedJWT;
    console.log('[header]: ', header);
    const { kid } = header;
    console.log('[kid]: ', kid);

    // Verify the token
    const key = await client.getSigningKey(kid);
    console.log('[key]: ', key);
    const signingKey = key.getPublicKey();
    const event = jwt.verify(token, signingKey) as JwtPayload;
    console.log('[event]: ', event);

    // Handle various events
    switch (event?.type) {
      case 'user.updated':
        // handle user updated event
        // e.g update database with event.data
        console.log(event.data);
        break;
      case 'user.created':
        // handle user created event
        // e.g add user to database with event.data
        console.log('[user created event]: ', event.data);
        const { email, first_name, last_name, id } = event.data.user;
        const data = {
          email,
          firstName: first_name,
          lastName: last_name,
          kindeId: id,
        };
        const formData = new FormData();
        for (const [key, value] of Object.entries(data)) {
          formData.append(key, value);
        }
        console.log('[formData]: ', formData);
        await createUser(formData);
        break;
      case 'user.authenticated':
        // handle user updated event
        // e.g update database with event.data
        console.log('[authenticated event]: ', event.data);
        break;
      default:
        return NextResponse.json({
          status: 500,
          statusText: 'hook event does not exist',
        });
        break;
    }
  } catch (error) {
    if (error instanceof Error)
      return NextResponse.json({
        status: 400,
        statusText: error.message,
      });
  }

  return NextResponse.json({ status: 200, statusText: 'success' });
}
