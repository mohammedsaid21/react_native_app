import { View, Text, Button, StyleSheet, ScrollView, TouchableOpacity, FlatList, Animated } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import ReportingService from '../services/api/ReportingService'
// import { i18n } from '../translation/i18n'
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import UserService from '../services/api/UserService';
import { authService } from '../services/auth/AuthService';
import { TextInput } from 'react-native';
import IconWithLabel from '../components/UI/IconWithLabel';
import { Ionicons } from '@expo/vector-icons';
import AddNewUser from '../components/modals/AddNewUser';
import LoadingOverlay from '../components/UI/LoadingOverlay';
import Toast from 'react-native-toast-message';
import { useScrollToTop } from '@react-navigation/native';
import i18n from '../I18N';
import Pagination from '../components/pagination/Pagination';
import Icon from 'react-native-vector-icons/FontAwesome'; // You can choose the icon library you prefer


const ListUsers = () => {
  const ITEM_PER_PAGE = 10;

  // const [currentAccounts, setCurrentAccounts] = useState([])
  const [users, setUsers] = useState([])
  const [isloading, setIsLoading] = useState(true)
  const [page, setPage] = useState(0);

  const [modalNewUser, setModalNewUser] = useState(false)

  let totalPages

  // const [filteredUsers, setFilteredUsers] = useState([])
  const [searchQuery, setSearchQuery] = useState();
  // const [modalNewCurrent, setModalNewCurrent] = useState(false)


  const getAllUsers = () => {
    //  UserService.getAllUsers().then((response) => {
    UserService.getAccessibleUsers(authService.currentUserValue.id)
      .then((response) => {
        // setUsers(response.data.slice(0, displayedUsers));
        setUsers(response.data)
        // setFilteredUsers(response.data)
        setIsLoading(false)
        // console.log(response.data);
      }).catch(error => {
        setIsLoading(false)
        console.log(error);
      })
  }

  useEffect(() => {
    getAllUsers();
  }, [isloading])


  useEffect(() => {
    totalPages = Math.ceil(users.length / ITEM_PER_PAGE)
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
  let scrollUp = useRef();

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
      // scrollViewRef.current.scrollToIndex({ index: index == 0 ? 0 : index - 1, animated: true });
    }
  };

  const [modalVisible, setModalVisible] = useState(false);
  const [userId, setUserId] = useState(null)

  const showAddNewUser = (e) => {
    setUserId(null)
    setModalNewUser(true)
  }

  const showUpdateNewUser = (e) => {
    setUserId(e)
    setModalNewUser(true)
  }


  const [selectedRoleType, setSelectedRoleType] = useState(null);
  let filterDataByRole = users?.filter(item => selectedRoleType ? item.roleType === selectedRoleType : true);

  let dataToShow = users?.slice(page * ITEM_PER_PAGE, (page + 1) * ITEM_PER_PAGE)
  const [filterData, setFilterData] = useState()
  const [searchLess10, setSearchLess10] = useState(false)
  const [noElement, setNoElement] = useState('')


  const handleSearch = (query) => {
    setPage(0)
    setSearchQuery(query);
    let queryLower = query.charAt(0).toLowerCase() + query.slice(1);
    if (queryLower.length === 0) {
      setSearchLess10(false)
      setFilterData(users?.slice(page * ITEM_PER_PAGE, (page + 1) * ITEM_PER_PAGE))
    }

    setFilterData(dataToShow.filter((user) =>
      user.userName.includes(queryLower)
    ))

    if (filterData && filterData.length === 0) {
      setNoElement("There Is No Element")
      Toast.show({
        type: 'error',
        text1: 'there is no items ',
        position: "top"
      });
    }

    if (filterData && filterData.length < 10) {
      setSearchLess10(true)
    }
  }

  useEffect(() => {
    if (filterData && filterData.length <= 9) setSearchLess10(true)
    else setSearchLess10(false)
  }, [filterData, selectedRoleType])


  const [sortBy, setSortBy] = useState({ column: '', direction: 'asc' });
  // const [surveys, setSurveys] = useState(currentItems); // Your data array

  const sortData = () => {
    if (sortBy.column === '') {
      return dataToShow; // Return original data if no sorting applied
    }

    const sortedData = [...dataToShow].sort((a, b) => {
      const columnA = a[sortBy.column];
      const columnB = b[sortBy.column];

      if (typeof columnA === 'number' && typeof columnB === 'number') {
        return sortBy.direction === 'asc' ? columnA - columnB : columnB - columnA;
      } else {
        return sortBy.direction === 'asc'
          ? columnA.toString().localeCompare(columnB.toString())
          : columnB.toString().localeCompare(columnA.toString());
      }
    });

    return sortedData;
  };

  const handleSort = (column) => {
    setSortBy((prevSortBy) => ({
      column,
      direction: prevSortBy?.column === column && prevSortBy?.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  // const sortedAndPaginatedData = sortData();
  // console.log("🚀~ sortedAndPaginatedData:", sortedAndPaginatedData)


  const renderItem = ({ item, index }) => (
    <View style={[styles.row, expandedIndex === index ? styles.borderActive : ""]} key={`${item.currency}-${index}`}>
      {/* <TouchableOpacity onPress={() => toggleExpanded(index)} > */}
      <TouchableOpacity onPress={() => toggleExpanded(index)} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ flex: 2, marginEnd: 10, }}>
          <Text>{item.userName}</Text>
        </View>
        <View style={{ flex: 1.1, }}>
          <Text style={{ textAlign: 'center' }}>{(item.roleType).toLowerCase()}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={{ textAlign: 'center' }}>{item.numberOfCurrentAccounts}</Text>
          {/* <Text style={{ textAlign: 'center', marginHorizontal: 5 }}>{item.numberOfAccountTransactions}</Text> */}
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
              outputRange: [0, 300],
            }),
            overflow: 'hidden',
          }}
        >
          <View style={styles.expandedView}>
            <View style={styles.expandedViewFlex}>
              <Text style={styles.expandedViewText}>
                {i18n.t("user_identifier")}:
              </Text>
              <Text style={styles.expandedValue}>
                {item.userIdentifier}
              </Text>
            </View>

            {
              item.logingUserName ?
                <View style={styles.expandedViewFlex}>
                  <Text style={styles.expandedViewText}>
                    {i18n.t("user_login_name")}:
                  </Text>
                  <Text style={styles.expandedValue}>
                    {item.logingUserName}
                  </Text>
                </View>
                : ""
            }

            <View style={styles.expandedViewFlex}>
              <Text style={styles.expandedViewText}>
                {i18n.t("user_country")}:
              </Text>
              <Text style={styles.expandedValue}>
                {item.country}
              </Text>
            </View>

            <View style={styles.expandedViewFlex}>
              <Text style={styles.expandedViewText}>
                {i18n.t("user_address")}:
              </Text>
              <Text style={styles.expandedValue}>
                {item.address}
              </Text>
            </View>

            <View style={styles.expandedViewFlex}>
              <Text style={styles.expandedViewText}>
                {i18n.t("user_email_address")}:
              </Text>
              <Text style={styles.expandedValue}>
                {item.emailAddress}
              </Text>
            </View>

            <View style={styles.expandedViewFlex}>
              <Text style={styles.expandedViewText}>
                {i18n.t("user_main_mobile")}:
              </Text>
              <Text style={styles.expandedValue}>
                {item.mainMobileNumber}
              </Text>
            </View>
            {
              item.secondaryMobileNumber ?
                <View style={styles.expandedViewFlex}>
                  <Text style={styles.expandedViewText}>
                    {i18n.t("user_sec_mobile")}:
                  </Text>
                  <Text style={styles.expandedValue}>
                    {item.secondaryMobileNumber}
                  </Text>
                </View>
                : ""
            }
            <View style={{ borderColor: "#a2a2a2", borderWidth: 1, marginVertical: 7 }}></View>

            <View style={[styles.expandedViewFlex]}>
              <IconWithLabel iconName="cog-outline" label="Update" onPress={() => showUpdateNewUser(item.id)}
              // disabledClick={item.numberOfAccountTransactions === 0 ? false : true} 
              />
              <IconWithLabel iconName="trash-outline" label="Delete" disabledClick={true} />
              <IconWithLabel iconName="print-outline" label="Print Moves Account" disabledClick={true} />
            </View>

          </View>
        </Animated.View>
      )}
      {/* </TouchableOpacity> */}
    </View>
  );

  // console.log("i18n ", i18n.locale)

  const renderFooter = () => (
    <>
      <Text style={styles.thereIsnoElement}>{noElement}</Text>

      {
        page === 0 ?
          <View style={styles.paginationContainer}>
            {/* <Text style={styles.paginationText}>{`${i18n.t("pagination_page_label")} ${page + 1} 
                ${i18n.t("pagination_of_label")} ${Math.ceil(users.length / ITEM_PER_PAGE)}`}</Text> */}
            {
              i18n.locale === 'en'
                ?
                <View style={styles.paginationTextContainer}>
                  <Text style={styles.paginationText}>{i18n.t("pagination_page_label")} {page + 1} </Text>
                  <Text style={styles.paginationText}>{i18n.t("pagination_of_label")} {Math.ceil(users.length / ITEM_PER_PAGE)}</Text>
                </View>
                :
                <View style={styles.paginationTextContainer}>
                  <Text style={styles.paginationText}>{i18n.t("pagination_of_label")} {page + 1} </Text>
                  <Text style={styles.paginationText}>{i18n.t("pagination_page_label")} {Math.ceil(users.length / ITEM_PER_PAGE)} </Text>
                </View>
            }

            <TouchableOpacity
              disabled={page >= Math.ceil(users.length / ITEM_PER_PAGE) - 1}
              onPress={handleNext}
              style={[styles.paginationButton, page >= Math.ceil(users.length / ITEM_PER_PAGE) - 1 && styles.disabled]}>
              <Ionicons name={i18n.locale === 'en' ? "caret-forward-outline" : "caret-back-outline"} size={20} color="#fff" />
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
                {/* <Ionicons name="caret-back-outline" size={20} color="#fff" /> */}
                <Ionicons name={i18n.locale !== 'en' ? "caret-forward-outline" : "caret-back-outline"} size={20} color="#fff" />
              </TouchableOpacity>

              {
                i18n.locale === 'en'
                  ?
                  <View style={styles.paginationTextContainer}>
                    <Text style={styles.paginationText}>{i18n.t("pagination_page_label")} {page + 1} </Text>
                    <Text style={styles.paginationText}>{i18n.t("pagination_of_label")} {Math.ceil(users.length / ITEM_PER_PAGE)}</Text>
                  </View>
                  :
                  <View style={styles.paginationTextContainer}>
                    <Text style={styles.paginationText}>{i18n.t("pagination_of_label")} {page + 1} </Text>
                    <Text style={styles.paginationText}>{i18n.t("pagination_page_label")} {Math.ceil(users.length / ITEM_PER_PAGE)} </Text>
                  </View>
              }

              <TouchableOpacity
                disabled={page >= Math.ceil(users.length / ITEM_PER_PAGE) - 1}
                onPress={handleNext}
                style={[styles.paginationButton, page >= Math.ceil(users.length / ITEM_PER_PAGE) - 1 && styles.disabled]}>
                {/* <Ionicons name="caret-forward-outline" size={20} color="#fff" /> */}
                <Ionicons name={i18n.locale === 'en' ? "caret-forward-outline" : "caret-back-outline"} size={20} color="#fff" />
              </TouchableOpacity>
            </View>
      }
    </>
  );



  if (isloading) {
    return <LoadingOverlay />
  }

  return (
    <View style={styles.container} ref={scrollUp}>

      <FlatList
        ListHeaderComponent={
          <View >
            <View style={styles.headerPage}>
              {/* <View style={{ flexDirection: 'row' }}>
                <Text style={{ marginHorizontal: 10 }} onPress={() => setSelectedRoleType('ADMIN')}>Admin</Text>
                <Text style={{ marginHorizontal: 10 }} onPress={() => setSelectedRoleType('BROKER')}>Broker</Text>
                <Text style={{ marginHorizontal: 10 }} onPress={() => setSelectedRoleType(null)}>All</Text>
              </View> */}

              <TextInput
                style={styles.inputSearch}
                onChangeText={text => handleSearch(text)}
                value={searchQuery}
                placeholder="Search..."
              />
              <View style={styles.addSearch}>
                {/* <Button title='Add user' />
          <Button title='Print' /> */}
                {/* <IconWithLabel iconName="add-outline" label="New Account" onPress={() => showAddNewCurrentAccount()} /> */}
                <IconWithLabel iconName="add-circle-outline" label="New Move" onPress={() => showAddNewUser()} />
                <IconWithLabel iconName="print-outline" label="Print" />
              </View>
            </View>

            {/* header of Table */}
            <View style={styles.headerTable}>
              <TouchableOpacity onPress={() => handleSort("userName")} style={{ flex: 2, borderEndColor: "#fff", borderEndWidth: 2, flexDirection: "row", alignItems: "center", justifyContent: 'center' }} >
                {/* <Icon name="sort-desc" size={18} color="#fff" /> */}
                <Icon
                  name={sortBy.direction === 'asc' ? 'caret-up' : 'caret-down'}
                  size={12} color="#fff"
                />
                <Text style={styles.textCol}>{i18n.t("user_name")}</Text>
              </TouchableOpacity>
              <View style={{ flex: 1, borderEndColor: "#fff", borderEndWidth: 2, }}>
                <Text style={styles.textCol}>{i18n.t("user_role_type")}</Text>
              </View>
              <TouchableOpacity onPress={() => handleSort("numberOfCurrentAccounts")} style={{ flex: 1.2, }}>
                <Text style={[styles.textCol, { fontSize: 11 }]}>{i18n.t("user_accounts_number_of_accounts")}</Text>
              </TouchableOpacity>
              {/* <View style={{ flex: 1 }}>
                <Text style={[styles.textCol, { fontSize: 10 }]}>No. of Transactions</Text>
              </View> */}
            </View>
            {/* header of Table */}
          </View>
        }

        data={sortData()}
        // data={filterData || dataToShow}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ListFooterComponent={renderFooter}
        maxToRenderPerBatch={10}
        // initialNumToRender={10}
        ref={scrollViewRef}
        nestedScrollEnabled={true}
      />

      <AddNewUser modalNewUser={modalNewUser} setModalNewUser={setModalNewUser} userId={userId} setUserId={setUserId} />

    </View>
  )
}

export default ListUsers




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
    marginEnd: 6,
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
    marginVertical: 25,
    flex: 2,
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
  },
  paginationTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 7,
  },
  disabled: {
    opacity: 0.5,
  },
  thereIsnoElement: {
    textAlign: 'center',
    fontSize: 20,
    paddingVertical: 10
  }
});
