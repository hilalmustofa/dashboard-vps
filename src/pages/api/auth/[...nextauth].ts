import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        const res = await fetch(
          process.env.NEXT_PUBLIC_BACKEND_URL + "/api/users/login",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password,
            }),
          }
        );
        const user = await res.json();

        if (user.code === 200) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  secret: process.env.SECRET,
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },

  pages: {
    signIn: "/auth",
    signOut: "/logout",
    error: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      const maxAge = 24 * 60; // in minutes
      const tokenExpires = Math.floor(Date.now() / 1000) + maxAge * 60; // convert maxAge to seconds
      return { ...token, ...user, exp: tokenExpires };
    },
    async session({ session, token, user }) {
      session.user = token as any;
      return session;
    },
  },
});
