import { useState, useEffect } from 'react';
import axios from 'axios';

const useUserRole = () => {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userId = localStorage.getItem('userId');
        if (!userId) {
          console.error('User ID not found in localStorage');
          return;
        }

        const response = await axios.get(`https://localhost:7119/api/User/${userId}`);
        const userData = response.data;

        setUserRole(userData && userData.roleId_FK == 2 ? 'admin' : 'user');
      } catch (error) {
        console.error('Error fetching user role:', error);
      }
    };

    fetchUserRole();
  }, []);

  return userRole;
};

export default useUserRole;
