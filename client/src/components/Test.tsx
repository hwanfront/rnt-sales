import { useState } from 'react';
import PropTypes, { InferProps } from 'prop-types';

const ComponentPropTypes = {
  tel: PropTypes.string.isRequired,
  firstName: PropTypes.string,
  secondName: PropTypes.string.isRequired,
};

type ComponentTypes = InferProps<typeof ComponentPropTypes>;

const Component = ({ tel, firstName, secondName }: ComponentTypes) => {
  const [num] = useState(10);

  return (
    <div className="test" aria-busy>
      {tel}
      {num}
      {firstName}
      {secondName}
    </div>
  );
};

Component.prototype = ComponentPropTypes;

export default Component;
