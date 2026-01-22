import { Request, Response, NextFunction } from 'express'
import { ValidationError } from '../utils/errors'

export type ValidationRule = {
  field: string
  type: 'string' | 'number' | 'boolean' | 'email' | 'url' | 'array' | 'object'
  required?: boolean
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (value: any) => boolean | string
}

export type ValidationRules = ValidationRule[]

/**
 * Validates request body against provided rules
 */
const validateField = (value: any, rule: ValidationRule): string | null => {
  // Check required
  if (rule.required && (value === undefined || value === null || value === '')) {
    return `${rule.field} is required`
  }

  // If not required and empty, skip type validation
  if (!rule.required && (value === undefined || value === null || value === '')) {
    return null
  }

  // Type validation
  let actualType = Array.isArray(value) ? 'array' : typeof value
  if (value instanceof Object && actualType === 'object' && !Array.isArray(value)) {
    actualType = 'object'
  }

  const expectedType = rule.type === 'email' || rule.type === 'url' ? 'string' : rule.type
  if (actualType !== expectedType) {
    return `${rule.field} must be of type ${rule.type}`
  }

  // String validations
  if (rule.type === 'string' && typeof value === 'string') {
    if (rule.minLength !== undefined && value.length < rule.minLength) {
      return `${rule.field} must be at least ${rule.minLength} characters`
    }
    if (rule.maxLength !== undefined && value.length > rule.maxLength) {
      return `${rule.field} must be at most ${rule.maxLength} characters`
    }
  }

  // Number validations
  if (rule.type === 'number' && typeof value === 'number') {
    if (rule.min !== undefined && value < rule.min) {
      return `${rule.field} must be at least ${rule.min}`
    }
    if (rule.max !== undefined && value > rule.max) {
      return `${rule.field} must be at most ${rule.max}`
    }
  }

  // Email validation
  if (rule.type === 'email' && typeof value === 'string') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) {
      return `${rule.field} must be a valid email address`
    }
  }

  // URL validation
  if (rule.type === 'url' && typeof value === 'string') {
    try {
      new URL(value)
    } catch {
      return `${rule.field} must be a valid URL`
    }
  }

  // Pattern validation
  if (rule.pattern && typeof value === 'string') {
    if (!rule.pattern.test(value)) {
      return `${rule.field} format is invalid`
    }
  }

  // Custom validation
  if (rule.custom) {
    const result = rule.custom(value)
    if (result !== true) {
      return typeof result === 'string' ? result : `${rule.field} validation failed`
    }
  }

  return null
}

/**
 * Validate request body against rules
 */
export const validate = (rules: ValidationRules) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const errors: Record<string, string> = {}

    for (const rule of rules) {
      const value = req.body[rule.field]
      const error = validateField(value, rule)
      if (error) {
        errors[rule.field] = error
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError(JSON.stringify(errors))
    }

    next()
  }
}

/**
 * Validate query parameters
 */
export const validateQuery = (rules: ValidationRules) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const errors: Record<string, string> = {}

    for (const rule of rules) {
      const value = req.query[rule.field]
      // Convert string query params to appropriate types
      let convertedValue: any = value
      if (rule.type === 'number' && typeof value === 'string') {
        convertedValue = isNaN(Number(value)) ? value : Number(value)
      }
      if (rule.type === 'boolean' && typeof value === 'string') {
        convertedValue = value === 'true'
      }

      const error = validateField(convertedValue, rule)
      if (error) {
        errors[rule.field] = error
      }
    }

    if (Object.keys(errors).length > 0) {
      throw new ValidationError(JSON.stringify(errors))
    }

    next()
  }
}
