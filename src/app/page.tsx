import Link from "next/link";

import { LatestPost } from "~/app/_components/post";
import { api, HydrateClient } from "~/trpc/server";

import { useState } from "react";
import { HomeClient } from "./_components/home-client";

export default async function Home() {
  const hello = await api.post.hello({ text: "from tRPC" });

  void api.post.getLatest.prefetch();

  //define functions

  return (
    <HydrateClient>
      <HomeClient />
    </HydrateClient>
  );
}
