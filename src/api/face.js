import * as faceapi from "face-api.js";
import axios from "axios";
import { Redirect } from "react-router-dom";
let BaseUrl = window.location == "localhost" ? "http:localhost:9090" : null;
// Load models and weights
export async function loadModels() {
  const MODEL_URL = process.env.PUBLIC_URL + "/models";
  await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
  await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
  await faceapi.loadFaceRecognitionModel(MODEL_URL);
}

export async function getFullFaceDescription(blob, inputSize = 512) {
  // tiny_face_detector options
  let scoreThreshold = 0.5;
  const OPTION = new faceapi.TinyFaceDetectorOptions({
    inputSize,
    scoreThreshold,
  });
  const useTinyModel = true;
  // console.log(blob);
  if (!blob) {
    return;
  }
  // fetch image to api
  let img = await faceapi.fetchImage(blob);

  // detect all faces and generate full description from image
  // including landmark and descriptor of each face
  let fullDesc = await faceapi
    .detectAllFaces(img, OPTION)
    .withFaceLandmarks(useTinyModel)
    .withFaceDescriptors();
  // console.log(fullDesc);
  return fullDesc;
}

const maxDescriptorDistance = 0.5;
// export async function createMatcher(faceProfile) {
//   // Create labeled descriptors of member from profile
//   let members = Object.keys(faceProfile);
//   let labeledDescriptors = members.map(
//     (member) =>
//       new faceapi.LabeledFaceDescriptors(
//         faceProfile[member].name,
//         faceProfile[member].descriptors.map(
//           (descriptor) => new Float32Array(descriptor)
//         )
//       )
//   );

//   // Create face matcher (maximum descriptor distance is 0.5)
//   let faceMatcher = new faceapi.FaceMatcher(
//     labeledDescriptors,
//     maxDescriptorDistance
//   );
//   return faceMatcher;
// }
let labeld = [];
export async function createMatcher() {
  // fetch images and create descriptors
  let users = [];

  console.log(BaseUrl);
  axios.get("http://localhost:8080/user/get_user").then(async (res) => {
    users = res.data;
    // console.log(users[0]);

    return Promise.all(
      users.map(async (user) => {
        let img = await faceapi.fetchImage(
          "http://localhost:8080/uploads/" + user.img
        );

        let options = new faceapi.TinyFaceDetectorOptions({
          inputSize: 160,
          scoreThreshold: 0.5,
        });
        const useTinyModel = true;
        const detections = await faceapi
          .detectAllFaces(img, options)
          .withFaceLandmarks(useTinyModel)
          .withFaceDescriptors();

        const descriptions = [new Float32Array(detections[0].descriptor)];

        // console.log(user.firstname);
        let result = new faceapi.LabeledFaceDescriptors(
          user.firstname + " " + user._id,
          descriptions
        );
        console.log(result);
        labeld.push(result);
      })
    );
  });
}

export async function getMatcher() {
  // Create face matcher (maximum descriptor distance is 0.5)
  if (labeld.length == 0) {
    return window.location == "/";
  }
  if (labeld.length > 0) {
    let faceMatcher = new faceapi.FaceMatcher(labeld, maxDescriptorDistance);
    return faceMatcher;
  }
}
