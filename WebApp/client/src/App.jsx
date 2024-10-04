import { BrowserRouter, Route, Routes } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Listing from "./pages/Listing";
import Benefits from "./pages/Benefits";
import Faqs from "./pages/Faqs";
import Contact from "./pages/Contact";
import About from "./pages/About";
import PrivateRoute from "./components/PrivateRoute";
import CreateListing from "./pages/CreateListing";
import MyListings from "./pages/MyListings";
import MyBids from "./pages/MyBids";
import UpdateListing from "./pages/UpdateListing";
import Search from "./pages/Search";
import PricePrediction from "./pages/PricePrediction";
import CreateReview from "./pages/CreateReview";
import MyReviews from "./pages/MyReviews";
import CommunityReviews from "./pages/CommunityReviews";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/listing/:listingId" element={<Listing />} />
        <Route path="/benefits" element={<Benefits />} />
        <Route path="/faqs" element={<Faqs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/sign-up" element={<Register />} />
        <Route path="/search" element={<Search />} />
        <Route path="/price-prediction" element={<PricePrediction />} />
        <Route path="/community-reviews" element={<CommunityReviews />} />
        <Route element={<PrivateRoute />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/create-listing" element={<CreateListing />} />
          <Route
            path="/update-listing/:listingId"
            element={<UpdateListing />}
          />
          <Route path="/my-listings" element={<MyListings />} />
          <Route path="/my-bids" element={<MyBids />} />
          <Route path="/my-reviews" element={<MyReviews />} />
          <Route path="/create-review" element={<CreateReview />} />
        </Route>
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;
