import React, {useEffect, useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  Modal,
  Keyboard,
  ToastAndroid
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {APIAddressContext} from '../App';
import { BackHandler } from 'react-native';
const Main = ({navigation}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filteredData, setFilteredData] = useState(null);
  const [searchString, setSearchString] = useState('');
  const [cart, setCart] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const {apiAddress} = useContext(APIAddressContext);
  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress',()=> {
      BackHandler.exitApp();
      return true;
    });
    const fetchData = async () => {
      try {
        const response = await axios.get(apiAddress);
        const json = await response.data;
        setData(json);
        setFilteredData(json);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    return ()=>backHandler.remove();
  }, [refreshing]);
  const filterData = text => {
    setSearchString(text);
    if (text === '') {
      setFilteredData(data);
    } else {
      const filtered = data.filter(
        item =>
          item.food_code == parseInt(text) ||
          item.food_name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredData(filtered);
    }
  };
  const addToCart = item => {
    setSelectedItem(item);

    // Check if the item is already in the cart
    const isInCart = cart.some(cartItem => cartItem.id === item.id);
    if (isInCart) {
      // If the item is already in the cart, remove it
      const updatedCart = cart.filter(cartItem => cartItem.id !== item.id);
      setCart(updatedCart);
    } else {
      // If the item is not in the cart, show the modal for quantity input
      setModalVisible(true);
    }
  };

  const closeAddToCartModal = () => {
    setModalVisible(false);
  };

  const clearCart = () => {
    setCart([]);
    ToastAndroid.show('Cart Cleared',ToastAndroid.SHORT);
  };
  const generateRandomId = (numAlphabets, numNumbers) => {
    const alphabets = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';

    let randomId = '';

    for (let i = 0; i < numAlphabets; i++) {
      const randomAlphabetIndex = Math.floor(Math.random() * alphabets.length);
      randomId += alphabets[randomAlphabetIndex];
    }

    for (let i = 0; i < numNumbers; i++) {
      const randomNumberIndex = Math.floor(Math.random() * numbers.length);
      randomId += numbers[randomNumberIndex];
    }

    return randomId;
  };

  const renderItem = ({item}) => (
    <View style={styles.cardContainer}>
      {/* First Column */}
      <View style={styles.firstColumn}>
        <Text style={styles.cardTitle} numberOfLines={4} ellipsizeMode="tail">
          {item.food_name}
        </Text>
        <Text style={styles.cardText}>Price: {item.food_price}</Text>
      </View>

      {/* Second Column */}
      <TouchableOpacity
        onPress={() => addToCart(item)}
        style={styles.addButton}>
        <Icon
          name={
            cart.some(cartItem => cartItem.id === item.id) ? 'remove' : 'add'
          }
          size={24}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );
  const openCheckout = () => {
    if(cart.length>0) {
      navigation.navigate('checkout', {
        id: generateRandomId(2, 13),
        cart: cart,
        clear: clearCart
      });
    }
  };
  const handleAddToCart = quantity => {
    if (quantity) {
      const newItem = {...selectedItem, quantity: parseInt(quantity)};
      setCart([...cart, newItem]);
      //console.log(cart);
      setModalVisible(false);
    }
  };
  const handleRefresh = () => {
    setRefreshing(true);
  };
  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Text style={styles.loadingText}>Data is loading.......</Text>
      ) : data ? (
        <View style={styles.contentContainer}>
          <TextInput
            placeholder="Enter code or name to search"
            placeholderTextColor="#999"
            style={styles.input}
            value={searchString}
            onChangeText={text => filterData(text)}
            onBlur={()=>Keyboard.dismiss()}
          />
          <FlatList
            data={filteredData}
            keyExtractor={item => item.id.toString()}
            renderItem={renderItem}
            style={styles.list}
          />
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={openCheckout} style={styles.cartIcon}>
              {cart.length > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{cart.length}</Text>
                </View>
              )}
              <Icon name="shopping-cart" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity onPress={clearCart} style={styles.clearCartIcon}>
              <Icon name="refresh" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        <View>
          <Text style={styles.errorText}>No data found </Text>
          <TouchableOpacity
            onPress={handleRefresh}
            style={{
              flexDirection: 'row',
              backgroundColor: '#05f',
              color: '#fff',
              padding: 10,
              borderRadius: 10,
            }}>
            <Text style={{color: '#fff'}}>Refresh</Text>
            <Icon name="refresh" color="#fff" size={24} />
          </TouchableOpacity>
        </View>
      )}

      {/* Modal for adding items to the cart */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={closeAddToCartModal}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              Enter Quantity for {selectedItem?.food_name}
            </Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Quantity"
              keyboardType="numeric"
              onChangeText={text =>
                setSelectedItem({...selectedItem, quantity: text})
              }
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => handleAddToCart(selectedItem?.quantity)}>
                <Text style={styles.buttonText}>Add to Cart</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={closeAddToCartModal}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  contentContainer: {
    flex: 1,
    width: '90%',
    paddingTop: 20,
  },
  card: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#eee',
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  list: {
    width: '100%',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    borderRadius: 8,
    backgroundColor: '#eee',
    marginVertical: 10,
  },
  firstColumn: {
    flex: 1,
    marginRight: 10, // Adjust spacing between columns
  },
  cardText: {
    fontSize: 16,
    color: '#333',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 8,
    fontSize: 15,
    color: '#333',
    width: '100%',
    marginBottom: 15,
  },
  loadingText: {
    fontSize: 18,
    color: '#555',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
  },
  addButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
  },
  cartIcon: {
    backgroundColor: '#e74c3c',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
    flexDirection: 'row',
  },
  cartBadge: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 6,
    marginRight: 5,
  },
  cartBadgeText: {
    color: '#e74c3c',
    fontSize: 12,
    fontWeight: 'bold',
  },
  clearCartIcon: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    alignItems: 'center',
    marginLeft: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 8,
    width: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingLeft: 10,
    borderRadius: 8,
    fontSize: 15,
    marginBottom: 10,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
    width: '48%',
    alignItems: 'center',
  },
});
export default Main;
