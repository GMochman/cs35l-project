import React from "react";
import { getDocs, collection, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { useEffect, useState } from 'react';
import { useAuthState } from "react-firebase-hooks/auth";
import Form from '../components/search'
import { Review } from "./RestaurantReviews";

function Home() {
  const [reviewsList, setReviewsList] = useState([]);
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
    <div>
        {reviewsList?.filter((review)=> {
        if (searchKeyword == "") {
          return review;
        } else if (review.description.toLowerCase().includes(searchKeyword.toLowerCase()) || 
        review.title.toLowerCase().includes(searchKeyword.toLowerCase()) || 
        review.username.toLowerCase().includes(searchKeyword.toLowerCase())) {
          return review;
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
