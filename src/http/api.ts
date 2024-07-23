const API = {
  "login": "api/Auths/loginweb",
  "otp_trust": "api/Auths/otp-trust",
  "resend_otp": "api/Auths/resend-otp",
  "reset_password": "api/Auths/reset-password",
  "forgot_password": "api/Auths/forget-password",
  "login_refreshtoken": "api/Auths/login-refreshtoken",
  "user_update_password": "api/Users/updatepassword",
  "get_me": "api/Users/getmeweb",
  "search": "",
  "staffs_get": "api/Staffs/getlist",
  "staff_create": "api/Users/create",
  "staff_delete": "api/Users/remove",
  "organizations_get": "api/Organizations/getpaginationlist",
  "organization_create": "",
  "organization_delete": "api/Organizations/delete",
  "organization_status": "api/Organizations/updateActiveOrDeactive",
  "organization_requests_all":"request/organization-requests",
  "organization_comments":"api/v1/comments",
  "create_comment" :"api/v1/comments/post",
};

export default API;