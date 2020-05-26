module.exports = (sequelize, type) => {

    const Invite = sequelize.define('invite', {
        id: {
            type: type.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        companyId: {
            type: type.INTEGER,
            unique: false
        },
        userId: {
            type: type.INTEGER,
            unique: false
        },
        status: {
            type: type.STRING
        }
    })
    
    return Invite

}

/*
NOTE:
The belongsToMany methods (inside database>>sequelize.js) create FKs.
So when i tried to include another invite for the same user from the same company (since the first one was cancelled), mysql throws an error like:

"USER_ID x COMPANY_ID already exists".

So i had to get inside the container and excludo manually.

May have an better way to do this, maybe with migrations, for now this will be the palliative solution.
*/

/*
USE INFORMATION_SCHEMA;
SELECT TABLE_NAME,
       COLUMN_NAME,
       CONSTRAINT_NAME,
       REFERENCED_TABLE_NAME,
       REFERENCED_COLUMN_NAME
FROM KEY_COLUMN_USAGE  
WHERE TABLE_SCHEMA = "vistolog" 
      AND TABLE_NAME = "invites" 
      AND REFERENCED_COLUMN_NAME IS NOT NULL;
*/

//alter table invites drop foreign key invites_ibfk_1;
//alter table invites drop foreign key invites_ibfk_2;
//alter table invites drop index userId;
//alter table invites drop index invites_companyId_userId_unique;