import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase-config";
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom"
import { Review } from './Review'
import Form from '../components/search';

export const Reviews = () => {
  const [reviewsList, setReviewsList] = useState(null);
  const reviewsRef = collection(db, "reviews");
  const [searchKeyword, setSearchKeyword] = useState(""); 

  const getReviews = async () => {
    const data = await getDocs(reviewsRef);
    setReviewsList(
      data.docs.map((doc) => ({...doc.data(), id: doc.id }))
    );
  };

  useEffect(() => {
      getReviews();
  }, []);

  return (
      <div>
        <div className="search-bar">
          <Form placeHolder={"Find a Location"} isSearching={(event) => 
          {setSearchKeyword(event.target.value)}}/> 
         </div>
        {reviewsList?.filter((review)=> {
        if (searchKeyword == "") {
          return review;
        } else if (review.title.toLowerCase().includes(searchKeyword.toLowerCase())) {
          return review;
}}).map((review) => (
          <div>
            <Link to={review.id}>
              <div className="review-snippets">
                {review.title}
                </div>
          </Link>
          {/* {reviewsList?.map((review) => ( */}
          {/* <Review review={review}/> */}
          {/* ))} */}
       </div>
        ))}
      </div>
  )
}
