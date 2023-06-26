export interface IUser {
  id: number;
  firstName: string;
  lastName: string | null;
  username: string | null;
  isPremium: boolean;
  isBot: boolean;
  languageCode: string | null;
  supportsInlineQueries: boolean;
  createdAt: Date;
}
