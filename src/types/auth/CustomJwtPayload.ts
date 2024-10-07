import { JwtPayload } from "jwt-decode";

export interface CustomJwtPayload extends JwtPayload {
  id?: string;
  email?: string;
  name?: string;
  email_verified_at?: string | null;
  isAdmin: boolean;
}
