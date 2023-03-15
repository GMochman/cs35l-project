import React, { useState, useEffect } from 'react';
import Form from '../components/search';
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from '../firebase-config';
import Dropdown from "../components/Dropdown"

function Home({ isAuth }) {
  const [postLists, setPostList] = useState([]);
  const postsCollectionRef = collection(db, "posts");

  const [searchKeyword, setSearchKeyword] = useState(""); 

  const options = [ {value: "most_recent", label: "Most Recent"}, 
  {value: "least_recent", label: "Least Recent"}, 
  {value: "most_liked", label: "Most Liked"},
  {value: "least_liked", label: "Least Liked"} ];

  useEffect(() => {
    const getPosts = async() => {
      const data = await getDocs(postsCollectionRef);
      setPostList(data.docs.map((doc) => ({...doc.data(), id: doc.id})));
    };

    getPosts();
  });

  const deletePost = async(id) => {
    // eslint-disable-next-line
    const postDoc = doc(db, "posts", id);
    await deleteDoc(postDoc);
  };
    return(
    <div className="homePage">
      <h1>The Foodies</h1>
      <div>
        <h2>at ucla</h2>
      </div>
      <Form placeHolder={"Find a Location"} isSearching={(event) => 
        { setSearchKeyword(event.target.value)}}/> 
      <Dropdown placeHolder={"Sort by..."} options={options}/>
      {postLists.filter((post)=> {
        if (searchKeyword == "") {
          return post;
        } else if (post.title.toLowerCase().includes(searchKeyword.toLowerCase())) {
          return post;
        }}).map((post) =>{
        return (
        <div className="post">
          <div className="postHeader">
            <div className="title">
              <h3>{post.title}</h3>
            </div>  
            <div className="deletePost">
              {isAuth && post.author.id === auth.currentUser.uid && (
              <button 
                onClick={() => {
                  deletePost(post.id);
                }}
                > &#129530;
              </button>
              )}
            </div>          
          </div>
          <div className="postTextContainer">{post.postText}</div>
          <h4>@{post.author.name}</h4>
        </div>
        );
      })}
    </div>
    );
}

export default Home;



