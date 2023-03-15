import React from "react";
import Form from '../components/addLocation'
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { useEffect, useState } from 'react';
import { Review } from "./Review.js";
import { useAuthState } from "react-firebase-hooks/auth";


function Home() {
  const [reviewsList, setReviewsList] = useState([]);
  const reviewsRef = collection(db, "reviews");
  const [user] = useAuthState(auth);

  const deletePost = async(id) => {
    const postDoc = doc(db, "reviews", id);
    await deleteDoc(postDoc);
  };

  useEffect(() => {
  const getReviews = async () => {
    const data = await getDocs(reviewsRef);
    setReviewsList(data.docs.map((doc) => ({...doc.data(), id: doc.id })));
  };

    getReviews();
  }, [deletePost]);

  return(
    <div className="homePage">
      <h1>The Foodies</h1>
      <div>
        <h2>at ucla</h2>
      </div>
      
      <Form />

      <div>
        {reviewsList?.map((review) => {
        return(
          <div key={review.id}>
            <Review review={review} />
            {/* {review.userId === user?.uid && (
            <div className="deletePost">
                <button
                  onClick={() => {
                    deletePost(review.id);
                  }}
                > &#128465;
                </button>              
            </div>
            )} */}
          </div>
        );  
        })}  
      </div>
    </div>
  );
}

export default Home;
