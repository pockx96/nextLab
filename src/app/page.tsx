import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { api, HydrateClient } from "~/trpc/server";
import { useState } from "react";
import { HomeClient } from "./_components/home-client";
import { TaskManager } from "./_components/task-manager";
import toast, { Toaster } from 'react-hot-toast';

export default async function Home() {

  //define functions


  return (
    <main className="flex flex-col h-screen items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white ">
      <nav className="flex w-full justify-end h-1/5 text-3xl font-bold">
        <div className="w-1/3 flex justify-center items-center"><strong>To Do</strong></div>
        <div className="w-1/3 flex justify-center items-center"><strong>Finished</strong></div>
      </nav>  
      <TaskManager/>
    </main>
  );
}
