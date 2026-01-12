"use server";

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function loginAction(userId: string) {
  const cookieStore = await cookies();
  // Cookie setzen, gültig für 7 Tage
  cookieStore.set('userId', userId, { 
    path: '/',
    maxAge: 60 * 60 * 24 * 7 
  });
  
  redirect('/');
}

export async function logoutAction() {
    const cookieStore = await cookies();
    cookieStore.delete('userId');
    redirect('/login');
}
