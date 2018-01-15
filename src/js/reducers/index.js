import { combineReducers } from 'redux'
import { PAGE_CLICK, REQUEST_DATA, RECIEVE_DATA, TOGGLE_MENU, TOGGLE_INFODRAWER, EXPAND_INFODRAWER, TOGGLE_FILTERS, START_MAP_QUERY, RECEIVED_MAP_QUERY, TOGGLE_BEDROCK } from '../actions'

// import all reducers here
// const stats = (state = [], action) => {
//   switch (action.type, state) {
//     case TOGGLE_DICTIONARY:
//       return Object.assign({}, state, {
//         showDetails: action.dict_id
//       })
//
//     default:
//       return state
//   }
// }
//

const update = (state = {
  menuOpen: false,
  infoDrawerOpen: false,
  infoDrawerExpanded: false,
  isFetching: false,
  filtersOpen: false,
  mapInfo: [],
  fetchingMapInfo: false,
  mapHasBedrock: true,

  data: [],
  filters: [],
  msg: '',
  clicks: 0
}, action) => {

  switch (action.type) {
    case TOGGLE_MENU:
      return Object.assign({}, state, {
        menuOpen: !state.menuOpen
      })
    case TOGGLE_INFODRAWER:
      return Object.assign({}, state, {
        infoDrawerOpen: !state.infoDrawerOpen,
        infoDrawerExpanded: false
      })
    case EXPAND_INFODRAWER:
      return Object.assign({}, state, {
        infoDrawerExpanded: !state.infoDrawerExpanded
      })
    case TOGGLE_FILTERS:
      return Object.assign({}, state, {
        filtersOpen: !state.filtersOpen
      })
    case START_MAP_QUERY:
      return Object.assign({}, state, {
        fetchingMapInfo: true
      })
    case RECEIVED_MAP_QUERY:
      return Object.assign({}, state, {
        fetchingMapInfo: false,
        mapInfo: action.data,
        infoDrawerOpen: true
      })
    case TOGGLE_BEDROCK:
      return Object.assign({}, state, {
        mapHasBedrock: !state.mapHasBedrock
      })

    case PAGE_CLICK:
      return Object.assign({}, state, {
        msg: action.msg,
        clicks: state.clicks + 1,
        infoDrawerOpen: !state.infoDrawerOpen
      })
    case REQUEST_DATA:
      return Object.assign({}, state, {
        isFetching: true
      })
    case RECIEVE_DATA:
      return Object.assign({}, state, {
        isFetching: false,
        data: action.data
      })
    default:
      return state
  }
}



const reducers = combineReducers({
  // list reducers here
//  stats,
  update
})

export default reducers
