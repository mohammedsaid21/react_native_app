import React, { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Table, Row, Rows } from 'react-native-table-component';
import CurrentAccountService from '../services/api/CurrentAccountService';
import { authService } from '../services/auth/AuthService';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native';
import { TextInput } from 'react-native';
import { FlatList } from 'react-native';
import IconWithLabel from '../components/UI/IconWithLabel';
import AddNewMove from '../components/modals/AddNewMove';
import { SafeAreaView } from 'react-native';
import AddNewCurrentAccount from '../components/modals/AddNewCurrentAccount';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ListCurrentAccountMoves from './ListCurrentAccountMoves';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import Toast from 'react-native-toast-message';
import i18n from '../I18N';

const ITEM_PER_PAGE = 10;

const CurrentAccountsUsers = ({ navigation }) => {
  const handleItemPress = (item) => {
    console.log(item);
  };

  const [currentAccounts, setCurrentAccounts] = useState([])
  const [isloading, setIsLoading] = useState(true)
  const [page, setPage] = useState(0);

  const [modalNewCurrent, setModalNewCurrent] = useState(false)

  let totalPages

  useLayoutEffect(() => {
    CurrentAccountService.getAccessibleCurrentAccounts(authService.currentUserValue.id)
      .then((response) => {
        setCurrentAccounts(response.data)
        setIsLoading(false)
        // console.log("(response.data)", response.data)
      }).catch(error => {
        setIsLoading(false)
        console.log(error);
      })
  }, [modalVisible, isloading])


  useEffect(() => {
    totalPages = Math.ceil(currentAccounts.length / ITEM_PER_PAGE)
  }, [page, modalVisible])

  const handleNext = () => {
    handleRowPress(null)
    setPage(prevPage => prevPage + 1);
    scrollViewRef.current.scrollToOffset({ offset: 0, animated: true });
  };

  const handlePrev = () => {
    handleRowPress(null)
    setPage(prevPage => prevPage - 1);
    scrollViewRef.current.scrollToOffset({ offset: 0, animated: true });
  };

  const [animation, setAnimation] = useState(new Animated.Value(0));
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleRowPress = index => {
    setExpandedIndex(prevIndex => prevIndex === index ? null : index);
    Animated.timing(animation, {
      toValue: 1,
      duration: 150,
      useNativeDriver: false,
    }).start();
  };

  const scrollViewRef = useRef();

  const toggleExpanded = (index) => {
    if (expandedIndex === index) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start(() => handleRowPress(index));
    } else {
      handleRowPress(index);
      if (index >= 3) {
        scrollViewRef.current.scrollToIndex({ index: index, animated: true });
      }
      // scrollViewRef.current.scrollToIndex({ index: index === 0 ? index : index - 1, animated: true });
    }
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [userId, setUserId] = useState(null)
  const [accountId, setAccountId] = useState(null)

  const handleAddNew = (id) => {
    setAccountId(id)
    setUserId(null)
    setModalVisible(true);
  };

  const showAddNewCurrentAccount = (e) => {
    setUserId(null)
    setModalNewCurrent(true)
  }

  const showUpdateNewCurrentAccount = (e) => {
    setUserId(e)
    setAccountId(e)
    setModalNewCurrent(true)
  }


  const goToMovesScreen = (itemId) => {
    navigation.navigate("ListCurrentAccountMoves", {
      id: itemId
    })
  }

  const renderItem = ({ item, index }) => (
    <View style={[styles.row, expandedIndex === index ? styles.borderActive : ""]} key={`${item.currency}-${index}`}>
      {/* <TouchableOpacity onPress={() => toggleExpanded(index)} > */}
      <TouchableOpacity onPress={() => toggleExpanded(index)} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 2, marginEnd: 20, }}>
          <Text>{item.userName}</Text>
        </View>
        <View style={{ flex: 1, }}>
          <Text style={{ textAlign: 'center' }}>{item.accountCurrency}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ textAlign: 'center' }}>{item.balance}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={{ textAlign: 'center', marginHorizontal: 5 }}>{item.numberOfAccountTransactions}</Text>
          <Ionicons
            name={expandedIndex === index ? 'caret-up-outline' : 'caret-down-outline'}
            size={20}
            color="green"
            style={{ justifyContent: 'center', textAlign: 'center' }}
          />
        </View>
      </TouchableOpacity>
      {expandedIndex === index && (
        <Animated.View
          style={{
            height: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 290],
            }),
            overflow: 'hidden',
          }}
        >
          <View style={styles.expandedView}>
            <View style={styles.expandedViewFlex}>
              <Text style={styles.expandedViewText}>
                AccountIdentifier:
              </Text>
              <Text style={styles.expandedValue}>
                {item.accountIdentifier}
              </Text>
            </View>

            <View style={styles.expandedViewFlex}>
              <Text style={styles.expandedViewText}>
                userIdentifier:
              </Text>
              <Text style={styles.expandedValue}>
                {item.userIdentifier}
              </Text>
            </View>

            <View style={styles.expandedViewFlex}>
              <Text style={styles.expandedViewText}>
                numberOfAccountTransactions:
              </Text>
              <Text style={styles.expandedValue}>
                {item.numberOfAccountTransactions}
              </Text>
            </View>

            <View style={{ borderColor: "#a2a2a2", borderWidth: 1, marginVertical: 7 }}></View>

            <View style={[styles.expandedViewFlex]}>
              <IconWithLabel iconName="add-circle-outline" label="New Move" onPress={() => handleAddNew(item.id)} />

              <IconWithLabel iconName="add-outline" label="Moves" onPress={() => goToMovesScreen(item.id)}
                disabledClick={item.numberOfAccountTransactions === 0 ? true : false} />

              <IconWithLabel iconName="cog-outline" label="Update" onPress={() => showUpdateNewCurrentAccount(item.id)}
                disabledClick={item.numberOfAccountTransactions === 0 ? false : true} />
              <IconWithLabel iconName="trash-outline" label="Delete" />
              <IconWithLabel iconName="print-outline" label="Print Moves Account" disabledClick={true} />
            </View>

          </View>
        </Animated.View>
      )}
      {/* </TouchableOpacity> */}
    </View>
  );

  const renderFooter = () => (
    <>
      {page === 0 ?
        <View style={styles.paginationContainer}>
          <Text style={styles.paginationText}>{`${i18n.t("pagination_page_label")} ${page + 1} ${i18n.t("pagination_of_label")} ${Math.ceil(currentAccounts.length / ITEM_PER_PAGE)}`}</Text>
          <TouchableOpacity
            disabled={page >= Math.ceil(currentAccounts.length / ITEM_PER_PAGE) - 1}
            onPress={handleNext}
            style={[styles.paginationButton, page >= Math.ceil(currentAccounts.length / ITEM_PER_PAGE) - 1 && styles.disabled]}>
            <Ionicons name="caret-forward-outline" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
        :
        searchLess10 ?
          <View style={styles.footerTable} >
          </View>
          :
          <View style={styles.paginationContainer}>
            <TouchableOpacity
              disabled={page === 0}
              onPress={handlePrev}
              style={[styles.paginationButton, page === 0 && styles.disabled]}>
              {/* <Text style={styles.paginationButtonText}>{'<'}</Text> */}
              {/* <IconWithLabel iconName="caret-forward-outline" /> */}
              <Ionicons name="caret-back-outline" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.paginationText}>{`Page ${page + 1} of ${Math.ceil(currentAccounts.length / ITEM_PER_PAGE)}`}</Text>
            <TouchableOpacity
              disabled={page >= Math.ceil(currentAccounts.length / ITEM_PER_PAGE) - 1}
              onPress={handleNext}
              style={[styles.paginationButton, page >= Math.ceil(currentAccounts.length / ITEM_PER_PAGE) - 1 && styles.disabled]}>
              {/* <Text style={styles.paginationButtonText}>{'>'}</Text> */}
              <Ionicons name="caret-forward-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
      }
    </>
  );

  const [searchQuery, setSearchQuery] = useState("")

  let dataToShow = currentAccounts?.slice(page * ITEM_PER_PAGE, (page + 1) * ITEM_PER_PAGE)
  const [filterData, setFilterData] = useState()

  const [searchLess10, setSearchLess10] = useState(false)

  const handleSearch = (query) => {
    setSearchQuery(query);
    let queryLower = query.charAt(0).toLowerCase() + query.slice(1);
    if (queryLower.length === 0) {
      setSearchLess10(false)
      setFilterData(currentAccounts?.slice(page * ITEM_PER_PAGE, (page + 1) * ITEM_PER_PAGE))
    }

    setFilterData(dataToShow.filter((user) =>
      user.userName.includes(queryLower)
    ))

    if (filterData && filterData.length === 0) {
      Toast.show({
        type: 'error',
        text1: 'there is no items ',
        position: "top"
      });
    }
  }

  useEffect(() => {
    if (filterData && filterData.length <= 9 && filterData.length > 0) setSearchLess10(true)
    else setSearchLess10(false)
  }, [filterData])


  if (isloading) {
    return <LoadingOverlay />
  }

  return (
    <View style={styles.container}>
      <FlatList
        ListHeaderComponent={
          <View >
            <View style={styles.headerPage}>
              <TextInput
                style={styles.inputSearch}
                onChangeText={text => handleSearch(text)}
                value={searchQuery}
                placeholder="Search..."
              />
              <View style={styles.addSearch}>
                {/* <Button title='Add user' />
          <Button title='Print' /> */}
                <IconWithLabel iconName="add-outline" label="New Account" onPress={() => showAddNewCurrentAccount()} />
                <IconWithLabel iconName="print-outline" label="Print" />
              </View>
            </View>

            {/* header of Table */}
            <View style={styles.headerTable}>
              <View style={{ flex: 2, borderEndColor: "#fff", borderEndWidth: 2, }}>
                <Text style={styles.textCol}>User Name</Text>
              </View>
              <View style={{ flex: 1, borderEndColor: "#fff", borderEndWidth: 2, }}>
                <Text style={styles.textCol}>Currency</Text>
              </View>
              <View style={{ flex: 1, borderEndColor: "#fff", borderEndWidth: 2, }}>
                <Text style={styles.textCol}>Balance</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.textCol, { fontSize: 10 }]}>No. of Transactions</Text>
              </View>
            </View>
            {/* header of Table */}
          </View>
        }

        data={dataToShow}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListFooterComponent={renderFooter}
        initialNumToRender={10}
        ref={scrollViewRef}
        nestedScrollEnabled={true}
      />

      <AddNewCurrentAccount
        modalNewCurrent={modalNewCurrent} setModalNewCurrent={setModalNewCurrent}
        userId={userId} setUserId={setUserId}
        accountId={accountId} setAccountId={setAccountId}
        setIsLoading={setIsLoading}
      />

      <AddNewMove
        modalVisible={modalVisible} setModalVisible={setModalVisible}
        userId={userId} setUserId={setUserId}
        accountId={accountId} setAccountId={setAccountId}
        setIsLoading={setIsLoading}
      />

    </View>
  );
};

export default CurrentAccountsUsers;


const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingTop: 10,
    // paddingHorizontal: 30,
    flex: 1,
    backgroundColor: "#fff"
  },
  container1: {
    flexDirection: 'column',
    paddingTop: 8,
    marginVertical: 10,
    backgroundColor: '#fff',
    flex: 1,
  },
  loading: {
    fontSize: 20,
    textAlign: "center",
    paddingVertical: 80
  },
  buttonContainer: {
    flex: 'row'
  },
  footerTable: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 25,
    // paddingBottom: 60,
    paddingHorizontal: 60
  },
  headerPage: {
    flexDirection: 'column',
  },
  addSearch: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginEnd: 20,
    marginTop: 20,
    flexWrap: 'wrap',
    alignItems: 'center'
  },
  inputSearch: {
    height: 40,
    // width: 150,
    borderColor: '#f3f3f3',
    backgroundColor: "#e5e5e5",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginHorizontal: 10,
    marginTop: 10,
  },
  h3TextList: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 12
  },
  //      table      /*/********/
  row: {
    paddingHorizontal: 12,
    backgroundColor: "#eee",
    marginBottom: 5,
    paddingVertical: 15,
    borderRadius: 5
  },
  borderActive: {
    borderWidth: 1,
    borderColor: "#4285F4",
  },
  headerTable: {
    flexDirection: 'row',
    backgroundColor: "#4285F4",
    color: "#fff",
    marginTop: 10,
    marginBottom: 10,
    paddingHorizontal: 5
  },

  textCol: {
    color: "#fff",
    fontSize: 13,
    paddingHorizontal: 5,
    paddingVertical: 10,
    textAlign: 'center'
  },

  expandedView: {
    backgroundColor: 'rgb(255, 255, 204)',
    paddingVertical: 12,
    paddingHorizontal: 12,
    marginTop: 20,
    borderRadius: 10
  },
  expandedViewText: {
    color: '#444',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
    marginEnd: 5,
  },
  expandedValue: {
    color: '#333',
    fontSize: 14,
    marginBottom: 5,
  },
  expandedViewFlex: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    // justifyContent: 'space-between'
  },
  moves: {
    justifyContent: 'center',
    alignItems: 'center'
  },
  buttonContainerMoves: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#009688',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 5,
    marginRight: 10,
  },
  buttonContainer: {
    backgroundColor: '#4285F4',
    borderRadius: 5,
    padding: 5,
    marginVertical: 20,
    marginHorizontal: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
  },

  paginationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 26,
  },
  paginationButton: {
    padding: 7,
    backgroundColor: '#f2f2f2',
    borderRadius: 40,
    marginHorizontal: 4,
    backgroundColor: "#4285F4"
  },
  paginationButtonText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#fff',
  },
  paginationText: {
    fontSize: 14,
    marginHorizontal: 14,
  },
  disabled: {
    opacity: 0.5,
  },
});
