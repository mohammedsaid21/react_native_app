import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, ScrollView } from 'react-native';

const Pagination = ({
  dataPerPage,
  getData,
  currentPageData,
  navigation,
  getStyle,
}) => {
  const pageNumbers = [];
  const [currentPage, setCurrentPage] = useState(1);
  const [dataPerPageState, setDataPerPageState] = useState(10);
  const [showPaginationState, setShowPaginationState] = useState([1, 2, 3, 4, 5]);
  const [style, setStyle] = useState('');
  const [styleCustom, setStyleCustom] = useState('');
  const [newPageData, setNewPageData] = useState(NewCurrentPageData);

  useEffect(() => {
    currentPageData(NewCurrentPageData);
    if (NewCurrentPageData.length === 0) { // Updated variable name
      showPaginationState.pop();
      setCurrentPage(showPaginationState.at(-1));
    }
  }, [currentPage, dataPerPageState, getData]);

  for (let i = 1; i <= Math.ceil(getData.length / dataPerPageState); i++) {
    pageNumbers.push(i);
  }

  useEffect(() => {
    if (!dataPerPage) {
      setDataPerPageState(10);
    } else {
      setDataPerPageState(dataPerPage);
    }
  }, [dataPerPage, getData]);

  useEffect(() => {
    setNavigationState(navigation);
  }, [navigation]);

  useEffect(() => {
    if (!getStyle) {
      setStyle('sweetPagination');
      setStyleCustom('');
    } else if (getStyle && getStyle !== 'style-custom') {
      setStyle(getStyle);
      setStyleCustom('');
    } else if (getStyle === 'style-custom') {
      setStyleCustom('style-custom');
    }
  }, [getStyle]);

  const handleCurrentPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleDirectFirstPage = () => {
    setShowPaginationState([1, 2, 3, 4, 5]);
  };

  const handleDirectLastPage = () => {
    setShowPaginationState([
      pageNumbers.at(-5),
      pageNumbers.at(-4),
      pageNumbers.at(-3),
      pageNumbers.at(-2),
      pageNumbers.at(-1),
    ]);
  };

  useEffect(() => {
    currentPageData(NewCurrentPageData);
    if (pageNumbers.length > 10) {
      setNewPageData(NewCurrentPageData);
    }
  }, [currentPage, dataPerPageState, getData]);

  useEffect(() => {
    if (newPageData.length === 0) {
      showPaginationState.pop();
      setCurrentPage(showPaginationState.at(-1));
    }
  }, [newPageData.length === 0]);

  const indexOfLastPost = currentPage * dataPerPageState;
  const indexOfFirstPost = indexOfLastPost - dataPerPageState;
  const NewCurrentPageData = getData.slice(
    indexOfFirstPost,
    indexOfLastPost
  );

  if (pageNumbers.length > 10) {
    return (
      <View style={[styles.sweetPagination, styles[style]]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {navigation &&
            (currentPage === 1 ? (
              <TouchableOpacity style={styles.pageItem}>
                <View style={[styles.pageButton, styles.leftNavigation]}>
                  <Text style={styles.navigationIcon}>{'<'}</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => handleCurrentPage(currentPage - 1)}
                style={styles.pageItem}
              >
                <View style={[styles.pageButton, styles.leftNavigation]}>
                  <Text style={styles.navigationIcon}>{'<'}</Text>
                </View>
              </TouchableOpacity>
            ))}
          {showPaginationState.at(0) > pageNumbers.at(0) && (
            <React.Fragment>
              <TouchableOpacity
                onPress={() => {
                  handleCurrentPage(pageNumbers.at(0));
                  handleDirectFirstPage();
                }}
                style={styles.pageItem}
              >
                <View
                  style={
                    currentPage === pageNumbers.at(0)
                      ? styles.activeButton
                      : styles.pageButton
                  }
                >
                  <Text>{pageNumbers.at(0)}</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.pageItem}>
                <View style={styles.dottedIcon}>
                  <Text>...</Text>
                </View>
              </TouchableOpacity>
            </React.Fragment>
          )}
          {showPaginationState.map((number) => (
            <TouchableOpacity
              key={number}
              onPress={() => handleCurrentPage(number)}
              style={styles.pageItem}
            >
              <View
                style={
                  currentPage === number
                    ? [styles.pageButton, styles.activeButton]
                    : [styles.pageButton, styles[styleCustom]]
                }
              >
                <Text>{number}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {showPaginationState.at(-1) < pageNumbers.at(-1) && (
            <React.Fragment>
              <TouchableOpacity style={styles.pageItem}>
                <View style={styles.dottedIcon}>
                  <Text>...</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  handleCurrentPage(pageNumbers.at(-1));
                  handleDirectLastPage();
                }}
                style={styles.pageItem}
              >
                <View
                  style={
                    currentPage === pageNumbers.at(-1)
                      ? styles.activeButton
                      : styles[styleCustom]
                  }
                >
                  <Text>{pageNumbers.at(-1)}</Text>
                </View>
              </TouchableOpacity>
            </React.Fragment>
          )}
          {navigation &&
            (currentPage === pageNumbers.at(-1) ? (
              <TouchableOpacity style={styles.pageItem}>
                <View style={[styles.pageButton, styles.rightNavigation]}>
                  <Text style={styles.navigationIcon}>{'>'}</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                onPress={() => handleCurrentPage(currentPage + 1)}
                style={styles.pageItem}
              >
                <View style={[styles.pageButton, styles.rightNavigation]}>
                  <Text style={styles.navigationIcon}>{'>'}</Text>
                </View>
              </TouchableOpacity>
            ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={[styles.sweetPagination, styles[style]]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {pageNumbers.map((number) => (
          <TouchableOpacity
            key={number}
            onPress={() => handleCurrentPage(number)}
            style={styles.pageItem}
          >
            <View
              style={
                currentPage === number
                  ? [styles.pageButton, styles.activeButton]
                  : [styles.pageButton, styles[styleCustom]]
              }
            >
              <Text>{number}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sweetPagination: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  pageItem: {
    padding: 0,
  },
  pageButton: {
    fontSize: 16,
    fontWeight: '600',
    borderRadius: 50,
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
    backgroundColor: '#ddd',
  },
  navigationIcon: {
    fontSize: 20,
  },
  activeButton: {
    color: '#f1f2f6',
    backgroundColor: '#FD7238',
  },
  leftNavigation: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  rightNavigation: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  dottedIcon: {
    backgroundColor: 'transparent',
  },
  styleCustom: {
    // Add your custom styles here
  },
});

export default Pagination;
