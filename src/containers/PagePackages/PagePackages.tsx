import { Fragment, useState, useEffect, FC } from 'react'
import SectionSliderNewCategories from "./SectionSliderNewCategories";
import BackgroundSection from "components/BackgroundSection/BackgroundSection";
import BgGlassmorphism from "components/BgGlassmorphism/BgGlassmorphism";
import Circles from "components/Circles"
import SectionGridCategoryBox from "./SectionGridCategoryBox";

import PackageSearchForm from "components/HeroSearchForm/PackageSearchForm";
import { Helmet } from "react-helmet";

import { Service } from 'services/Service'

export interface HeroSearchFormProps {
  className?: string;
  currentTab?: string;
  currentPage?: "Packages";
}

const PagePackages: FC<HeroSearchFormProps> = ({
  className = "",
  currentTab = "Packages",
  currentPage,
}) => {
  const [tabActive, setTabActive] = useState(currentTab);
  const [bastDeal, setBestDeal] = useState([])
  const [honeyMoon, setHoneyMoon] = useState([])
  const [family, setFamily] = useState([])

  const getData = (params: any, type: any) => {
    Service.post({ url: '/packages', body: JSON.stringify(params) })
      .then((response) => {
        if (response) {
          if (response.data.length > 0) {
            if (type === 'honeymoon')
              setHoneyMoon(response.data)
            else if (type === 'family')
              setFamily(response.data)
          }
        }
      })
  }

  const getBestDeal = () => {
    Service.get({ url: '/data/pp' })
      .then((response) => {
        if (response) {
          if (response.data.length > 0) {
            setBestDeal(response.data)
          }
        }
      })
  }

  const getHoneyMoonData = () => {
    const params = {
      page: 1,
      limit: 10,
      category: "honeymoon"
    }
    getData(params, 'honeymoon')
  }

  const getFamilyData = () => {
    const params = {
      page: 1,
      limit: 10,
      category: "family"
    }
    getData(params, 'family')
  }

  const getPackageList = () => {

  }

  useEffect(() => {
    getBestDeal()
    getHoneyMoonData()
    getFamilyData()
  }, [])

  const isArchivePage = !!currentPage && !!currentTab;
  return (
    <div className="nc-PageHome relative overflow-hidden">
      <Helmet>
        <title>Packages || Best Online Travel Agency in Bangladesh</title>
      </Helmet>
      {/* GLASSMOPHIN */}
      <BgGlassmorphism />

      <div className="search-container-bg relative bread-bg-packages">
        {/* SECTION HERO */}
        <div className="container relative z-10">
          <PackageSearchForm haveDefaultValue={isArchivePage} page='page1' getSearchResult={getPackageList} />
        </div>
        <Circles />
      </div>

      <div className="container relative">

        {/* SECTION 1 */}
        <SectionSliderNewCategories
          className='relative py-8 lg:py-16'
          categories={bastDeal}
          categoryCardType="card5"
          itemPerRow={4}
          heading="Best Selling Holiday Destinations"
          subHeading="Grab exciting discounts for your upcoming trips to our most-loved destinations!"
          slug=""
        />

        {/* SECTION 2 */}
        <div className="relative py-8 lg:py-16">
          <BackgroundSection className="bg-orange-50 dark:bg-black dark:bg-opacity-20 " />
          <SectionSliderNewCategories
            heading="Best Honeymoon Packages"
            subHeading="Make beautiful memories with your Soulmate!"
            categories={honeyMoon}
            categoryCardType="card5"
            itemPerRow={5}
            slug="honeymoon"
          />
        </div>

        {/* SECTION 2 */}
        <SectionSliderNewCategories
          className='relative py-8 lg:py-16'
          heading="Best Family Packages"
          subHeading="Make beautiful memories with your Soulmate!"
          categories={family}
          categoryCardType="card5"
          itemPerRow={5}
          slug="family"
        />

        {/* SECTION */}
        <div className="relative py-8 lg:py-16">
          <BackgroundSection className="bg-neutral-100 dark:bg-black dark:bg-opacity-20 rounded-none-imp" />
          <SectionGridCategoryBox />
        </div>

      </div>
    </div>
  );
}

export default PagePackages;
