"use client";

import { useEffect, useState } from "react";
import { type SubmitEvent } from "react";
import Link from "next/link";

const URL = "/api/posts";

type Post = {
  id: number;
  description: string;
  created_at: string;
};

export default function Home() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [description, setDescription] = useState("");
  const [postTextError, setPostTextError] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const date = new Date();

  useEffect(() => {
    fetchPosts();
  }, [selectedDate]);

  const fetchPosts = async () => {
    const date = selectedDate.toLocaleDateString("en-CA");

    const response = await fetch(`/api/posts?date=${date}`);
    const posts = await response.json();

    console.log(await posts);

    console.table(
      posts.map((post: Post) => ({
        id: post.id,
        created_at: post.created_at,
      })),
    );
    setPosts(posts);
  };

  async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!description) {
      setPostTextError(true);
      return;
    } else setPostTextError(false);

    const response = await fetch("/api/posts", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ description }),
    });

    if (response.ok) {
      setDescription("");
      fetchPosts();
    }
  }

  const handleDelete = async (id: number) => {
    const response = await fetch(URL, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id }),
    });

    console.log(await response.json());

    fetchPosts();
  };

  function previousDay() {
    setSelectedDate((current) => {
      const previous = new Date(current);
      previous.setDate(previous.getDate() - 1);
      return previous;
    });
  }

  return (
    <div className="main w-1/2 mx-auto flex flex-col gap-4 ">
      <div className="form mx-auto">
        <Link href="./login">Sign Up</Link>
        <form
          id="info-form"
          onSubmit={handleSubmit}
          className="mx-auto flex flex-col items-center"
        >
          <label htmlFor="description" className="title">
            What did you do today?
          </label>
          <textarea
            name="description"
            id="description"
            className="border-2 w-100"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {postTextError && <div className="errorMessage">Text needed</div>}
          <button type="submit" value="submit">
            post
          </button>
        </form>
      </div>
      <div className="datepicker text-center">
        <p className="datepicker-text ">Select a day</p>
        <div className="datepicker-days border-1 rounded-md border-primary-text/50">
          <button onClick={() => previousDay()}>previous</button>
          <p>Today</p>
          <p>{date.toLocaleDateString()}</p>
        </div>
      </div>
      <div className="display-posts">
        <ul className="mx-auto  flex flex-col items-center">
          {posts.map((post: Post) => {
            return (
              <li key={post.id} className="item flex gap-3 w-xl items-center">
                <span className="ml-auto">{post.description}</span>
                <span>{new Date(post.created_at).toLocaleString()}</span>
                <button
                  className="ml-auto"
                  onClick={() => handleDelete(post.id)}
                >
                  {" "}
                  delete
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
