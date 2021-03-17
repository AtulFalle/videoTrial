/**
 * Enter here the user flows and custom policies for your B2C application,
 * To learn more about user flows, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/user-flow-overview
 * To learn more about custom policies, visit https://docs.microsoft.com/en-us/azure/active-directory-b2c/custom-policy-overview
 */
export const b2cPolicies = {
  names: {
    signUpSignIn: 'B2C_1A_signup_signin',
    forgotPassword: 'B2c_1A_PasswordReset',
    editProfile: 'B2C_1A_ProfileEdit',
  },
  authorities: {
    signUpSignIn: {
      authority:
        'https://biogenb2cnonprod.b2clogin.com/biogenb2cnonprod.onmicrosoft.com/B2C_1A_signup_signin',
    },
    forgotPassword: {
      authority:
        'https://biogenb2cnonprod.b2clogin.com/biogenb2cnonprod.onmicrosoft.com/B2c_1A_PasswordReset',
    },
    editProfile: {
      authority:
        'https://biogenb2cnonprod.b2clogin.com/biogenb2cnonprod.onmicrosoft.com/B2C_1A_ProfileEdit',
    },
  },
  authorityDomain: 'biogenb2cnonprod.b2clogin.com',
};

/**
 * Enter here the coordinates of your Web API and scopes for access token request
 * The current application coordinates were pre-registered in a B2C tenant.
 */
export const apiConfig: { scopes: string[]; uri: string } = {
  scopes: [
    'https://BiogenB2CNonProd.onmicrosoft.com/891277f7-2881-4abd-afd8-11b517c07745/user_imporsonation',
  ],
  uri: 'https://biogenb2cnonprodhello.azurewebsites.net/hello',
};
