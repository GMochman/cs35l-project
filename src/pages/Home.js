import React from "react";
import Form from '../components/search'
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase-config";
import { useEffect, useState } from 'react';
import { Review } from "./RestaurantReviews";

function Home() {
  const [reviewsList, setReviewsList] = useState(null);
  const reviewsRef = collection(db, "reviews");

  const getReviews = async () => {
    const data = await getDocs(reviewsRef);
    setReviewsList(
      data.docs.map((doc) => ({...doc.data(), id: doc.id }))
    );
  };

  useEffect(() => {
      getReviews();
  }, []);

  // console.log(reviewsList)
  return(
    <div className="homePage">
      <h1>The Foodies</h1>
      <div>
        <h2>at ucla</h2>
      </div>

      <Form />

      <div>
        {reviewsList?.map((review) => (
          <Review review={review}/>
        ))}
      </div>

    </div>
  );
}

export default Home;
