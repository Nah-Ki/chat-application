import DashNav from "@/components/dashboard/dash-nav";
import { getServerSession } from "next-auth";
import { authOptions, CustomSession } from "../api/auth/[...nextauth]/options";

export default async function dashboard() {
  const session: CustomSession | null = await getServerSession(authOptions);

  return (
    <div>
      <p>{JSON.stringify(session)}</p>
      <DashNav name={session?.user?.name!} image={session?.user?.image ?? undefined} />
    </div>
  );
}
