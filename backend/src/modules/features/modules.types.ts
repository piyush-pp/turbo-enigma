/**
 * Types for the Modules/Features API
 */

export interface ModuleState {
    key: string;
    name: string;
    description: string;
    enabled: boolean;
}

export interface UpdateModuleRequest {
    enabled: boolean;
}

export interface ModulesResponse {
    modules: ModuleState[];
}

/**
 * Internal type for storing module states in the database
 * Key is the module key, value is whether it's enabled
 */
export type FeaturesMap = Record<string, boolean>;
