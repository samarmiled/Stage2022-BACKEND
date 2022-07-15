//Validation
const Joi = require('@hapi/joi')
const JoiDate = require('@hapi/joi').extend(require('@joi/date'))
const registerValidation = (data) => {
    const schema = Joi.object().keys({
        fullname : Joi.string().alphanum().min(6).required(),
        birthday : JoiDate.date(),
        pays : Joi.string().required() ,
        etude : Joi.string().required(),
        experience : Joi.string().required(),
        email : Joi.string().max(30).required().email(),
        password : Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(8).required()
    });
    return schema.validate(data);
};
const loginValidation = (data) => {
    const schema = Joi.object().keys({
        email : Joi.string().max(30).required().email(),
        password : Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')).min(8).required()
    });
    return schema.validate(data);
}
module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;