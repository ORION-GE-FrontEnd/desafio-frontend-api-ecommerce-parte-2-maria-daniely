const Footer = () => {
  return (
    <>
      <footer className="fixed bottom-0 left-0 w-full bg-amber-50 px-4 py-4 text-center shadow-md z-10">
        <p className="font-adlam text-amber-900 text-sm sm:text-base leading-relaxed px-2 text-wrap">
          Feito com 🤎 por{" "}
          <span className="inline-flex flex-wrap justify-center items-center gap-1">
            <a
              href="https://github.com/alvesmariadefatima"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-900 underline break-words"
            >
              Daniely Vasconcelos
            </a>
            <span className="mx-1">&</span>
            <a
              href="https://github.com/alvesmariadefatima"
              target="_blank"
              rel="noopener noreferrer"
              className="text-amber-900 underline break-words"
            >
              Maria de Fátima
            </a>
          </span>
        </p>
      </footer>
    </>
  );
};

export default Footer;