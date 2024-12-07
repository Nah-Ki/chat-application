import ChatBase from '@/components/chats/chat-base';
import { fetchMessages } from '@/fetch/chats';
import { fetchChatGroup, fetchChatUsers } from '@/fetch/group-fetch';
import { notFound } from 'next/navigation';
import React from 'react'

export default async function Page({params}: {params: {id: string}}) {

  if(params.id.length !== 36){
    return notFound();
  } 

  const group:ChatGroupType | null = await fetchChatGroup(params.id);
  if(group === null){
    return notFound();
  }

    

  const users:Array<ChatGroupUsertype> | [] = await fetchChatUsers(params.id); 
  const chats:Array<MessageType> | [] = await fetchMessages(params.id);  

  return (
    <div>
      <ChatBase group={group} users={users} oldMessages={chats}/>
    </div>
  )
}

