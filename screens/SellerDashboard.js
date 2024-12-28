import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView, Alert, FlatList, Image } from 'react-native';
import { db, auth, realtimeDb } from '../firebaseConfig';
import { ref, set, onValue } from 'firebase/database';
import { launchImageLibrary } from 'react-native-image-picker';

export default function SellerDashboard() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [discount, setDiscount] = useState('');
  const [quantity, setQuantity] = useState('');
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

  const handleChooseImage = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
    };

    launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.assets[0].uri };
        setImage(source);
      }
    });
  };

  const handleAddProduct = async () => {
    if (!title || !price || !quantity || !image) {
      Alert.alert('Error', 'Please fill in all required fields (Title, Price, Quantity, Image)');
      return;
    }

    try {
      const newProduct = {
        title,
        price: parseFloat(price),
        image: image.uri,
        discount: discount ? parseFloat(discount) : 0,
        quantity: parseInt(quantity),
        sellerId: auth.currentUser.uid,
        active: true,
        createdAt: new Date().toISOString(),
      };

      const newProductRef = ref(realtimeDb, `products/${Date.now()}`);
      await set(newProductRef, newProduct);

      Alert.alert('Success', 'Product added successfully!');
      
      // Clear form after successful addition
      setTitle('');
      setPrice('');
      setImage(null);
      setDiscount('');
      setQuantity('');
    } catch (error) {
      console.error('Error adding product:', error);
      Alert.alert('Error', 'Failed to add product. Please try again.');
    }
  };

  const renderProduct = ({ item }) => (
    <View style={styles.productItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productTitle}>{item.title}</Text>
      <Text>Price: ${item.price}</Text>
      <Text>Quantity: {item.quantity}</Text>
    </View>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Add New Product</Text>
      <TextInput
        style={styles.input}
        placeholder="Title (required)"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Price (required)"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.imageButton} onPress={handleChooseImage}>
        <Text style={styles.imageButtonText}>Choose Image</Text>
      </TouchableOpacity>
      {image && <Image source={image} style={styles.previewImage} />}
      <TextInput
        style={styles.input}
        placeholder="Discount"
        value={discount}
        onChangeText={setDiscount}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity (required)"
        value={quantity}
        onChangeText={setQuantity}
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
        <Text style={styles.buttonText}>Add Product</Text>
      </TouchableOpacity>

      <Text style={styles.subtitle}>Your Products</Text>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={item => item.id}
        style={styles.productList}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
  },
  imageButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  imageButtonText: {
    color: 'white',
    fontSize: 18,
  },
  previewImage: {
    width: 200,
    height: 200,
    marginBottom: 10,
    borderRadius: 5,
  },
  productList: {
    width: '80%',
    marginTop: 20,
  },
  productItem: {
    backgroundColor: 'white',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  productTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  productImage: {
    width: '100%',
    height: 150,
    borderRadius: 5,
    marginBottom: 10,
  },
});

