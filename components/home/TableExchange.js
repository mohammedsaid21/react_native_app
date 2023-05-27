
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useContext, useEffect, useState } from "react";
import { View, Text, FlatList } from "react-native";
import { StyleSheet } from "react-native";
import { useQuery } from "react-query";
import ExchangeRateService from "../../services/api/ExchangeRateService";
import { getExchange } from "../../services/api/user";
import { getRefreshToken, isTokenExpired } from "../../services/ApiClient";

import { Table, TableWrapper, Row, Rows } from 'react-native-table-component';
import { ScrollView } from "react-native";
import i18n from "../../I18N";
import { useRef } from "react";
import { Animated } from "react-native";
import { Easing } from "react-native";
import LoadingOverlay from "../UI/LoadingOverlay";


const COLUMNS = [
  { key: 'fromCurrency', title: i18n.t("home_header_table_from_currency"), width: 120 },
  { key: 'toCurrency', title: i18n.t("home_header_table_to_currency"), width: 120 },
  { key: 'rate', title: i18n.t("home_header_table_exchange_rate"), width: 80 },
];

function TableHeader({ columns }) {
  return (
    <View style={styles.row}>
      {columns.map(column => (
        <View style={[styles.cell, { width: column.width }]} key={column.key}>
          <Text style={styles.headerText}>{column.title}</Text>
        </View>
      ))}
    </View>
  );
}

function TableCell({ item, index, column }) {
  return (
    <View style={[styles.cell, { width: column.width }, index % 2 === 0 ? styles.evenRow : styles.oddRow]}>
      <Text style={styles.cellText}>{item[column.key]}</Text>
    </View>
  );
}


const TableExchange = () => {
  const [exchangeRates, setExchangeRates] = useState([])
  const [isloading, setIsLoading] = useState(true)


  useEffect(() => {
    ExchangeRateService.getActiveExchangeRates()
      .then((response) => {
        setIsLoading(false)
        setExchangeRates(response.data)
        // console.log(response.data)
      }).catch(error => {
        setIsLoading(false)
        console.log(error);
      })
  }, [isloading])

  if (isloading) {
    return <LoadingOverlay />
  }

  return (
    <View style={styles.container}>

      <View style={[styles.row, ]}>
        {COLUMNS.map(column => (
          <View style={[styles.cell,]} key={column.key}>
            <Text style={styles.headerText}>{column.title}</Text>
          </View>
        ))}
      </View>

      {
        exchangeRates.map((rate, index) =>
          <View style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]} key={`${rate.rate}-${index}`}>
            <View style={{ flex: 1, }}>
              <Text style={styles.cellText}>{rate.fromCurrency}</Text>
            </View>
            <View style={{ flex: 1, }}>
              <Text style={styles.cellText}>{rate.toCurrency}</Text>
            </View>
            <View style={{ flex: 1, }}>
              <Text style={styles.cellText}>{rate.rate}</Text>
            </View>
          </View>
        )
      }

      {/* <ScrollView>
        <TableHeader columns={COLUMNS} />
        {exchangeRates.map((item, index) => (
          <View style={styles.row} key={`${item.currency}-${index}`}>
            {COLUMNS.map((column, columnIndex) => (
              <TableCell
                key={column.key}
                item={item}
                index={index}
                column={column}
                onResize={width => handleResize(columnIndex, width)}
              />
            ))}
          </View>
        ))}
      </ScrollView> */}

    </View>
  );
}

export default TableExchange



const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 16,
    paddingTop: 10,
    marginVertical: 20,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 4,
    paddingBottom: 10,
    paddingHorizontal: 2,
    overflow: 'hidden',
  },
  evenRow: {
    backgroundColor: '#f2f2f2',
  },
  oddRow: {
    backgroundColor: '#fff',
  },
  headerText: {
    fontWeight: 'bold',
  },
  cellText: {
    textAlign: 'center',
    fontSize: 13
  },
  loading: {
    fontSize: 20,
    textAlign: "center",
    paddingVertical: 80
  },
});