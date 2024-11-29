import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios, { fetcherPost } from 'utils/axios';

let users = [
  {
    id: 1,
    name: 'Jone Doe',
    email: 'info@codedthemes.com',
    password: '123456'
  }
];

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET_KEY,
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter Email' },
        password: { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter Password' }
      },
      async authorize(credentials) {
        try {
          const response = await fetcherPost(
            'api/auth/local', // API endpoint
            {
              identifier: credentials?.email,
              password: credentials?.password
            },
            {
              headers: {
                'Content-Type': 'application/json'
              }
            }
          );
          console.log('response: ', response);
          if (response.jwt) {
            if (typeof window !== 'undefined') {
              window.localStorage.setItem('jwt', response.jwt);
            }
            return response;
          }
          throw new Error('Invalid username or password.');
        } catch (e: any) {
          const errorMessage = e?.response.data.message;
          throw new Error(errorMessage);
        }
      }
    }),
    CredentialsProvider({
      id: 'register',
      name: 'Register',
      credentials: {
        firstname: { name: 'firstname', label: 'Firstname', type: 'text', placeholder: 'Enter Firstname' },
        lastname: { name: 'lastname', label: 'Lastname', type: 'text', placeholder: 'Enter Lastname' },
        email: { name: 'email', label: 'Email', type: 'email', placeholder: 'Enter Email' },
        company: { name: 'company', label: 'Company', type: 'text', placeholder: 'Enter Company' },
        password: { name: 'password', label: 'Password', type: 'password', placeholder: 'Enter Password' }
      },
      async authorize(credentials) {
        try {
          const user = await axios.post('/api/account/register', {
            firstName: credentials?.firstname,
            lastName: credentials?.lastname,
            company: credentials?.company,
            password: credentials?.password,
            email: credentials?.email
          });

          if (user) {
            users.push(user.data);
            return user.data;
          }
        } catch (e: any) {
          const errorMessage = e?.response.data.message;
          throw new Error(errorMessage);
        }
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      const returnToken = { ...token };

      // Check if there's a user object and add the jwt and other user properties
      if (user?.jwt) {
        returnToken.jwt = user.jwt;
        returnToken.email = user.email; // Add email to token
        returnToken.username = user.username; // Add username to token
        returnToken.documentId = user.documentId; // Add documentId to token

        // Store JWT to localStorage (if not already stored)
        if (typeof window !== 'undefined' && !localStorage.getItem('jwt')) {
          window.localStorage.setItem('jwt', user.jwt);
        }
      }

      return returnToken;
    },
    session: async ({ session, token }) => {
      // Pass the properties from the token to the session
      return {
        ...session,
        user: {
          ...session.user,
          documentId: token.documentId, // Get documentId from token
          username: token.username, // Get username from token
          email: token.email // Get email from token
        }
      };
    }
  },
  session: {
    strategy: 'jwt',
    maxAge: Number(process.env.NEXT_APP_JWT_TIMEOUT!)
  },
  jwt: {
    secret: process.env.NEXT_APP_JWT_SECRET
  },
  pages: {
    signIn: '/',
    newUser: '/register'
  }
};
