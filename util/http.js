import axios from "axios";

export const sendRequest = (infoAccount) => {
  axios.post("https://jsonplaceholder.typicode.com/posts", infoAccount)
}

export const getRequest = () => {
  axios.get("https://jsonplaceholder.typicode.com/posts")
}


export async function fetchExpenses() {
  const response = await axios.get('https://jsonplaceholder.typicode.com/posts');

  // const expenses = [];

  // for (const key in response.data) {
  //   const expenseObj = {
  //     id: key,
  //     amount: response.data[key].amount,
  //     date: new Date(response.data[key].date),
  //     description: response.data[key].description
  //   };
  //   expenses.push(expenseObj);
  // }
  console.log(response.json())
  return expenses;
}