export const API_CONFIG = {
  contact: import.meta.env.VITE_NEON_FUNCTION_CONTACT_URL || "https://br-raspy-moon-az1535z7-contact.compute.c-3.ap-southeast-1.aws.neon.tech",
  submissions: import.meta.env.VITE_NEON_FUNCTION_SUBMISSIONS_URL || "https://br-raspy-moon-az1535z7-submissions.compute.c-3.ap-southeast-1.aws.neon.tech",
  updateStatus: import.meta.env.VITE_NEON_FUNCTION_UPDATESTATUS_URL || "https://br-raspy-moon-az1535z7-updatestatus.compute.c-3.ap-southeast-1.aws.neon.tech",
  setupDb: import.meta.env.VITE_NEON_FUNCTION_SETUPDB_URL || "https://br-raspy-moon-az1535z7-setupdb.compute.c-3.ap-southeast-1.aws.neon.tech",
  products: import.meta.env.VITE_NEON_FUNCTION_PRODUCTS_URL || "https://br-raspy-moon-az1535z7-products.compute.c-3.ap-southeast-1.aws.neon.tech",
}
