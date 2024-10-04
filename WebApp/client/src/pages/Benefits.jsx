import Helmet from "../components/Helmet";

const LockClosedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      fill="none"
      stroke="#ffffff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z"
    />
  </svg>
);
const HouseIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      fill="none"
      stroke="#ffffff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="m2.25 12l8.955-8.955a1.124 1.124 0 0 1 1.59 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
    />
  </svg>
);

const PricePredictionIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      fill="none"
      stroke="#ffffff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M2 16.5L6 12l4 4 4-8 4 10.5"
    />
    <path
      fill="none"
      stroke="#ffffff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M2 18h20M2 16h20M2 14h20"
    />
  </svg>
);

const CommunityReviewsIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
  >
    <path
      fill="none"
      stroke="#ffffff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M12 3.75c4.125 0 7.5 3.375 7.5 7.5S16.125 18.75 12 18.75 4.5 15.375 4.5 12 7.875 3.75 12 3.75zm0 1.5c-3.375 0-6 2.625-6 6s2.625 6 6 6 6-2.625 6-6-2.625-6-6-6zm-3 8.25h6m-6 1.5h6"
    />
  </svg>
);

const features = [
  {
    name: "Dyanmic Bidding",
    description:
      "Our platform allows you to bid on properties, ensuring a fair process as you compete with other buyers/sellers.",
    icon: HouseIcon,
  },
  {
    name: "Verified Listings",
    description:
      "Listings are verified for authenticity to prevent fraudulent activities and ensure a smooth experience.",
    icon: LockClosedIcon,
  },
  {
    name: "Price Prediction",
    description:
      "Get an estimate of the price of a property based on historical data so you can make informed decisions.",
    icon: PricePredictionIcon,
  },
  {
    name: "Community Reviews",
    description:
      "Read reviews from other users to get a better understanding of the property and the neighborhood with the option of sorting reviews by sentiment.",
    icon: CommunityReviewsIcon,
  },
];

export default function Benefits() {
  return (
    <Helmet title={"Benefits"}>
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 xl:max-w-full">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-myblue">
              Benefits
            </h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Here are some of the benefits
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Discover the advantages of using our platform for all your real
              estate needs. From dynamic bidding to verified listings, we
              provide a seamless and efficient experience.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {features.map((feature) => (
                <div
                  key={feature.name}
                  className="relative pl-16 p-4 border border-solid border-gray-300 rounded-lg"
                >
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-[8px] top-[8px] flex h-10 w-10 items-center justify-center rounded-lg bg-myblue">
                      <feature.icon
                        className="h-6 w-6 text-white"
                        aria-hidden="true"
                      />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>
    </Helmet>
  );
}
