function auth (req, res, next) {
    if(req.session?.user.username === 'milton' && req.session?.user.admin){
        return next()
    }

    return res.status(401).send('Error de autenticación')
}

export default auth