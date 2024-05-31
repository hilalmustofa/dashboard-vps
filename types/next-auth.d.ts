import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      name: ReactNode;
      id: number;
      username: string;
      fullName: string;
      role: string;
      avatar: string;
      access_token: string;
    };
  }
}
