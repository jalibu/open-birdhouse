import { GlobalMessage, StatusContextType } from '@open-birdhouse/common'
import React from 'react'

const StatusContext = React.createContext<StatusContextType>({
  message: {} as GlobalMessage | null | undefined,
  isLoading: false,
  setLoading: () => null,
  setMessage: () => null,
  clearMessage: () => null,
})
export default StatusContext
