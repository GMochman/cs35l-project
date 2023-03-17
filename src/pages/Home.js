import React from "react";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { useEffect, useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import Form from '../components/search'
import { Review } from "./RestaurantReviews";

function Home() {
  const [reviewsList, setReviewsList] = useState([]);
  const [maxReviewSize, setMaxReviewSize] = useState([0]);
  const [averageReviewSize, setAverageReviewSize] = useState([0]);
  const [featuredReviewThreshold, setFeaturedReviewThreshold] = useState([0]);
  const reviewsRef = collection(db, "reviews");
  const [user] = useAuthState(auth);
  const [searchKeyword, setSearchKeyword] = useState("");

  const deletePost = async(id) => {
    const postDoc = doc(db, "reviews", id);
    await deleteDoc(postDoc);
  };

  useEffect(() => {
  const getReviews = async () => {
    const data = await getDocs(reviewsRef);
    setReviewsList(data.docs.map((doc) => ({...doc.data(), id: doc.id })));

    var i;
    for (i = 0; i < reviewsList?.length; i++) {
      if (maxReviewSize < reviewsList[i].description.length) {
        setMaxReviewSize(reviewsList[i].description.length);
      }
    }

    var j;
    for (j = 0; j < reviewsList?.length; j++) {
      if (j == 0) {
        setAverageReviewSize(reviewsList[i].description.length);
      }
      else {
        setAverageReviewSize((j * averageReviewSize + reviewsList[i].description.length)/(j + 1));
      }
    }

    setFeaturedReviewThreshold(((maxReviewSize + 30) + averageReviewSize)/2);


  };

    getReviews();
  }, [deletePost]);

  // console.log(reviewsList)
  return(
    <div className="homePage">
      <h1>The Foodies</h1>
      <div>
        <h2>at ucla</h2>
      </div>

      <div className="search-bar">
      <Form placeHolder={"Find a Review"} isSearching={(event) => 
      {setSearchKeyword(event.target.value)}}/> 
     </div>
     <div className="featured-reviews-label">
        <label>Featured Reviews:</label>
     </div>
    <div>
        {reviewsList?.filter((review)=> {
        if (searchKeyword == "" && review.description.length >= featuredReviewThreshold) {
          return review;
        } else if (review.description.toLowerCase().includes(searchKeyword.toLowerCase()) || 
        review.title.toLowerCase().includes(searchKeyword.toLowerCase()) || 
        review.username.toLowerCase().includes(searchKeyword.toLowerCase())) {
          if (review.description.length >= featuredReviewThreshold) {
            return review;
          }
        }}).map((review) => {
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
