import { createContext, useContext } from 'react';
import type { User } from '@supabase/supabase-js';
export const TeamSessionContext = createContext<User | null>(null);
export const useTeamSession = () => useContext(TeamSessionContext);