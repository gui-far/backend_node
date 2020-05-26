============================================================================================================================

Instructions:

Download and simply run...

"npm i"
"docker-compose up"


============================================================================================================================

Dependencies

bcryptjs:       Encrypts password
body-parser:    Handles requests content
express:        Backend Framework
jsonwebtoken:   Generate tokens
mysql2:         Database
sequelize:      ORM (Manages the backend integration with the database)

============================================================================================================================

What you can do with this?

You can...

1. Create an User login.
    Checks if the login already exists
    Encrypts the password

2. Log-in
    Check if password match
    Create and session tokens

3. Create/Update a Company
    Check if the company's name already exists

4. Invite
    The company Administrator can invite any user.
    The company administrator can check all invited users.
    The company Administrator can cancel an invite.
    The user can check the invitations received from different companies.
    The user can reject an invite.
    The user can accept an invite.

    The user can only be invited once per company.
    When a user accepts a company invitation, the remaining invitations will be declined.

    An user can belongs to only one Company.
    Company members cannot be invited.

5. Company Members
    Get all company members

============================================================================================================================

About this little project:

Auth:
Have four routes: users, companies, invites, companyMembers.
There's a file called "auth.js" that checks all incoming request.
Sometimes, a path does not need to be verified, for these cases there is a file called "ignoredPaths.js".
The "auth.js" file already set "local" variables with UserId, CompanyId and Role.

Docker:
There are 2 containers.
One with Alpine Image and NodeJs and One with Mysql Image.
They share they own container network.
The Mysql container have a shared volume with the host. This volume will allow "see" all files from this project.

============================================================================================================================
