//Standarize Response fucntion

const handleResponse=(res,status,message,data=null)=>{
    res.status(status).json({
        status:status,
        message:message,
        data:data
    })
}

export const createUser=async(req,res,next)=>{

    const {name,email}=req.body;
    try{
        const newUser=await  crreateUserService(name,email);
        handleResponse(res,201,"User created successfully",newUser);
    }catch(err){
        next(err);
    }
}

export const getAllusers=async(req,res,next)=>{
    try{
        const users=await getAllUsersService();
        handleResponse(res,200,"Users fetched successfully",users);
    }
    catch(err){
        next(err);
    }   
};

export const getuserById=async(req,res,next)=>{
    const {id}=req.params;

    try{
        const user=await getUserByIdService(id);
        if
(!user){
            return handleResponse(res,404,"User not found");
        }   
        handleResponse(res,200,"User fetched successfully",user);
    }catch(err){
        next(err);
    }
}

export const updateUser=async(req,res,next)=>{
    const {id}=req.params;
    const {name,email}=req.body;
    try{
        const updatedUser=await updateUserService(id,name,email);
        handleResponse (res,200,"User updated successfully",updatedUser);
    }catch(err){
        next(err);
    }
}
export const deleteUser=async(req,res,next)=>{
    const {id}=req.params;  

    try{
        const deletedUser=await deleteUserService(id);
        handleResponse(res,200,"User deleted successfully",deletedUser);
    }catch(err){
        next(err);
    }
}