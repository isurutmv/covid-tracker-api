(() => {
    ("use strict");

    const Role = require("../repositories/role.repository");
    const User = require("../repositories/auth.repository");
    const content = require("../../../static/static.json");

  const deleteRole = async(roleId)=>{
   const role = await Role.getOne(roleId);
   if(role.isDefault){
       throw new Error(content.ERROR_MESSAGES.CAN_NOT_DELETE_DEFAULT_ROLE);
   }
   // check role already assigend or not
      const isAssign = await User.checkRole(roleId);
   if(isAssign){
       throw new Error(content.ERROR_MESSAGES.ROLE_ALREADY_ASSIGNED);
   }
   return await Role.delete(roleId);
  }


    module.exports = {
        deleteRole
    };
})();
