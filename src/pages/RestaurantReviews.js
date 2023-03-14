import { addDoc, getDoc, getDocs, collection, query, where, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"


export const Review = (props) => {
    const { review } = props;

    const [user] = useAuthState(auth);

    const [likes, setLikes] = useState(null);

    const likesRef = collection(db, "likes");

    const likesDoc = query(likesRef, where("reviewId", "==", review.id));

    const getLikes = async () => {
        const data = await getDocs(likesDoc);
        setLikes(data.docs.map((doc) => ({userId: doc.data().userId, likeId: doc.id})));
    };

    const addLike = async () => {
     try { 
        const newDoc = await addDoc(likesRef, { userId: user?.uid, reviewId: review.id }); 
        if (user) {
        setLikes((prev) => prev 
            ? [...prev, {userId: user.uid, likeId: newDoc.id }]
            : [{ userId: user.uid, likeId: newDoc.id}]
        );
      }
    } catch (err) {
        console.log(err)
     }
    };

    const unLike = async () => {
        try { 
            const queryLike = query(likesRef, 
            where("reviewId", "==", review.id), 
            where("userId", "==", user?.uid) 
           );

           const toBeDeletedData = await getDocs(queryLike);
           const likeId = toBeDeletedData.docs[0].id;
           const toBeDeleted = doc(db, "likes", likeId); 
           await deleteDoc(toBeDeleted);
           if (user) {
                setLikes(
                    (prev) => prev && prev.filter((like) => like.likeId !== likeId));
         }
       } catch (err) {
           console.log(err);
        }
       };
    
    const isLikedByUser = likes?.find((like) => like.userId === user?.uid);

    useEffect(() => {
        getLikes();
    }, []);

    // reviewsList?.forEach((review) => console.log(review))
    return (
        <div className="post">
          <div className="postHeader">
            <div className="title">
              <h3>{review.title}</h3>
            </div>       
          </div>
          <div className="postTextContainer">{review.description}</div>
          <h4 className="userName">@{review.username}</h4>
          <div className="likeContainer">
            {likes && <p className="likes"> Likes: {likes?.length} </p>} 
            <button onClick={isLikedByUser ? unLike : addLike}>
                {isLikedByUser ? <img src={'/images/thumbsdown.png'} height="20px"/> : <img src={'/images/thumbsup.png'} height="20px"/>}
            </button>
           </div>
        </div>
    );
};

export const RestaurantReviews = () => {
    const { encodedRestaurantName } = useParams();
    const reviewsRef = collection(db, "reviews");
    const reviewsDoc = query(reviewsRef, where("title", "==", decodeURIComponent(encodedRestaurantName)))
    const [reviewsList, setReviewsList] = useState(null);
    const getReviews = async () => {
        const data = await getDocs(reviewsDoc);
        // console.log(data.docs)
        setReviewsList(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
    }
    useEffect(() => {
        getReviews();
    }, []);

    return (
      reviewsList?.map((review) => (
        <Review review={review} />
      ))
    );
}
