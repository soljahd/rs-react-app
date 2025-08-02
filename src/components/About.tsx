type LinkItemProps = {
  label: string;
  text: string;
  href: string;
};

function LinkItem({ label, text, href }: LinkItemProps) {
  return (
    <div className={'flex items-baseline gap-1'}>
      <span className="text-gray-500 dark:text-gray-400">{label}</span>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-600 transition-colors hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400"
      >
        {text}
      </a>
    </div>
  );
}

function ProfileCard() {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-lg transition-all hover:shadow-xl dark:bg-gray-800 dark:hover:shadow-gray-700/50">
      <div className="flex flex-col md:flex-row">
        <div className="flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-6 md:flex-shrink-0 dark:from-blue-900/30 dark:to-blue-800/30">
          <div className="relative h-48 w-48 overflow-hidden rounded-full border-4 border-blue-500 shadow-md dark:border-blue-400">
            <img
              src="/soljahd.jpg"
              alt="Dzmitry Solahub"
              className="h-full w-full object-cover transition-transform hover:scale-105"
              loading="lazy"
            />
          </div>
        </div>
        <div className="flex flex-col gap-4 p-8">
          <div className="text-sm font-semibold tracking-wide text-blue-600 uppercase dark:text-blue-400">
            Frontend Developer
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Dzmitry Solahub</h2>
          <p className="text-gray-600 dark:text-gray-300">
            Frontend developer from Mogilev, Belarus with experience in React and TypeScript. Currently working as a
            design engineer developing boards for electronic transport control units.
          </p>

          <div className="flex flex-col gap-3">
            <LinkItem label="Address:" text="Mogilev, Belarus" href="https://maps.google.com/?q=Mogilev,Belarus" />
            <LinkItem label="Email:" text="moskuitoz@gmail.com" href="mailto:moskuitoz@gmail.com" />
            <LinkItem label="GitHub:" text="@soljahd" href="https://github.com/soljahd" />
          </div>
          <hr className="dark:border-gray-700" />
          <div className="flex items-center gap-4">
            <a href="https://rs.school/courses/reactjs" target="_blank" rel="noopener noreferrer">
              <img
                src="./rss-logo.svg"
                alt="RS School"
                className="h-16 w-16 transition-transform hover:scale-105 dark:invert"
              />
            </a>
            <p className="text-gray-600 dark:text-gray-300">
              This project was created as part of the RS School React course
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function About() {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-12">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl dark:text-white">About Author</h1>
        <div className="h-1 w-20 rounded-full bg-blue-600 dark:bg-blue-500"></div>
      </div>
      <ProfileCard />
    </div>
  );
}

export default About;
