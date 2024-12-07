import { CHATS_URL } from "@/lib/api-end-points";

export async function fetchMessages(id: string) {
  const res = await fetch(`${CHATS_URL}/${id}`, {
    cache: "no-cache",
  })

  if(!res.ok) {
    throw new Error("Failed to fetch data");
  }

  const response = await res.json();
  if(response?.data){
    return response?.data;
  }

  return [];
} 
