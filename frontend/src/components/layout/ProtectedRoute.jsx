import { Navigate } from "react-router-dom";
import useStore from "../../utils/Store";

export default function ProtectedRoute({ children }) {
  const token = useStore((state) => state.token);

  if (!token) {
    return <Navigate to="/auth" replace />;
  }

  return children;
}
