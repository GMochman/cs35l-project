import { addDoc, getDoc, getDocs, collection, query, where, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../firebase-config";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import Form from '../components/search';
import Dropdown from "../components/Dropdown";


export const Review = (props) => {
    const { review, deletePost } = props;

    const [user] = useAuthState(auth);

    const handleDeletePost = async () => {
      await deleteDoc(doc(db, "reviews", review.id));
    };

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
      // eslint-disable-next-line
        getLikes();
    }, []);

    // reviewsList?.forEach((review) => console.log(review))
    return (
        <div className="post">
          <div className="postHeader">
            <div className="title">
              <h3>{review.title}</h3>
            </div>
          {review.userId === user?.uid && (
          <div className="deletePost">
            <button onClick={handleDeletePost}> &#128465;</button>
          </div>
          )}
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
    const reviewsDoc = query(reviewsRef, where("title", "==", decodeURIComponent(encodedRestaurantName)));
    const [reviewsList, setReviewsList] = useState(null);
    const [searchKeyword, setSearchKeyword] = useState("");
    const getReviews = async () => {
        const data = await getDocs(reviewsDoc);
        // console.log(data.docs[0].data())
        let reviews = data.docs.map((doc) => ({...doc.data(), id: doc.id}))
        // setReviewsList(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
        if (dropdownSelection !== "") {
            reviews = reviews.sort((a, b) => {
                let x = a[dropdownSelection.property].toLowerCase();
                let y = b[dropdownSelection.property].toLowerCase();

                const order = dropdownSelection.order === "a-z" ? 1 : -1;
                if(x>y){return 1*order;} 
                if(x<y){return -1*order;}
                return 0;
            })
        }
        console.log(reviews)
        setReviewsList(reviews)
    }

    const [dropdownSelection, setDropdownSelection] = useState("");
    const options = [
      {value: {order: "a-z", property: "username"}, label: "A-Z (User)"}, 
      {value: {order: "z-a", property: "username"}, label: "Z-A (User)"},
      {value: {order: "a-z", property: "description"}, label: "A-Z (Review)"}, 
      {value: {order: "z-a", property: "description"}, label: "Z-A (Review)"}
    ];

    const deletePost = async(id) => {
      const postDoc = doc(db, "reviews", id);
      await deleteDoc(postDoc);
    };
    
    useEffect(() => {
        getReviews();
    }, [deletePost]);

    return (
      <div>
      <div className="search-bar">
      <Form placeHolder={"Find a Review"} isSearching={(event) => 
      {setSearchKeyword(event.target.value)}}/> 
     </div>
     <Dropdown placeHolder={"Sort by..."} options={options} onSelection={(value) => setDropdownSelection(value)}/>
      {console.log(dropdownSelection)}
      {reviewsList?.filter((review)=> {
        if (searchKeyword == "") {
          return review;
        } else if (review.description.toLowerCase().includes(searchKeyword.toLowerCase()) || 
        review.title.toLowerCase().includes(searchKeyword.toLowerCase()) || 
        review.username.toLowerCase().includes(searchKeyword.toLowerCase())) {
          return review;
        }}).map((review) => (
        <Review review={review} />
      ))}
      </div>
    );
}