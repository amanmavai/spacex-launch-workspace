import Head from 'next/head';
import {useRouter} from 'next/router';
import {SpaceXCard} from '../components/SpaceXCard';
import {FilterLabel} from '../components/FilterLabel';
import {useEffect} from 'react';

function FilterTitle({title}) {
  return (
    <div className="flex flex-col items-center">
      <div className="px-4 border-b-2 border-gray-300">{title}</div>
    </div>
  );
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

  const {launch_year, launch_success, land_success} = router.query;

  let initYear = launch_year || '';
  let initLaunch = launch_success === 'true';
  let initLanding = land_success === 'true';
  let [selectedYear, setSelectedYear] = React.useState(initYear);
  let [launch, setLaunch] = React.useState(initLaunch);
  let [landing, setLanding] = React.useState(initLanding);

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
      <div className="container  mx-auto bg-gray-200 p-2">
        <div className="grid grid-cols-1 gap-1 md:grid-cols-7 lg:grid-cols-5">
          <div className="md:col-span-7 lg:col-span-5 ml-2 font-bold">SpaceX Launch Programs</div>
          <div className="bg-white font-semibold p-2 md:col-span-2 lg:col-span-1">
            Filters
            <div className="flex flex-col">
              <FilterTitle title="Launch Year" />
              <div className="flex flex-wrap justify-center items-center m-2">
                {launch_year_filters.map((year) => {
                  return (
                    <div className="m-2 md:mx-0">
                      <FilterLabel
                        isSelected={year === selectedYear}
                        handleSelect={() => handleClickYear(year)}
                        name={year}
                      />
                    </div>
                  );
                })}
              </div>
              <FilterTitle title="Successful Launch" />
              <div className="flex flex-wrap justify-center items-center m-2">
                <div>
                  <FilterLabel isSelected={launch} handleSelect={() => handleSetLaunch(true)} name={'true'} />
                </div>
                <div className="ml-4">
                  <FilterLabel isSelected={!launch} handleSelect={() => handleSetLaunch(false)} name={'false'} />
                </div>
              </div>
              <FilterTitle title="Successful Landing" />
              <div className="flex flex-wrap justify-center items-center m-2">
                <div>
                  <FilterLabel isSelected={landing} handleSelect={() => handleSetLanding(true)} name={'true'} />
                </div>
                <div className="ml-4">
                  <FilterLabel isSelected={!landing} handleSelect={() => handleSetLanding(false)} name={'false'} />
                </div>
              </div>
            </div>
          </div>
          <div
            style={{justifyItems: 'center'}}
            className="container md:px-2 md:col-span-5 lg:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-1"
          >
            {getVisibleRecords().map((item) => {
              let _props = item;
              return <SpaceXCard {..._props} key={item.flight_number} />;
            })}
          </div>
        </div>
        <div className="fixed bottom-0 left-0 w-full flex justify-center items-center bg-purple-200 text-base font-hairline tracking-widest">
          Developed By: Aman Mavai
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
