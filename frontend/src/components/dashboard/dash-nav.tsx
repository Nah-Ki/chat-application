import ProfileMenu from "../auth/profile-menu";

export default function DashNav({ name, image }: { name: string; image?: string }) {
  return (
    <nav className="px-6 py-4 flex justify-between items-center border-b shadow-sm">
      <h1 className="text-xl md:text-2xl font-extrabold">Scalable Chat App</h1>
      <div className="flex items-center space-x-2 md:space-x-6 text-gray-700">
        <ProfileMenu name={name} image={image} />
      </div>
    </nav>
  );
}
