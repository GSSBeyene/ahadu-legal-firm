export function canReadConsultations(roles: readonly { role: string }[]) {
  return roles.some((entry) => entry.role === 'team');
}