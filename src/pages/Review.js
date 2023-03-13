import { addDoc, getDoc, getDocs, collection, query, where, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"


export const Review = (props) => {
    // const { review } = props;
    // const reviewId = review.id
    const { reviewId } = useParams();
    const reviewsRef = doc(db, "reviews", reviewId);
    const [review, setReview] = useState(null);
    const getReview = async () => {
        const doc = await getDoc(reviewsRef);
        setReview(doc.data());
    }
    useEffect(() => {
        getReview();
    }, []);

    const [user] = useAuthState(auth);

    const [likes, setLikes] = useState(null);

    const likesRef = collection(db, "likes");

    const likesDoc = query(likesRef, where("reviewId", "==", reviewId));

    const getLikes = async () => {
        const data = await getDocs(likesDoc);
        setLikes(data.docs.map((doc) => ({userId: doc.data().userId, likeId: doc.id})));
    };

    const addLike = async () => {
     try { 
        const newDoc = await addDoc(likesRef, { userId: user?.uid, reviewId: reviewId }); 
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
            where("reviewId", "==", reviewId), 
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

    return (
        <div className="post">
          <div className="postHeader">
            <div className="title">
              <h3>{review?.title}</h3>
            </div>       
          </div>
          <div className="postTextContainer">{review?.description}</div>
          <h4 className="userName">@{review?.username}</h4>
          <div className="likeContainer">
            {likes && <p className="likes"> Likes: {likes?.length} </p>} 
            <button onClick={isLikedByUser ? unLike : addLike}>
                {isLikedByUser ? <img src={'/images/thumbsdown.png'} height="20px"/> : <img src={'/images/thumbsup.png'} height="20px"/>}
            </button>
           </div>
        </div>
    );
};
