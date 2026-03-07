export const ROLE_ACCESS = {
  SUPER_ADMIN: ["*"],

  ADMIN: [
    "overview",
    // "sales",
    "operations",
    "clients",
    "finance",
    // "performance",
    "identity",
    "blogs"
  ],

  SALES_MANAGER: [
    "overview",
    "sales",
    "clients",
    "blogs",

  ],

  OPERATIONS_MANAGER: [
    "overview",
    "operations",
    "clients"
  ],

  FINANCE_MANAGER: [
    "overview",
    "finance"
  ],

  HR_MANAGER: [
    "overview",
    "performance"
  ],

  CONTENT_MANAGER: [
    "overview",
    "blogs"
  ]
};