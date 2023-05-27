import { View, Text, StyleSheet, FlatList, ScrollView, Modal } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
// import { i18n } from '../translation/i18n'
import { DataTable, Accordion } from 'react-native-paper';
import CurrentAccountService from '../services/api/CurrentAccountService';
import { authService } from '../services/auth/AuthService';
import { TextInput, Button, Animated, LayoutAnimation } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import { TouchableOpacity } from 'react-native';
import AddNewMove from '../components/modals/AddNewMove';

const ITEM_PER_PAGE = 10;

const CurrentAccounts = ({ navigation }) => {

  const [currentAccounts, setCurrentAccounts] = useState([])

  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [isloading, setIsLoading] = useState(true)

  let totalPages

  useEffect(() => {
    CurrentAccountService.getAccessibleCurrentAccounts(authService.currentUserValue.id).then((response) => {
      setCurrentAccounts(response.data)
      setIsLoading(false)

      // console.log("(response.data)", response.data)
    }).catch(error => {
      setIsLoading(false)

      console.log(error);
    })
  }, [])

  useEffect(() => {
    totalPages = Math.ceil(currentAccounts.length / ITEM_PER_PAGE)
  }, [page])



  const handleSearch = (text) => {
    setSearchQuery(text)

    let filterData = filteredUsers.filter(user =>
      user.userName.toLowerCase().includes(searchQuery.toLowerCase())
    )
    setFilteredUsers(filterData)

    if (!searchQuery) {
      setFilteredUsers(currentAccounts)
    }
  }


  const handleNext = () => {
    setPage(prevPage => prevPage + 1);
  };

  const handlePrev = () => {
    setPage(prevPage => prevPage - 1);
  };

  const [animation, setAnimation] = useState(new Animated.Value(0));
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleRowPress = index => {
    setExpandedIndex(prevIndex => prevIndex === index ? null : index);
    Animated.timing(animation, {
      toValue: 1,
      duration: 70,
      useNativeDriver: false,
    }).start();
  };

  const toggleExpanded = (index) => {
    if (expandedIndex !== index) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 70,
        useNativeDriver: false,
      }).start(() => handleRowPress(index));
    } else {
      handleRowPress(index);
    }
  };

  const [modalVisible, setModalVisible] = useState(false);

  const handleButtonPress = (id) => {
    setAccountId(id)
    setUserId(null)
    setModalVisible(true);
  };

  const [userId, setUserId] = useState(null)
  const [accountId, setAccountId] = useState(null)


  const renderItem = ({ item, index }) => (
    <View style={styles.row} key={`${item.currency}-${index}`}>
      <DataTable.Row>
        <DataTable.Cell style={{ flex: 2 }}>{item.userName}</DataTable.Cell>
        <DataTable.Cell>{item.accountCurrency}</DataTable.Cell>
        <DataTable.Cell>{item.balance}</DataTable.Cell>
        <DataTable.Cell onPress={() => toggleExpanded(index)} style={{ justifyContent: 'center' }}>
          <Ionicons name={expandedIndex === index ? 'chevron-up-outline' : 'chevron-down-outline'} size={20} color="green" />
        </DataTable.Cell>
      </DataTable.Row>
      {/* <Animated.View
          style={{ height: animation.interpolate({ inputRange: [0, 1], outputRange: [0, 100], }), overflow: 'hidden', }}
        > */}
      {expandedIndex === index && (
        <Animatable.View animation="zoomIn" easing="ease-out" // pulse slideInDown
          duration={200} style={{ backgroundColor: '#f6f6f6', padding: 10 }}>
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

            <View style={[styles.expandedViewFlex]}>
              <Text>AccountTransactions: </Text>
              <TouchableOpacity style={[styles.expandedViewFlex, styles.buttonContainer]}>
                <Text style={[styles.buttonText, styles.moves]}>Go to Moves</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.expandedViewFlex, styles.buttonContainer]} onPress={() => handleButtonPress(item.id)}>
                <Text style={[styles.buttonText, styles.moves]}>Add New Move</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.expandedViewFlex, styles.buttonContainerMoves]}>
              <Text>crud general actions: </Text>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>

          </View>
        </Animatable.View>
      )}
    </View >
  );

  const renderFooter = () => (
    <View style={styles.footerTable}>
      <Button title="Prev" onPress={handlePrev} disabled={page === 0} />
      <Button title="Next" onPress={handleNext} disabled={page >= Math.ceil(currentAccounts.length / ITEM_PER_PAGE) - 1} />
    </View>
  );

  // const dataToShow = filteredAccount?.slice(page * ITEM_PER_PAGE, (page + 1) * ITEM_PER_PAGE);
  const dataToShow = currentAccounts?.slice(page * ITEM_PER_PAGE, (page + 1) * ITEM_PER_PAGE);

  if (isloading) {
    return <Text style={styles.loading}>Loading...</Text>;
  }


  return (
    // <ScrollView  style={styles.container}>
    <View style={styles.container}>

      <View style={styles.headerPage}>
        <Text style={styles.h3TextList}>List User</Text>
        <View style={styles.addSearch}>
          <Button title='Add user' />
          <Button title='Print' />
          <TextInput
            style={styles.inputSearch}
            onChangeText={text => handleSearch(text)}
            value={searchQuery}
            placeholder="Search..."
          />
        </View>
      </View>

      <View style={styles.container1}>
        <DataTable>
          <DataTable.Header>
            <DataTable.Title style={{ flex: 2 }}>user name</DataTable.Title>
            <DataTable.Title>currency</DataTable.Title>
            <DataTable.Title>total</DataTable.Title>
            <DataTable.Title>more</DataTable.Title>
          </DataTable.Header>

          <FlatList
            data={dataToShow}
            renderItem={renderItem}
            keyExtractor={item => item.id}
            ListFooterComponent={renderFooter}
            initialNumToRender={10}
          />

        </DataTable>

      </View>

      <AddNewMove
        modalVisible={modalVisible} setModalVisible={setModalVisible}
        userId={userId} setUserId={setUserId}
        accountId={accountId} setAccountId={setAccountId}
      />

      {/* </ScrollView> */}
    </View>
  );
}

export default CurrentAccounts
const styles = StyleSheet.create({
  // container: {
  //   paddingTop: 10,
  //   paddingHorizontal: 30,
  //   backgroundColor: "#fff"
  // },
  container: {
    flexDirection: 'column',
    paddingTop: 10,
    // paddingHorizontal: 30,
    flex: 1
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
    marginTop: 20,
    marginBottom: 60,
    paddingHorizontal: 60
  },
  headerPage: {
    flexDirection: 'column',
  },
  addSearch: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    alignItems: 'center'
  },
  inputSearch: {
    height: 40,
    width: 150,
    borderColor: 'gray',
    borderBottomWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10
  },
  h3TextList: {
    fontSize: 20,
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 12
  },
  expandedView: {
    backgroundColor: '#f6f6f6',
    padding: 6,
    marginTop: 6,
  },
  expandedViewText: {
    color: '#444',
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
    marginEnd: 5
  },
  expandedValue: {
    color: '#333',
    fontSize: 14,
    marginBottom: 5,
  },
  expandedViewFlex: {
    flexDirection: 'row',
    alignItems: 'center'
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
});
