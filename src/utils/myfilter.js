import moment from 'moment'
export const timeFormate = (time) => {
  time = new Date(time * 1000)
  return moment(time).format('YYYY-MM-DD HH:mm:ss')
}
