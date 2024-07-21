"use client";

import { useState } from "react";

import { api } from "~/trpc/react";

export const HomeClient = () => {
  //define constants
  const [name, setName] = useState("");
  const [nameToUpdate, setNameToUpdate] = useState("");
  const [userId, setUserId] = useState(0);
  const [userIdToUpdate, setUserIdToUpdate] = useState(0);
  const [nameToDelete, setNameToDelete] = useState("");

  const utils = api.useUtils();
  const users = api.user.getAll.useQuery();
  const user = api.user.getOne.useQuery({ id: userId });

  const handleCreateUser = api.user.createUser.useMutation({
    onSuccess: async () => {
      await utils.user.invalidate();
      setName("");
    },
  });

  const handleDeleteUser = api.user.deleteUser.useMutation({
    onSuccess: async () => {
      await utils.user.invalidate();
      setNameToDelete("");
    },
  });

  const handleUpdateUser = api.user.updateUser.useMutation({
    onSuccess: async () => {
      await utils.user.invalidate();
      setNameToUpdate("");
      setUserIdToUpdate(0);
    },
  });

  return (
    <div className="container mx-auto flex w-3/4 flex-col items-center justify-center gap-12 px-4 py-16">
      <div className="w-full p-8">
        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Get All Users</h2>
        </div>
        <button
          className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={() => users.refetch()}
        >
          Get All Users
        </button>

        <div className="text- mb-4 mt-4 grid grid-cols-3 gap-4 font-bold">
          <p>Id</p>
          <p>Name</p>
        </div>

        {users.data &&
          users.data.map((user) => (
            <div
              key={user.id}
              className="my-4 grid grid-cols-3 gap-4 rounded border border-gray-300 bg-white p-4 shadow"
            >
              <p>{user.id}</p>
              <p>{user.name}</p>
            </div>
          ))}

        {/* Get one user UI */}

        <div className="mb-8">
          <h2 className="mb-4 text-2xl font-bold">Get One User</h2>
          <div className="mb-4 flex">
            <input
              type="number"
              className="mr-2 border border-gray-300 p-2"
              placeholder="Enter user id to get"
              value={userId}
              onChange={(e) => setUserId(parseInt(e.target.value, 10) || 0)}
            />
            <button
              className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              onClick={() => {
                user.refetch();
                console.log(user.data);
              }}
            >
              Get One User
            </button>
          </div>
          {user.data && (
            <div>
              <p>Name: {user.data.name}</p>
            </div>
          )}
        </div>

        <p className="mb-4 text-2xl font-bold">CREATE USER</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateUser.mutate({ name });
          }}
          className="flex flex-col gap-2"
        >
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-full border-2 px-4 py-2 text-black"
          />
          <button
            type="submit"
            className="rounded-full bg-blue-500 px-10 py-3 text-2xl font-semibold text-white transition hover:bg-blue-600"
            disabled={handleCreateUser.isPending}
          >
            {handleCreateUser.isPending ? "Submitting..." : "Submit"}
          </button>
        </form>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleDeleteUser.mutate({ nameToDelete });
          }}
          className="flex flex-col gap-2"
        >
          <p className="mb-4 text-2xl font-bold">DElETE USER</p>
          <input
            type="text"
            placeholder="Name"
            value={nameToDelete}
            onChange={(e) => setNameToDelete(e.target.value)}
            className="w-full rounded-full border-2 px-4 py-2 text-black"
          />
          <button
            type="submit"
            className="rounded-full bg-red-500 px-10 py-3 text-2xl font-semibold text-white transition hover:bg-red-600"
            disabled={handleDeleteUser.isPending}
          >
            {handleDeleteUser.isPending ? "Submitting..." : "Submit"}
          </button>
        </form>

        <form
          className="mb-8"
          onSubmit={(e) => {
            e.preventDefault();
            handleUpdateUser.mutate({ id: userIdToUpdate, name: nameToUpdate });
          }}
        >
          <h2 className="mb-4 text-2xl font-bold">Update User</h2>
          <div className="mb-4 flex">
            <input
              className="mr-2 w-1/2 border border-gray-300 p-2"
              placeholder="Name to update"
              value={nameToUpdate}
              onChange={(e) => setNameToUpdate(e.target.value)}
            />
          </div>
          <input
            type="number"
            placeholder="Enter user id to update"
            className="mr-2 border border-gray-300 p-2"
            value={userIdToUpdate}
            onChange={(e) =>
              setUserIdToUpdate(parseInt(e.target.value, 10) || 0)
            }
          />
          <button className="mt-2 rounded bg-orange-500 px-4 py-2 text-white hover:bg-orange-600">
            Update User
          </button>
        </form>
      </div>
    </div>
  );
};
