import Head from 'next/head'
import { useRouter } from 'next/router'
import styles from '../styles/Home.module.css'
import { SpaceXCard } from '../components/SpaceXCard'
import { useEffect } from 'react'

let _css = {
  btn: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ml-2',
  btnSelected: 'bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded ml-2',
}
const launch_year_filters = [
  '2006',
  '2007',
  '2008',
  '2009',
  '2010',
  '2011',
  '2012',
  '2013',
  '2014',
  '2015',
  '2016',
  '2017',
  '2018',
  '2019',
  '2020',
]
export default function Home({ data, filteredData }) {
  const router = useRouter()
  function getVisibleRecords() {
    debugger;
    if(filteredData && isMounted.current===0){
      return filteredData;
    }
    return data.filter((item) => item.launch_year === selectedYear.toString() && item.launch_success === launch)
  }

  let isMounted = React.useRef(0);
  useEffect(()=>{
    isMounted.current++;
  })
  // API end point for the first-time page load without any Filters
  // https://api.const router = useRouter()spaceXdata.com/v3/launches?limit=100

  /**
   * Launch Success Filter:
   * https://api.spaceXdata.com/v3/launches?limit=100&launch_success=true
   *
   * Launch & Land Filter:
   * https://api.spaceXdata.com/v3/launches?limit=100&launch_success=true&land_success=true
   *
   * All:
   * https://api.spaceXdata.com/v3/launches?limit=100&launch_success=true&land_success=true&launch_year=2014
   *
   */

  const { launch_year, launch_success, land_success } = router.query

  let initYear = launch_year || ''
  let initLaunch = launch_success === 'true'
  let initLanding = land_success === 'true'
  let [selectedYear, setSelectedYear] = React.useState(initYear)
  let [launch, setLaunch] = React.useState(initLaunch)
  let [landing, setLanding] = React.useState(initLanding)

  // launch_success=true
  // land_success=true
  // launch_year=2014

  function handleClickYear(year) {
    router.push(
      {
        pathname: '',
        query: { launch_year: year.toString(), launch_success: launch, land_success: landing },
      },
      undefined,
      { shallow: true }
    )
    setSelectedYear(year)
  }
  function handleSetLaunch(launch) {
    router.push(
      {
        pathname: '',
        query: { launch_year: selectedYear.toString(), launch_success: launch, land_success: landing },
      },
      undefined,
      { shallow: true }
    )
    setLaunch(launch)
  }
  function handleSetLanding(landing) {
    router.push(
      {
        pathname: '',
        query: { launch_year: selectedYear.toString(), launch_success: launch, land_success: landing },
      },
      undefined,
      { shallow: true }
    )
    setLanding(landing)
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>SpaceX Launch</title>
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <aside>
        Filters:
        <div>Launch Year</div>
        {launch_year_filters.map((year) => {
          return (
            <button
              onClick={() => handleClickYear(year)}
              className={selectedYear === year ? _css.btnSelected : _css.btn}
            >
              {year}
            </button>
          )
        })}
        <div>Successful Launch</div>
        <button className={launch ? _css.btnSelected : _css.btn} onClick={() => handleSetLaunch(true)}>
          true
        </button>
        <button className={!launch ? _css.btnSelected : _css.btn} onClick={() => handleSetLaunch(false)}>
          false
        </button>
        <div>Successful Landing</div>
        <button className={landing ? _css.btnSelected : _css.btn} onClick={() => handleSetLanding(true)}>
          true
        </button>
        <button className={!landing ? _css.btnSelected : _css.btn} onClick={() => handleSetLanding(false)}>
          false
        </button>
      </aside>
      <main className={styles.main}>
        <h1 className={styles.title}>SpaceX Launch Programs</h1>

        <div className={styles.grid}>
          {getVisibleRecords().map((item) => {
            let _props = item
            return <SpaceXCard {..._props} />
          })}
        </div>
      </main>

      <footer className={styles.footer}>
        <a href='#' target='_blank' rel='noopener noreferrer'>
          Powered by spacex launch
        </a>
      </footer>
    </div>
  )
}

// This gets called on every request
export async function getServerSideProps({ query }) {
  // Fetch data from external API
  const res = await fetch(`https://api.spaceXdata.com/v3/launches?limit=100`)
  const data = await res.json()

  let filteredData = undefined
  if (Object.keys(query).length > 0) {
    let neededFilters = Object.entries(query).filter(([key, value]) => Boolean(value) && key !== 'land_success')
    let filterString = neededFilters.flatMap((j) => j.join('=')).join('&')
    const filteredRes = await fetch(`https://api.spaceXdata.com/v3/launches?limit=1000&${filterString}`)
    filteredData = await filteredRes.json()
  }

  // Pass data to the page via props
  return { props: { data, filteredData } }
}
