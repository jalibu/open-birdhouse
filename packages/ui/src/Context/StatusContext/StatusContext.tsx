import { GlobalMessage } from '../../Models/GlobalMessage'
import { StatusContextType } from '../../Models/StatusContextType'
import React from 'react'

const StatusContext = React.createContext<StatusContextType>({
  messages: [] as GlobalMessage[],
  isLoading: () => false,
  addLoader: () => null,
  finalizeLoader: () => null,
  addMessage: () => null,
  clearMessages: () => null,
})
export default StatusContext
