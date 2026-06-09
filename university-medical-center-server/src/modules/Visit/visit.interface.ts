import { Visit } from '../../generated/client';

export type TVisit = Visit;

export type TVisitCreate = {
    studentId: string;
    chiefComplaint: string;
    bloodPressure?: string;
    temperature?: number;
    weight?: number;
    pulseRate?: number;
    notes?: string;
    visitDate?: Date;
};