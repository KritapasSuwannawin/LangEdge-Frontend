import './Spinner.scss';

interface SpinnerProps {
  isLight?: boolean;
  isThin?: boolean;
}

function Spinner(props: SpinnerProps) {
  const { isLight, isThin } = props;

  return (
    <div className="spinner">
      <span className={`${isLight ? 'light' : ''} ${isThin ? 'thin' : ''}`}></span>
    </div>
  );
}

export default Spinner;
