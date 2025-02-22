// person.interface.ts
export interface Person {
  email: string;
  fullName: string;
}

export interface LoginResponse {
  token: string;
  user: Person;
}

export interface RegisterResponse {
  token: string;
  user: Person;
}

export interface User extends Person {}
