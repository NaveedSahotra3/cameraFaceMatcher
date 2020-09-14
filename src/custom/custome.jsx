import React,{useEffect} from "react";
import "./style.css"
import {start} from './script'
const FaceDetect = (props) => {
    useEffect(()=>{
        start()
    },[])
    return (
    <div>
      <input type="file" id="imageUpload" />
    </div>
  );
};

export default FaceDetect;
