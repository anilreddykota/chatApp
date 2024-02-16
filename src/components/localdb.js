import { useEffect, useState } from 'react';

const useLocalDatabase = (dbName, objectStoreName) => {
  const [db, setDb] = useState(null);

  useEffect(() => {
    const initDatabase = async () => {
      const dbPromise = indexedDB.open(dbName, 1);

      dbPromise.onupgradeneeded = (event) => {
        const database = event.target.result;
        database.createObjectStore(objectStoreName, { keyPath: 'uid' });
      };

      dbPromise.onsuccess = (event) => {
        setDb(event.target.result);
      };
    };

    initDatabase();
  }, [dbName, objectStoreName]);

  const storeData = (data) => {
    if (db) {
      const transaction = db.transaction([objectStoreName], 'readwrite');
      const objectStore = transaction.objectStore(objectStoreName);
  
      data.forEach((item) => {
        // Ensure that the 'id' property exists and has a value before storing
        // console.log(item)
        if (item.uid) {
          objectStore.put(item);
        } else {
          console.warn('Item skipped: missing or invalid id property', item);
        }
       
      });
    }
  };
  const deleteDatabase = () => {
    if (db) {
      db.close();

      const deleteRequest = indexedDB.deleteDatabase(dbName);

      deleteRequest.onsuccess = () => {
        console.log(`Database ${dbName} deleted successfully`);
      };

      deleteRequest.onerror = (event) => {
        console.error(`Error deleting database ${dbName}`, event.target.error);
      };
    }
  };
  

  const fetchData = async () => {
    if (db) {
      const transaction = db.transaction([objectStoreName], 'readonly');
      const objectStore = transaction.objectStore(objectStoreName);
      const request = objectStore.getAll();

      return new Promise((resolve, reject) => {
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };

        request.onerror = (event) => {
          reject(event.target.error);
        };
      });
    }
  };
  const fetchDataAndUpdate = async () => {
    const cachedData = await fetchData();

    if (cachedData) {
      return cachedData;
    } else {
      return [];
    }
  };

  return { storeData, fetchDataAndUpdate,deleteDatabase };
};

export default useLocalDatabase;
// const UsersComponent = () => {
//   const [users, setUsers] = useState([]);
//   const localDatabase = useLocalDatabase('myDatabase', 'usersObjectStore');

//   const fetchUsers = async () => {
//     try {
//       const response = await axios.get('https://chatappserver-zop9.onrender.com/users');
//       setUsers(response.data);

//       // Store data in the local database for future offline access
//       localDatabase.storeData(response.data);
//     } catch (error) {
//       console.error('Error fetching users:', error);

//       // If network is not available, try fetching from local database
//       const cachedUsers = await localDatabase.fetchData();
//       if (cachedUsers) {
//         setUsers(cachedUsers);
//       }
//     }
//   };

//   useEffect(() => {
//     fetchUsers();
//   }, [localDatabase]);

 


