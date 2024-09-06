export interface ProfileStoreData {
  data: {
    _id: string,
    email: string,
    profile: {
      name: string,
      phone: string
    }
  } | null,
  waiting: boolean,
}

export interface ProfileStoreConfig {
  log?: boolean,
  name?: string
}
