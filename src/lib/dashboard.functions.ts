import { createServerFn } from '@tanstack/react-start';
import { z } from 'zod';
import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware';
import { canReadConsultations } from './team-access';

export const getDashboard = createServerFn({ method: 'GET' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { page: number; search: string }) => z.object({ page: z.number().int().min(0), search: z.string().max(100) }).parse(input))
  .handler(async ({ data, context }) => {
    const { data: roles, error: roleError } = await context.supabase.from('user_roles').select('role').eq('user_id', context.userId);
    if (roleError || !canReadConsultations(roles ?? [])) throw new Error('This account is not approved for team access.');
    let query = context.supabase.from('consultations').select('*', { count: 'exact' }).order('created_at', { ascending: false });
    if (data.search.trim()) query = query.ilike('client_name', `%${data.search.trim().replace(/[%_]/g, '')}%`);
    const { data: cases, count, error } = await query.range(data.page * 20, data.page * 20 + 19);
    if (error) throw new Error('Consultations could not be loaded. Please try again.');
    const { data: profile } = await context.supabase.from('profiles').select('display_name').eq('id', context.userId).single();
    return { cases: cases ?? [], count: count ?? 0, profile: profile?.display_name ?? '' };
  });

export const saveProfile = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { displayName: string }) => z.object({ displayName: z.string().trim().min(1).max(100) }).parse(input))
  .handler(async ({ data, context }) => {
    const { error } = await context.supabase.from('profiles').update({ display_name: data.displayName }).eq('id', context.userId);
    if (error) throw new Error('Your profile could not be saved.');
    return { success: true };
  });