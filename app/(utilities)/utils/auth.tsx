"use client";
import Cookies from "js-cookie";
import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { API } from "./config";

interface AuthContextType {
  data: UserData | null;
  auth: boolean;
  setAuth: React.Dispatch<React.SetStateAction<boolean>>;
  setData: React.Dispatch<React.SetStateAction<UserData | null>>;
  isIndividual: boolean;
  setIsIndividual: React.Dispatch<React.SetStateAction<boolean>>;
}

// Provide a default value for the context
const defaultAuthContext: AuthContextType = {
  data: null,
  auth: false,
  setAuth: () => {},
  setData: () => {},
  isIndividual: false,
  setIsIndividual: () => {},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuthContext = () => {
  return useContext(AuthContext);
};

export interface UserData {
  id: string;
  fullname: string;
  profilepic: string;
  email: string;
  organisationId: string;
}

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [auth, setAuth] = useState(false);
  const [data, setData] = useState<UserData | null>(null);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isIndividual, setIsIndividual] = useState(false);

  const deleteToken = () => {
    Cookies.remove("token");
    router.push("/login");
  };

  console.log(data, "data", auth, "auth", isIndividual, "isIndividual");

  const sendTokenAndVerify = async () => {
    try {
      const token = Cookies.get("token");

      if (!token) {
        console.log("No token found in cookies.");
        return;
      }
      setLoading(true);
      const res = await axios.get(`${API}/auth/verifytoken`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        const dataToPut = res.data.data;
        const organisationId = localStorage.getItem("organisationId");
        if (organisationId) {
          dataToPut.organisationId = organisationId;
        }

        if (res.data.data.organisationId || organisationId) {
          setIsIndividual(false);
        } else {
          setIsIndividual(true);
        }

        setData(dataToPut);
        setAuth(true);
      } else {
        deleteToken();
      }
    } catch (error: Error | any) {
      if (error.response?.data?.error === "Token expired") {
        toast.error(error.response.data.message);
      }

      deleteToken();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    sendTokenAndVerify();
  }, []);

  const contextValue = useMemo(
    () => ({
      data,
      auth,
      setAuth,
      setData,
      isIndividual,
      setIsIndividual,
    }),
    [data, auth]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {loading ? (
        <div className="w-full h-screen flex font-semibold justify-center items-center">
          Loading....
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};
