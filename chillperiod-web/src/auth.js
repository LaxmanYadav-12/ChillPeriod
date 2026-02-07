import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import Google from "next-auth/providers/google";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import mongoose from 'mongoose';

export const { handlers, signIn, signOut, auth } = NextAuth({
  debug: true,
  trustHost: true,
  cookies: {
    sessionToken: {
      name: `authjs.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: false, // Force insecure for debugging
      },
    },
  },
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
      console.log('AUTH DEBUG: JWT Callback', { account: !!account, profile: !!profile, token });
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
      console.log('AUTH DEBUG: Session Callback Start', { token });
      // Add provider info to the session
      session.user.discordId = token.discordId;
      session.user.googleId = token.googleId;
      session.user.avatar = token.avatar;
      session.user.provider = token.provider;
      session.accessToken = token.accessToken;
      
      // Get or create user in database
      try {
        console.log('AUTH DEBUG: Connecting to DB...');
        await dbConnect();
        console.log('AUTH DEBUG: DB Connected. Finding user...');
        let dbUser = await User.findOne({
          $or: [
            { discordId: token.discordId },
            { googleId: token.googleId },
            { email: session.user.email }
          ].filter(q => Object.values(q)[0])
        });
        
        console.log('AUTH DEBUG: DB User found:', !!dbUser);

        if (!dbUser) {
          console.log('AUTH DEBUG: Creating new user...');
          dbUser = await User.create({
            email: session.user.email,
            name: session.user.name || token.username || 'User',
            image: session.user.image,
            discordId: token.discordId,
            googleId: token.googleId,
          });
          console.log('AUTH DEBUG: New user created');
        }
        session.user.id = dbUser._id.toString();
        session.user.username = dbUser.username;
        session.user.totalBunks = dbUser.totalBunks;
        session.user.hasCompletedOnboarding = dbUser.hasCompletedOnboarding || false;
        session.user.followerCount = dbUser.followers?.length || 0;
        session.user.followingCount = dbUser.following?.length || 0;
        session.user.semester = dbUser.semester;
        session.user.section = dbUser.section;
      } catch (error) {
        console.error('AUTH DEBUG: Error syncing user to database:', error);
        session.error = error.message;
        // Safely check mongoose connection state
        try {
            session.dbState = mongoose.connection.readyState;
        } catch (e) {
            session.dbState = 'unknown';
        }
      }
      
      console.log('AUTH DEBUG: Session Callback End', { session });
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
});

