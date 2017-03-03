import React, { PropTypes } from 'react';
import './<%= dashed %>.scss';

/**
 * @export
 * @returns JSX
 */
export const <%= proper %> = (props) => (
  <div className="<%= dashed %>"><p><%= original %></p></div>
);

export default <%= proper %>;

<%= proper %>.propTypes = {
  // title: PropTypes.string,
};

<%= proper %>.defaultProps = {

};
