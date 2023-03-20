import React, { useState, useEffect, useRef } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import cx from 'classnames'
import 'react-toastify/dist/ReactToastify.css'
import Employee from './employees'
import Car from './car'
import Service from './service'
import Material from './material'
import Final from './final'
import sizeThreeList from '../../lists/shinomontazhdiametr'

const StosCreate = (props) => {
  toast.configure()
  const notify = (arg) => {
    toast.info(arg, { position: toast.POSITION.BOTTOM_RIGHT })
  }

  const history = useHistory()

  const employeeList = useSelector((s) => s.employees.list)
  const auth = useSelector((s) => s.auth)
  const stoprices = useSelector((s) => s.stoprices.list)
  const materialprices = useSelector((s) => s.materials.list).filter((it) => it.type === 'sto')
  const placeList = useSelector((s) => s.places.list)

  const currentPlace = placeList.find((it) => it.id === auth.place)

  const [regNumber, setRegNumber] = useState([])
  const [keyboard, setKeyboard] = useState(false)
  const [regOpen, setRegOpen] = useState(false)

  const [state, setState] = useState({
    place: auth.place,
    regnumber: regNumber.toString(),
    mark: '',
    model: '',
    comment: '',
    kuzov: '',
    diametr: '',
    dateStart: new Date(),
    class: '',
    category: ''
  })

  const [service, setService] = useState([])
  const [materials, setMaterials] = useState([])

  const [tyres, setTyres] = useState({ sale: 'no' })
  const [employees, setEmployees] = useState([])
  const [box, setBox] = useState()

  const onChangeRegNumber = (e) => {
    const { value } = e.target
    setRegNumber((prevState) => [...prevState.concat(value)])
  }
  const onDeleteRegNumber = () => {
    const removeItem = regNumber.filter((element, index) => index < regNumber.length - 1)
    setRegNumber(removeItem)
  }
  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      regnumber: regNumber.join('').toString()
    }))
  }, [regNumber])
  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      place: auth.place
    }))
  }, [auth])

  const onChangeRegnumberUppercaseRussian = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value
        .toUpperCase()
        .replace(/\s/g, '')
        .replace(/[^а-яё0-9]/i, '')
    }))
  }

  const switchKeyboard = () => {
    setKeyboard(true)
    setRegOpen(false)
  }

  const acceptRegnumber = () => {
    setRegOpen(false)
  }

  const openRegModal = () => {
    if (keyboard === false) {
      setRegOpen(true)
    }
  }

  const [options, setOptions] = useState({
    mark: [],
    model: []
  })

  const [stateId, setStateId] = useState({
    mark: '',
    model: ''
  })

  const [customer, setCustomer] = useState({
    mark: '',
    model: '',
    idOfItem: ''
  })

  const onChangeMark = (e) => {
    const { value } = e.target
    const findCar = options.mark ? options.mark.find((it) => value === it.name) : null
    setState((prevState) => ({
      ...prevState,
      mark: value,
      model: ''
    }))
    setStateId((prevState) => ({
      ...prevState,
      mark: findCar ? findCar.id_car_mark : '',
      model: ''
    }))
    setCustomer((prevState) => ({
      ...prevState,
      mark: value
    }))
    setOptions((prevState) => ({
      mark: prevState.mark,
      model: []
    }))
  }

  const onChangeModel = (e) => {
    const { value } = e.target
    const finModel = options.model.find((it) => value === it.name)
    setState((prevState) => ({
      ...prevState,
      model: value
    }))
    setStateId((prevState) => ({
      ...prevState,
      model: finModel ? finModel.id_car_model : ''
    }))
    setCustomer((prevState) => ({
      ...prevState,
      model: value
    }))
  }

  const [search, setSearch] = useState()
  const [activeCustomer, setActiveCustomer] = useState('')

  const onSearchChange = (event) => {
    setSearch(event.target.value)
  }
  const onChange = (e) => {
    const { name, value } = e.target
    setState((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }
  const onChangeTyres = (e) => {
    const { name, value } = e.target
    setTyres((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }
  const checkboxTyresChange = (e) => {
    const { checked } = e.target
    if (checked) {
      setTyres((prevState) => ({
        ...prevState,
        sale: 'yes'
      }))
    } else {
      setTyres((prevState) => ({
        ...prevState,
        sale: 'no'
      }))
    }
  }
  const [customerList, setCustomerOptions] = useState([])

  const throttling = useRef(false)

  useEffect(() => {
    if (throttling.current) {
      return
    }

    // If there is no search term, do not make API call
    throttling.current = true
    setTimeout(() => {
      throttling.current = false
      if (state.regnumber !== '' && state.regnumber.length > 4) {
        fetch(
          `/api/v1/customerfind/${state.regnumber ? state.regnumber : 'reg'}/${
            state.vinnumber ? state.vinnumber : 'vin'
          }/${state.phone ? state.phone : 'phone'}`
        )
          .then((res) => res.json())
          .then((it) => {
            setCustomerOptions(it.data)
          })
      } else if (state.regnumber === '') {
        setCustomerOptions([])
      }
    }, 200)
  }, [state.regnumber])

  const applyCustomer = () => {
    const newCustomer = customerList.find((it) => it.id === search)
    const findCar = options.mark.find((it) => newCustomer.mark === it.name)
    if (newCustomer) {
      setStateId((prevState) => ({
        ...prevState,
        mark: findCar ? findCar.id_car_mark : '',
        model: ''
      }))
      setCustomer((prevState) => ({
        ...prevState,
        regnumber: newCustomer.regnumber ? newCustomer.regnumber : '',
        mark: newCustomer.mark ? newCustomer.mark : '',
        model: newCustomer.model ? newCustomer.model : '',
        kuzov: newCustomer.kuzov ? newCustomer.kuzov : '',
        diametr: newCustomer.diametr ? newCustomer.diametr : '',
        idOfItem: newCustomer.id
      }))
      setState((prevState) => ({
        ...prevState,
        regnumber: newCustomer.regnumber ? newCustomer.regnumber : '',
        mark: newCustomer.mark ? newCustomer.mark : '',
        kuzov: newCustomer.kuzov ? newCustomer.kuzov : '',
        diametr: newCustomer.diametr ? newCustomer.diametr : '',
        model: newCustomer.model ? newCustomer.model : ''
      }))
      setActiveCustomer(newCustomer.id)
    }
    return null
  }
  const [actualService, setActualService] = useState([])
  // const applyDiscount = (number, percent) => {
  //   const number_percent = (number / 100) * Number(percent)

  //   return Number(number) - Number(number_percent)
  // }
  // const applyDiscountPlus = (number, percent) => {
  //   const number_percent = (number / 100) * Number(percent)

  //   return Number(number) + Number(number_percent)
  // }
  // function roundTo5(num) {
  //   return Math.round(num / 5) * 5
  // }

  useEffect(() => {
    // const helpToGetDiametr = (item) => {
    //   if (item === 'R16С (скорая)') {
    //     return '16Camb'
    //   }
    //   if (item === '22.5 (спец шина)') {
    //     return '23'
    //   }
    //   return item.replace(/[^C\d]/g, '')
    // }
    const actualDiametr = state.category

    // const percent = currentPlace ? currentPlace.shinostavka : ''
    // const definition = currentPlace ? currentPlace.shinomeaning : ''
    const getPrice = (item) => {
      // if (!percent) {
      //   return item[actualDiametr]
      // }
      // if (percent && definition === 'negative') {
      //   return roundTo5(applyDiscount(item[actualDiametr], percent))
      // }
      // if (percent && definition === 'positive') {
      //   return roundTo5(applyDiscountPlus(item[actualDiametr], percent))
      // }
      return item[actualDiametr]
    }
    if (state.class && state.category) {
      setActualService(
        stoprices
          .filter((it) => it.type && it.type === state.class)
          .map((item) => ({
            name: item.name,
            id: item.id,
            type: item.type,
            category: item.category,
            number: item.number,
            actualprice: getPrice(item),
            free: item.free
          }))
      )
    }
    // if (state.diametr && state.kuzov === 'gruz') {
    //   setActualService(
    //     stoprices
    //       .filter(
    //         (it) =>
    //           it.type === 'gruz' &&
    //           (it.category === 'common' || it.category === 'other' || it.category === 'free')
    //       )
    //       .map((item) => ({
    //         name: item.name,
    //         id: item.id,
    //         type: item.type,
    //         category: item.category,
    //         number: item.number,
    //         actualprice: getPrice(item),
    //         free: item.free
    //       }))
    //   )
    // }
    // if (state.diametr && state.kuzov === 'selhoz') {
    //   setActualService(
    //     stoprices
    //       .filter(
    //         (it) =>
    //           it.type === 'selhoz' &&
    //           (it.category === 'common' || it.category === 'other' || it.category === 'free')
    //       )
    //       .map((item) => ({
    //         name: item.name,
    //         id: item.id,
    //         type: item.type,
    //         category: item.category,
    //         number: item.number,
    //         actualprice: getPrice(item),
    //         free: item.free
    //       }))
    //   )
    // }
    return () => {}
  }, [state.diametr, state.kuzov, stoprices, state.class, state.category])

  const sendData = () => {
    const checkCustomer =
      customerList !== []
        ? customerList.find((it) => it.id === search)
        : {
            mark: '',
            model: '',
            regnumber: '',
            kuzov: '',
            diametr: ''
          }

    if (!state.mark) notify('Укажите марку авто')
    if (!state.model) notify('Укажите модель авто')
    if (!state.place) notify('Укажите место работы')
    else if (employees && state.place && state.mark && state.model) {
      if (
        checkCustomer !== undefined &&
        state.mark === checkCustomer.mark &&
        state.model === checkCustomer.model &&
        state.regnumber === checkCustomer.regnumber &&
        state.kuzov === checkCustomer.kuzov &&
        state.diametr === checkCustomer.diametr
      ) {
        props.create({
          ...state,
          services: service,
          material: materials,
          tyre: tyres,
          employee: employees,
          box
        })
        if (props.checkLink) {
          history.push('/stoboss/list')
        } else {
          history.push('/sto/list')
        }
        notify('Запись добавлена')
      } else if (checkCustomer !== undefined && activeCustomer !== '') {
        props.openAndUpdate(
          activeCustomer,
          { ...customer, regnumber: state.regnumber, kuzov: state.kuzov, diametr: state.diametr },
          {
            ...state,
            services: service,
            material: materials,
            tyre: [...tyres],
            employee: employees,
            box
          }
        )
      } else {
        props.create({
          ...state,
          services: service,
          material: materials,
          tyre: [...tyres],
          employee: employees,
          box
        })
        props.createCust({
          ...customer,
          regnumber: state.regnumber,
          kuzov: state.kuzov,
          diametr: state.diametr
        })
        if (props.checkLink) {
          history.push('/stoboss/list')
        } else {
          history.push('/sto/list')
        }
        notify('Запись добавлена')
        notify('Создан новый клиент')
      }
    }
  }

  const [active, setActive] = useState('employee')
  const checkboxServiceChange = (e) => {
    const { name, placeholder, checked, attributes } = e.target
    if (checked) {
      setService((prevState) => [
        ...prevState,
        {
          serviceName: name,
          quantity: 1,
          price: placeholder,
          name: attributes.somename.value,
          free: attributes.somefree.value
        }
      ])
    } else {
      setService((prevState) => prevState.filter((it) => it.serviceName !== name))
    }
  }
  const servicePlusChange = (e) => {
    const { name } = e.target
    setService(
      service.map((object) => {
        if (object.serviceName === name) {
          return {
            ...object,
            quantity: object.quantity + 1
          }
        }
        return object
      })
    )
  }

  const serviceMinusChange = (e) => {
    const { name } = e.target
    setService(
      service.map((object) => {
        if (object.serviceName === name && object.quantity >= 2) {
          return {
            ...object,
            quantity: object.quantity - 1
          }
        }
        return object
      })
    )
  }

  const servicePriceChange = (e) => {
    const { value, id, attributes, name } = e.target

    if (service.find((object) => object.serviceName === id)) {
      setService(
        service.map((object) => {
          if (object.serviceName === id) {
            return {
              ...object,
              price: value
            }
          }
          return object
        })
      )
    } else {
      setService((prevState) => [
        ...prevState,
        {
          serviceName: name,
          quantity: 1,
          price: value,
          name: attributes.somename.value,
          free: attributes.somefree.value
        }
      ])
    }
  }

  const checkboxMaterialChange = (e) => {
    const { name, placeholder, checked, attributes } = e.target
    if (checked) {
      setMaterials((prevState) => [
        ...prevState,
        {
          serviceName: name,
          quantity: 1,
          price: placeholder,
          name: attributes.somename.value,
          free: attributes.somefree.value
        }
      ])
    } else {
      setMaterials((prevState) => prevState.filter((it) => it.serviceName !== name))
    }
  }
  const materialPlusChange = (e) => {
    const { name } = e.target
    setMaterials(
      materials.map((object) => {
        if (object.serviceName === name) {
          return {
            ...object,
            quantity: object.quantity + 1
          }
        }
        return object
      })
    )
  }

  const materialEightChange = (e) => {
    const { name } = e.target
    setMaterials(
      materials.map((object) => {
        if (object.serviceName === name) {
          return {
            ...object,
            quantity: 8
          }
        }
        return object
      })
    )
  }

  const checkboxMaterialPlusChange = (e) => {
    const { name, attributes } = e.target
    if (!materials.find((it) => it.serviceName.includes(name))) {
      setMaterials((prevState) => [
        ...prevState,
        {
          serviceName: name,
          quantity: 8,
          price: attributes.someprice.value,
          name: attributes.somename.value,
          free: attributes.somefree.value
        }
      ])
    }
  }

  const materialMinusChange = (e) => {
    const { name } = e.target
    setMaterials(
      materials.map((object) => {
        if (object.serviceName === name && object.quantity >= 2) {
          return {
            ...object,
            quantity: object.quantity - 1
          }
        }
        return object
      })
    )
  }

  const materialPriceChange = (e) => {
    const { value, id } = e.target
    setMaterials(
      materials.map((object) => {
        if (object.serviceName === id) {
          return {
            ...object,
            price: value
          }
        }
        return object
      })
    )
  }

  // const checkboxEmployeeChange = (e) => {
  //   const { name, checked, placeholder, attributes } = e.target
  //   if (checked) {
  //     setState((prevState) => ({
  //       ...prevState,
  //       employee: [
  //         ...prevState.employee,
  //         {
  //           id: name,
  //           numberId: placeholder,
  //           name: attributes.itemName.value,
  //           surname: attributes.itemSurname.value,
  //           role: 'second'
  //         }
  //       ]
  //     }))
  //   } else {
  //     setState((prevState) => ({
  //       ...prevState,
  //       employee: prevState.employee.filter((it) => it.id !== name)
  //     }))
  //   }
  // }

  const checkboxEmployeeChange = (e) => {
    const { name, placeholder, checked, attributes } = e.target
    if (checked) {
      setEmployees((prevState) => [
        ...prevState,
        {
          id: name,
          numberId: placeholder,
          name: attributes.itemName.value,
          surname: attributes.itemSurname.value,
          role: 'second'
        }
      ])
    } else {
      setEmployees((prevState) => prevState.filter((it) => it.id !== name))
    }
  }

  const checkBoxEmpRoleChange = (e) => {
    const { id } = e.target
    if (employees.find((it) => it.id === id).role === 'second') {
      setEmployees(
        employees.map((object) => {
          if (object.id === id) {
            return {
              ...object,
              role: 'main'
            }
          }
          return object
        })
      )
    } else if (employees.find((it) => it.id === id).role === 'main') {
      setEmployees(
        employees.map((object) => {
          if (object.id === id) {
            return {
              ...object,
              role: 'student'
            }
          }
          return object
        })
      )
    } else {
      setEmployees(
        employees.map((object) => {
          if (object.id === id) {
            return {
              ...object,
              role: 'second'
            }
          }
          return object
        })
      )
    }
  }

  const nextStep = () => {
    if (active === 'employee') {
      if (employees.length < 1) {
        notify('Сначала выберите сотрудников')
      }
      if (!box) {
        notify('Выберите бокс')
      } else {
        setActive('car')
      }
    } else if (active === 'car') {
      if (!state.regnumber) {
        notify('Заполните гос. номер')
      } else if (!state.mark) {
        notify('Заполните поле Марка авто')
      } else if (!state.model) {
        notify('Заполните поле Модель авто')
      } else if (!state.category) {
        notify('Выберите категорию')
      } else if (!state.class) {
        notify('Выберите класс авто')
      } else {
        setActive('service')
      }
    } else if (active === 'service') {
      if (service.length < 1) {
        notify('Выбериту услугу')
      } else {
        setActive('material')
      }
    } else if (active === 'material') {
      setActive('finish')
    } else if (active === 'finish') {
      sendData()
    }
  }

  const changeStep = (wanted) => {
    if (wanted === 'employee') {
      setActive('employee')
    }
    if (wanted === 'car') {
      if (employees.length < 1) {
        notify('Сначала выберите сотрудников')
      } else {
        setActive('car')
      }
    } else if (wanted === 'service') {
      if (employees.length < 1) {
        notify('Сначала выберите сотрудников')
      } else if (!state.regnumber) {
        notify('Заполните гос. номер')
      } else if (!state.mark) {
        notify('Заполните поле Марка авто')
      } else if (!state.model) {
        notify('Заполните поле Модель авто')
      } else if (!state.category) {
        notify('Выберите категорию')
      } else if (!state.class) {
        notify('Выберите класс авто')
      } else {
        setActive('service')
      }
    } else if (wanted === 'material') {
      if (employees.length < 1) {
        notify('Сначала выберите сотрудников')
      } else if (!state.regnumber) {
        notify('Заполните гос. номер')
      } else if (!state.mark) {
        notify('Заполните поле Марка авто')
      } else if (!state.model) {
        notify('Заполните поле Модель авто')
      } else if (service.length < 1) {
        notify('Выбериту услугу')
      } else {
        setActive('material')
      }
    } else if (wanted === 'finish') {
      if (employees.length < 1) {
        notify('Сначала выберите сотрудников')
      } else if (!state.regnumber) {
        notify('Заполните гос. номер')
      } else if (!state.mark) {
        notify('Заполните поле Марка авто')
      } else if (!state.model) {
        notify('Заполните поле Модель авто')
      } else if (service.length < 1) {
        notify('Выбериту услугу')
      } else {
        setActive('finish')
      }
    }
  }
  const [termCash] = useState({
    terminal: 0,
    cash: 0
  })
  return (
    <div>
      <div className="bg-white shadow rounded-lg px-8 py-6 mb-4 flex flex-col my-2">
        <div className="flex flex-row">
          <div className="w-1/5 p-2">
            <button
              type="button"
              className={cx('p-4 bg-gray-200 rounded w-full h-full overflow-hidden', {
                block: active !== 'employee',
                'border-b-8 border-blue-400': active === 'employee'
              })}
              onClick={() => changeStep('employee')}
            >
              Исполнители
            </button>
          </div>
          <div className="w-1/5 p-2">
            <button
              type="button"
              className={cx('p-4 bg-gray-200 rounded w-full h-full overflow-hidden', {
                block: active !== 'car',
                'border-b-8 border-blue-400': active === 'car'
              })}
              onClick={() => changeStep('car')}
            >
              Авто
            </button>
          </div>
          <div className="w-1/5 p-2">
            <button
              type="button"
              className={cx('p-4 bg-gray-200 rounded w-full h-full overflow-hidden', {
                block: active !== 'service',
                'border-b-8 border-blue-400': active === 'service'
              })}
              onClick={() => changeStep('service')}
            >
              Услуги
            </button>
          </div>
          <div className="w-1/5 p-2">
            <button
              type="button"
              className={cx('p-4 bg-gray-200 rounded w-full h-full overflow-hidden', {
                block: active !== 'material',
                'border-b-8 border-blue-400': active === 'material'
              })}
              onClick={() => changeStep('material')}
            >
              Материалы
            </button>
          </div>
          <div className="w-1/5 p-2">
            <button
              type="button"
              className={cx('p-4 bg-gray-200 rounded w-full h-full overflow-hidden', {
                block: active !== 'finish',
                'border-b-8 border-blue-400': active === 'finish'
              })}
              onClick={() => changeStep('finish')}
            >
              Итог
            </button>
          </div>
        </div>
      </div>
      <div className="bg-white shadow rounded-lg px-8 pt-6 lg:pb-8 mb-4 flex flex-col my-2">
        <div
          className={cx('', {
            block: active === 'employee',
            hidden: active !== 'employee'
          })}
        >
          <Employee
            employeeList={employeeList}
            auth={auth}
            employees={employees}
            checkboxEmployeeChange={checkboxEmployeeChange}
            checkBoxEmpRoleChange={checkBoxEmpRoleChange}
            dateEnd=""
            box={box}
            setBox={setBox}
            currentPlace={currentPlace}
          />
        </div>
        <div
          className={cx('', {
            block: active === 'car',
            hidden: active !== 'car'
          })}
        >
          <Car
            regOpen={regOpen}
            onChangeRegNumber={onChangeRegNumber}
            onDeleteRegNumber={onDeleteRegNumber}
            onChangeRegnumberUppercaseRussian={onChangeRegnumberUppercaseRussian}
            switchKeyboard={switchKeyboard}
            acceptRegnumber={acceptRegnumber}
            openRegModal={openRegModal}
            state={state}
            keyboard={keyboard}
            onChangeMark={onChangeMark}
            onChangeModel={onChangeModel}
            options={options}
            onSearchChange={onSearchChange}
            search={search}
            customer={customer}
            customerOptions={customerList}
            activeCustomer={activeCustomer}
            setActiveCustomer={setActiveCustomer}
            applyCustomer={applyCustomer}
            sizeThreeList={sizeThreeList}
            onChange={onChange}
            setOptions={setOptions}
            stateId={stateId}
          />
        </div>
        <div
          className={cx('', {
            block: active === 'service',
            hidden: active !== 'service'
          })}
          key={state?.category}
        >
          <Service
            actualService={actualService}
            auth={auth}
            service={service}
            state={state}
            checkboxServiceChange={checkboxServiceChange}
            servicePlusChange={servicePlusChange}
            serviceMinusChange={serviceMinusChange}
            servicePriceChange={servicePriceChange}
            dateEnd=""
          />
        </div>
        <div
          className={cx('', {
            block: active === 'material',
            hidden: active !== 'material'
          })}
        >
          <Material
            materialprices={materialprices}
            auth={auth}
            materials={materials}
            checkboxMaterialChange={checkboxMaterialChange}
            materialPlusChange={materialPlusChange}
            materialMinusChange={materialMinusChange}
            materialPriceChange={materialPriceChange}
            dateEnd=""
            materialEightChange={materialEightChange}
            checkboxMaterialPlusChange={checkboxMaterialPlusChange}
          />
        </div>
        <div
          className={cx('', {
            block: active === 'finish',
            hidden: active !== 'finish'
          })}
        >
          <Final
            materialprices={materialprices}
            auth={auth}
            materials={materials}
            stoprices={stoprices}
            state={state}
            service={service}
            onChange={onChange}
            onChangeTyres={onChangeTyres}
            tyres={tyres}
            checkboxTyresChange={checkboxTyresChange}
            dateEnd=""
            termCash={termCash}
          />
        </div>
      </div>
      <div className=" flex my-2">
        <Link
          to={
            props.checkLink
              ? `/stoboss/list/${props.num ? props.num : ''}`
              : `/sto/list/${props.num ? props.num : ''}`
          }
          className="my-3 mr-2 py-3 w-1/3 px-3 bg-red-600 text-white text-center hover:bg-red-700 hover:text-white rounded-lg"
        >
          Отмена
        </Link>

        <button
          className="my-3 ml-2 py-3 w-2/3 px-3 bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-lg"
          onClick={nextStep}
          type="submit"
        >
          {active !== 'finish' ? 'Далее' : 'В работу'}
        </button>
      </div>
    </div>
  )
}

export default StosCreate
