

interface ErrorPopupProps {
    message: string;
  }
  
  const ErrorPopup: React.FC<ErrorPopupProps> = ({ message }) => {

  return (
    <div
      className={`'block' : 'hidden'
      } fixed top-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg`}
    >
      <p className='text-[13px] text-white text-center'>{message}</p>
    </div>
  );
};

export default ErrorPopup;
