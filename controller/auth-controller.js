const authService = require('../service/auth-service');
const {validationResult} = require('express-validator');
const ApiError = require('../exceptions/api-error');

class AuthController{
    async register(req,res,next){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation Error', errors.array()))
            }
            const {cid, password, name} = req.body;
            const token = await authService.register(cid, password,name)
            res.json({accessToken:token});
        } catch (err) {
            next(err)
        }
    }
    async staffRegister(req,res,next){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Validation Error', errors.array()))
            }
            if(req.user.type !== "Admin"){
                return next(ApiError.UnauthorizedError("No privileges"))
            }

            const {cid, password, name,type} = req.body;
            const user = await authService.registerStaff(cid, password,name,type)
            res.json({user});
        } catch (err) {
            next(err)
        }
    }
    async login(req,res,next){
        try {
            const {cid, password} = req.body;
            const token = await authService.login(cid,password)
            res.json({accessToken:token});
        } catch (err) {
            next(err)
        }
    }
    async me(req,res,next){
        try{
            const {cid} = req.user
            const user = await authService.me(cid)
            res.json({user})
        }catch (err) {
            next(err);
        }
    }
}

module.exports = new AuthController()