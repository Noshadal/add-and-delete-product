import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image } from 'react-native';
import { realtimeDb } from '../firebaseConfig';
import { ref, onValue } from 'firebase/database';

export default function BuyerDashboard() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const productsRef = ref(realtimeDb, 'products');
    const unsubscribe = onValue(productsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const productList = Object.entries(data).map(([key, value]) => ({
          id: key,
          ...value,
        }));
        setProducts(productList);
      }
    });

    return () => unsubscribe();
  }, []);

  const renderProduct = ({ item }) => (
    <View style={styles.productCard}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productTitle}>{item.title}</Text>
      <Text style={styles.productPrice}>Price: ${item.price}</Text>
      <Text style={styles.productDiscount}>Discount: {item.discount}%</Text>
      <Text style={styles.productQuantity}>Available: {item.quantity}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Available Products</Text>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.productList}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  productList: {
    padding: 10,
  },
  productCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: '#007AFF',
    marginBottom: 5,
  },
  productDiscount: {
    fontSize: 14,
    color: 'green',
    marginBottom: 5,
  },
  productQuantity: {
    fontSize: 14,
    color: 'gray',
  },
});
