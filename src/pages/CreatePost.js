import React, { useEffect, useState } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase-config";

function CreatePost({ user }) {
  const [locationId, setLocationId] = useState(null);
  const [title, setTitle] = useState("");
  const [post, setPost] = useState("");
  const reviewsRef = collection(db, "reviews");
  const locationsRef = collection(db, "locations");
  let [locations, setLocations] = useState([]);

  async function getLocations() {
    try {
      const response = await getDocs(locationsRef);
      let tempArr = [];
      response.forEach((doc) => {
        let tempObj = { name: doc.data().name, id: doc.id };
        tempArr.push(tempObj);
      });
      setLocations(tempArr);
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    getLocations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please log in first");
    }

    try {
      // await addDoc(reviewsRef, {
      //   userName: user.displayName,
      //   userId: user.uid,
      //   locationId: locationId,
      //   title: title,
      //   post: post,
      //   likes: {},
      //   date_posted: Date.now()
      // });
      setLocationId(null);
      setTitle("");
      setPost("");
      document.getElementById("review-form").reset();
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
              onChange={(e) => setLocationId(e.target.value)}
            >
              <option value="">--Please choose an option--</option>
              {locations.map((location) => {
                return (
                  <option key={location.id} value={location.id}>
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
