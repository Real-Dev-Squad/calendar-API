// Add interfaces for the providers' schema

interface GoogleOAuthJson {
  sub: string;
  name: string;
  given_name: string;
  family_name: string;
  picture: string;
  email: string;
  email_verified: boolean;
  locale: string;
  hd: string;
}

interface MicrosoftOAuthJson {
  id: string;
  surname: string;
  givenName: string;
  displayName: string;
  mail: string;
  userPrincipalName: string;
  email_verified: boolean;
}

export { GoogleOAuthJson, MicrosoftOAuthJson };
