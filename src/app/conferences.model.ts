export const conferences: Conference[] = [
  {code: 'default', description: 'Select a Conference'},
  {code: 'East', description: 'Eastern Conference'},
  {code: 'West', description: 'Western Conference'}
];
export interface Conference {
  code: string;
  description: string;
}
