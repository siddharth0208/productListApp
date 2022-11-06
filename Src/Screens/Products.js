import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import ProductComponent from '../Component/ProductComponent';
import Colors from '../Constants/Colors';

const Products = ({navigation}) => {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    getProducts();
  }, []);
  const getProducts = () => {
    axios
      .get(
        `http://staging.php-dev.in:8844/trainingapp/api/products/getList?product_category_id=1&limit=10&page=1`,
      )
      .then(function (response) {
        console.log('res', response.data.data);
        setProducts(response.data.data);
      })
      .catch(function (error) {
        console.log('error', error);
      });
  };
  const handleLoadMore = async () => {
    if (page <= 1) {
      await setPage(page + 1);
      setIsLoading(true);

      console.log('page', page);
      axios
        .get(
          `http://staging.php-dev.in:8844/trainingapp/api/products/getList?product_category_id=1&limit=10&page=2`,
        )
        .then(function (response) {
          setProducts(products.concat(response.data.data));
          setIsLoading(false);
        })
        .catch(function (error) {
          console.log('error', error);
        });
    }
  };
  const footerlist = () => {
    return isLoading ? (
      <View>
        <ActivityIndicator
          loading={isLoading}
          size={'large'}
          color={Colors.red}
        />
      </View>
    ) : null;
  };
  const renderItem = ({item}) => {
    return (
      <View>
        <ProductComponent props={item} navigation={navigation} />
      </View>
    );
  };

  return (
    <View>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onEndReached={handleLoadMore}
        ListFooterComponent={footerlist}
      />
    </View>
  );
};
export default Products;
