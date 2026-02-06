import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import Google from "next-auth/providers/google";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";

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
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      // Store provider-specific info in the token
      if (account && profile) {
        if (account.provider === 'discord') {
          token.discordId = profile.id;
          token.username = profile.username;
          token.avatar = profile.avatar;
        } else if (account.provider === 'google') {
          token.googleId = profile.sub;
        }
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      return token;
    },
    async session({ session, token }) {
      // Add provider info to the session
      session.user.discordId = token.discordId;
      session.user.googleId = token.googleId;
      session.user.username = token.username;
      session.user.avatar = token.avatar;
      session.user.provider = token.provider;
      session.accessToken = token.accessToken;
      
      // Get or create user in database
      try {
        await dbConnect();
        let dbUser = await User.findOne({
          $or: [
            { discordId: token.discordId },
            { googleId: token.googleId },
            { email: session.user.email }
          ].filter(q => Object.values(q)[0])
        });
        
        if (!dbUser) {
          dbUser = await User.create({
            email: session.user.email,
            name: session.user.name || token.username || 'User',
            image: session.user.image,
            discordId: token.discordId,
            googleId: token.googleId,
            username: token.username,
          });
        }
        session.user.id = dbUser._id.toString();
        session.user.totalBunks = dbUser.totalBunks;
      } catch (error) {
        console.error('Error syncing user to database:', error);
      }
      
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

