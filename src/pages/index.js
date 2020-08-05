import Head from 'next/head';
import {useRouter} from 'next/router';
import {SpaceXCard} from '../components/SpaceXCard';
import {FilterLabel} from '../components/FilterLabel';
import {useEffect} from 'react';

let _css = {
  btn: 'bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded ml-2',
  btnSelected: 'bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded ml-2',
};
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
];
export default function Home({data, filteredData}) {
  const router = useRouter();
  function getVisibleRecords() {
    if (filteredData && isMounted.current === 0) {
      return filteredData;
    }
    if (isMounted.current === 0 && !filteredData) {
      return data;
    }
    return data.filter((item) => item.launch_year === selectedYear.toString() && item.launch_success === launch);
  }

  let isMounted = React.useRef(0);
  useEffect(() => {
    isMounted.current++;
  });
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

  const {launch_year, launch_success, land_success} = router.query;

  let initYear = launch_year || '';
  let initLaunch = launch_success === 'true';
  let initLanding = land_success === 'true';
  let [selectedYear, setSelectedYear] = React.useState(initYear);
  let [launch, setLaunch] = React.useState(initLaunch);
  let [landing, setLanding] = React.useState(initLanding);

  // launch_success=true
  // land_success=true
  // launch_year=2014

  function handleClickYear(year) {
    router.push(
      {
        pathname: '',
        query: {launch_year: year.toString(), launch_success: launch, land_success: landing},
      },
      undefined,
      {shallow: true},
    );
    setSelectedYear(year);
  }
  function handleSetLaunch(launch) {
    router.push(
      {
        pathname: '',
        query: {launch_year: selectedYear.toString(), launch_success: launch, land_success: landing},
      },
      undefined,
      {shallow: true},
    );
    setLaunch(launch);
  }
  function handleSetLanding(landing) {
    router.push(
      {
        pathname: '',
        query: {launch_year: selectedYear.toString(), launch_success: launch, land_success: landing},
      },
      undefined,
      {shallow: true},
    );
    setLanding(landing);
  }
  return (
    <>
      <Head>
        <title>SpaceX Launch</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div class="grid grid-cols-1 md:grid-cols-5 gap-2 m-16 ">
        <div class="items-center justify-center">
          <div className="text-base w-full ml-4 font-bold">Filters</div>
          <div className="mx-12 my-2 border-b-2 border-solid border-gray-500 flex items-center justify-center">
            Launch Year
          </div>
          <div className="ml-4 flex flex-wrap">
            {launch_year_filters.map((year) => {
              return (
                <div className="my-2 ml-4">
                  <FilterLabel
                    isSelected={year === selectedYear}
                    handleSelect={() => handleClickYear(year)}
                    name={year}
                  />
                </div>
              );
            })}
          </div>
          <div className="mx-12 my-2 border-b-2 border-solid border-gray-500 flex items-center justify-center">
            Successful Launch
          </div>
          <div className="flex ml-8 my-2">
            <div>
              <FilterLabel isSelected={launch} handleSelect={() => handleSetLaunch(true)} name={'true'} />
            </div>
            <div className="ml-4">
              <FilterLabel isSelected={!launch} handleSelect={() => handleSetLaunch(false)} name={'false'} />
            </div>
          </div>
          <div className="mx-12 my-2 border-b-2 border-solid border-gray-500 flex items-center justify-center">
            Successful Landing
          </div>
          <div className="flex ml-8 my-2">
            <div>
              <FilterLabel isSelected={landing} handleSelect={() => handleSetLanding(true)} name={'true'} />
            </div>
            <div className="ml-4">
              <FilterLabel isSelected={!landing} handleSelect={() => handleSetLanding(false)} name={'false'} />
            </div>
          </div>
        </div>
        <div class="bg-gray-100 md:col-span-4">
          <h1 className="text-2xl font-bold mt-4 flex flex-wrap items-center justify-center">SpaceX Launch Programs</h1>

          <div className="flex flex-wrap justify-center">
            {getVisibleRecords().map((item) => {
              let _props = item;
              return <SpaceXCard {..._props} key={item.flight_number} />;
            })}
          </div>
        </div>
        <div className="md:col-span-5 flex justify-center my-6">
          <span className="font-semibold mr-2">Developed by:</span> Aman Mavai
        </div>
      </div>
    </>
  );
}

// This gets called on every request
export async function getServerSideProps({query}) {
  // Fetch data from external API
  const res = await fetch(`https://api.spaceXdata.com/v3/launches?limit=100`);
  const data = await res.json();

  let filteredData = null;
  if (Object.keys(query).length > 0) {
    let neededFilters = Object.entries(query).filter(([key, value]) => Boolean(value) && key !== 'land_success');
    let filterString = neededFilters.flatMap((j) => j.join('=')).join('&');
    const filteredRes = await fetch(`https://api.spaceXdata.com/v3/launches?limit=1000&${filterString}`);
    filteredData = await filteredRes.json();
  }

  // Pass data to the page via props
  return {props: {data, filteredData}};
}
