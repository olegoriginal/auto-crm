import React, { useEffect, useState } from 'react'
import cx from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import taskStatuses from '../../../lists/task-statuses'
import Salary from './Salary'
import Material from './Material'
import statuses from '../../../../common/enums/shinomontazh-statuses'
import { getEmployeeArray } from '../../../utils/admin/reportUtils'
import { updateEmployeeReport } from '../../../redux/reducers/employees'

const Shinomontazh = ({
  calendarType,
  place,
  activeMonth,
  activeDay,
  timeFinish,
  timeStart,
  active,
  employeeList,
  range
}) => {
  const [shinList, setShinList] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)

  const employee = useSelector((s) => s.employees.employee)
  const dispatch = useDispatch()

  useEffect(() => {
    const getType = () => {
      if (active.startsWith('sh-') || active === 'material') {
        return 'shinomontazhmonth'
      }
      if (active.includes('sto-')) {
        return 'stomonth'
      }
      if (active.includes('wash-')) {
        return 'washmonth'
      }
      if (active.includes('cond-')) {
        return 'condmonth'
      }
      if (active.includes('window-')) {
        return 'windowmonth'
      }
      return 'washmonth'
    }

    const getRangeType = (firstDt, secDt) => {
      const getTp = () => {
        if (active.startsWith('sh-') || active === 'material') {
          return 'shinomontazhrange'
        }
        if (active.includes('sto-')) {
          return 'storange'
        }
        if (active.includes('wash-')) {
          return 'washrange'
        }
        if (active.includes('cond-')) {
          return 'condrange'
        }
        if (active.includes('window-')) {
          return 'windowrange'
        }
        return 'washrange'
      }

      return `api/v1/${getTp()}?month=${
        firstDt.getMonth() + 1
      }&year=${firstDt.getFullYear()}&secMonth=${
        secDt.getMonth() + 1
      }&secYear=${secDt.getFullYear()}`
    }

    if (activeMonth && calendarType === 'month') {
      setIsLoaded(false)
      fetch(
        `api/v1/${getType()}?month=${activeMonth.getMonth() + 1}&year=${activeMonth.getFullYear()}`
      )
        .then((res) => res.json())
        .then((it) => {
          setShinList(it.data)
          setIsLoaded(true)
        })
    }
    if (activeDay && calendarType === 'day') {
      setIsLoaded(false)
      fetch(`api/v1/${getType()}?month=${activeDay.getMonth() + 1}&year=${activeDay.getFullYear()}`)
        .then((res) => res.json())
        .then((it) => {
          setShinList(it.data)
          setIsLoaded(true)
        })
    }
    if (activeDay && calendarType === 'diapason') {
      const getDtWithTime = (today, hr, tm, sec) =>
        new Date(today.getFullYear(), today.getMonth(), today.getDate(), hr, tm, sec)
      const firstDt = getDtWithTime(range[0], 0, 0, 0)
      const secDt = getDtWithTime(range[1], 23, 59, 0)

      const getFilteredByRange = (cont) =>
        cont.filter((arr) => new Date(arr.dateFinish) > firstDt && new Date(arr.dateFinish) < secDt)
      setIsLoaded(false)
      fetch(getRangeType(firstDt, secDt))
        .then((res) => res.json())
        .then((it) => {
          setShinList(getFilteredByRange(it.data))
          setIsLoaded(true)
        })
    }
    return () => {}
  }, [activeMonth.getMonth(), activeDay.getMonth(), range, calendarType, active])

  const [report, setReport] = useState([])

  const [bossPercent, setBossPercent] = useState(30)
  const [isMaterial, setIsMaterial] = useState('yes')

  useEffect(() => {
    if (calendarType === 'month') {
      setReport(
        shinList
          .filter((it) => (place ? place === it.place : it))

          .filter(
            (it) =>
              it.status === statuses[1] ||
              it.status === statuses[2] ||
              it.status === statuses[3] ||
              it.status === statuses[4] ||
              it.status === statuses[6]
          )
          .filter((it) => it.payment && it.payment !== 'cancel')
          .filter(
            (item) =>
              new Date(item.dateFinish).getFullYear() === activeMonth.getFullYear() &&
              new Date(item.dateFinish).getMonth() + 1 === activeMonth.getMonth() + 1
          )
      )
    }
    if (calendarType === 'day') {
      setReport(
        shinList
          .filter((it) => (place ? place === it.place : it))

          .filter(
            (it) =>
              it.status === statuses[1] ||
              it.status === statuses[2] ||
              it.status === statuses[3] ||
              it.status === statuses[4] ||
              it.status === statuses[6]
          )
          .filter((it) => it.payment && it.payment !== 'cancel')
          .filter(
            (item) =>
              new Date(item.dateFinish).getFullYear() === activeDay.getFullYear() &&
              new Date(item.dateFinish).getMonth() + 1 === activeDay.getMonth() + 1 &&
              new Date(item.dateFinish).getDate() === activeDay.getDate()
          )
      )
    }
    return () => {}
  }, [shinList, activeMonth, activeDay, place, employee])

  useEffect(() => {
    if (calendarType === 'month') {
      setReport(
        shinList

          .filter(
            (it) =>
              it.status === statuses[1] ||
              it.status === statuses[2] ||
              it.status === statuses[3] ||
              it.status === statuses[4] ||
              it.status === statuses[6]
          )

          .filter((it) => (place ? place === it.place : it))
          .filter((it) => it.payment && it.payment !== 'cancel')
          .filter(
            (item) =>
              new Date(item.dateFinish).getFullYear() === activeMonth.getFullYear() &&
              new Date(item.dateFinish).getMonth() + 1 === activeMonth.getMonth() + 1
          )
      )
    }
    if (calendarType === 'day' && !timeStart && !timeFinish) {
      setReport(
        shinList

          .filter(
            (it) =>
              it.status === statuses[1] ||
              it.status === statuses[2] ||
              it.status === statuses[3] ||
              it.status === statuses[4] ||
              it.status === statuses[6]
          )

          .filter((it) => (place ? place === it.place : it))
          .filter((it) => it.payment && it.payment !== 'cancel')
          .filter(
            (item) =>
              new Date(item.dateFinish).getFullYear() === activeDay.getFullYear() &&
              new Date(item.dateFinish).getMonth() + 1 === activeDay.getMonth() + 1 &&
              new Date(item.dateFinish).getDate() === activeDay.getDate()
          )
      )
    }
    if (calendarType === 'day' && timeStart && timeFinish) {
      setReport(
        shinList

          .filter(
            (it) =>
              it.status === statuses[1] ||
              it.status === statuses[2] ||
              it.status === statuses[3] ||
              it.status === statuses[4] ||
              it.status === statuses[6]
          )

          .filter((it) => (place ? place === it.place : it))
          .filter((it) => it.payment && it.payment !== 'cancel')
          .filter(
            (item) =>
              new Date(item.dateFinish).getFullYear() === activeDay.getFullYear() &&
              new Date(item.dateFinish).getMonth() + 1 === activeDay.getMonth() + 1 &&
              new Date(item.dateFinish).getDate() === activeDay.getDate() &&
              new Date(item.dateFinish).getHours() >=
                new Date(
                  `${activeDay.getFullYear()}.${
                    activeDay.getMonth() + 1
                  }.${activeDay.getDate()} ${timeStart}`
                ).getHours() &&
              (timeFinish !== '24:00'
                ? new Date(item.dateFinish).getHours() <=
                  new Date(
                    `${activeDay.getFullYear()}.${
                      activeDay.getMonth() + 1
                    }.${activeDay.getDate()} ${timeFinish}`
                  ).getHours()
                : 24)
          )
      )
    }
    if (activeDay && calendarType === 'diapason') {
      const getDtWithTime = (today, hr, tm, sec) =>
        new Date(today.getFullYear(), today.getMonth(), today.getDate(), hr, tm, sec)
      const firstDt = getDtWithTime(range[0], 0, 0, 0)
      const secDt = getDtWithTime(range[1], 23, 59, 0)

      const getFilteredByRange = (cont) =>
        cont
          .filter((arr) => new Date(arr.dateFinish) > firstDt && new Date(arr.dateFinish) < secDt)
          .filter((it) => (place ? place === it.place : it))
      setReport(getFilteredByRange(shinList))
    }
    return () => {}
  }, [shinList, activeMonth, activeDay, place, timeStart, timeFinish, employee])

  const employeeArray = getEmployeeArray(report)
  useEffect(() => {
    dispatch(updateEmployeeReport(employeeArray))

    return () => {}
  }, [report])

  const loading = () => {
    return (
      <div className="flex w-100 justify-center my-3">
        <button
          type="button"
          className="bg-blue-500 p-3 text-white rounded flex items-center"
          disabled
        >
          <div className=" flex justify-center items-center pr-3">
            <div className="animate-spin rounded-full h-4 w-4 border-b-4 border-white" />
          </div>
          Загрузка...
        </button>
      </div>
    )
  }

  return (
    <>
      {active === 'sh-kassa' ||
      active === 'sto-kassa' ||
      active === 'sh-buh' ||
      active === 'sto-buh' ||
      active === 'wash-kassa' ||
      active === 'wash-buh' ||
      active === 'window-buh' ||
      active === 'window-kassa' ||
      active === 'cond-buh' ||
      active === 'cond-kassa' ? (
        <div className={cx('block', {})}>
          {isLoaded ? null : loading()}
          {report.length > 0 && report && isLoaded ? (
            <Salary
              employeeList={employeeList}
              report={report}
              taskStatuses={taskStatuses}
              shinList={shinList}
              place={place}
              bossPercent={bossPercent}
              setBossPercent={setBossPercent}
              isMaterial={isMaterial}
              setIsMaterial={setIsMaterial}
              timeStart={timeStart}
              timeFinish={timeFinish}
              calendarType={calendarType}
              active={active}
              employee={employee}
              employeeArray={employeeArray}
            />
          ) : null}
          {isLoaded && report.length <= 0 ? <p className="my-3">Записей нет</p> : null}
        </div>
      ) : null}
      {active.includes('material') ? (
        <div
          className={cx('', {
            block: active.includes('material'),
            hidden: !active.includes('material')
          })}
        >
          {' '}
          {isLoaded ? null : loading()}
          {report.length > 0 && isLoaded ? (
            <Material report={report} isLoaded={shinList.isLoaded} />
          ) : null}
          {isLoaded && report.length <= 0 ? <p className="my-3">Записей нет</p> : null}
        </div>
      ) : null}
    </>
  )
}

export default Shinomontazh
