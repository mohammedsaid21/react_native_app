import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import CurrentAccountService from '../../services/api/CurrentAccountService';
import i18n from '../../I18N';
import LoadingOverlay from '../UI/LoadingOverlay';


const COLUMNS = [
  { key: 'currency', title: i18n.t("home_header_table_current_curreny_label"), width: 80 },
  { key: 'numberOfAccounts', title: i18n.t("home_header_table_current_num_account_label"), width: 80 },
  { key: 'credit', title: i18n.t("home_header_table_current_credit_label"), width: 80 },
  { key: 'debit', title: i18n.t("home_header_table_current_debit_label"), width: 80 },
  { key: 'total', title: i18n.t("home_header_table_current_balance_label"), width: 120 },
  // add more columns as needed
];



const CurrentAccounts = () => {
  const [accountsStats, setAccountsStats] = useState([])
  const [isloading, setIsLoading] = useState(true)



  useEffect(() => {
    CurrentAccountService.getAllCurrentAccountsStats()
      .then((response) => {
        setAccountsStats(response.data)
        setIsLoading(false)
      }).catch(error => {
        console.log(error);
        setIsLoading(false)
      })
  }, [isloading])



  const displayTotalBalanceText = (totalBalance) => {
    if (totalBalance > 0) {
      return (
        <Text style={{ color: 'green' }} >
          {totalBalance + " " + "Credit"}
        </Text>
      )
    }
    if (totalBalance < 0) {
      return (
        <Text style={{ color: 'red' }} >
          {totalBalance + " " + "Debit"}
        </Text>
      )
    }
    else return 0;
  }

  if (isloading) {
    return <LoadingOverlay />
  }

  // authService.userHasAuthority('generalbalance.view') &&
  return (
    <View style={styles.container}>

      <View style={styles.row}>
        {COLUMNS.map(column => (
          <View style={[styles.cell, { width: column.width, }]} key={column.key}>
            <Text style={styles.headerText}>{column.title}</Text>
          </View>
        ))}
      </View>

      {
        accountsStats.map((rate, index) =>
          <View style={[styles.row, index % 2 === 0 ? styles.evenRow : styles.oddRow]} key={`${rate.rate}-${index}`}>
            <View style={{ flex: 1, }}>
              <Text style={styles.cellText}>{rate.currency}</Text>
            </View>
            <View style={{ flex: 1, }}>
              <Text style={styles.cellText}>{rate.numberOfAccounts}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.cellText}>{rate.credit}</Text>
            </View>
            <View style={{ flex: 1, }}>
              <Text style={styles.cellText}>{rate.debit}</Text>
            </View>
            <View style={{ flex: 1.1 }}>
              <Text style={styles.cellText}>{displayTotalBalanceText(rate.total)}</Text>
            </View>
          </View>
        )
      }

      {/* <ScrollView>
        <TableHeader columns={COLUMNS} />
        {accountsStats?.map((item, index) => (
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
  )
}

export default CurrentAccounts



const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    padding: 16,
    paddingTop: 10,
    marginVertical: 25,
    backgroundColor: '#fff',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cell: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 5,
    paddingHorizontal: 0,
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
    fontSize: 11
  },
  cellText: {
    textAlign: 'center',
    fontSize: 11
  },
  loading: {
    fontSize: 20,
    textAlign: "center",
    paddingVertical: 80
  }
});