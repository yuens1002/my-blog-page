import Loader from './Loader';

export default function FullPageLoader() {
  return (
    <div className="w-full h-svh bg-black/25 z-0 fixed top-0 left-0 flex items-center justify-center">
      <div className="z-10">
        <Loader />
      </div>
    </div>
  );
}
