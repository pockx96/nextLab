"use client";

import { useState } from "react";

import { api } from "~/trpc/react";

export function LatestPost() {
  /*const [latestPost] = api.post.getLatest.useSuspenseQuery();*/

  const utils = api.useUtils();
  const [name, setName] = useState("");
  const createPost = api.user.createUser.useMutation({
    onSuccess: async () => {
      await utils.user.invalidate();
      setName("");
    },
  });

  const deleteUser = api.user.deleteUser.useMutation({
    onSuccess: async ()=>{
      await utils.user.invalidate();
      setName("");
    }
  });

  return (
    <div className="w-full max-w-xs">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          deleteUser.mutate({ name });
        }}
        className="flex flex-col gap-2"
    
        <input
          type="text"
          placeholder="Title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-full px-4 py-2 text-black"
        />
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createPost.isPending}
        >
          {createPost.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
