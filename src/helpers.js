import { useEffect } from "react";
import { useNavigate } from "react-router";

export const storeUser = (data) => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        username: data.user.username,
        jwt: data.jwt,
        email: data.user.email,
        id: data.user.id,
      })
    );
  };

export const userData = () => {

    const stringifiedUser = localStorage.getItem("user") || '""';
    return JSON.parse(stringifiedUser || {});
};

export const Protector = ({ Component }) => {
    const navigate = useNavigate();
  
    const { jwt } = userData();
  
    useEffect(() => {
      if (!jwt) {
        navigate("/login");
      }
    }, [navigate, jwt]);
  
    return <Component />;
  };
  export const SPRING_BASE_URL = "http://localhost:8080";
  // export const SPRING_BASE_URL = "https://thunder-spring.onrender.com";

 


  // export const API_BASE_URL = "http://localhost:1337";
   export const API_BASE_URL = "https://two025-strapi.onrender.com";





  