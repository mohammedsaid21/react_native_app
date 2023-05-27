import { View, Text } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useState } from 'react'
import CurrentAccountTransactionService from '../services/api/CurrentAccountTransactionService'
import CurrentAccountService from '../services/api/CurrentAccountService'
import { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import { Card, Paragraph, Title } from 'react-native-paper'
import { Picker } from '@react-native-picker/picker'
import { useRef } from 'react'
import { TouchableOpacity } from 'react-native'
import { Button } from 'react-native'
// i delete them
import DateInputPicker from '../components/UI/DateInputPicker'
import IconWithLabel from '../components/UI/IconWithLabel'
import { FlatList, Animated } from 'react-native'
import { ScrollView } from 'react-native'
import AddNewMove from '../components/modals/AddNewMove'
import AddNewMoveFromMain from '../components/modals/AddNewMoveFromMain'
import i18n from '../I18N'
// import DatePicker from 'react-native-datepicker';
// import DateTimePickerModal from "react-native-modal-datetime-picker";
// import DatePicker from 'react-native-datepicker'
// import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';

// import { DatePicker } from 'expo';

const ListCurrentAccountMoves = ({ route, navigation }) => {
  const ITEM_PER_PAGE = 10;

  const id = route.params.id

  const [currentAccountTransactions, setCurrentAccountTransactions] = useState([])
  const [clientAccounts, setClientAccounts] = useState([])
  const [currentAccountId, setCurrentAccountId] = useState('');
  const [clientId, setClientId] = useState('')
  const [clientName, setClientName] = useState('')

  const [addMove, setAddMove] = useState(false)
  const [accountId, setAccountId] = useState(null)
  const [idUpdate, setIdUpdated] = useState(null)
  const [isloading, setIsLoading] = useState(true)

  useEffect(() => {
    if (id) {
      CurrentAccountTransactionService.getAccountTransactions(id)
        .then((response) => {
          setCurrentAccountTransactions(response.data);
          // console.log("TEST: ", response.data)
          setCurrentAccountId(response?.data[0]?.currentAccountId);
          // console.log(response?.data[0])
          setClientId(response?.data[0]?.clientId);
          setClientName(response?.data[0]?.accountHolderName);
          // console.log("Client Id", clientId)
          // console.log("Client Id from Data", response?.data[0]?.clientId)
          CurrentAccountService.getClientCurrentAccounts(response?.data[0]?.clientId)
            .then((response1) => {
              setClientAccounts(response1.data);
              setIsLoading(false)
              //   setCurrentAccountId(response?.data[0]?.currentAccountId);
            }).catch(error => {
              console.log(error);
            })
        }).catch(error => {
          console.log(error);
          setIsLoading(false)
        })
    }
    else {
      navigation.navigate("CurrentAccountsUsers")
    }
  }, [addMove, id, currentAccountId,])


  const getCurrentAccountTransactions = () => {
    // if (id) {
    //   CurrentAccountTransactionService.getAccountTransactions(id).then((response) => {
    //     setCurrentAccountTransactions(response.data);
    //     setCurrentAccountId(response?.data[0]?.currentAccountId);
    //     // console.log(response?.data[0])
    //     setClientId(response?.data[0]?.clientId);
    //     setClientName(response?.data[0]?.accountHolderName);
    //     setIsLoading(false)
    //     // console.log("Client Id", clientId)
    //     // console.log("Client Id from Data", response?.data[0]?.clientId)
    //     CurrentAccountService.getClientCurrentAccounts(response?.data[0]?.clientId).then((response) => {
    //       setClientAccounts(response.data);
    //       //   setCurrentAccountId(response?.data[0]?.currentAccountId);
    //     }).catch(error => {
    //       console.log(error);
    //     })
    //   }).catch(error => {
    //     console.log(error);
    //     setIsLoading(false)
    //   })
    // }
  }

  const deleteCurrentAccountTransaction = (id) => {
    CurrentAccountTransactionService.deleteCurrentAccountTransaction(id).then((response) => {
      getCurrentAccountTransactions();
    }).catch(error => {
      console.log(error);
    })
  }


  const showUpdateMove = (idU) => {
    setIdUpdated(idU)
    setAddMove(true)
  }

  const showAddNewMove = () => {
    setAccountId(id)
    setAddMove(true)
  }

  const AccountDetails = ({ account }) => {
    return (
      <Card>
        <Card.Content>
          <Title style={{ fontWeight: 900 }}>{account?.accountHolderName}</Title>
          <Paragraph style={{ fontWeight: 800 }}>Account Identifier: {account?.accountIdentifier}</Paragraph>
          <Paragraph style={{ fontWeight: 800 }}>Currency: {account?.accountCurrency}</Paragraph>
          <Paragraph style={{ fontWeight: 800 }}>Balance: {account?.accountBalance}</Paragraph>
          <Paragraph style={{ fontWeight: 800 }}>User Id: {account?.userIdentifier}</Paragraph>
          <Paragraph style={{ fontWeight: 800 }}>Mobile Number: {account?.mainMobileNumber}</Paragraph>
        </Card.Content>
      </Card>
    );
  };

  const clientAccountIdRef = useRef()

  const moveToAnotherAccount = (accountId) => {
    setIsLoading(true)
    navigation.navigate("ListCurrentAccountMoves", {
      id: accountId
    })
  }

  // the list of table 
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

  const toggleExpanded = (index) => {
    if (expandedIndex !== index) {
      Animated.timing(animation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: false,
      }).start(() => handleRowPress(index));
    } else {
      handleRowPress(index);
    }
  };

  const renderItem = ({ item, index }) => (
    <View style={[styles.row, expandedIndex === index ? styles.borderActive : ""]} key={`${item.currency}-${index}`}>
      {/* <TouchableOpacity onPress={() => toggleExpanded(index)} > */}
      <TouchableOpacity onPress={() => toggleExpanded(index)} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 1, }}>
          <Text style={{ textAlign: 'center' }}>{item.transactionAmount}</Text>
        </View>
        <View style={{ flex: 1, }}>
          <Text style={{ textAlign: 'center' }}>{item.transactionType}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={{ textAlign: 'center' }}>{item.balanceAfterTransaction}</Text>
          <Ionicons
            name={expandedIndex === index ? 'caret-up-outline' : 'caret-down-outline'}
            size={20}
            color="green"
            style={{ justifyContent: 'center', textAlign: 'center', marginStart: 12 }}
          />
        </View>
        {/* <View style={{ flex: 1, }}>
        </View> */}
      </TouchableOpacity>
      {expandedIndex === index && (
        <Animated.View
          style={{
            height: animation.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 330],
            }),
            overflow: 'hidden',
          }}
        >
          <View style={styles.expandedView}>
            <View style={styles.expandedViewFlex}>
              <Text style={styles.expandedViewText}>
                Transaction Identifier:
              </Text>
              <Text style={styles.expandedValue}>
                {item.transactionIdentifier}
              </Text>
            </View>

            <View style={styles.expandedViewFlex}>
              <Text style={styles.expandedViewText}>
                balanceBeforeTransaction:
              </Text>
              <Text style={styles.expandedValue}>
                {item.balanceBeforeTransaction}
              </Text>
            </View>

            <View style={styles.expandedViewFlex}>
              <Text style={styles.expandedViewText}>
                balanceAfterTransaction:
              </Text>
              <Text style={styles.expandedValue}>
                {item.balanceAfterTransaction}
              </Text>
            </View>

            <View style={styles.expandedViewFlex}>
              <Text style={styles.expandedViewText}>
                Created By UserName:
              </Text>
              <Text style={styles.expandedValue}>
                {item.createdByUserName}
              </Text>
            </View>

            <View style={styles.expandedViewFlex}>
              <Text style={styles.expandedViewText}>
                Execution Date:
              </Text>
              <Text style={styles.expandedValue}>
                {item.executionDate}
              </Text>
            </View>

            <View style={styles.expandedViewFlex}>
              <Text style={styles.expandedViewText}>
                Notes:
              </Text>
              <Text style={styles.expandedValue}>
                {item.notes}
              </Text>
            </View>


            <View style={{ borderColor: "#a2a2a2", borderWidth: 1, marginVertical: 7 }}></View>

            <View style={[styles.expandedViewFlex]}>
              <IconWithLabel iconName="cloud-upload-outline" label="Update" onPress={() => showUpdateMove(item.id)} />
              <IconWithLabel iconName="cloud-upload-outline" label="Delete" />
            </View>

          </View>
        </Animated.View>
      )}
      {/* </TouchableOpacity> */}
    </View>
  );

  const renderFooter = () => (
    <>
      {
        page === 10 ?
          <View style={styles.paginationContainer}>
            <Text style={styles.paginationText}>{`${i18n.t("pagination_page_label")} ${page + 1} ${i18n.t("pagination_of_label")} ${Math.ceil(currentAccountTransactions.length / ITEM_PER_PAGE)}`}</Text>
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
            <Text style={styles.paginationText}>{`${i18n.t("pagination_page_label")} ${page + 1} ${i18n.t("pagination_of_label")} ${Math.ceil(currentAccountTransactions.length / ITEM_PER_PAGE)}`}</Text>
            <TouchableOpacity
              disabled={page >= Math.ceil(currentAccountTransactions.length / ITEM_PER_PAGE) - 1}
              onPress={handleNext}
              style={[styles.paginationButton, page >= Math.ceil(currentAccountTransactions.length / ITEM_PER_PAGE) - 1 && styles.disabled]}>
              {/* <Text style={styles.paginationButtonText}>{'>'}</Text> */}
              <Ionicons name="caret-forward-outline" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
      }
    </>
  );


  const showUpdateNewCurrentAccount = (e) => {
  }

  // end of flatlist 
  const [page, setPage] = useState(0);

  const [reportFromDate, setReportFromDate] = useState('')
  const [reportToDate, setReportToDate] = useState('')

  let totalPages

  useEffect(() => {
    totalPages = Math.ceil(currentAccountTransactions.length / ITEM_PER_PAGE)
  }, [page, isloading])

  const handleNext = () => {
    handleRowPress(null)
    setPage(prevPage => prevPage + 1);
  };

  const handlePrev = () => {
    handleRowPress(null)
    setPage(prevPage => prevPage - 1);
  };

  const dataToShow = currentAccountTransactions?.slice(page * ITEM_PER_PAGE, (page + 1) * ITEM_PER_PAGE);

  if (isloading) {
    return <Text style={styles.loading}>Loading...</Text>;
  }

  return (
    <View style={styles.container}>

      <FlatList
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 10 }}>
            <AccountDetails account={currentAccountTransactions[0]} />
            <View style={styles.inputPicker}>
              <Picker
                ref={clientAccountIdRef}
                selectedValue={currentAccountId}
                onValueChange={(itemValue, itemIndex) => moveToAnotherAccount(itemValue)}>
                {
                  clientAccounts?.map((account) =>
                    <Picker.Item label={account.accountCurrency} value={account.id} key={account.id} />
                  )
                }
              </Picker>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
              <DateInputPicker label="Start Date" date={reportFromDate} onDateChange={setReportFromDate} />
              <DateInputPicker label="End Date" date={reportToDate} onDateChange={setReportToDate} />
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <Button title="print" style={{ marginBottom: 20 }} />
              {/* <Button title="New Account" style={{ marginBottom: 20 }} /> */}
              <IconWithLabel iconName="add-outline" label="Add New Move" onPress={() => showAddNewMove()} />
            </View>

            {/* header of Table */}
            <View style={styles.headerTable}>
              <View style={{ flex: 1, borderEndColor: "#fff", borderEndWidth: 2, }}>
                <Text style={styles.textCol}>transaction Amount</Text>
              </View>
              <View style={{ flex: 1, borderEndColor: "#fff", borderEndWidth: 2, }}>
                <Text style={styles.textCol}>transaction Type</Text>
              </View>
              <View style={{ flex: 1, }}>
                <Text style={styles.textCol}>balance After Transaction</Text>
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
        nestedScrollEnabled={true}
        showsVerticalScrollIndicator={false}
      />

      <AddNewMoveFromMain
        addMove={addMove} setAddMove={setAddMove}
        // userId={userId} setUserId={setUserId}
        accountId={accountId} setAccountId={setAccountId}
        id={idUpdate}
        setIsLoading={setIsLoading}
      />

    </View>
  )
}

export default ListCurrentAccountMoves



const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    paddingTop: 10,
    // paddingHorizontal: 30,
    flex: 1,
    paddingHorizontal: 8,
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
  inputPicker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingVertical: 0,
    paddingHorizontal: 0,
    marginVertical: 18
  },
  disableInput: {
    backgroundColor: "#eee"
  },
  containerPickers: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 18,
    marginVertical: 10,
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
