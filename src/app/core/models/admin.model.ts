export interface Role {
    id: string;
    role: string;
    site: string;
    siteRequestStatus: string
}

export interface User {
    givenName: string;
    surname: string;
    email: string;
    objectId: string;
    accountEnabled: boolean,
    selectedRole: any,
    accountStatus: string,
    ifNoPendingRequest: boolean
}