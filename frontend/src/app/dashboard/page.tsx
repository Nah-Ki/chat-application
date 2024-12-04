import DashNav from "@/components/dashboard/dash-nav";
import { getServerSession } from "next-auth";
import { authOptions, CustomSession } from "../api/auth/[...nextauth]/options";
import CreateChatGroup from "@/components/chat-group/create-chatgroup";

export default async function dashboard() {
  const session: CustomSession | null = await getServerSession(authOptions);

  return (
    <div>
      <DashNav name={session?.user?.name!} image={session?.user?.image ?? undefined} />

      <div className="container">
        <div className="flex justify-end">
          <CreateChatGroup user={session?.user}/>    
        </div>
      </div>
    </div>
  );
}
