import { connectToDatabase } from "@/lib/db";
import { UserModel, type UserDocument } from "@/lib/models/User";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
const COOKIE_NAME = "pulse_terminal_session";
function getSecret() { const secret = process.env.AUTH_SECRET; if (!secret) throw new Error("Missing AUTH_SECRET."); return new TextEncoder().encode(secret); }
export type SessionPayload = { userId: string; email: string; name: string; plan: "Free" | "Basic" | "Pro"; };
export async function hashPassword(password: string) { return bcrypt.hash(password, 10); }
export async function verifyPassword(password: string, hash: string) { return bcrypt.compare(password, hash); }
export async function signSession(payload: SessionPayload) { return new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("14d").sign(getSecret()); }
export async function readSessionToken(token: string) { const { payload } = await jwtVerify(token, getSecret()); return payload as unknown as SessionPayload; }
export async function setSessionCookie(payload: SessionPayload) { const token = await signSession(payload); const store = await cookies(); store.set(COOKIE_NAME, token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 14 }); }
export async function clearSessionCookie() { const store = await cookies(); store.set(COOKIE_NAME, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 }); }
export async function getCurrentUser(): Promise<UserDocument | null> { const store = await cookies(); const token = store.get(COOKIE_NAME)?.value; if (!token) return null; try { const session = await readSessionToken(token); await connectToDatabase(); return await UserModel.findById(session.userId).lean<UserDocument | null>(); } catch { return null; } }
export async function requireUser() { const user = await getCurrentUser(); if (!user) throw new Error("Unauthorized"); return user; }
export function serializeUser(user: Pick<UserDocument, "_id" | "name" | "email" | "plan" | "subscriptionStatus" | "stripeCustomerId" | "currentPeriodEnd">) { return { id: String(user._id), name: user.name, email: user.email, plan: user.plan, subscriptionStatus: user.subscriptionStatus, stripeCustomerId: user.stripeCustomerId || null, currentPeriodEnd: user.currentPeriodEnd ? new Date(user.currentPeriodEnd).toISOString() : null, isPremium: user.plan === "Basic" || user.plan === "Pro", isPro: user.plan === "Pro" }; }
