import Discord from "next-auth/providers/discord";
import Google from "next-auth/providers/google";

export const authConfig = {
  pages: {
    signIn: "/login",
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
    async jwt({ token, user, trigger, session }) {
        if (trigger === "update" && session) {
            token = { ...token, ...session };
        }
        if (user) {
            token.id = user.id;
            token.hasCompletedOnboarding = user.hasCompletedOnboarding;
            token.semester = user.semester;
            token.section = user.section;
            token.college = user.college;
            token.totalBunks = user.totalBunks;
            token.followerCount = user.followerCount;
            token.followingCount = user.followingCount;
            token.isDiscordLinked = user.isDiscordLinked;
            token.isGoogleLinked = user.isGoogleLinked;
        }
        return token;
    },
    async session({ session, token }) {
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.role = token.role;
        session.user.group = token.group;
        session.user.hasCompletedOnboarding = token.hasCompletedOnboarding;
        session.user.semester = token.semester;
        session.user.section = token.section;
        session.user.college = token.college;
        session.user.totalBunks = token.totalBunks;
        session.user.followerCount = token.followerCount;
        session.user.followingCount = token.followingCount;
        
        session.user.isDiscordLinked = token.isDiscordLinked;
        session.user.isGoogleLinked = token.isGoogleLinked;
        
        return session;
    },
    authorized({ auth, request }) {
      const { nextUrl } = request;
      const isLoggedIn = !!auth?.user;
      const isOnboarding = nextUrl.pathname.startsWith('/onboarding');
      const isApi = nextUrl.pathname.startsWith('/api');
      const isAuth = nextUrl.pathname.startsWith('/auth') || nextUrl.pathname.startsWith('/login');
      const isPublic = nextUrl.pathname === '/' || nextUrl.pathname.startsWith('/static');

      if (isApi || isAuth || isPublic) {
        return true;
      }

      if (isLoggedIn) {
        const hasCompletedOnboarding = auth.user.hasCompletedOnboarding;

        // specific check: if user is logged in, has NOT completed onboarding, and is not on onboarding page -> redirect to onboarding
        if (!hasCompletedOnboarding && !isOnboarding) {
          return Response.redirect(new URL('/onboarding', nextUrl));
        }

        // if user HAS completed onboarding and tries to go to onboarding -> redirect to attendance
        if (hasCompletedOnboarding && isOnboarding) {
          return Response.redirect(new URL('/attendance', nextUrl));
        }
      } else {
        // Not logged in and trying to access protected route -> redirect to login
        if (!isPublic && !isOnboarding) {
           return false; // Redirect to login
        }
      }

      return true;
    },
  },
};
