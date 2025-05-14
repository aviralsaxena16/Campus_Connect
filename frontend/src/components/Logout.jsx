import { useClerk } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const { signOut } = useClerk();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/'); 
  };

  return (
    <button onClick={handleLogout} style={{ padding: '10px', backgroundColor: 'red', color: 'white' }}>
      Logout
    </button>
  );
};

export default Logout;
