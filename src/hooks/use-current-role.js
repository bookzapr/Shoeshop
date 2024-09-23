import { useSelector } from "react-redux";

export const useCurrentRole = () => {
  const { userInfo } = useSelector((state) => state.auth);

  return userInfo?.isAdmin;
};
