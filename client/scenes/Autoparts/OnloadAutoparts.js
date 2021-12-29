import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { socket } from '../../redux/sockets/socketReceivers'
import { getAutoparts, getAutopartsLast } from '../../redux/reducers/autoparts'

const OnloadAutoparts = (num, showSearch, type) => {
  socket.connect()
  const dispatch = useDispatch()
  const checkNum = num >= 2

  useEffect(() => {
    if (type === 'autoparts' && !checkNum && showSearch === false) {
      dispatch(getAutopartsLast())
      console.log('wow')
    } else if (type === 'autoparts' && (checkNum || showSearch === true)) {
      dispatch(getAutoparts())
    }
  }, [dispatch, checkNum, showSearch, type])

  useEffect(() => {
    socket.on('update autopart', () => {
      if (!checkNum && !showSearch) {
        dispatch(() => getAutopartsLast())
        console.log('last')
      } else {
        dispatch(() => getAutoparts())
        console.log('all')
      }
    })
  }, [])

  useEffect(() => {
    socket.on('update edited autopart', () => {
      if (!checkNum && !showSearch) {
        // setTimeout(dispatch(getAutoparts()), 5000)
        dispatch(getAutoparts())
        console.log('last')
      } else {
        // setTimeout(dispatch(getAutoparts()), 5000)
        dispatch(getAutoparts())
        console.log('all')
      }
    })
  }, [])
}

export default OnloadAutoparts
