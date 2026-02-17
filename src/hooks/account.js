// // hooks/useProfile.js
// import { useEffect, useState } from "react";
// // import { getProfile } from "../api/userApi";
// import { fetchUserProfile } from "../api/authApi";

// export const UserAccout = () => {
//   const [profile, setProfile] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     let isMounted = true;

//     const fetchProfile = async () => {
//       try {
//         const data = await fetchUserProfile();

//         if (data?.success && isMounted) {
//           setProfile(data.data);
//         }
//       } catch (err) {
//         if (isMounted) {
//           setError(err.response?.data?.message || "Something went wrong");
//         }
//       } finally {
//         if (isMounted) {
//           setLoading(false);
//         }
//       }
//     };

//     fetchProfile();

//     return () => {
//       isMounted = false; // prevent memory leaks
//     };
//   }, []);

//   return { profile, loading, error };
// };
