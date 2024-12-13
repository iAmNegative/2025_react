// import React, { useEffect, useState } from 'react';
// import CustomNav from "../CustomNav";
// import axios from "axios";
// import { userData } from "../../helpers";
// import { Link } from "react-router-dom";
// import AgoraRTC from 'agora-rtc-sdk-ng';
// import { VideoPlayer } from './VideoPlayer';

// const APP_ID = '83a530740a1f4160892bd6beab448251';
// const TOKEN ='007eJxTYOAWXXa9QqgsXT50SvupR1GMi3Z9fv1AesHT2x53JR6uefBXgcHCONHU2MDcxCDRMM3E0MzAwtIoKcUsKTUxycTEwsjUcHnV95SGQEaGu5ubGBkZIBDEZ2EoSS0uYWAAANfFIjU=';
// const CHANNEL = 'test';



// const client = AgoraRTC.createClient({
//   mode: 'rtc',
//   codec: 'vp8',
// });

// export const VideoRoom = () => {
//     const [users, setUsers] = useState([]);
//     const [localTracks, setLocalTracks] = useState([]);
//     let tracks = null; // Define 'tracks' variable and initialize it
  
//     const handleUserJoined = async (user, mediaType) => {
//       await client.subscribe(user, mediaType);
  
//       if (mediaType === 'video') {
//         setUsers((previousUsers) => [...previousUsers, user]);
//       }
  
//       if (mediaType === 'audio') {
//         // user.audioTrack.play()
//       }
//     };
  
//     const handleUserLeft = (user) => {
//       setUsers((previousUsers) =>
//         previousUsers.filter((u) => u.uid !== user.uid)
//       );
//     };
  
//     useEffect(() => {
//       client.on('user-published', handleUserJoined);
//       client.on('user-left', handleUserLeft);
  
//       client
//         .join(APP_ID, CHANNEL, null, null)
//         .then((uid) =>
//           Promise.all([
//             AgoraRTC.createMicrophoneAndCameraTracks(),
//             uid,
//           ])
//         )
//         .then(([createdTracks, uid]) => {
//           const [audioTrack, videoTrack] = createdTracks;
//           tracks = createdTracks; // Assign the value to 'tracks' variable
//           setLocalTracks(createdTracks);
//           setUsers((previousUsers) => [
//             ...previousUsers,
//             {
//               uid,
//               videoTrack,
//               audioTrack,
//             },
//           ]);
//           client.publish(createdTracks);
//         });
  
//       return () => {
//         if (tracks) {
//           for (let localTrack of tracks) {
//             localTrack.stop();
//             localTrack.close();
//           }
//           client.off('user-published', handleUserJoined);
//           client.off('user-left', handleUserLeft);
//           client.unpublish(tracks).then(() => client.leave());
//         }
//       };
//     }, []);
  
//     return (
//       <div
//         style={{ display: 'flex', justifyContent: 'center' }}
//       >
//         <div
//           style={{
//             display: 'grid',
//             gridTemplateColumns: 'repeat(2, 200px)',
//           }}
//         >
//           {users.map((user) => (
//             <VideoPlayer key={user.uid} user={user} />
//           ))}
//         </div>
//       </div>
//     );
//   };
  
//   export default VideoRoom;
