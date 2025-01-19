import './Loader.scss';

interface LoaderProps {
  isLight?: boolean;
  isThin?: boolean;
}

function Loader(props: LoaderProps) {
  const { isLight, isThin } = props;

  return (
    <div className="loader">
      <span className={`${isLight ? 'light' : ''} ${isThin ? 'thin' : ''}`}></span>
    </div>
  );
}

export default Loader;
