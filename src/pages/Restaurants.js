import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase-config";
import { useEffect, useState } from 'react';
import { Link } from "react-router-dom"

export const Restaurants = () => {
  const [reviewsList, setReviewsList] = useState(null);
  const reviewsRef = collection(db, "reviews");

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

  console.log(reviewsList)
  return (
    <div>
      {reviewsList?.map((review) => (
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
