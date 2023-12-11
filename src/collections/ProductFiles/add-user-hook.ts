import { BeforeChangeHook } from "payload/dist/collections/config/types";
import { User } from "../../payload-types";

export const addUser: BeforeChangeHook = ({ req, data }) => {
  const user = req.user as User | null;
  return { ...data, user: user?.id };
};
