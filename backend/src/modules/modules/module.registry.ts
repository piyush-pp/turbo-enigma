/**
 * Module Registry
 * Centralized configuration for all platform modules/extensions
 * 
 * This registry defines which modules are available in the system.
 * The database only stores enabled/disabled state per business.
 */

export interface ModuleDefinition {
  key: string;
  name: string;
  description: string;
  defaultEnabled: boolean;
}

export const MODULE_REGISTRY: Record<string, ModuleDefinition> = {
  services: {
    key: 'services',
    name: 'Services',
    description: 'Allow customers to book services',
    defaultEnabled: true,
  },
  staff: {
    key: 'staff',
    name: 'Staff',
    description: 'Manage staff members',
    defaultEnabled: true,
  },
  payments: {
    key: 'payments',
    name: 'Payments',
    description: 'Accept payments for bookings',
    defaultEnabled: false,
  },
  // Add more modules here as needed
};

/**
 * Get all module definitions
 */
export function getAllModules(): ModuleDefinition[] {
  return Object.values(MODULE_REGISTRY);
}

/**
 * Get a specific module definition by key
 */
export function getModuleDefinition(key: string): ModuleDefinition | undefined {
  return MODULE_REGISTRY[key];
}

/**
 * Check if a module key is valid
 */
export function isValidModuleKey(key: string): boolean {
  return key in MODULE_REGISTRY;
}
