import NextAuth from "next-auth";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";
import mongoose from 'mongoose';
import { authConfig } from "./auth.config";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  debug: false,
  callbacks: {
    ...authConfig.callbacks,
    async jwt({ token, account, profile, trigger, session }) {
      
      // Update token if session is updated (e.g. from client side update())
      if (trigger === "update" && session) {
         token = { ...token, ...session };
      }

      // Initial sign in
      if (account && profile) {
        // PREPARE TOKEN DATA
        if (account.provider === 'discord') {
          token.discordId = profile.id;
          token.username = profile.username;
          token.avatar = profile.avatar;
        } else if (account.provider === 'google') {
          token.googleId = profile.sub;
        }
        token.accessToken = account.access_token;
        token.provider = account.provider;

        // DB OPERATIONS
        try {
            await dbConnect();

            // CASE 1: LINKING (User is already logged in)
            if (token.id) {
                console.log('AUTH: Linking account to existing user', token.id);
                const currentUser = await User.findById(token.id);
                if (currentUser) {
                    let updated = false;
                    if (account.provider === 'discord' && !currentUser.discordId) {
                        currentUser.discordId = profile.id;
                        updated = true;
                    }
                    if (account.provider === 'google' && !currentUser.googleId) {
                        currentUser.googleId = profile.sub;
                        updated = true;
                    }
                    
                    if (updated) await currentUser.save();
                    
                    // Refresh token fields
                    token.isDiscordLinked = !!currentUser.discordId;
                    token.isGoogleLinked = !!currentUser.googleId;
                }
                return token; // Return early, we are done linking
            }

            // CASE 2: LOGIN / REGISTER (User is not logged in)
            
            // Find user by email or provider ID
            let dbUser = await User.findOne({
              $or: [
                { email: token.email },
                { discordId: token.discordId },
                { googleId: token.googleId }
              ].filter(q => Object.values(q)[0])
            });

            // Create if not exists
            if (!dbUser && token.email) {
               const newUser = {
                 email: token.email,
                 name: token.name || token.username || 'User',
                 image: token.picture || token.avatar,
               };
               if (token.discordId) newUser.discordId = token.discordId;
               if (token.googleId) newUser.googleId = token.googleId;
               
               dbUser = await User.create(newUser);
            }

            // If user found/created, update their IDs if missing (Merge by email)
            if (dbUser) {
                let updated = false;
                if (token.discordId && !dbUser.discordId) {
                    dbUser.discordId = token.discordId;
                    updated = true;
                }
                if (token.googleId && !dbUser.googleId) {
                    dbUser.googleId = token.googleId;
                    updated = true;
                }
                if (updated) await dbUser.save();

                // Populate token
                token.id = dbUser._id.toString();
                token.username = dbUser.username;
                token.hasCompletedOnboarding = dbUser.hasCompletedOnboarding || false;
                token.semester = dbUser.semester;
                token.section = dbUser.section;
                token.college = dbUser.college;
                token.totalBunks = dbUser.totalBunks || 0;
                token.followerCount = dbUser.followers?.length || 0;
                token.followingCount = dbUser.following?.length || 0;
                token.isDiscordLinked = !!dbUser.discordId;
                token.isGoogleLinked = !!dbUser.googleId;
                token.role = dbUser.role || 'user';
                token.group = dbUser.group;
            }

        } catch (error) {
            console.error('AUTH DEBUG: Error in JWT callback:', error);
        }
      }

      // Sync on subsequent visits (if not signing in)
      if (!account && token.id) {
          try {
            await dbConnect();
            const dbUser = await User.findById(token.id);
            if (dbUser) {
               token.hasCompletedOnboarding = dbUser.hasCompletedOnboarding || false;
               token.semester = dbUser.semester;
               token.section = dbUser.section;
               token.college = dbUser.college;
               token.totalBunks = dbUser.totalBunks || 0;
               token.followerCount = dbUser.followers?.length || 0;
               token.followingCount = dbUser.following?.length || 0;
               token.followingCount = dbUser.following?.length || 0;
               token.isDiscordLinked = !!dbUser.discordId;
               token.isGoogleLinked = !!dbUser.googleId;
               token.role = dbUser.role || 'user';
               token.group = dbUser.group;
            }
          } catch (error) {
             console.error('AUTH DEBUG: Error refreshing token:', error);
          }
      }

      return token;
    },
    async session({ session, token }) {
      // Pass data from token to session
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.hasCompletedOnboarding = token.hasCompletedOnboarding || false;
      session.user.semester = token.semester;
      session.user.section = token.section;
      session.user.college = token.college;
      session.user.totalBunks = token.totalBunks;
      session.user.followerCount = token.followerCount;
      session.user.followingCount = token.followingCount;
      session.user.provider = token.provider;
      
      session.user.isDiscordLinked = token.isDiscordLinked;
      session.user.isGoogleLinked = token.isGoogleLinked;
      session.user.isGoogleLinked = token.isGoogleLinked;
      session.user.role = token.role;
      session.user.group = token.group;
      
      return session;
    },
  },
});

