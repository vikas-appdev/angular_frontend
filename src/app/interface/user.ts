export interface User {
  id: number;
  userId: string; // extra
  firstName: string;
  lastName: string;
  username: string; // extra
  email: string; // UNIQUE
  profileImageUrl: string; // CDN flaticon avtar 512 149
  lastLoginDate: Date;
  lastLoginDateDisplay: Date;
  createdAt: Date;
  active: boolean; // enabled
  notLocked: boolean;
  userNFCIdCardNumber: string;
  aadhaarNumber: string;
  mobileNumber: string;
  title: string;
  bio: string;
  usingMFA: boolean; // Multi factor authentication
  address?: Address;

  roleName: string;
  permissions: string;
}

export interface Address {
  doorNumber: string;
  street: string;
  locality: string;
  city: string;
  state: string;
  pincode: number;
  country: string;
  latitude: number;
  longitude: number;
}
