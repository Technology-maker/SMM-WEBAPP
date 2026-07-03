import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../../api/authAPI";
import useAuth from "../../hooks/useAuth";

const Logout = () => {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const handleLogout = async () => {
      try {
        await logoutUser();
        setUser(null);
      } catch (error) {
        console.error(error);
      } finally {
        navigate("/", { replace: true });
      }
    };

    handleLogout();
  }, [navigate, setUser]);

  return (
    <div className="flex items-center justify-center py-10">
      Logging out...
    </div>
  );
};

export default Logout;