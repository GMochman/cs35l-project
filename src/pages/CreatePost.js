import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";

function CreatePost({ user }) {
  const [location, setLocation] = useState(null);
  const [title, setTitle] = useState("");
  const [post, setPost] = useState("");
  const reviewsRef = collection(db, "reviews");
  const locationsRef = collection(db, "locations");
  let locations = [
    { _id: "1", name: "rende" },
    { _id: "2", name: "study" },
  ];

  // useEffect(async () => {
  //   locations = await getDocs(locationsRef);
  // }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(reviewsRef, {
        user: user,
        location,
        location,
        title: title,
        post: post,
        likes: {},
        date_posted: Date.now(),
      });
      document.getElementyById("review-form").reset();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="createPostPage">
      <div className="cpContainer">
        <h3>Write a Review</h3>
        <form id="review-form" onSubmit={(e) => handleSubmit(e)}>
          <div className="inputGp">
            <label htmlFor="location"> Choose a location:</label>
            <select
              name="location"
              onSelect={(e) => setLocation(e.target.value)}
            >
              <option value="">--Please choose an option--</option>
              {locations.map((location) => {
                return (
                  <option key={location._id} value={location._id}>
                    {location.name}
                  </option>
                );
              })}
            </select>
          </div>
          <div className="inputGp">
            <label htmlFor="title"> Title:</label>
            <input
              name="title"
              placeholder="Title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <div className="inputGp">
            <label htmlFor="post"> Post:</label>
            <textarea
              name="post"
              placeholder="Post..."
              value={post}
              onChange={(e) => setPost(e.target.value)}
            />
          </div>
          <button> Submit </button>
        </form>
      </div>
    </div>
  );
}

export default CreatePost;
