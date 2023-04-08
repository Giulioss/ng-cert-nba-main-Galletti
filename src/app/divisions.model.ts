export const divisions: Division[] = [
  {code: 'Southeast', description: 'Southeast Division', conferenceCode: 'East'},
  {code: 'Atlantic', description: 'Atlantic Division', conferenceCode: 'East'},
  {code: 'Central', description: 'Central Division', conferenceCode: 'East'},
  {code: 'Northwest', description: 'Northwest Division', conferenceCode: 'West'},
  {code: 'Pacific', description: 'Pacific Division', conferenceCode: 'West'},
  {code: 'Southwest', description: 'Southwest Division', conferenceCode: 'West'}
];

export interface Division {
  code: string;
  description: string;
  conferenceCode: string;
}
