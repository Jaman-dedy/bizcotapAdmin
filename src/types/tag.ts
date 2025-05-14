// types/tag.ts

export interface Email {
  type: string;
  value: string;
}

export interface Phone {
  type: string;
  value: string;
}

export interface Website {
  type: string;
  value: string;
}

export interface Address {
  type: string;
  value: string;
}

export interface TagInfo {
  dob: string | null;
  mine?: number;
  fname: string;
  lname: string;
  notes: string | null;
  title: string | null;
  avatar: string | null;
  emails: Email[];
  phones: Phone[];
  company: string | null;
  position: string | null;
  websites: Website[];
  addresses: Address[];
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
}

export interface Tag {
  id: number;
  tuid: string;
  tagInfo: TagInfo;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  privacyPolicyAccepted: boolean;
  privacyPolicyVersion: string | null;
  privacyAcceptedDate: string | null;
  userId: number;
  companyId: number | null;
  tagOrderId: number | null;
  user: User;
  company: any | null;
}

export interface TagInput {
  userId: number;
  companyId: number | null;
  tagInfo: TagInfo;
}
