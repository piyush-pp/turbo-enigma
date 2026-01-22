/**
 * Module Registry - Static configuration defining all available modules
 * 
 * New modules can be added here without requiring database migrations.
 * The database only stores the enabled/disabled state for each business.
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
};

/**
 * Get all module keys
 */
export const getModuleKeys = (): string[] => Object.keys(MODULE_REGISTRY);

/**
 * Check if a module key is valid
 */
export const isValidModuleKey = (key: string): boolean => key in MODULE_REGISTRY;

/**
 * Get module definition by key
 */
export const getModuleDefinition = (key: string): ModuleDefinition | undefined =>
    MODULE_REGISTRY[key];
