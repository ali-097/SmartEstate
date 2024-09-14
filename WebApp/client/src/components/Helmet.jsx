/* eslint-disable react/prop-types */

const Helmet = (props) => {
  document.title = "SmartEstate – " + props.title;
  return <div>{props.children}</div>;
};

export default Helmet;
