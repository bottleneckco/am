import PropTypes from 'prop-types';

const recommendationPropType = PropTypes.shape({
  attributes: PropTypes.shape({
    id: PropTypes.string,
    isGroupRecommendation: PropTypes.bool,
    nextUpdateDate: PropTypes.string,
    resourceTypes: PropTypes.arrayOf(PropTypes.string),
  }),
  relationships: PropTypes.shape({
    contents: PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.object),
    }),
    recommendations: PropTypes.shape({
      data: PropTypes.arrayOf(PropTypes.object),
    }),
  }),
});
export default recommendationPropType;
