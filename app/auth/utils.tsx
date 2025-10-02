export interface ValidationRule {
  type: "required" | "email" | "minLength" | "maxLength" | "pattern" | "custom";
  value?: any;
  message: string;
  validator?: (value: string) => boolean;
}

export const validateField = (
  value: string,
  rules?: ValidationRule[]
): { isValid: boolean; errorMessage?: string } => {
  //console.log(value, rules);
  if (!rules || rules.length === 0) {
    return { isValid: true };
  }

  for (const rule of rules) {
    switch (rule.type) {
      case "required":
        if (!value || value.trim() === "") {
          return { isValid: false, errorMessage: rule.message };
        }
        break;

      case "email":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !emailRegex.test(value)) {
          return { isValid: false, errorMessage: rule.message };
        }
        break;

      case "minLength":
        if (value && value.length < rule.value) {
          return { isValid: false, errorMessage: rule.message };
        }
        break;

      case "maxLength":
        if (value && value.length > rule.value) {
          return { isValid: false, errorMessage: rule.message };
        }
        break;

      case "pattern":
        if (value && !rule.value.test(value)) {
          return { isValid: false, errorMessage: rule.message };
        }
        break;

      case "custom":
        if (value && rule.validator && !rule.validator(value)) {
          return { isValid: false, errorMessage: rule.message };
        }
        break;
    }
  }

  return { isValid: true };
};
