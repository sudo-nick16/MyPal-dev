//post component

import React , {useState,useEffect} from 'react'
import './Post.css'
import Avatar from '@material-ui/core/Avatar'
import {DataBase} from './firebase'
import firebase from 'firebase';

function Post({postId,user,username,caption,imageUrl}) {
    //store comments from the database for a praticular post in an array (GET from DataBase)
    const [comments, setComments] = useState([])
    //input comment for a post from the user  (POST to DataBase)
    const [comment, setComment] = useState('')

//======================================Post comments to the database=======================================
    const postComment = (e) => {
        e.preventDefault();
        //add comment to the 'comments' collection of the particular post 
        DataBase.collection('posts').doc(postId).collection('comments').add(
            {
             text:comment,
             username:user.displayName,
             timestamp:firebase.firestore.FieldValue.serverTimestamp()
            }
        )
        //clear the input after posting
        setComment('')
    }


//====================================Get the post from the database and display=========================================
    useEffect(() => {
        let unsubscribe;
        //if a postId is passed
        if (postId){
            //get a snapshot listner for 'comments' collection inside the passed 'postId' doc inside the collection 'posts'
            unsubscribe = DataBase.collection('posts').doc(postId).collection('comments').orderBy('timestamp','desc').onSnapshot(
                    (snapshot) =>{
                        //set comments to the data inside the doc
                                setComments(snapshot.docs.map((doc) => (doc.data())))
                    })
        }
        return  () => {
            unsubscribe()
        };
        //when postId changes fire the code above
    },[postId])
//========================================================================================================================
    return (
        <div className="post">
            <div className="post__header">
                                               {/*avatar managed by@material-ui/core*/}
                <Avatar className="post__avatar" alt={username} src="/static/images/avatar/1.jpg"></Avatar>
                <h3>{username}</h3>
            </div>
            <img className="post__image" src={imageUrl} alt={username+" "+caption}/>
            <h4 className="post__text"><strong>{username+" "}</strong>:{" "+caption}</h4>

                                              {/*display the comments from the database */}
            <div className="post__comments">
                {
                    comments.map((comment) => (
                        //here we are accessing the username and text fields of the doc[comment(iterator)] from 'comments' collection of the DataBase
                        <p><strong>{comment.username}</strong>{comment.text}</p>
                    ))
                } 
            </div>
                                               {/*post the comment to the database*/}
            {//if the user is logged in then only show the post comment section
                user &&(
                <form className="post__commentBox">
                    <input className="post__input" type="text" placeholder="Add a comment..." value={comment} onChange={(e)=> setComment(e.target.value)}/>
                    <button className="post__button" disabled={!comment} type="submit" onClick={postComment}>Post</button>
                </form>) 
            }
        </div>
    )
}

export default Post
