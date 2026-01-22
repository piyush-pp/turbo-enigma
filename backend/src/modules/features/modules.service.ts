import { PrismaClient } from '@prisma/client';
import { ValidationError, NotFoundError } from '../../utils/errors';
import { MODULE_REGISTRY, isValidModuleKey, getModuleKeys } from './registry';
import { ModuleState, FeaturesMap } from './modules.types';

const prisma = new PrismaClient();

export class ModulesService {
    /**
     * Get all modules with their current enabled state for a business
     */
    async getBusinessModules(businessId: string): Promise<ModuleState[]> {
        const business = await prisma.business.findUnique({
            where: { id: businessId },
            select: { features: true },
        });

        if (!business) {
            throw new NotFoundError('Business not found');
        }

        // Parse features from DB (defaults to empty object)
        const features = (business.features as FeaturesMap) || {};

        // Build module states by merging registry with DB state
        const modules: ModuleState[] = getModuleKeys().map((key) => {
            const definition = MODULE_REGISTRY[key];
            // Use DB value if exists, otherwise use default from registry
            const enabled = key in features ? features[key] : definition.defaultEnabled;

            return {
                key: definition.key,
                name: definition.name,
                description: definition.description,
                enabled,
            };
        });

        return modules;
    }

    /**
     * Update the enabled state of a specific module for a business
     */
    async updateModuleState(
        userId: string,
        businessId: string,
        moduleKey: string,
        enabled: boolean
    ): Promise<ModuleState> {
        // Validate module key
        if (!isValidModuleKey(moduleKey)) {
            throw new ValidationError(`Unknown module key: ${moduleKey}`);
        }

        // Verify business exists and user owns it
        const business = await prisma.business.findUnique({
            where: { id: businessId },
            select: { id: true, ownerId: true, features: true },
        });

        if (!business) {
            throw new NotFoundError('Business not found');
        }

        if (business.ownerId !== userId) {
            throw new ValidationError('You do not have permission to update this business');
        }

        // Get current features and update the specific module
        const features = (business.features as FeaturesMap) || {};
        features[moduleKey] = enabled;

        // Update in database
        await prisma.business.update({
            where: { id: businessId },
            data: { features },
        });

        // Return the updated module state
        const definition = MODULE_REGISTRY[moduleKey];
        return {
            key: definition.key,
            name: definition.name,
            description: definition.description,
            enabled,
        };
    }

    /**
     * Helper function to check if a module is enabled for a business
     */
    async isModuleEnabled(businessId: string, moduleKey: string): Promise<boolean> {
        if (!isValidModuleKey(moduleKey)) {
            return false;
        }

        const business = await prisma.business.findUnique({
            where: { id: businessId },
            select: { features: true },
        });

        if (!business) {
            return false;
        }

        const features = (business.features as FeaturesMap) || {};

        // Return DB value if exists, otherwise use default
        if (moduleKey in features) {
            return features[moduleKey];
        }

        return MODULE_REGISTRY[moduleKey].defaultEnabled;
    }
}

export const modulesService = new ModulesService();

/**
 * Standalone helper function to get business modules
 * Can be used from other parts of the application
 */
export const getBusinessModules = async (businessId: string): Promise<ModuleState[]> => {
    return modulesService.getBusinessModules(businessId);
};
