import React from "react";

function CreatePost() {
    return <div className="createPostPage"> 
        <div className="cpContainer">
            <h3>Write a Review</h3>
            <div className="inputGp">
                <label> Title:</label>
                <input placeholder="Title..."/>
            </div>
            <div className="inputGp">
                <label> Post:</label>
                <textarea placeholder="Post..."/>
            </div>
            <button> Submit </button>
        </div>
    </div>
}

export default CreatePost;