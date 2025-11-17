const Footer = () => {
  return (
    <footer className="text-white font-bold p-6 sm:p-8 xl:h-1">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <div className="text-sm  text-center sm:text-left">
          <p className="3xl:text-[1.1rem]">© 2025 Giovani Salvador. All rights reserved.</p>
        </div>
        <div className="flex flex-wrap justify-center sm:justify-end space-x-4 text-sm">
          <a
            href="https://www.linkedin.com/in/giovani-salvador/"
            target="_blank"
            rel="noopener noreferrer"
            className=" hover:text-red-800 transition duration-300 3xl:text-[1.1rem]"
          >
            LinkedIn
          </a>
          <span className="text-red-800 3xl:text-[1.1rem]">|</span>
          <a
            href="https://github.com/GioSalvador/rpg-item-creator"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-red-800 transition duration-300 3xl:text-[1.1rem]"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
