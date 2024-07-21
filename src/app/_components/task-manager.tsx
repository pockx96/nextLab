"use client";
import { Task } from "@prisma/client";
import { Input } from "postcss";
import { useState } from "react";

import { api } from "~/trpc/react";

export const TaskManager = () => {
  const [title, setTitle] = useState("");
  const [titleFind, setTitleFind] = useState("");
  const [description, setDescription] = useState("");
  const [done, setDone] = useState(true);

  const [titleToDelete, setTitleToDelete] = useState("");

  const utils = api.useUtils();
  const tasks = api.task.getAll.useQuery();

  const handleUpdateTask = api.task.updateTask.useMutation({
    onSuccess: async () => {
      await utils.task.invalidate();
    },
  });

  const taskIsDone = (task: Task)=>{
    handleUpdateTask.mutate({id:task.id,title:task.title,description:task.description,done:false});
  }

  const handleCreateTask = api.task.createTask.useMutation({
    onSuccess: async () => {
      await utils.task.invalidate();
      console.log(tasks.data);
      setDescription("");
      setTitle("");
      setDone(true);
      tasks.refetch();
    },
  });

  const handleDeleteTask = api.task.deleteTask.useMutation({
    onSuccess: async () => {
      await utils.task.invalidate();
      setTitle("");
    },
  });

  return (
    <section className="mx-auto overflow-auto flex h-full w-full scr">

      {/* create task */}
      <div className="flex w-1/3 justify-center items-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCreateTask.mutate({ title, description });
          }}
          className="flex h-1/3 w-1/2 flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20"
        >
          <h3 className="text-2xl font-bold">New Task</h3>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-black"
          />
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="text-black"
          />
          <button
            type="submit"
            className="hover:blue-600 bg-blue-500"
            disabled={handleCreateTask.isPending}
          >
            {handleCreateTask.isPending ? "Sunmitting" : "Submit"}
          </button>
        </form>
      </div>

      {/* get all task unfinished */}
      <div className="flex w-1/3 flex-col items-center pt-4">
        {tasks.data &&
          tasks.data
            .filter((task) => task.done)
            .map((task) => (
              <div className="my-2 flex justify-center w-1/2 flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20">
                <h3 className="text-2xl font-bold text-center">{task.title}</h3>
                <div className="text-lg text-center">{task.description}</div>
                <button
                  onClick={() => {
                    setTitleToDelete(task.title);
                    handleDeleteTask.mutate({ titleToDelete });
                    tasks.refetch();
                  }}
                  className=" rounded bg-red-600/50 hover:bg-red-600/85 hover:font-bold "
                >
                  Delete
                </button>
                <button
                  onClick={() => {
                    taskIsDone(task);
                    tasks.refetch();
                  }}
                  className="rounded bg-blue-500/50 hover:bg-blue-600/85 hover:font-bold"
                >
                  Finished
                </button>
              </div>
            ))}
      </div>

      {/* get all task finished */}
      <div className="flex w-1/3 flex-col items-center pt-4">
        {tasks.data &&
          tasks.data
            .filter((task) => !task.done)
            .map((task) => (
              <div className="my-2 flex w-1/2 flex-col gap-4 rounded-xl bg-white/10 p-4 hover:bg-white/20">
                <h3 className="text-2xl font-bold">{task.title}</h3>
                <div className="text-lg">{task.description}</div>
                <button
                  onClick={() => {
                    setTitleToDelete(task.title);
                    handleDeleteTask.mutate({ titleToDelete });
                    tasks.refetch();
                  }}
                  className="rounded bg-red-500"
                >
                  delete
                </button>
              </div>
            ))}
      </div>
    </section>
  );
};
