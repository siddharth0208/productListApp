import React, {useEffect, useState} from 'react';
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native';
import axios from 'axios';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Colors from '../Constants/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ProductsDetails = ({navigation, route}) => {
  const [like, setLike] = useState(false);
  console.log('route', route.params);
  const [productDetails, setProductDetails] = useState();
  let jsonValue;
  const setLikeValue = async () => {
    let val1 = await AsyncStorage.getItem('data');
    val1 = JSON.parse(val1);
    console.log(val1);
    if (val1 != null) {
      for (let i = 0; i < val1.length; i++) {
        if (val1[i].id == productDetails.id) {
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
  const getData = async () => {
    try {
      jsonValue = await AsyncStorage.getItem('data');
      jsonValue = JSON.parse(jsonValue);
      console.log('Liked item', jsonValue);
    } catch (e) {
      // error reading value
    }
  };

  const getProducts = () => {
    axios
      .get(
        `http://staging.php-dev.in:8844/trainingapp/api/products/getDetail?product_id=${route.params.id}`,
      )
      .then(function (response) {
        console.log('res', response.data.data);
        setProductDetails(response.data.data);
      })
      .catch(function (error) {
        console.log('error', error);
      });
  };

  useEffect(() => {
    getProducts();
    setLikeValue();

    getData();
  }, []);
  const saveProduct = async () => {
    if (like === false) {
      let productData;
      let jsonValue = await AsyncStorage.getItem('data');
      if (jsonValue != null) {
        jsonValue = JSON.parse(jsonValue);
        productData = [
          ...jsonValue,
          {
            id: productDetails.id,
            name: productDetails.name,
            producer: productDetails.producer,
            price: productDetails.cost,
          },
        ];
      } else {
        productData = [
          {
            id: productDetails.id,
            name: productDetails.name,
            producer: productDetails.producer,
            price: productDetails.cost,
          },
        ];
      }

      try {
        const Value = JSON.stringify(productData);
        await AsyncStorage.setItem('data', Value);
        setLike(!like);
      } catch (e) {
        console.log('error', e);
      }
    } else if (like === true) {
      let jsonValue = await AsyncStorage.getItem('data');
      jsonValue = JSON.parse(jsonValue);
      let value = jsonValue.filter(item => item.id != productDetails.id);
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
    <View style={{backgroundColor: 'white', flex: 1}}>
      <View>
        <Image
          resizeMode={'cover'}
          resizeMethod={'auto'}
          style={styles.imageView}
          source={{
            uri: productDetails?.product_images[0].image,
          }}
        />
      </View>
      <View style={{flexDirection: 'row'}}>
        <Text style={styles.titleView}>{productDetails?.name}</Text>
        <View style={styles.likeBottonView}>
          <TouchableOpacity
            onPress={() => {
              saveProduct();
            }}>
            {like === true ? (
              <AntDesign name="heart" size={33} color={Colors.red} />
            ) : (
              <AntDesign name="hearto" size={33} color={Colors.red} />
            )}
          </TouchableOpacity>
        </View>
      </View>
      <Text style={styles.subTitleView}>{productDetails?.producer}</Text>
      <View style={{flexDirection: 'row', marginVertical: 2}}>
        <Text style={styles.priceView}>Rs. {productDetails?.cost}</Text>
        <Text style={styles.ratingView}>Rating {productDetails?.rating}</Text>
      </View>
      <Text style={styles.descriptionView}>{productDetails?.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  imageView: {
    height: 300,
    width: 393,
    left: 0,
    right: 0,
    top: 0,
    marginBottom: 3,
  },
  titleView: {
    fontSize: 22,
    top: 5,
    fontWeight: 'bold',
    color: Colors.black,
    left: 15,
  },
  subTitleView: {
    fontSize: 17,
    left: 15,
    marginVertical: 8,
  },
  likeBottonView: {
    position: 'absolute',
    top: 5,
    marginLeft: 340,
  },
  priceView: {
    left: 15,
    fontSize: 18,
    color: Colors.darkRed,
    fontWeight: '600',
  },
  ratingView: {
    position: 'absolute',
    left: 200,
    fontSize: 18,
    color: Colors.darkRed,
    fontWeight: '600',
  },
  descriptionView: {
    marginVertical: 7,
    marginLeft: 15,
    marginRight: 22,
    fontSize: 16,
  },
});

export default ProductsDetails;
