import { describe, expect, it } from 'vitest';
import { canReadConsultations } from '@/lib/team-access';
describe('Consultation access', () => {
  it('allows approved team members to read consultations', () => { expect(canReadConsultations([{ role: 'team' }])).toBe(true); });
  it('denies signed-in users without team membership', () => { expect(canReadConsultations([])).toBe(false); expect(canReadConsultations([{ role: 'user' }])).toBe(false); });
});