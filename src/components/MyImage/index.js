import axios from "axios";
import React, { useState } from "react";





const Images = () => {
    const [Image,setImage] = useState([])
    const fetchImages =  async ()=>{
        try {
         const response = await axios.get("https://picsum.photos/v2/list")
         
     setImage(response.data);
        } catch (error) {
         
        }
     };


    return (
    
        <div>
            IMAGES
            <button
              onClick={fetchImages} 
              className="px-5 py-4 bg-green-600"  >
                 GET IMAGES 
            </button>

            <div className = "p-10">
            {Image.map((elem,i)=>{
                return <img key={i}
                src={elem.download_url}
                width={300}
                height={300}
                className="m-10 rounded inline-block"
                />
            })}
            </div>
        </div>

     
    );
}

export default Images