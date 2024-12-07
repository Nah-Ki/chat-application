import DashNav from "@/components/dashboard/dash-nav";
import { getServerSession } from "next-auth";
import { authOptions, CustomSession } from "../api/auth/[...nextauth]/options";
import CreateChatGroup from "@/components/chat-group/create-chatgroup";
import { fetchChatGroups } from "@/fetch/group-fetch";
import ChatGroupCard from "@/components/chat-group/chat-group-card";

export default async function dashboard() {
  const session: CustomSession | null = await getServerSession(authOptions);

  const groups: Array<ChatGroupType> = await fetchChatGroups(session?.user?.token!);
  console.log("the groups are ", groups);

  return (
    <div>
      <DashNav name={session?.user?.name!} image={session?.user?.image ?? undefined} />

      <div className="container">
        <div className="flex justify-end py-4">
          <CreateChatGroup user={session?.user}/>    
        </div>
      </div>
      <div className="mx-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {groups.length > 0 &&
            groups.map((item, index) => (
              <ChatGroupCard group={item} key={index} user={session?.user!} />
            ))}
        </div>
      </div>

    </div>
  );
}
