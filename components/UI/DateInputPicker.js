import React, { useState } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const DateInputPicker = ({ label, date, onDateChange }) => {
  const [showPicker, setShowPicker] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) {
      onDateChange(moment(selectedDate).format('YYYY-MM-DD'));
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={date}
        placeholder={label}
        editable={false}
      />
      {showPicker && (
        <DateTimePicker
          value={new Date()}
          mode="date"
          display="spinner"
          onChange={handleDateChange}
          locale="en"
        />
      )}
      <TouchableOpacity onPress={() => setShowPicker(true)}>
        <Ionicons name="calendar-outline" size={25} color="black" />
      </TouchableOpacity>
      
    </View>
  );
};

export default DateInputPicker;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    width: "48%"
  },
  input: {
    flex: 1,
    fontSize: 13,
    color: 'black',
    paddingLeft: 10,
  },
});
