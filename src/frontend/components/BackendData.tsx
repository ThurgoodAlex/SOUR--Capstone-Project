import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';


/******************************
 * This is basically just example code for how to request data from the backend.
 * Updated by Ashlyn on 11/18/24
 * Not being used anywhere- can probably be deleted
 ********************************/
const BackendData = () => {
  const [data, setData] = useState({
    body: {
      message: "Default",
      info: "Something went wrong if you are seeing this default data",
    },
    statusCode: 400,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBackendData();
  }, []);

  const fetchBackendData = async () => {
    try {
      const response = await fetch('http://localhost:8000/');
      const json = await response.json();

      // Parse body if it's a stringified JSON
      const parsedBody = JSON.parse(json.body);
      setData({
        body: parsedBody,
        statusCode: json.statusCode,
      });
      console.log("Requested data from \"/\" Received:", json);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data from the backend');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <ActivityIndicator size="large" color={Colors.orange} />;
  }

  if (error) {
    return <Text style={styles.error}>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{data.body.message}</Text>
      <Text style={styles.info}>{data.body.info}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default BackendData;
