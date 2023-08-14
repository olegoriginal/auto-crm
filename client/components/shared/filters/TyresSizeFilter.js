import cx from 'classnames'
import React from 'react'

const TyresSizeFilter = ({ search, setSearch, onEnterPress, showSearch }) => {
  const onChangeSize = (e) => {
    const { name, value } = e.target

    setSearch((prevState) => ({
      ...prevState,
      [name]: value
    }))
  }
  return (
    <div className="md:w-1/2 px-3 mb-6 md:mb-0">
      <label
        className="block uppercase tracking-wide text-grey-darker text-xs font-bold mb-2"
        htmlFor="grid-first-name"
      >
        Размер шин
      </label>
      <div className="flex-shrink w-full flex relative">
        <input
          className={cx(
            'block appearance-none w-1/3 bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none p-1 rounded mr-1',
            {
              'border-red-300 focus:border-red-500': search.sizeone && showSearch === true
            }
          )}
          name="sizeone"
          value={search.sizeone}
          onChange={onChangeSize}
          placeholder="175"
          type="number"
          onKeyDown={onEnterPress}
        />
        <span className="flex my-auto mr-1">/</span>
        <input
          className={cx(
            'block appearance-none w-1/3 bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none p-1 rounded mr-1 rounded',
            {
              'border-red-300 focus:border-red-500': search.sizetwo && showSearch === true
            }
          )}
          name="sizetwo"
          value={search.sizetwo}
          onChange={onChangeSize}
          placeholder="70"
          type="number"
          onKeyDown={onEnterPress}
        />
        <span className="flex my-auto mr-1">R</span>
        <input
          className={cx(
            'block appearance-none w-1/3 bg-grey-lighter border border-gray-300 focus:border-gray-500 focus:outline-none p-1 rounded',
            {
              'border-red-300 focus:border-red-500': search.sizethree && showSearch === true
            }
          )}
          name="sizethree"
          value={search.sizethree}
          onChange={onChangeSize}
          placeholder="13"
          type="number"
          onKeyDown={onEnterPress}
        />
      </div>
    </div>
  )
}
export default TyresSizeFilter
