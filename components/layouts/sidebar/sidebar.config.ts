
export type IconName =
  | "LayoutDashboard"
  | "Stethoscope"
  | "UserPlus"
  | "ClipboardPlus"
  | "Users"
  | "UserRoundPlus";

export interface MenuItem {
  title: string;
  url: string;
  icon: IconName;
}

export const dashboardNavigation: MenuItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: "LayoutDashboard",
  },
];

export const doctorNavigation: MenuItem[] = [
  {
    title: "Doctors List",
    url: "/dashboard/doctors",
    icon: "Stethoscope",
  },
  {
    title: "Create Doctor",
    url: "/dashboard/doctors/create",
    icon: "UserPlus",
  },
];

export const patientNavigation: MenuItem[] = [
  {
    title: "Patients List",
    url: "/dashboard/patients",
    icon: "Users",
  },
  {
    title: "Create Patient",
    url: "/dashboard/patients/create",
    icon: "UserRoundPlus",
  },
];
