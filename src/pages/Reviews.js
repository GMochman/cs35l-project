import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase-config";
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom"
import { Review } from './Review'

export const Reviews = () => {
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

  return (
    <div>
      {reviewsList?.map((review) => (
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
