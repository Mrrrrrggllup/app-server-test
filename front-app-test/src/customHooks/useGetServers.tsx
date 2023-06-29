import { useState, useEffect } from "react"
import { fetchServers } from "../service/apiService";
import Server from "../interfaces/Server";

const useGestServers = () => {
    const [servers, setServers] = useState<Server[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    let url = "http://localhost:8080/servers"

    let getServers = async () => {
      setLoading(true);
      fetchServers()
      .then((res) => {
        console.log(res);
        setServers(res);
        setLoading(false);
      })
      .catch((e) => {
        setError(e);
        setLoading(false);
      });
    };
   
    useEffect(() => {
     getServers();
    }, [url]);
   
    return { servers, loading, error, getServers };
  };

export default useGestServers;