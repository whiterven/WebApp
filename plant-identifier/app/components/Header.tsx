import Image from 'next/image';

const Header = () => {
  return (
    <header className="bg-green-700 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Image src="/logo.svg" alt="Plant Identifier Logo" width={40} height={40} />
          <span className="text-xl font-bold">Plant Identifier</span>
        </div>
        <nav>
          <ul className="flex space-x-4">
            <li><a href="#" className="hover:text-green-200">Home</a></li>
            <li><a href="#" className="hover:text-green-200">About</a></li>
            <li><a href="#" className="hover:text-green-200">Contact</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;