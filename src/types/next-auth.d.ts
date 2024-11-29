// eslint-disable-next-line
import NextAuth from 'next-auth';

declare module 'next-auth' {
  interface User {
    jwt?: string; // Add jwt property to the User type
    documentId?: string; // Add documentId property to the User type
    username?: string; // Add username property to the User type
  }

  interface Session {
    jwt?: string;
    user: {
      jwt: string;
      documentId: string;
      username: string;
      email: string;
    };
  }
}
