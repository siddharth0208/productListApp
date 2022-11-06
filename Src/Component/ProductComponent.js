import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Colors from '../Constants/Colors';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProductComponent = ({navigation, props}) => {
  const id = props.id;
  const [like, setLike] = useState(false);
  useEffect(() => {
    setLikeValue();
  }, []);

  const setLikeValue = async () => {
    let val1 = await AsyncStorage.getItem('data');
    val1 = JSON.parse(val1);
    console.log(val1);
    if (val1 != null) {
      for (let i = 0; i < val1.length; i++) {
        if (val1[i].id == props.id) {
          setLike(true);
          return;
        } else {
          setLike(false);
        }
      }
    } else {
      setLike(false);
    }
  };

  const saveProduct = async () => {
    if (like === false) {
      let productData;
      let jsonValue = await AsyncStorage.getItem('data');
      if (jsonValue != null) {
        jsonValue = JSON.parse(jsonValue);
        productData = [
          ...jsonValue,
          {
            id: props.id,
            name: props.name,
            producer: props.producer,
            price: props.cost,
          },
        ];
      } else {
        productData = [
          {
            id: props.id,
            name: props.name,
            producer: props.producer,
            price: props.cost,
          },
        ];
      }

      try {
        const Value = JSON.stringify(productData);
        await AsyncStorage.setItem('data', Value);
        setLike(!like);
        Alert.alert('data set');
      } catch (e) {
        console.log('error', e);
      }
    } else if (like === true) {
      let jsonValue = await AsyncStorage.getItem('data');
      jsonValue = JSON.parse(jsonValue);
      let value = jsonValue.filter(item => item.id != props.id);
      value = JSON.stringify(value);
      try {
        await AsyncStorage.setItem('data', value);
        setLike(!like);
      } catch (e) {
        console.log('error', e);
      }
    }
  };
  return (
    <View style={styles.mainView}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('ProductsDetails', {id});
        }}>
        <Image
          resizeMode={'cover'}
          resizeMethod={'auto'}
          style={styles.imageView}
          source={{
            uri: props?.product_images,
          }}
        />
      </TouchableOpacity>
      <View style={styles.detailsView}>
        <Text style={styles.productTitle}>{props?.name}</Text>
        <Text style={styles.productSubTitleView}>{props?.producer}</Text>
        <Text style={styles.productPriceView}>Rs. {props?.cost}</Text>
      </View>
      <View style={styles.likeBottonView}>
        <TouchableOpacity
          onPress={() => {
            saveProduct();
          }}>
          {like === true ? (
            <AntDesign name="heart" size={35} color={Colors.darkRed} />
          ) : (
            <AntDesign name="hearto" size={35} color={Colors.darkRed} />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  mainView: {
    top: 0,
    flexDirection: 'row',
  },
  imageView: {
    width: 90,
    height: 85,
    left: 10,
    marginTop: 10,
  },
  detailsView: {
    marginLeft: 30,
    paddingBottom: 30,
  },
  productTitle: {
    fontSize: 20,
    color: Colors.black,
    fontWeight: '500',
    marginVertical: 5,
  },
  productSubTitleView: {
    color: Colors.grey,
    marginVertical: 5,
  },
  productPriceView: {
    color: Colors.darkRed,
    fontWeight: 'bold',
    marginVertical: 5,
    fontSize: 18,
  },
  likeBottonView: {
    position: 'absolute',
    marginTop: 55,
    marginLeft: 345,
  },
});

export default ProductComponent;
