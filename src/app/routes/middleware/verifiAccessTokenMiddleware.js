const Users = require('../../models/users')
const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
    try {
        if (!req.headers['authorization']){
            return res.status(400).json({msg: "Token de acesso não informado"})
        }

        const token = req.headers['authorization'].split(' ')
        if (token[0] !== 'Bearer') {
            return res.status(400).json({msg: "Token de acesso informadado porém com formado inválido"})
        }

        const user = await jwt.verify(token[1], 'TOP_SECRET')
        req.body.user = await Users.findOne({email: user.email})

        next()

    } catch (error) {
        return res.status(400).json({msg: "Não foi possível validar o token"})
    }
}
