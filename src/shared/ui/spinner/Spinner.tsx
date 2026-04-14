import './Spinner.scss';

interface SpinnerProps {
  isThin?: boolean;
}

function Spinner(props: SpinnerProps) {
  const { isThin } = props;

  return (
    <div className="spinner">
      <span className={isThin ? 'thin' : ''}></span>
    </div>
  );
}

export default Spinner;
