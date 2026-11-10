
import { Stethoscope } from "lucide-react";
import { SidebarHeader } from "@/components/ui/sidebar";

const SideBarHeader = () => {
  return (
    <SidebarHeader className="h-16 justify-center px-4">
      <div className="flex items-center gap-2">
        <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <Stethoscope className="size-5" />
        </div>

        <span className="text-lg font-bold tracking-tight group-data-[collapsible=icon]:hidden">
          MediCare
        </span>
      </div>
    </SidebarHeader>
  );
};

export default SideBarHeader;
