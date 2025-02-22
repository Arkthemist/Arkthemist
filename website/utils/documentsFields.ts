export const servicesContractFields = [
  {
    id: "client_name",
    isLocked: false,
    isRequired: true,
    name: "Client Name",
    type: "string"
  },
  {
    id: "service_provider_name",
    isLocked: false,
    isRequired: true,
    name: "Service Provider Name",
    type: "string"
  },
  {
    id: "company_name",
    isLocked: false,
    isRequired: true,
    name: "Company Name",
    type: "string"
  },
  {
    id: "client_address",
    isLocked: false,
    isRequired: true,
    name: "Client Address",
    type: "string"
  },
  {
    id: "service_provider_address",
    isLocked: false,
    isRequired: true,
    name: "Service Provider Address",
    type: "string"
  },
  {
    id: "start_date_of_agreement",
    isLocked: false,
    isRequired: true,
    name: "Start Date of Agreement",
    type: "string"
  },
  {
    id: "end_date",
    isLocked: false,
    isRequired: false,
    name: "End Date",
    type: "string"
  },
  {
    id: "scope_of_work",
    isLocked: false,
    isRequired: true,
    name: "Scope of Work",
    type: "string"
  },
  {
    id: "project_location",
    isLocked: false,
    isRequired: true,
    name: "Project Location",
    type: "string"
  },
  {
    id: "payment_amount",
    isLocked: false,
    isRequired: true,
    name: "Payment Amount ($)",
    type: "number"
  },
];

export const powerOfAttorneyFields = [
  {
    id: "full_name_principal",
    isLocked: false,
    isRequired: true,
    name: "Full Name of Principal",
    type: "string"
  },
  {
    id: "principal_address",
    isLocked: false,
    isRequired: true,
    name: "Principal Address",
    type: "string"
  },
  {
    id: "principal_phone_number",
    isLocked: false,
    isRequired: true,
    name: "Principal Phone Number",
    type: "string"
  },
  {
    id: "type_of_power_granted",
    isLocked: false,
    isRequired: true,
    name: "Type of Power Granted",
    type: "string"
  },
  {
    id: "effective_date",
    isLocked: false,
    isRequired: true,
    name: "Effective Date",
    type: "string"
  },
  {
    id: "expiration_date",
    isLocked: false,
    isRequired: true,
    name: "Expiration Date",
    type: "string"
  },
  {
    id: "specific_powers_granted",
    isLocked: false,
    isRequired: true,
    name: "Specific Powers Granted",
    type: "string"
  },
  {
    id: "witness_name_1",
    isLocked: false,
    isRequired: true,
    name: "Witness Name 1",
    type: "string"
  },
  {
    id: "witness_name_2",
    isLocked: false,
    isRequired: true,
    name: "Witness Name 2",
    type: "string"
  }
];

export const nonDisclosureAgreementFields = [
  {
    id: "full_name_disclosing_party",
    isLocked: false,
    isRequired: true,
    name: "Full Name of Disclosing Party",
    type: "string"
  },
  {
    id: "disclosing_party_company_name",
    isLocked: false,
    isRequired: false,
    name: "Disclosing Party Company Name",
    type: "string"
  },
  {
    id: "disclosing_party_address",
    isLocked: false,
    isRequired: true,
    name: "Disclosing Party Address",
    type: "string"
  },
  {
    id: "full_name_receiving_party",
    isLocked: false,
    isRequired: true,
    name: "Full Name of Receiving Party",
    type: "string"
  },
  {
    id: "receiving_party_company_name",
    isLocked: false,
    isRequired: true,
    name: "Receiving Party Company Name",
    type: "string"
  },
  {
    id: "purpose_of_nda",
    isLocked: false,
    isRequired: true,
    name: "Purpose of NDA",
    type: "string"
  },
  {
    id: "type",
    isLocked: false,
    isRequired: true,
    name: "Type",
    type: "string"
  },
  {
    id: "effective_date",
    isLocked: false,
    isRequired: true,
    name: "Effective Date",
    type: "string"
  },
  {
    id: "expiration_date",
    isLocked: false,
    isRequired: true,
    name: "Expiration Date",
    type: "string"
  },
  {
    id: "confidential_info",
    isLocked: false,
    isRequired: true,
    name: "Confidential Information",
    type: "string"
  },
  {
    id: "permitted_use",
    isLocked: false,
    isRequired: true,
    name: "Permitted Use",
    type: "string"
  }
];

import { z } from "zod"
export const notEmpty = z.string().trim().min(1, { message: 'Requerido' });

// Function to generate Zod schema based on custom array
export const generateSchema = (custom: any) => { //baseSchema: any,
  // Define the base schema
  const baseSchema: any = {
  };

  if (!custom) {
    return z.object(baseSchema).refine(data => data.email === data.confirmEmail, {
      message: "El correo electrónico no coincide",
      path: ["confirmEmail"],
    })
  }

  // Add custom fields to the base schema
  custom?.forEach((item: any) => {
    let schema;
    switch (item.type) {
      case 'phoneNumber':
        //schema = phoneNumberSchema;
        schema = z.string().trim();  // Basic string schema
        if (item.isRequired) {
          schema = schema
            .min(7, { message: 'Número de teléfono debe tener más de 8 digitos' })
            .regex(/^\+?[1-9]\d{1,14}$/, "Formato de Número de teléfono inválido");
        }
        break;
      case 'country':
        schema = z.string().optional();  // Basic string schema for select fields
        if (item.isRequired) {
          schema = notEmpty
        }
        break;
      case 'select':
        schema = z.string().optional();  // Basic string schema for select fields
        if (item.isRequired) {
          schema = notEmpty
        }
        break;

      case 'string':
        schema = z.string().optional();  // Basic string schema for select fields
        if (item.isRequired) {
          schema = notEmpty
        }
        break;
      default:
        schema = z.string().optional(); // Default to optional string if no specific schema is defined
    }
    baseSchema[item.id] = item.isRequired ? schema : schema.optional();
  });

  // Create and return the final schema
  return z.object(baseSchema).refine(data => data.email === data.confirmEmail, {
    message: "El correo electrónico no coincide",
    path: ["confirmEmail"],
  });
};