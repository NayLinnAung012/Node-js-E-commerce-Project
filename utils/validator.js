module.exports = {
    validateBody: (schema) => {
        return (req, res, next) => {
            const result = schema.validate(req.body);
            if (result.error) {
                next(new Error(result.error.details[0].message));
            } else {
                next();
            }
        }
    },
    validateParams:(schema,name)=>{
        return (req,res,next)=>{
            let obj = {};
            obj[`${name}`] = req.params[`${name}`];
            const result = schema.validate(obj);
            if(result.error){
                next(new Error(result.error.details[0].message))
            }else{
                next();
            }
        }
    }
}