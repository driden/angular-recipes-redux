export class User {
  constructor(
    public email: string,
    public id: string,
    private userToken: string,
    private tokenExpiration: Date
  ) {}

  get token() {
    if (!this.tokenExpiration || this.tokenExpiration < new Date()) {
      return null;
    }
    return this.userToken;
  }
}
