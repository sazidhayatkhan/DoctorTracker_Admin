
import { SidebarHeader } from "@/components/ui/sidebar";

const SideBarHeader = () => {
  return (
    <SidebarHeader className="flex h-16 shrink-0 items-center justify-center border-b bg-red-100">
      <h2 className="text-lg font-bold text-black">
        MediCare Dashboard
      </h2>
    </SidebarHeader>
  );
};

export default SideBarHeader;
