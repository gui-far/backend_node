const bodyParser = require('body-parser');
const express = require('express');
const app = express();

const auth = require('./middleware/auth');

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.listen(3000);

//Token Validation occurs here
app.use(auth.validateUserToken);


//Routes Call
const usersRoute = require('./routes/users');
app.use('/api/users', usersRoute);

const companiesRoute = require('./routes/companies');
app.use('/api/companies', companiesRoute);

const invitesRoute = require('./routes/invites');
app.use('/api/invites', invitesRoute);

const companyMembersRoute = require('./routes/companyMembers');
app.use('/api/companyMembers', companyMembersRoute);

module.exports = app;

/*
STATUS
200 - OK
201 - Created
202 - Accepted

400 - Bad Request - "ERRO GENERICO"
401 - Unauthorized -- AUTHENTICATION, you can access by passing the appropriate credentials
403 - Forbiden -- AUTHORIZATION, you can be logged in properly, i know your profile and you should not access this content

500 - Internal Server Error
501 - Not Implemented
503 - Service Unavaiable - I have this function but it isn't available
*/