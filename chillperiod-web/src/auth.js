import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "identify email guilds",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Store Discord user info in the token
      if (account && profile) {
        token.discordId = profile.id;
        token.username = profile.username;
        token.avatar = profile.avatar;
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
      // Add Discord info to the session
      session.user.discordId = token.discordId;
      session.user.username = token.username;
      session.user.avatar = token.avatar;
      session.accessToken = token.accessToken;
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});
