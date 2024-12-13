// import React, { useState, useEffect, useCallback } from "react";
// import CustomNav from "../CustomNav";
// import axios from "axios";
// import { userData } from "../../helpers";
// import { useParams } from "react-router-dom";
// import { API_BASE_URL } from "../../helpers";
// import VideoRoom from "./VideoRoom";


// export const VideoChat = () => {
//     const [localStream, setLocalStream] = useState(null);
//     const [remoteStreams, setRemoteStreams] = useState([]);
//     const [joined, setJoined] = useState(false);
    

  
 
  
//     return (
//       <div className="ttt">
//       <h1>WDJ Virtual Call</h1>

//       {!joined && (
//         <button onClick={() => setJoined(true)}>
//           Join Room
//         </button>
//       )}

//       {joined && < VideoRoom />}
//     </div>
//     );
//   };

// export default VideoChat;
