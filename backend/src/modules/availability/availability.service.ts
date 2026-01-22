import { PrismaClient } from '@prisma/client';
import { ValidationError, NotFoundError } from '../../utils/errors';
import {
  SetAvailabilityRequest,
  AvailabilityResponse,
  AvailabilityRuleResponse,
  DAY_NAMES,
} from './availability.types';

const prisma = new PrismaClient();

export class AvailabilityService {
  async setAvailability(
    businessId: string,
    staffId: string,
    request: SetAvailabilityRequest
  ): Promise<AvailabilityResponse> {
    // Verify staff exists and belongs to business
    const staff = await prisma.staff.findFirst({
      where: { id: staffId, businessId },
    });

    if (!staff) {
      throw new NotFoundError('Staff member not found');
    }

    // Validate input
    if (!request.rules || request.rules.length === 0) {
      throw new ValidationError('At least one availability rule is required');
    }

    // Validate rules
    const validDays = new Set<number>();
    for (const rule of request.rules) {
      this.validateRule(rule);
      if (validDays.has(rule.dayOfWeek)) {
        throw new ValidationError(`Duplicate rule for day ${rule.dayOfWeek}`);
      }
      validDays.add(rule.dayOfWeek);
    }

    // Delete existing rules for this staff
    await prisma.availabilityRule.deleteMany({
      where: { staffId },
    });

    // Create new rules
    await prisma.availabilityRule.createMany({
      data: request.rules.map((rule) => ({
        staffId,
        businessId,
        dayOfWeek: rule.dayOfWeek,
        startTime: rule.isWorkingDay === false ? '00:00' : rule.startTime,
        endTime: rule.isWorkingDay === false ? '00:00' : rule.endTime,
      })),
    });

    // Return updated availability
    return this.getAvailability(businessId, staffId);
  }

  async getAvailability(businessId: string, staffId: string): Promise<AvailabilityResponse> {
    // Verify staff exists and belongs to business
    const staff = await prisma.staff.findFirst({
      where: { id: staffId, businessId },
    });

    if (!staff) {
      throw new NotFoundError('Staff member not found');
    }

    // Get all rules for this staff
    const rules = await prisma.availabilityRule.findMany({
      where: { staffId },
      orderBy: { dayOfWeek: 'asc' },
    });

    // If no rules exist, return with defaults (all days 9-17)
    if (rules.length === 0) {
      const defaultRules = await this.createDefaultRules(businessId, staffId);
      return {
        staffId,
        businessId,
        rules: defaultRules.map((r) => this.mapToResponse(r)),
      };
    }

    return {
      staffId,
      businessId,
      rules: rules.map((r) => this.mapToResponse(r)),
    };
  }

  async getStaffAvailabilityByDay(
    staffId: string,
    dayOfWeek: number
  ): Promise<AvailabilityRuleResponse | null> {
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      throw new ValidationError('Day of week must be between 0 and 6');
    }

    const rule = await prisma.availabilityRule.findFirst({
      where: { staffId, dayOfWeek },
    });

    return rule ? this.mapToResponse(rule) : null;
  }

  private async createDefaultRules(businessId: string, staffId: string): Promise<any[]> {
    // Create default working hours for all days: 9:00-17:00, Mon-Fri (1-5), off on weekends
    const defaultRules = [];
    const daysOfWeek = [0, 1, 2, 3, 4, 5, 6];

    for (const day of daysOfWeek) {
      // Sunday (0) and Saturday (6) are off
      const isWeekend = day === 0 || day === 6;
      const startTime = isWeekend ? '00:00' : '09:00';
      const endTime = isWeekend ? '00:00' : '17:00';

      const rule = await prisma.availabilityRule.create({
        data: {
          staffId,
          businessId,
          dayOfWeek: day,
          startTime,
          endTime,
        },
      });
      defaultRules.push(rule);
    }

    return defaultRules;
  }

  private validateRule(rule: any): void {
    // Validate dayOfWeek
    if (rule.dayOfWeek < 0 || rule.dayOfWeek > 6) {
      throw new ValidationError('Day of week must be between 0 (Sunday) and 6 (Saturday)');
    }

    // If day off, no need to validate times
    if (rule.isWorkingDay === false) {
      return;
    }

    // Validate time format (HH:mm)
    const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

    if (!rule.startTime || !timeRegex.test(rule.startTime)) {
      throw new ValidationError('Invalid startTime format. Use HH:mm (00:00-23:59)');
    }

    if (!rule.endTime || !timeRegex.test(rule.endTime)) {
      throw new ValidationError('Invalid endTime format. Use HH:mm (00:00-23:59)');
    }

    // Validate endTime > startTime
    const [startHour, startMin] = rule.startTime.split(':').map(Number);
    const [endHour, endMin] = rule.endTime.split(':').map(Number);
    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    if (endMinutes <= startMinutes) {
      throw new ValidationError('End time must be after start time');
    }
  }

  private mapToResponse(rule: any): AvailabilityRuleResponse {
    const isWorkingDay = !(rule.startTime === '00:00' && rule.endTime === '00:00');

    return {
      id: rule.id,
      dayOfWeek: rule.dayOfWeek,
      dayName: DAY_NAMES[rule.dayOfWeek],
      startTime: rule.startTime,
      endTime: rule.endTime,
      isWorkingDay,
      createdAt: rule.createdAt.toISOString(),
      updatedAt: rule.updatedAt.toISOString(),
    };
  }
}

export const availabilityService = new AvailabilityService();
