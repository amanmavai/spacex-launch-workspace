export function SpaceXCard(props) {
  const { links, mission_name, flight_number, mission_id, launch_year, launch_success, launch_landing } = props

  return (
    <div className='bg-white rounded-lg p-6'>
      <img src={links.mission_patch} className='h-24 w-24 md:h-32 md:w-32 mx-auto md:mx-0' alt='img' />

      <div className=''>{`${mission_name} #${flight_number}`}</div>
      <div>
        Mission Ids:{' '}
        <ul>
          {mission_id.map((m_id, _i) => (
            <li key={`${flight_number}-${_i}`}>{m_id}</li>
          ))}
        </ul>
      </div>
      <div>Launch Year: {launch_year}</div>
      <div>Successful Launch: {`${launch_success}`}</div>
      <div>Successful Landing: {`${launch_landing}`}</div>
    </div>
  )
}
