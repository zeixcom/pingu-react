import { connect } from 'react-redux';
// import { fetchData } from '../actions';
// import { MyComponent } from '../components/my-component';
const MyComponent = null;

const mapStateToProps = state => ({
  // items: state.<%= camel %>.items,
});

const mapDispatchToProps = dispatch => ({
  // fetchData: dispatch(fetchData()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyComponent);
