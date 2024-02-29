import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  FlatList,
  Keyboard,
} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useSelector} from 'react-redux';
import axios from 'axios';
import {useNavigation} from '@react-navigation/native';
const Checkout = ({route}) => {
  const {id, cart, clear} = route.params;
  const navigation = useNavigation();
  const [perHeads, setPerHeads] = useState('0');
  const [totalPerHeads, setTotalPerHeads] = useState('0');
  const [orders, setOrders] = useState({});
  const [orderItems, setOrderItems] = useState([]);
  const [tables, setTables] = useState(null);
  const [selectedTable, setSelectedTable] = useState(null);
  const apiAddress = useSelector(state=>state.settings.apiAddress);
  const perHead = useSelector(state=>state.settings.perHead);
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

  const calculateTotalPrice = orderItems => {
    return orderItems.reduce(
      (accumulator, item) => accumulator + item.quantity * item.food_price,
      0,
    );
  };

  const handleCheckout = async () => {
    try {
      const order_id = id;
      const OrderItems = cart.map(item => ({
        order_item_id: generateRandomId(1, 3),
        food_id: item.id,
        food_name: item.food_name,
        quantity: item.quantity,
        food_price: item.food_price,
        sub_total: item.quantity * item.food_price,
      }));
      setOrderItems(OrderItems);
      const totalPrice = calculateTotalPrice(OrderItems);
      const order_date = new Date().toISOString();

      const order = {
        order_id: order_id,
        order_date: order_date,
        auth_id: null,
        table_id: selectedTable,
        per_heads: perHeads,
        total_phead: totalPerHeads,
        order_status: 'Pending',
        items: OrderItems,
        total_amount: Math.round(totalPrice + parseFloat(totalPerHeads)),
      };
      setOrders(order);
    } catch (err) {
      console.error('Error during checkout ', err);
    }
  };

  const saveOrder = async () => {
    try {
      const response = await axios.post(apiAddress + '/placeOrder', orders);
      if (response.data.status === '200') {
        navigation.goBack();
        clear();
      }
    } catch (error) {
      console.error('Error in saveOrder:', error);
    }
  };

  const LoadTables = async () => {
    try {
      const response = await axios.get(`${apiAddress}/tables`);
      if (response?.data?.tables) {
        setTables(response.data.tables);
      } else {
        console.error('Invalid data structure in the response:', response);
      }
    } catch (error) {
      console.error('Error loading tables:', error);
    }
  };

  useEffect(() => {
    LoadTables();
    handleCheckout();
  }, [totalPerHeads, selectedTable,perHead]);

  const renderItem = ({item}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemName}>{item.quantity}-{item.food_name} @{item.sub_total/item.quantity}</Text>
      <Text style={styles.itemName}></Text>
      <Text style={styles.itemPrice}>Subtotal: {item.sub_total} RS</Text>
    </View>
  );
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.orderContainer}>
        <Text style={styles.heading}>Per Heads</Text>
        <TextInput
          inputMode="numeric"
          style={styles.input}
          placeholder="Enter No. Of Heads"
          value={perHeads}
          onChangeText={text => {
            setPerHeads(text);
            setTotalPerHeads(parseInt(text) * parseInt(perHead));
          }}
          onBlur={() => {
            Keyboard.dismiss();
          }}
        />
        <Text style={styles.label}>Select Table:</Text>
        <Picker
          selectedValue={selectedTable}
          onValueChange={(itemValue, itemIndex) => setSelectedTable(itemValue)}
          style={styles.picker}>
          <Picker.Item label="Select a table" value={null} />
          {tables &&
            tables.map(table => (
              <Picker.Item
                key={table.table_id}
                label={table.table_name}
                value={table.table_id}
              />
            ))}
        </Picker>
      </View>
      <FlatList
        ListHeaderComponent={() => (
          <View>
            <Text style={styles.orderNumber}>Order# {orders.order_id}</Text>
            <Text style={styles.grandTotal}>
              Sub Total: {orders.total_amount - totalPerHeads}
            </Text>
            <Text style={styles.grandTotal}>Per Heads: {totalPerHeads}</Text>
            <Text style={styles.grandTotal}>
              Grand Total: {orders.total_amount} RS
            </Text>
            <View style={{alignContent: 'center'}}>
              <Text style={styles.orderDetails}>Order Details</Text>
            </View>
          </View>
        )}
        style={styles.container}
        data={orderItems}
        renderItem={renderItem}
        keyExtractor={item => item.food_id.toString()}
        ListFooterComponent={() => (
          <View style={{alignContent: 'center', margin: 20}}>
            <Button
              title="Checkout"
              onPress={saveOrder}
              style={styles.button}
            />
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    marginLeft: 10,
    paddingBottom: 10,
  },
  heading: {
    color: '#000',
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    fontSize: 16,
    borderBottomColor: '#4CAF50',
    borderBottomWidth: 2,
    width: '100%',
    marginVertical: 10,
  },
  picker: {
    height: 40,
    width: '100%',
    borderBottomColor: '#4CAF50',
    borderBottomWidth: 2,
    marginVertical: 10,
  },
  orderContainer: {
    margin: 20,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orderDetails: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
  },
  itemName: {
    fontSize: 16,
  },
  itemPrice: {
    fontSize: 14,
    color: '#555',
  },
  grandTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    alignItems: 'center',
  },
});
export default Checkout;
