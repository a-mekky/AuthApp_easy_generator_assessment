export const validators = {
  required: (value: string): boolean => {
    return !!value && value.trim().length > 0
  },
  
  minLength: (value: string, min: number): boolean => {
    return !!value && value.length >= min
  },
  
  email: (value: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(value)
  },
  
  strongPassword: (value: string): boolean => {
    // At least 8 chars, 1 letter, 1 number, 1 special char
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/
    return passwordRegex.test(value)
  }
}

export const getValidationMessage = {
  required: (fieldName: string): string => {
    return `${fieldName} is required`
  },
  
  minLength: (fieldName: string, min: number): string => {
    return `${fieldName} should be at least ${min} characters`
  },
  
  email: (): string => {
    return 'Please enter a valid email address'
  },
  
  strongPassword: (): string => {
    return 'Password must be at least 8 characters and include a letter, a number, and a special character'
  }
}
