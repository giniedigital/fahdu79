import {useState, useEffect} from 'react';
import axios from 'axios';

export const useAxiosFetch = (url, token) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async (url, token) => {
    try {
      console.log('Ln 13', url, token);

      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: url,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      axios
        .request(config)
        .then(response => {
          console.log(JSON.stringify(response.data));
        })
        .catch(error => {
          console.log(error);
        });

      console.log(data);
    } catch (error) {
      setError(error);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(url, token);
  }, []);

  return {data, error, loading};
};
