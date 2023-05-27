
import { configureStore } from '@reduxjs/toolkit'
import projectSlice from './projectSlice'

export default configureStore({
  reducer: {
    project: projectSlice
  },
})