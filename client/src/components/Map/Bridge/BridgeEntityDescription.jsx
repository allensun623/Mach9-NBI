import { EntityDescription } from 'resium';
import { getEntityDetails } from '../../../utils';

const getEntityItem = (detail, i) => (
  <p key={i}>
    <strong>{detail.label}:</strong> {detail.value}
  </p>
);

export default function BridgeEntityDescription(props) {
  return (
    <EntityDescription>
      {getEntityDetails(props).map(getEntityItem)}
    </EntityDescription>
  );
}
