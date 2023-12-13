import { OrganizationUnitType } from "./organizationUnitType";

export interface OrganizationUnit {
    id: number;
    name: string;
    description: string;
    organizationUnitType: OrganizationUnitType;
    parentOrganizationUnit: OrganizationUnit | null;
}