import NextAuth from "next-auth";
import EmailProvider from "next-auth/providers/email";
import { TypeORMLegacyAdapter } from "@next-auth/typeorm-legacy-adapter";

export default NextAuth({
  providers: [
    EmailProvider({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
  ],
  adapter: TypeORMLegacyAdapter({
    type: "sqlite",
    database: "./db.sqlite",
    synchronize: true,
  }),
  pages: {
    signIn: '/auth/signin',
  },
}); 