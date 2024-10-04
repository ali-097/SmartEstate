import React from "react";
import Helmet from "../components/Helmet";

const About = () => {
  return (
    <Helmet title="About Us">
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <h1 className="text-4xl font-bold text-center text-myblue mb-8">
            About Smart Estate
          </h1>
          <div className="mb-10 text-lg text-gray-600">
            <p>
              Welcome to Smart Estate, where technology meets real estate! We
              are dedicated to transforming the way you buy, sell, and rent
              properties by leveraging cutting-edge technology. Our mission is
              to provide you with an unparalleled experience that simplifies the
              complex world of real estate.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Our mission is clear: to make real estate accessible and efficient
              for everyone. We aim to empower our users with tools and insights
              that enhance their decision-making and ensure a seamless
              experience throughout their real estate journey.
            </p>
          </div>

          <div className="mb-12 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              What We Do
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              We leverage innovative technology to enhance the real estate
              experience. Whether you're looking to buy, sell, or rent, we offer
              valuable insights and resources to help you make informed
              decisions.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Our Values
            </h2>
            <ul className="list-disc list-inside text-lg text-gray-600 mb-6 space-y-2">
              <li>
                Integrity: We believe in transparency and honesty in all our
                dealings.
              </li>
              <li>
                Innovation: Constantly evolving, we embrace the latest
                technologies to enhance user experience.
              </li>
              <li>
                Customer-Centric: Your needs drive our actions. We are here to
                listen and serve you.
              </li>
              <li>
                Collaboration: Working together with buyers and sellers to
                create a supportive community.
              </li>
            </ul>
          </div>

          <div className="mb-12 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Join Us
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Ready to experience a smarter way to handle real estate? Join us
              at Smart Estate and let us guide you through your real estate
              journey with confidence and ease.
            </p>
          </div>

          <div className="mb-12">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4">
              Contact Us
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              If you have any questions or would like to learn more about our
              services, feel free to{" "}
              <a href="/contact" className="text-myblue underline">
                contact us
              </a>
              . We are here to help!
            </p>
          </div>
        </div>
      </section>
    </Helmet>
  );
};

export default About;
