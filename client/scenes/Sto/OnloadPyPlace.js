import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
// import { socket } from '../../redux/sockets/socketReceivers'
import { getItemsFiltered } from '../../redux/reducers/stos'
import useSaveFilter from '../../hooks/saveFilterParams'
// import { socketCondition } from '../../utils/utils'

const OnLoadPlace = (page, showSearch, place) => {
  const dispatch = useDispatch()

  const filterObj = { page, place }
  const { queryParamsToApi } = useSaveFilter(filterObj)

  useEffect(() => {
    if (!showSearch && place) {
      dispatch(getItemsFiltered(queryParamsToApi))
    }
  }, [dispatch, page, showSearch, place])

  // useEffect(() => {
  //   socket.on('update sto', function () {
  //     if (socketCondition(showSearch, page)) {
  //       dispatch(getItemsFiltered(page, place))
  //     }
  //   })
  // }, [])
  //
  // useEffect(() => {
  //   socket.on('update edited sto', function () {
  //     if (socketCondition(showSearch, page)) {
  //       dispatch(getItemsFiltered(page, place))
  //     }
  //   })
  // }, [])
}

export default OnLoadPlace
