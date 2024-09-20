# Flow Diagram and Explanation of the Directory

Here’s a full flow diagram to represent the structure and flow of authentication in the `auth` folder, including all the components we’ve discussed: registration, login, password recovery, and email verification.

The flow breaks down into the following key areas:

1. **Registration**: Where a user registers an account and gets an email verification.
2. **Login**: Where a user logs in with their credentials (email and password).
3. **Password Recovery**: Where a user requests a password reset and is able to reset it using a link sent via email.
4. **Email Verification**: Where a user verifies their email by following a link sent to their inbox.

## Flow Breakdown

1. **`/api/auth/register`**

   - **Frontend Request**: User submits name, email, and password to `/api/auth/register`.
   - **Backend Actions**:
     - Check if the user already exists.
     - Hash the password using `bcrypt`.
     - Create a new user in the `users` table.
     - Generate a verification token.
     - Store the token in the `email_verifications` table.
     - Send a verification email with the token in the URL.
   - **Response**: Registration success with JWT token and user data.

2. **`/api/auth/login`**

   - **Frontend Request**: User submits email and password to `/api/auth/login`.
   - **Backend Actions**:
     - Find the user by email.
     - Check if the password matches using `bcrypt.compare`.
     - Generate a JWT token if credentials are valid.
     - Send the token and user data in the response.
   - **Response**: Login success with JWT token and user data.

3. **`/api/auth/recover`** (Password Recovery)

   - **Frontend Request**: User submits their email to `/api/auth/recover` to request a password reset.
   - **Backend Actions**:
     - Check if the user exists in the database.
     - Generate a password reset token using `crypto`.
     - Store the token in the `password_resets` table.
     - Send an email with a reset password link containing the token.
   - **Response**: Confirmation that the recovery email has been sent.

4. **`/api/auth/reset`** (Password Reset)

   - **Frontend Request**: User clicks the reset link, submits the new password, token, and email to `/api/auth/reset`.
   - **Backend Actions**:
     - Validate the token and email by checking the `password_resets` table.
     - Check if the token is still valid (e.g., not expired).
     - Hash the new password using `bcrypt`.
     - Update the user’s password in the `users` table.
     - Delete the token from the `password_resets` table.
   - **Response**: Confirmation that the password has been reset.

5. **`/api/auth/send-verification`** (Send Email Verification)

   - **Frontend Request**: User requests email verification (usually after registration or upon request) to `/api/auth/send-verification`.
   - **Backend Actions**:
     - Check if the user exists and if the email is already verified.
     - Generate a verification token using `crypto`.
     - Store the token in the `email_verifications` table.
     - Send a verification email with the token.
   - **Response**: Confirmation that the verification email has been sent.

6. **`/api/auth/verify-email`** (Verify Email)
   - **Frontend Request**: User clicks the verification link and submits the token and email to `/api/auth/verify-email`.
   - **Backend Actions**:
     - Validate the token and email by checking the `email_verifications` table.
     - Check if the token is still valid (e.g., not expired).
     - Mark the user’s email as verified by updating the `users` table.
     - Delete the token from the `email_verifications` table.
   - **Response**: Confirmation that the email has been verified.

---

## Full Flow Diagram

Here’s a textual breakdown of the graph structure for authentication. A graphical representation would look like a series of connected actions and responses for each component:

```plaintext
/-------------------\   /------------------\   /-----------------------\
|  /api/auth/register  | → | Generate JWT       | → | Store User and Token   |
\-------------------/   \------------------/   \-----------------------/
/-------------------\   /------------------\   /-----------------------\
|  /api/auth/login     | → | Validate Credentials | → | Return JWT Token     |
\-------------------/   \------------------/   \-----------------------/
/-------------------\   /------------------\   /-----------------------\
|  /api/auth/recover    | → | Generate Reset Token  | → | Send Reset Email    |
\-------------------/   \------------------/   \-----------------------/
/-------------------\   /------------------\   /-----------------------\
|  /api/auth/reset      | → | Validate Token      | → | Update User Password |
\-------------------/   \------------------/   \-----------------------/
/-------------------\   /------------------\   /-----------------------\
|  /api/auth/send-verif | → | Generate Verif Token  | → | Send Verif Email    |
\-------------------/   \------------------/   \-----------------------/
/-------------------\   /------------------\   /-----------------------\
|  /api/auth/verify-email| → | Validate Token      | → | Mark Email Verified  |
\-------------------/   \------------------/   \-----------------------/
```

---

## Database Tables

- **`users`**: Holds the registered user information, including `email`, `password`, `email_verified_at`, etc.
- **`password_resets`**: Stores the tokens for password reset functionality.
- **`email_verifications`**: Stores the tokens for email verification functionality.

This flow provides an overview of the interactions between the frontend and backend during the authentication process.
