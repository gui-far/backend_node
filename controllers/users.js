const auth = require('../middleware/auth');
const { User } = require('../database/sequelize');

//Create an User
async function postUser(req, res) {

    const { email, password } = req.body;

    if (!email || !password) {

        return res.json({ error: 'Dados insuficientes' });
    }

    const newUser = { email, password };

    try {

        if (await User.findOne({ where: { email: email } })) {

            return res.json({ error: "Email já cadastrado" });

        }

        if (await User.create(newUser)) {

            res.json({ message: true });

        }

    } catch (err) {

        return res.json({ error: "ERRO - POST - USUARIO: " + err });

    };
}

//Login - Return token when success 
async function postAuth(req, res) {

    const { email, password } = req.body;

    if (!email || !password) return res.json({ error: "Dados insuficientes!" });

    try {

        const user = await User.findOne({ where: { email: email } });

        if (!user) {

            return res.json({ error: 'Usuário não registrado' });

        }

        const pass_ok = auth.validateUserPassword(password, user.password);

        if (!pass_ok) {

            return res.json({ error: 'Erro ao autenticar usuário' });

        }

        return res.json({ message: { token: auth.getUserToken(user.id) } });

    } catch (err) {

        return res.json({ error: 'Erro ao logar usuário' });

    };
}

async function getAuth(req, res) {

    return res.json({ message: true })

}

module.exports = { postUser, postAuth, getAuth }