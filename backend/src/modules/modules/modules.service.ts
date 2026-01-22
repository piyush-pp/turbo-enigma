import { PrismaClient } from '@prisma/client';
import { NotFoundError, ValidationError } from '../../utils/errors';
import { getAllModules, getModuleDefinition, isValidModuleKey } from './module.registry';

const prisma = new PrismaClient();

export interface ModuleState {
  key: string;
  name: string;
  description: string;
  enabled: boolean;
  defaultEnabled: boolean;
}

export interface BusinessModulesResponse {
  modules: ModuleState[];
}

export interface ToggleModuleRequest {
  enabled: boolean;
}

/**
 * Get all modules with their enabled/disabled state for a business
 */
export async function getBusinessModules(businessId: string): Promise<BusinessModulesResponse> {
  // Verify business exists
  const business = await prisma.business.findUnique({
    where: { id: businessId },
  });

  if (!business) {
    throw new NotFoundError('Business not found');
  }

  // Get all module definitions
  const moduleDefinitions = getAllModules();

  // Parse features from database (default to empty object)
  const features = (business.features as Record<string, boolean>) || {};

  // Build module states
  const modules: ModuleState[] = moduleDefinitions.map((def) => ({
    key: def.key,
    name: def.name,
    description: def.description,
    enabled: features[def.key] !== undefined ? features[def.key] : def.defaultEnabled,
    defaultEnabled: def.defaultEnabled,
  }));

  return { modules };
}

/**
 * Toggle a module for a business
 */
export async function toggleBusinessModule(
  businessId: string,
  moduleKey: string,
  enabled: boolean
): Promise<ModuleState> {
  // Validate module key
  if (!isValidModuleKey(moduleKey)) {
    throw new ValidationError(`Invalid module key: ${moduleKey}`);
  }

  // Verify business exists and get current features
  const business = await prisma.business.findUnique({
    where: { id: businessId },
  });

  if (!business) {
    throw new NotFoundError('Business not found');
  }

  // Get module definition
  const moduleDef = getModuleDefinition(moduleKey);
  if (!moduleDef) {
    throw new ValidationError(`Module not found: ${moduleKey}`);
  }

  // Get current features
  const features = (business.features as Record<string, boolean>) || {};

  // Update the specific module state
  const updatedFeatures = {
    ...features,
    [moduleKey]: enabled,
  };

  // Update business with new features
  await prisma.business.update({
    where: { id: businessId },
    data: {
      features: updatedFeatures,
    },
  });

  // Return updated module state
  return {
    key: moduleDef.key,
    name: moduleDef.name,
    description: moduleDef.description,
    enabled,
    defaultEnabled: moduleDef.defaultEnabled,
  };
}

/**
 * Check if a module is enabled for a business
 * Helper function for use in other services
 */
export async function isModuleEnabled(businessId: string, moduleKey: string): Promise<boolean> {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { features: true },
  });

  if (!business) {
    return false;
  }

  const features = (business.features as Record<string, boolean>) || {};
  const moduleDef = getModuleDefinition(moduleKey);

  if (!moduleDef) {
    return false;
  }

  // Return explicit setting or default
  return features[moduleKey] !== undefined ? features[moduleKey] : moduleDef.defaultEnabled;
}
