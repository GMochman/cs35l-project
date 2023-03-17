import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase-config";
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom"
import Form from '../components/search';

export const Restaurants = () => {
  const [reviewsList, setReviewsList] = useState(null);
  const reviewsRef = collection(db, "reviews");
  const [searchKeyword, setSearchKeyword] = useState(""); 

  const getReviews = async () => {
    const data = await getDocs(reviewsRef);
    const restaurants = data.docs.map((doc) => (doc.data().title))
    setReviewsList(
      [...new Set(restaurants)]
    );
  };

  useEffect(() => {
      getReviews();
  }, []);

  // console.log(reviewsList)
  return (
      <div>
        <div className="search-bar">
          <Form placeHolder={"Find a Location"} isSearching={(event) => 
          {setSearchKeyword(event.target.value)}}/> 
         </div>
        {reviewsList?.filter((review)=> {
        if (searchKeyword == "") {
          return review;
        } else if (review.toLowerCase().includes(searchKeyword.toLowerCase())) {
          return review;
        }}).map((review) => (
          <div>
            <Link to={encodeURIComponent(review)}>
                <div className="review-snippets">
                    {review}
                </div>
            </Link>
       </div>
        ))}
      </div>
  )
}
