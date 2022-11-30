import { IconButton } from "@material-ui/core";
import { SendOutlined } from "@material-ui/icons";
import moment from "moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useHistory, useParams } from "react-router-dom";
import Announcement from "../components/Announcement";
import { auth, db, storage } from "../firebase";
import "./Class.css";
import DocViewer from "react-doc-viewer";
// import attach_file from ";
import { ReactComponent as YourSvg } from './attachment.svg';

function Class() {
  const [classData, setClassData] = useState({});
  const [announcementContent, setAnnouncementContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [user, loading, error] = useAuthState(auth);
  const { id } = useParams();
  const history = useHistory();

  /*
    PLAN: Create a snapshot listener and fill in the data into classData, 
    and then map through it during render
  */

  useEffect(() => {
    // reverse the array
    let reversedArray = classData?.posts?.reverse();
    setPosts(reversedArray);
  }, [classData]);


  const createPost = async () => {
    try {
      const myClassRef = await db.collection("classes").doc(id).get();
      const myClassData = await myClassRef.data();
      console.log(myClassData);
      let tempPosts = myClassData.posts;
      tempPosts.push({
        authorId: user.uid,
        content: announcementContent,
        date: moment().format("MMM Do YY"),
        image: user.photoURL,
        name: user.displayName,
      });
      myClassRef.ref.update({
        posts: tempPosts,
      });
    } catch (error) {
      console.error(error);
      alert(`There was an error posting the announcement, please try again!`);
    }
  };



  const [image, setImage] = useState('');
  const [Url, setUrl] = useState('');
  const upload = (e) => {
    setImage(e.target.files[0]);
    if (image == null)
      return;
    setUrl("Getting Download Link...")

    // Sending File to Firebase Storage
    storage.ref(`/images/${image.name}`).put(image)
      .on("state_changed", alert("success"), () => {
        // Getting Download Link
        storage.ref("images").child(image.name).getDownloadURL()
          .then((url) => {
            setUrl(url);
          })
      });
  }

  useEffect(() => {
    db.collection("classes")
      .doc(id)
      .onSnapshot((snapshot) => {
        const data = snapshot.data();
        if (!data) history.replace("/");
        console.log(data);
        setClassData(data);
      });
  }, [history, id]);

  useEffect(() => {
    if (loading) return;
    if (!user) history.replace("/");
  }, [loading, user, history]);

  return (
    <div className="class">
      <div className="class__nameBox">
        <div className="class__name">{classData?.name}</div>
      </div>
      <div className="class__announce">
        <img src={user?.photoURL} alt="logo" />
        <input
          type="text"
          value={announcementContent}
          onChange={(e) => { setAnnouncementContent(e.target.value) }}
          placeholder="Announce something to your class"
        />
        <IconButton>
          <div className="image-upload">
            <label for="file-input">
              {/* <img src={YourSvg} alt="attachment-logo" /> */}
              <YourSvg />
            </label>
            <input id="file-input" style={{ display: "none" }} type="file" onChange={(e) => {
              upload(e);
            }
            } />
          </div>

        </IconButton>
        <IconButton onClick={createPost}>
          <SendOutlined />
        </IconButton>
      </div>
      <p><a href={Url}>{Url}</a></p>
      {posts?.map((post) => (
        <Announcement
          authorId={post.authorId}
          content={post.content}
          date={post.date}
          image={post.image}
          name={post.name}
        />
      ))}
    </div>
  );
}

export default Class;
