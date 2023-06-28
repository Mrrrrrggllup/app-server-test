import { useState, useEffect } from "react"
import { fetchServers } from "../service/apiService";
import Server from "../interfaces/Server";
import { getServers } from "dns";

const useGestServers = () => {
    const [servers, setServers] = useState<Server[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    let url = "http://localhost:8080/servers"

    let getServers = async () => {
      setLoading(true);
      fetchServers()
      .then((data) => {
        console.log(data);
        setServers(data);
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