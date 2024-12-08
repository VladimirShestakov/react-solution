export interface ProfileStoreData {
  data: {
    _id: string;
    email: string;
    profile: {
      name: string;
      phone: string;
    };
  } | null;
  waiting: boolean;
}

export type ProfileStoreConfig = object;
