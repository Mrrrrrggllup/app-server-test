import { useState, useEffect } from "react"
import { fetchServers } from "../service/apiService";
import Server from "../interfaces/Server";

const useGestServers = () => {
    const [servers, setServers] = useState<Server[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    let getServers = async () => {
      setLoading(true);
      fetchServers()
      .then((res) => {
        setServers(res?.data?.body || []);
        setLoading(false);
      })
      .catch((e) => {
        setError(e);
        setLoading(false);
      });
    };
   
    useEffect(() => {
     getServers();
    }, []);
   
    return { servers, loading, error, getServers, setServers };
  };

export default useGestServers;