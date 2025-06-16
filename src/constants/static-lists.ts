import USER_ROLES from "@/schemas/auth/user-roles";

export const ADMIN_DEFAULTS = {
  username: "admin",
  role: USER_ROLES.ADMINISTRATOR,
};

export const SU_ADMIN_DEFAULTS = {
  username: "su_admin",
  role: USER_ROLES.ADMINISTRATOR,
};
