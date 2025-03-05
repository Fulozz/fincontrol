import DashboardCards from "@/components/dashboard/dashboard-cards";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";

export default function DashboardPage(){
    return (
        <div className="space-y-6 bg-[#FBFBFB] h-screen">
             <DashboardHeader />
            <div className="grid gap-4 p-4 md:p-4 md:gap-8 ">
                <DashboardCards />
            </div>
        </div>
    )
}