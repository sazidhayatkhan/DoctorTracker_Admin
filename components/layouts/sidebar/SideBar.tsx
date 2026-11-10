
import {
  Sidebar,
  SidebarContent,
  SidebarRail,
} from "@/components/ui/sidebar";

import {
  dashboardNavigation,
  doctorNavigation,
  patientNavigation,
} from "./sidebar.config";

import SideBarHeader from "./SideBarHeader";
import SideBarMenuGroup from "./SideBarMenuGroup";

const SideBar = () => {
  return (
    <Sidebar collapsible="icon">
      <SideBarHeader />

      <SidebarContent>
        <SideBarMenuGroup items={dashboardNavigation} />

        <SideBarMenuGroup
          title="Doctors"
          items={doctorNavigation}
        />

        <SideBarMenuGroup
          title="Patients"
          items={patientNavigation}
        />
      </SidebarContent>

      <SidebarRail />
    </Sidebar>
  );
};

export default SideBar;
