export function SpaceXCard(props) {
  const { links, mission_name, flight_number, mission_id, launch_year, launch_success, launch_landing } = props

  return (
    <div className='bg-white rounded-lg p-6 m-2 w-56 text-sm'>
      <div className='bg-gray-300 p-4 flex flex-wrap items-center justify-center'>
        <img src={links.mission_patch} className='h-24 w-24 mx-auto md:mx-0 object-cover object-center' alt='img' />
      </div>

      <div className='text-indigo-600 font-semibold'>{`${mission_name} #${flight_number}`}</div>
      {mission_id.length > 0 && <div>
        <span className='font-semibold'>Mission Ids:</span>
        <ul className='ml-8'>
          {mission_id.map((m_id, _i) => (
            <li key={`${flight_number}-${_i}`}>{m_id}</li>
          ))}
        </ul>
      </div>}
      <div><span className='font-semibold'>Launch Year: </span>{launch_year}</div>
      <div><span className='font-semibold'>Successful Launch: </span>{`${launch_success}`}</div>
      {launch_landing && <div><span className='font-semibold'>Successful Landing: </span>{`${launch_landing}`}</div>}
    </div>
  )
}
