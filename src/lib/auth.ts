import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { getAll } from "./db";
import bcrypt from "bcryptjs";
import type { User } from "./types";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email as string;
        const password = credentials?.password as string;

        const users = await getAll<User>("users");
        const user = users.find((u) => u.email === email);

        if (!user) return null;
        const valid = user.password.startsWith("$2")
          ? await bcrypt.compare(password, user.password)
          : user.password === password;
        if (!valid) return null;

        return { id: user.id, name: user.name, email: user.email, role: user.role };
      },
    }),
  ],
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: unknown }).role;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const sessionUser = session.user as { role?: unknown; id?: string };
        sessionUser.role = token.role;
        sessionUser.id = token.id as string;
      }
      return session;
    },
  },
});
