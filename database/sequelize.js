const Sequelize = require('sequelize');
const { connection } = require('./connection');

const UserModel = require('../models/User');
const CompanyModel = require('../models/Company');
const InviteModel = require('../models/Invite');
const CompanyMemberModel = require('../models/CompanyMember');

const User = UserModel(connection, Sequelize);
const Invite = InviteModel(connection, Sequelize);
const Company = CompanyModel(connection, Sequelize);
const CompanyMember = CompanyMemberModel(connection, Sequelize);

//CompanyMembers Constraints
User.belongsToMany(Company, {through: CompanyMember});
Company.belongsToMany(User, {through: CompanyMember});

//Invites Constraints
User.belongsToMany(Company, {through: { model: Invite, unique: false }});
Company.belongsToMany(User, {through: { model: Invite, unique: false }});

connection.sync({logging: console.log }).then(() => {
    console.log("Tables Created");
})

module.exports = { User, Company, Invite, CompanyMember }


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