import Joi from 'joi';
import joi from 'joi';
const userSchema=Joi.object({
    name:Joi.string().min(3).required(),
    email:joi.string().email().required(),

})

const validateUserInput=(req,res,next)=>{
    const {error}=userSchema.validate(req.body);
    if(error){
        return res.status(400).json({error:error.details[0].message});
    }
    next();
}

export default validateUserInput;

