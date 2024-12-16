//client\src\types\activity-types\activityTypes.ts
export type Activity = {
    id?: string;
    name: string;
    status: 'active' | 'inactive';
}