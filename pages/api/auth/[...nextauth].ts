import NextAuth, { Session, User } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import Cookie from "js-cookie";
import { signIn } from "next-auth/react";

let fullProfile: Session;
export default NextAuth({
    callbacks: {
        async signIn({ user, account, profile, email, credentials }) {
            console.log(profile)
            profile.user = user
            fullProfile = <Session> profile
            return true;
        },
        async session({ session, user }) {
            session = fullProfile
            return session;
        }
    },
	providers: [
		DiscordProvider({
			clientId: process.env.DISCORD_ID!,
			clientSecret: process.env.DISCORD_SECRET!,
            authorization: { params: { scope: "identify" } }
		})
	],
});
