

export type UserRole = "admin" | "client" | "administrator" | "frontdesk" | "employee";

interface RolePermissionsForMicroForm {
  canEditFields: boolean;
  canEditPathogenicCheckboxes: boolean;
  canEditResultCheckboxes:boolean;
  canEditComments: boolean;
  canSubmit: boolean;
}

interface RolePermissionsForChemicalForm{
    canEditFields:boolean;
    canEditActiveIngredient:boolean;
    canEditResultFields:boolean;
    canEditComments:boolean;
    canSubmit:boolean;
}

export const RolePermissionsForMicroForm: Record<UserRole, RolePermissionsForMicroForm> = {
  admin: {
    canEditFields: false,
    canEditPathogenicCheckboxes:false,
    canEditResultCheckboxes:false,
    canEditComments: false,
    canSubmit: false,
  },
  client: {
    canEditFields: true,
    canEditPathogenicCheckboxes:true,
    canEditResultCheckboxes:false,
    canEditComments: false,
    canSubmit: true,
  },
  administrator: {
    canEditFields: false,
    canEditPathogenicCheckboxes:false,
    canEditResultCheckboxes:true,
    canEditComments: true,
    canSubmit: true,
  },
  employee: {
    canEditFields: false,
    canEditPathogenicCheckboxes:false,
    canEditResultCheckboxes:true,
    canEditComments: true,
    canSubmit: false,
  },
  frontdesk: {
    canEditFields: false,
    canEditPathogenicCheckboxes:false,
    canEditResultCheckboxes:false,
    canEditComments: false,
    canSubmit: false,
  },
};

export const RolePermissionsForChemicalForm : Record<UserRole,RolePermissionsForChemicalForm> = {
    admin: {
        canEditFields: false,
        canEditActiveIngredient:false,
        canEditResultFields:false,
        canEditComments: false,
        canSubmit: false,
      },
      client: {
        canEditFields: true,
        canEditActiveIngredient:true,
        canEditResultFields:false,
        canEditComments: false,
        canSubmit: true,
      },
      administrator: {
        canEditFields: false,
        canEditActiveIngredient:false,
        canEditResultFields:true,
        canEditComments: true,
        canSubmit: true,
      },
      employee: {
        canEditFields: false,
        canEditActiveIngredient:false,
        canEditResultFields:true,
        canEditComments: true,
        canSubmit: false,
      },
      frontdesk: {
        canEditFields: false,
        canEditActiveIngredient:false,
        canEditResultFields:false,
        canEditComments: false,
        canSubmit: false,
      },
};

// ✅ Function to safely retrieve permissions with a default fallback
export const getRolePermissionsForMicroForm = (role: string): RolePermissionsForMicroForm => {
  return RolePermissionsForMicroForm[role as UserRole] || RolePermissionsForMicroForm["frontdesk"];
};


export const getRolePermissionsForChemicalForm = (role:string):RolePermissionsForChemicalForm =>{
    return RolePermissionsForChemicalForm[role as UserRole] || RolePermissionsForChemicalForm["frontdesk"]
};
