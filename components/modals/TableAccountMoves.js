import { View, Text } from 'react-native'
import React from 'react'
import { FlatList } from 'react-native'

const TableAccountMoves = ({ dataToShow, renderItem, renderFooter, }) => {
  return (
    <FlatList
      data={dataToShow}
      renderItem={renderItem}
      keyExtractor={item => item.id}
      ListFooterComponent={renderFooter}
      initialNumToRender={10}
      nestedScrollEnabled={true}
    />
  )
}

export default TableAccountMoves